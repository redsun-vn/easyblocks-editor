import { buildSectionEntries, getTemplateSources } from "./EditorSections";

// Stands in for the editor's translation lookup, which returns the key itself
// when the key is absent.
const t = (key: string): string =>
  (
    ({
      "definition.category.layout": "Bố cục",
      "definition.category.content": "Nội dung",
      "definition.category.others": "Khác",
    }) as Record<string, string>
  )[key] ?? key;

describe("entries shown in the components panel", () => {
  it("lists the built-in categories alphabetically", () => {
    const entries = buildSectionEntries({
      panel: "components",
      localGroups: ["content", "layout"],
      t,
    });

    expect(entries.map((entry) => entry.id)).toEqual([
      "builtin:content",
      "builtin:layout",
    ]);
    expect(entries.map((entry) => entry.label)).toEqual(["Nội dung", "Bố cục"]);
  });

  it("does not reorder the caller's array in place", () => {
    const localGroups = ["layout", "content"];

    buildSectionEntries({ panel: "components", localGroups, t });

    expect(localGroups).toEqual(["layout", "content"]);
  });

  it("marks every entry as built-in", () => {
    const entries = buildSectionEntries({
      panel: "components",
      localGroups: ["layout"],
      t,
    });

    expect(entries).toEqual([
      {
        id: "builtin:layout",
        label: "Bố cục",
        group: "layout",
        source: "builtin",
      },
    ]);
  });

  it("is empty when the form accepts no components yet", () => {
    expect(
      buildSectionEntries({ panel: "components", localGroups: [], t }),
    ).toEqual([]);
  });

  it("never lets a template category leak into the components panel", () => {
    const entries = buildSectionEntries({
      panel: "components",
      localGroups: ["layout"],
      templateCategories: [{ uuid: "c1", name: "Banner" }],
      t,
    });

    expect(entries.every((entry) => entry.source === "builtin")).toBe(true);
  });
});

describe("template libraries a mode may read", () => {
  it("gives a shop the system library and its own, in that order", () => {
    expect(getTemplateSources("user")).toEqual(["public", "shop"]);
  });

  it("gives an admin one library, because its own path is the system one", () => {
    expect(getTemplateSources("admin")).toEqual(["shop"]);
  });

  it("treats the template editor like the theme editor", () => {
    expect(getTemplateSources("admin-template")).toEqual(["shop"]);
  });
});

describe("entries shown in the templates panel", () => {
  it("lists one row per category, carrying the id the listing filters on", () => {
    const entries = buildSectionEntries({
      panel: "templates",
      localGroups: ["layout"],
      templateCategories: [{ uuid: "c1", name: "Banner" }],
      t,
    });

    expect(entries).toEqual([
      {
        id: "category:c1",
        label: "Banner",
        categoryUuid: "c1",
        source: "template",
      },
    ]);
  });

  it("carries no category id on the uncategorized row", () => {
    const [entry] = buildSectionEntries({
      panel: "templates",
      localGroups: [],
      templateCategories: [{ uuid: null, name: null }],
      t,
    });

    expect(entry.id).toBe("category:others");
    expect(entry.categoryUuid).toBeUndefined();
    expect(entry.label).toBe("Khác");
  });

  it("sorts categories A→Z and keeps the uncategorized row last", () => {
    const entries = buildSectionEntries({
      panel: "templates",
      localGroups: [],
      templateCategories: [
        { uuid: null, name: null },
        { uuid: "c2", name: "Zalo" },
        { uuid: "c1", name: "Banner" },
      ],
      t,
    });

    expect(entries.map((entry) => entry.label)).toEqual([
      "Banner",
      "Zalo",
      "Khác",
    ]);
  });

  it("shows a category name verbatim even when a built-in group shares it", () => {
    // "Layout" typed as a category name stays as typed, although the built-in
    // component category of the same name is translated.
    const entries = buildSectionEntries({
      panel: "templates",
      localGroups: ["layout"],
      templateCategories: [{ uuid: "c1", name: "Layout" }],
      t,
    });

    expect(entries.map((entry) => entry.label)).toEqual(["Layout"]);
  });

  it("does not reorder the discovered categories in place", () => {
    const categories = [
      { uuid: "c2", name: "Zalo" },
      { uuid: "c1", name: "Banner" },
    ];

    buildSectionEntries({
      panel: "templates",
      localGroups: [],
      templateCategories: categories,
      t,
    });

    expect(categories.map((category) => category.name)).toEqual([
      "Zalo",
      "Banner",
    ]);
  });

  it("is empty while the categories are still being discovered", () => {
    expect(
      buildSectionEntries({
        panel: "templates",
        localGroups: ["layout"],
        templateCategories: null,
        t,
      }),
    ).toEqual([]);
  });

  it("is empty when no category holds a single template", () => {
    expect(
      buildSectionEntries({
        panel: "templates",
        localGroups: ["layout"],
        templateCategories: [],
        t,
      }),
    ).toEqual([]);
  });

  it("ignores the built-in categories entirely", () => {
    const entries = buildSectionEntries({
      panel: "templates",
      localGroups: ["layout", "content"],
      templateCategories: [{ uuid: "c1", name: "Layout" }],
      t,
    });

    expect(entries.every((entry) => entry.source === "template")).toBe(true);
    expect(entries.some((entry) => entry.id.startsWith("builtin:"))).toBe(
      false,
    );
  });
});
