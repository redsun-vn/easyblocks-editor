import {
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { getSortingStrategy, noSortingStrategy } from "./BlockControls";

describe("which blocks shift while something is dragged", () => {
  it("opens a gap along the row when siblings of that row are being sorted", () => {
    expect(
      getSortingStrategy({
        direction: "horizontal",
        isSortingWithinThisCollection: true,
      }),
    ).toBe(horizontalListSortingStrategy);
  });

  it("opens a gap down the column for a stacked collection", () => {
    expect(
      getSortingStrategy({
        direction: "vertical",
        isSortingWithinThisCollection: true,
      }),
    ).toBe(verticalListSortingStrategy);
  });

  it("leaves other collections alone, whichever way they run", () => {
    // Positions in the sortable list only describe real siblings within one
    // collection; across two they point at unrelated blocks, so shifting them
    // would scatter parts of the page the drop will never touch.
    expect(
      getSortingStrategy({
        direction: "horizontal",
        isSortingWithinThisCollection: false,
      }),
    ).toBe(noSortingStrategy);
    expect(
      getSortingStrategy({
        direction: "vertical",
        isSortingWithinThisCollection: false,
      }),
    ).toBe(noSortingStrategy);
  });

  it("moves nothing when asked for no sorting", () => {
    expect(noSortingStrategy({} as never)).toBeNull();
  });
});
