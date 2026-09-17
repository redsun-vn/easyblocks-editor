import { getSectionInsertionIndex } from "./EditorSections";

describe("where a section from the drawer is inserted", () => {
  it("goes to the end when nothing is selected", () => {
    expect(getSectionInsertionIndex([], 4)).toBe(4);
  });

  it("goes right after the selected section", () => {
    expect(getSectionInsertionIndex(["data.1"], 4)).toBe(2);
  });

  it("uses the top level section of a selection made deep inside one", () => {
    expect(getSectionInsertionIndex(["data.2.Cards.0"], 5)).toBe(3);
  });

  it("follows the last block of a multi selection", () => {
    expect(getSectionInsertionIndex(["data.0", "data.3"], 5)).toBe(4);
  });

  it("appends when the selected section is the last one", () => {
    expect(getSectionInsertionIndex(["data.3"], 4)).toBe(4);
  });

  it("never points past the end of the collection", () => {
    // The selection can outlive the block it pointed at, e.g. right after a delete.
    expect(getSectionInsertionIndex(["data.9"], 2)).toBe(2);
  });

  it("goes to the end for a selection outside the root collection", () => {
    expect(getSectionInsertionIndex(["somethingElse.0"], 3)).toBe(3);
  });
});
