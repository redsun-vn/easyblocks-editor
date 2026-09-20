import {
  panelGroupTranslationKey,
  toGroupKeySegment,
  translatePanelGroup,
} from "./panelGroupLabel";

describe("toGroupKeySegment", () => {
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
    expect(toGroupKeySegment(group)).toBe(expected);
  });

  test("splits on the separators definitions actually use", () => {
    expect(toGroupKeySegment("Grid / Slider")).toBe("gridSlider");
    expect(toGroupKeySegment("Input - Textarea")).toBe("inputTextarea");
    expect(toGroupKeySegment("Hover & Active")).toBe("hoverActive");
  });

  test("an all-caps word is not left shouting", () => {
    expect(toGroupKeySegment("Accessibility and SEO")).toBe(
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
    expect(panelGroupTranslationKey("Section background")).toBe(
      "definition.schema.group.sectionBackground",
    );
  });
});
