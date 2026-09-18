import { buildSectionEntries, getTemplateSources } from "./EditorSections";

// Stands in for the editor's translation lookup, which returns the key itself
// when the key is absent.
const t = (key: string): string =>
  (
    ({
      "definition.category.layout": "Bố cục",
      "definition.category.content": "Nội dung",
      "definition.category.others": "Khác",
      "editor.sidebar.sections.templates.system": "Mẫu hệ thống",
      "editor.sidebar.sections.templates.shop": "Mẫu của khách hàng",
    }) as Record<string, string>
  )[key] ?? key;

describe("entries shown in the components panel", () => {
  it("lists the built-in categories alphabetically", () => {
    const entries = buildSectionEntries({
      panel: "components",
      mode: "admin",
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

    buildSectionEntries({ panel: "components", mode: "admin", localGroups, t });

    expect(localGroups).toEqual(["layout", "content"]);
  });

  it("marks every entry as built-in so it draws the + glyph", () => {
    const entries = buildSectionEntries({
      panel: "components",
      mode: "user",
      localGroups: ["layout"],
      t,
    });

    expect(entries).toEqual([
      {
        id: "builtin:layout",
        label: "Bố cục",
        group: "layout",
        source: "builtin",
        kind: "builtin",
      },
    ]);
  });

  it("is empty when the form accepts no components yet", () => {
    expect(
      buildSectionEntries({
        panel: "components",
        mode: "admin",
        localGroups: [],
        t,
      }),
    ).toEqual([]);
  });

  it("never lets a template source leak into the components panel", () => {
    const entries = buildSectionEntries({
      panel: "components",
      mode: "user",
      localGroups: ["layout"],
      t,
    });

    expect(entries.every((entry) => entry.source === "builtin")).toBe(true);
  });
});

describe("template libraries a mode may read", () => {
  it("gives a shop the system library and its own, in that order", () => {
    expect(getTemplateSources("user")).toEqual([
      {
        source: "public",
        labelKey: "editor.sidebar.sections.templates.system",
      },
      { source: "shop", labelKey: "editor.sidebar.sections.templates.shop" },
    ]);
  });

  it("gives an admin one library, because its own path is the system one", () => {
    expect(getTemplateSources("admin")).toEqual([
      { source: "shop", labelKey: "editor.sidebar.sections.templates.system" },
    ]);
  });

  it("treats the template editor like the theme editor", () => {
    expect(getTemplateSources("admin-template")).toHaveLength(1);
  });
});

describe("entries shown in the templates panel", () => {
  it("lists one row per category, under a heading naming its library", () => {
    const entries = buildSectionEntries({
      panel: "templates",
      mode: "user",
      localGroups: ["layout"],
      categoriesBySource: {
        public: ["Landing"],
        shop: ["Banner"],
      },
      t,
    });

    expect(entries).toEqual([
      {
        id: "public:Landing",
        label: "Landing",
        group: "Landing",
        source: "public",
        kind: "template",
        sourceLabel: "Mẫu hệ thống",
      },
      {
        id: "shop:Banner",
        label: "Banner",
        group: "Banner",
        source: "shop",
        kind: "template",
        sourceLabel: "Mẫu của khách hàng",
      },
    ]);
  });

  it("keeps a category of the same name in each library apart", () => {
    const entries = buildSectionEntries({
      panel: "templates",
      mode: "user",
      localGroups: [],
      categoriesBySource: { public: ["Banner"], shop: ["Banner"] },
      t,
    });

    expect(entries.map((entry) => entry.id)).toEqual([
      "public:Banner",
      "shop:Banner",
    ]);
    expect(entries.map((entry) => entry.sourceLabel)).toEqual([
      "Mẫu hệ thống",
      "Mẫu của khách hàng",
    ]);
  });

  it("leaves no heading and no row behind for an empty library", () => {
    const entries = buildSectionEntries({
      panel: "templates",
      mode: "user",
      localGroups: [],
      categoriesBySource: { public: [], shop: ["Banner"] },
      t,
    });

    expect(entries).toHaveLength(1);
    expect(entries[0].source).toBe("shop");
    expect(entries.some((entry) => entry.source === "public")).toBe(false);
  });

  it("sorts categories A→Z and keeps the uncategorized bucket last", () => {
    const entries = buildSectionEntries({
      panel: "templates",
      mode: "admin",
      localGroups: [],
      categoriesBySource: { shop: ["others", "Zalo", "Banner"] },
      t,
    });

    expect(entries.map((entry) => entry.group)).toEqual([
      "Banner",
      "Zalo",
      "others",
    ]);
  });

  it("localizes the uncategorized bucket but shows category names verbatim", () => {
    // "others" is this editor's sentinel for "no category", so it is
    // translated. "Layout" is a name somebody typed and stays as typed, even
    // though the built-in component category of the same name is translated.
    const entries = buildSectionEntries({
      panel: "templates",
      mode: "admin",
      localGroups: [],
      categoriesBySource: { shop: ["Layout", "others"] },
      t,
    });

    expect(entries.map((entry) => entry.label)).toEqual(["Layout", "Khác"]);
  });

  it("does not reorder the discovered categories in place", () => {
    const categories = ["Zalo", "Banner"];

    buildSectionEntries({
      panel: "templates",
      mode: "admin",
      localGroups: [],
      categoriesBySource: { shop: categories },
      t,
    });

    expect(categories).toEqual(["Zalo", "Banner"]);
  });

  it("is empty while the categories are still being discovered", () => {
    expect(
      buildSectionEntries({
        panel: "templates",
        mode: "user",
        localGroups: ["layout"],
        categoriesBySource: null,
        t,
      }),
    ).toEqual([]);
  });

  it("is empty when no library holds a single template", () => {
    expect(
      buildSectionEntries({
        panel: "templates",
        mode: "user",
        localGroups: ["layout"],
        categoriesBySource: { public: [], shop: [] },
        t,
      }),
    ).toEqual([]);
  });

  it("ignores the built-in categories entirely", () => {
    // A shop that saved templates under "Layout" must not make the built-in
    // Layout category show up here: the two panels never share a row.
    const entries = buildSectionEntries({
      panel: "templates",
      mode: "user",
      localGroups: ["layout", "content"],
      categoriesBySource: { shop: ["Layout"] },
      t,
    });

    expect(entries.every((entry) => entry.kind === "template")).toBe(true);
    expect(entries.some((entry) => entry.id.startsWith("builtin:"))).toBe(
      false,
    );
  });

  it("stays populated even when the form accepts no components", () => {
    expect(
      buildSectionEntries({
        panel: "templates",
        mode: "user",
        localGroups: [],
        categoriesBySource: { public: ["Landing"], shop: ["Banner"] },
        t,
      }),
    ).toHaveLength(2);
  });
});
