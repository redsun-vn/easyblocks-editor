import type { PanelDropAim } from "../editorSidebar/editorSections/panelDropSlots";
import { aimAt, column, slotOf } from "./alignment-guide-fixtures";
import {
  alignedEdge,
  resolveAlignmentGuide,
  sharesOneLine,
} from "./alignment-guide-resolver";

describe("alignedEdge", () => {
  const container = { start: 0, end: 400 };

  test("a block against the start, the end, or on the centre", () => {
    expect(alignedEdge({ start: 0, end: 120 }, container)).toBe("start");
    expect(alignedEdge({ start: 280, end: 400 }, container)).toBe("end");
    expect(alignedEdge({ start: 140, end: 260 }, container)).toBe("center");
  });

  test("a block filling the collection gives no line", () => {
    expect(alignedEdge({ start: 0, end: 400 }, container)).toBeNull();
  });

  test("a block placed freely gives no line", () => {
    expect(alignedEdge({ start: 30, end: 90 }, container)).toBeNull();
  });
});

describe("resolveAlignmentGuide", () => {
  test("centred blocks put the guide on the centre line, across the gap", () => {
    const slot = column([
      { left: 100, width: 200 },
      { left: 150, width: 100 },
    ]);

    expect(resolveAlignmentGuide({ slot, aim: aimAt(1, 90) })).toEqual({
      axis: "horizontal",
      x: 200,
      y: 0,
      length: 180,
    });
  });

  test("the block before the gap decides when the two disagree", () => {
    const slot = column([
      { left: 0, width: 120 },
      { left: 280, width: 120 },
    ]);

    expect(resolveAlignmentGuide({ slot, aim: aimAt(1, 90) })?.x).toBe(0);
  });

  test("blocks all the same width tell a start from nothing", () => {
    const slot = column([
      { left: 0, width: 400 },
      { left: 0, width: 400 },
    ]);

    expect(resolveAlignmentGuide({ slot, aim: aimAt(1, 90) })).toBeNull();
  });

  test("a collection of one block gives no guide", () => {
    const slot = column([{ left: 150, width: 100 }]);

    expect(resolveAlignmentGuide({ slot, aim: aimAt(1, 90) })).toBeNull();
  });

  test("the dragged block is not its own neighbour", () => {
    const slot = column([
      { left: 0, width: 400 },
      { left: 280, width: 120 },
      { left: 0, width: 400 },
    ]);

    expect(
      resolveAlignmentGuide({ slot, aim: aimAt(1, 90), fromIndex: 1 }),
    ).toBeNull();
    expect(resolveAlignmentGuide({ slot, aim: aimAt(1, 90) })?.x).toBe(400);
  });

  test("an empty collection has nothing to line up with", () => {
    expect(
      resolveAlignmentGuide({ slot: column([]), aim: aimAt(0, 0) }),
    ).toBeNull();
  });

  const rowAim: PanelDropAim = {
    parentPath: "data.0",
    prop: "Cells",
    index: 1,
    line: { axis: "horizontal", x: 190, y: 0, length: 300 },
  };

  test("in a row, the guide runs across at the neighbours' top", () => {
    const row = slotOf("data.0", "Cells", [
      { index: 0, left: 0, right: 180, top: 0, bottom: 120 },
      { index: 1, left: 200, right: 380, top: 0, bottom: 200 },
    ]);

    expect(resolveAlignmentGuide({ slot: row, aim: rowAim })).toEqual({
      axis: "vertical",
      x: 0,
      y: 0,
      length: 380,
    });
  });

  test("a row wrapped onto two lines draws no guide", () => {
    const row = slotOf("data.0", "Cells", [
      { index: 0, left: 0, right: 180, top: 0, bottom: 120 },
      { index: 1, left: 200, right: 380, top: 30, bottom: 90 },
      { index: 2, left: 0, right: 180, top: 140, bottom: 260 },
    ]);

    expect(resolveAlignmentGuide({ slot: row, aim: rowAim })).toBeNull();
  });
});

describe("sharesOneLine", () => {
  test("blocks overlapping one band of height share a line", () => {
    expect(
      sharesOneLine([
        { index: 0, left: 0, right: 10, top: 0, bottom: 100 },
        { index: 1, left: 20, right: 30, top: 40, bottom: 60 },
      ]),
    ).toBe(true);
  });

  test("a block below the others starts a second line", () => {
    expect(
      sharesOneLine([
        { index: 0, left: 0, right: 10, top: 0, bottom: 100 },
        { index: 1, left: 0, right: 10, top: 120, bottom: 200 },
      ]),
    ).toBe(false);
  });
});
