import { foldForSearch, matchesQuery } from "./panelSearch";

describe("foldForSearch", () => {
  // Real group and component labels from the shipped library, paired with what
  // a plain keyboard produces for them.
  test.each([
    ["Mở đầu", "mo dau"],
    ["Giới thiệu", "gioi thieu"],
    ["Chuyển đổi", "chuyen doi"],
    ["Cửa hàng", "cua hang"],
    ["Bố cục khối", "bo cuc khoi"],
    ["Đoạn văn", "doan van"],
    ["Bảng giá", "bang gia"],
  ])("%s folds to %s", (label, expected) => {
    expect(foldForSearch(label)).toBe(expected);
  });

  test("leaves a label with no marks alone apart from its case", () => {
    expect(foldForSearch("Announcement Bar")).toBe("announcement bar");
  });
});

describe("matchesQuery", () => {
  test("finds a label by what a plain keyboard types", () => {
    expect(matchesQuery("Mở đầu — canh giữa", "mo dau")).toBe(true);
  });

  test("finds it by the marks too, for anyone who types them", () => {
    expect(matchesQuery("Mở đầu — canh giữa", "mở đầu")).toBe(true);
  });

  test("takes the words in any order", () => {
    expect(matchesQuery("Mở đầu — canh giữa", "giua mo")).toBe(true);
  });

  test("matches inside a word, which is how a half-typed query finds anything", () => {
    expect(matchesQuery("Announcement bar", "nounce")).toBe(true);
  });

  test("an empty query leaves the list whole", () => {
    expect(matchesQuery("Mở đầu", "")).toBe(true);
    expect(matchesQuery("Mở đầu", "   ")).toBe(true);
  });

  test("says no when a word is missing", () => {
    expect(matchesQuery("Mở đầu — canh giữa", "mo dau video")).toBe(false);
  });
});
