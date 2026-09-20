import {
  toKeySegment,
  translatePanelGroup,
  translatePanelLabel,
} from "./panelTranslation";

describe("toKeySegment", () => {
  // Every one of these is a group name a definition in this repo really
  // declares, paired with the key the locale files already carry for it. They
  // are the reason the derivation has to be exactly this and not "close".
  test.each([
    ["Layout", "layout"],
    ["Padding", "padding"],
    ["Margins", "margins"],
    ["Section margins", "sectionMargins"],
    ["Section background", "sectionBackground"],
    ["General styles", "generalStyles"],
    ["Label styles", "labelStyles"],
    ["Icon styles", "iconStyles"],
    ["Border and shadow", "borderAndShadow"],
    ["Label and Icon", "labelAndIcon"],
    ["Forgot Password", "forgotPassword"],
    ["Sign Up", "signUp"],
    ["Login by Social", "loginBySocial"],
  ])("%s becomes %s", (group, expected) => {
    expect(toKeySegment(group)).toBe(expected);
  });

  test("splits on the separators definitions actually use", () => {
    expect(toKeySegment("Grid / Slider")).toBe("gridSlider");
    expect(toKeySegment("Input - Textarea")).toBe("inputTextarea");
    expect(toKeySegment("Hover & Active")).toBe("hoverActive");
  });

  test("an all-caps word is not left shouting", () => {
    expect(toKeySegment("Accessibility and SEO")).toBe(
      "accessibilityAndSeo",
    );
  });
});

describe("translatePanelGroup", () => {
  test("uses the translation when the locale has one", () => {
    const t = (key: string) =>
      key === "definition.schema.group.sectionMargins"
        ? "Margin phần nội dung"
        : key;

    expect(translatePanelGroup("Section margins", t)).toBe(
      "Margin phần nội dung",
    );
  });

  // The whole reason this is safe to switch on for every component at once: a
  // group nobody has translated has to keep reading as it reads today.
  test("keeps the group's own words when nothing translates it", () => {
    const t = (key: string) => key;

    expect(translatePanelGroup("Time for count down", t)).toBe(
      "Time for count down",
    );
  });

  test("builds the key the locale files are written against", () => {
    const t = (key: string) =>
      key === "definition.schema.group.sectionBackground" ? "Nền" : key;

    expect(translatePanelGroup("Section background", t)).toBe("Nền");
  });
});

describe("translatePanelLabel", () => {
  // The common case: a definition already names a key, and it wins outright.
  test("uses the key a definition already names", () => {
    const t = (key: string) =>
      key === "definition.schema.label.padding" ? "Padding" : key;

    expect(translatePanelLabel("definition.schema.label.padding", t)).toBe(
      "Padding",
    );
  });

  // The case this was added for: a label written as plain English, which `t`
  // handed straight back because the words are not a key.
  test("derives a key for a label written as plain words", () => {
    const t = (key: string) =>
      key === "definition.schema.label.paddingTop" ? "Padding trên" : key;

    expect(translatePanelLabel("Padding top", t)).toBe("Padding trên");
  });

  test("keeps the words when nothing translates them", () => {
    const t = (key: string) => key;

    expect(translatePanelLabel("Ease in out circ", t)).toBe("Ease in out circ");
  });

  /**
   * Dropdowns are full of numbers, and stripping the punctuation collapses
   * pairs of them onto one key: `1:1` and `1/1` both become `11`, `3:2` and
   * `32` both become `32`. Translating either would put its words on the other.
   */
  test("leaves anything that is not words alone", () => {
    const t = (key: string) =>
      key === "definition.schema.label.11" ? "một phần một" : key;

    for (const value of ["1:1", "1/1", "3:2", "32", "50%", "16px"]) {
      expect(translatePanelLabel(value, t)).toBe(value);
    }
  });

  // A key the locale does not carry must not be shown to anyone as-is.
  test("falls back to the derivation when a named key is missing", () => {
    const t = (key: string) =>
      key === "definition.schema.label.somethingElse" ? "Cái khác" : key;

    expect(translatePanelLabel("definition.schema.label.missing", t)).toBe(
      "definition.schema.label.missing",
    );
  });
});
