import { getCategoryLabel } from "./getLocalGroups";

// Stands in for the editor's translation lookup, which returns the key itself
// when the key is absent — the behaviour the helper leans on.
const translate =
  (dictionary: Record<string, string>) =>
  (key: string): string =>
    dictionary[key] ?? key;

const t = translate({
  "definition.category.layout": "Bố cục",
  "definition.category.content": "Nội dung",
});

describe("label shown for a component category", () => {
  it("translates a known built-in category", () => {
    expect(getCategoryLabel(t, "Layout")).toBe("Bố cục");
  });

  it("matches regardless of how the category is cased", () => {
    expect(getCategoryLabel(t, "CONTENT")).toBe("Nội dung");
  });

  it("ignores surrounding whitespace when looking the key up", () => {
    expect(getCategoryLabel(t, "  Layout  ")).toBe("Bố cục");
  });

  it("keeps a shop's own group string when there is no translation", () => {
    expect(getCategoryLabel(t, "Banner tết")).toBe("Banner tết");
  });

  it("never leaks a half-built key for an unknown group", () => {
    expect(getCategoryLabel(t, "Hero")).not.toContain("definition.category");
  });

  it("leaves an empty group untouched", () => {
    expect(getCategoryLabel(t, "")).toBe("");
    expect(getCategoryLabel(t, "   ")).toBe("   ");
  });
});
