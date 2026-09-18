import { buildSectionEntries } from "./EditorSections";

// Stands in for the editor's translation lookup, which returns the key itself
// when the key is absent.
const t = (key: string): string =>
  (
    ({
      "definition.category.layout": "Bố cục",
      "definition.category.content": "Nội dung",
      "editor.sidebar.sections.templates.redsun": "Mẫu REDSUN",
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

describe("entries shown in the templates panel", () => {
  it("gives a shop both the REDSUN library and its own templates", () => {
    const entries = buildSectionEntries({
      panel: "templates",
      mode: "user",
      localGroups: ["layout"],
      t,
    });

    expect(entries).toEqual([
      {
        id: "public:redsun",
        label: "Mẫu REDSUN",
        source: "public",
        kind: "template",
      },
      {
        id: "shop:own",
        label: "Mẫu của khách hàng",
        source: "shop",
        kind: "template",
      },
    ]);
  });

  it("gives an admin one entry, because its own path is the REDSUN library", () => {
    const entries = buildSectionEntries({
      panel: "templates",
      mode: "admin",
      localGroups: ["layout"],
      t,
    });

    expect(entries).toEqual([
      {
        id: "shop:own",
        label: "Mẫu REDSUN",
        source: "shop",
        kind: "template",
      },
    ]);
  });

  it("treats the template editor like the theme editor", () => {
    expect(
      buildSectionEntries({
        panel: "templates",
        mode: "admin-template",
        localGroups: [],
        t,
      }),
    ).toHaveLength(1);
  });

  it("ignores the built-in categories entirely", () => {
    // A shop that saved templates under "Layout" must not make the built-in
    // Layout category show up here: the two panels never share a row.
    const entries = buildSectionEntries({
      panel: "templates",
      mode: "user",
      localGroups: ["layout", "content"],
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
        t,
      }),
    ).toHaveLength(2);
  });
});
