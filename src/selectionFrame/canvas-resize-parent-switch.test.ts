import type { CanvasResizeField } from "./canvas-resize-fields";
import { pendingSwitch } from "./canvas-resize-parent-switch";

/** A column-width field of a row, opted into switching the row's grid on. */
const spanField = {
  field: { name: "data.0.Cells.1._itemProps.BlockRow.Cells.span" },
  option: {
    axis: "x",
    parentSwitch: { prop: "twelveColumnGrid", tracks: 12 },
  },
} as unknown as CanvasResizeField;

const rowWithGrid = (twelveColumnGrid: unknown) => ({
  data: [{ twelveColumnGrid, Cells: [{}, {}] }],
});

describe("pendingSwitch", () => {
  test("a row still on its own tracks has its grid to switch on", () => {
    expect(
      pendingSwitch(spanField, "data.0.Cells.1", rowWithGrid(false)),
    ).toEqual({ parentPath: "data.0", prop: "twelveColumnGrid", tracks: 12 });
  });

  test("a row that never stored the switch counts as off", () => {
    expect(
      pendingSwitch(spanField, "data.0.Cells.1", rowWithGrid(undefined)),
    ).not.toBeNull();
  });

  test("a row already on the twelve-track grid has nothing to switch", () => {
    expect(
      pendingSwitch(spanField, "data.0.Cells.1", rowWithGrid(true)),
    ).toBeNull();
  });

  test("a field without a parent switch never has one pending", () => {
    const plain = { ...spanField, option: { axis: "x" } } as CanvasResizeField;

    expect(
      pendingSwitch(plain, "data.0.Cells.1", rowWithGrid(false)),
    ).toBeNull();
    expect(
      pendingSwitch(undefined, "data.0.Cells.1", rowWithGrid(false)),
    ).toBeNull();
  });
});
