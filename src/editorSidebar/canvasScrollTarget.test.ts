import { canvasScrollTargetTop } from "./canvasScrollTarget";

describe("canvasScrollTargetTop", () => {
  test("brings a layer below the fold to the top of the canvas", () => {
    expect(canvasScrollTargetTop({ elementTop: 600, scrollY: 0 })).toBe(600);
  });

  test("keeps its bearings once the canvas has already scrolled", () => {
    expect(canvasScrollTargetTop({ elementTop: 200, scrollY: 1000 })).toBe(
      1200
    );
  });

  test("scrolls back up for a layer above the current position", () => {
    expect(canvasScrollTargetTop({ elementTop: -400, scrollY: 1000 })).toBe(600);
  });

  test("never asks for a position above the top of the document", () => {
    expect(canvasScrollTargetTop({ elementTop: -900, scrollY: 100 })).toBe(0);
  });

  test("a layer already at the top asks for no movement", () => {
    expect(canvasScrollTargetTop({ elementTop: 0, scrollY: 0 })).toBe(0);
  });

  /**
   * The bug this replaced: the section's rect was added to the element's, both
   * measured from the same viewport. A layer 60px into a section sitting 500px
   * down went to 1120 instead of 560 — past the section entirely.
   */
  test("does not double-count the enclosing section", () => {
    const sectionTop = 500;
    const elementTop = 560;

    expect(canvasScrollTargetTop({ elementTop, scrollY: 0 })).toBe(560);
    expect(canvasScrollTargetTop({ elementTop, scrollY: 0 })).not.toBe(
      sectionTop + elementTop
    );
  });
});
