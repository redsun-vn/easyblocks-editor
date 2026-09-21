import {
  isPanelDrag,
  PANEL_DRAG_MIME,
  resolvePanelDropTarget,
} from "./panelDrag";

/** Three stacked sections, 100 tall each, no gaps. */
const RECTS = [
  { top: 0, bottom: 100 },
  { top: 100, bottom: 200 },
  { top: 200, bottom: 300 },
];

describe("resolvePanelDropTarget", () => {
  it("answers index 0 on an empty page", () => {
    expect(resolvePanelDropTarget(500, [])).toEqual({ index: 0, y: 0 });
  });

  it("aims before a section while above its midpoint", () => {
    expect(resolvePanelDropTarget(10, RECTS)).toEqual({ index: 0, y: 0 });
    expect(resolvePanelDropTarget(49, RECTS)).toEqual({ index: 0, y: 0 });
  });

  it("aims after a section once past its midpoint", () => {
    expect(resolvePanelDropTarget(51, RECTS)).toEqual({ index: 1, y: 100 });
    expect(resolvePanelDropTarget(149, RECTS)).toEqual({ index: 1, y: 100 });
  });

  // The midpoint belongs to the section below, so the two halves of a section
  // never both answer "before" and leave a pixel that answers nothing.
  it("hands the midpoint itself to the later gap", () => {
    expect(resolvePanelDropTarget(50, RECTS).index).toBe(1);
    expect(resolvePanelDropTarget(150, RECTS).index).toBe(2);
  });

  it("lands at the end below the last section", () => {
    expect(resolvePanelDropTarget(260, RECTS)).toEqual({ index: 3, y: 300 });
    expect(resolvePanelDropTarget(99999, RECTS)).toEqual({ index: 3, y: 300 });
  });

  // Sections are separated by margins that belong to no section. Aiming into
  // one still has to give an answer rather than none.
  it("answers inside a gap between two sections", () => {
    const spaced = [
      { top: 0, bottom: 100 },
      { top: 140, bottom: 240 },
    ];

    expect(resolvePanelDropTarget(120, spaced)).toEqual({ index: 1, y: 140 });
  });

  it("covers every pixel of the page with some index", () => {
    for (let y = -50; y <= 350; y += 1) {
      const target = resolvePanelDropTarget(y, RECTS);

      expect(target.index).toBeGreaterThanOrEqual(0);
      expect(target.index).toBeLessThanOrEqual(RECTS.length);
    }
  });
});

describe("isPanelDrag", () => {
  it("recognises our own drag", () => {
    expect(isPanelDrag([PANEL_DRAG_MIME])).toBe(true);
    expect(isPanelDrag(["text/plain", PANEL_DRAG_MIME])).toBe(true);
  });

  // A file dragged in from the desktop must not put an insertion line on the
  // canvas, and neither must a text selection dragged out of a heading.
  it("ignores anything else", () => {
    expect(isPanelDrag(["Files"])).toBe(false);
    expect(isPanelDrag(["text/plain"])).toBe(false);
    expect(isPanelDrag([])).toBe(false);
    expect(isPanelDrag(undefined)).toBe(false);
  });
});
