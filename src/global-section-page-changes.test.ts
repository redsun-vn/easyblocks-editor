import { globalSectionPageChanges } from "./global-section-page-changes";

const header = {
  label: "Header",
  pages: ["home", "about"],
  documentId: "doc-header",
  entry: { _id: "header-1", _component: "BlockHeader" },
};

const globalSections = {
  Headers: { orders: ["header-1"], entities: { "header-1": header } },
  Footers: {
    orders: ["footer-1"],
    entities: {
      "footer-1": {
        label: "Footer",
        pages: ["about"],
        documentId: "doc-footer",
      },
    },
  },
};

const headerEntry = { _id: "header-1", _component: "BlockHeader" };
const rowEntry = { _id: "row-1", _component: "BlockRow" };

describe("globalSectionPageChanges", () => {
  test("reports nothing when every section's page list already matches the page", () => {
    // An ordinary edit — a column resized, a word typed — changes neither list.
    expect(
      globalSectionPageChanges({
        globalSections,
        pageEntries: [headerEntry, rowEntry],
        currentDocument: "home",
      }),
    ).toEqual([]);
  });

  test("adds the page to a section the page has just gained", () => {
    expect(
      globalSectionPageChanges({
        globalSections,
        pageEntries: [headerEntry, { _id: "footer-1", _component: "Footer" }],
        currentDocument: "home",
      }),
    ).toEqual([
      {
        label: "Footer",
        mode: "update",
        groupName: "Footers",
        entry: { _id: "footer-1", _component: "" },
        pages: ["about", "home"],
      },
    ]);
  });

  test("removes the page from a section the page has just lost", () => {
    expect(
      globalSectionPageChanges({
        globalSections,
        pageEntries: [rowEntry],
        currentDocument: "home",
      }),
    ).toEqual([
      {
        label: "Header",
        mode: "update",
        groupName: "Headers",
        entry: header.entry,
        pages: ["about"],
      },
    ]);
  });

  test("reports nothing without global sections", () => {
    expect(
      globalSectionPageChanges({
        globalSections: null,
        pageEntries: [rowEntry],
        currentDocument: "home",
      }),
    ).toEqual([]);
  });
});
