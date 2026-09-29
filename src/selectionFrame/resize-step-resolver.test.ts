import {
  gridSpanSteps,
  gridTrackWidth,
  hasEqualTracks,
  isStackedGrid,
  nearestResizeStep,
  offeredSteps,
  targetSizeFromDrag,
} from "./resize-step-resolver";

describe("gridTrackWidth", () => {
  test("shares what the gaps leave between equal tracks", () => {
    // 1200px row, 12 tracks, 16px gaps: (1200 - 11 * 16) / 12
    expect(
      gridTrackWidth({ contentWidth: 1200, trackCount: 12, gap: 16 }),
    ).toBe((1200 - 176) / 12);
  });

  test("a row without tracks has no track width", () => {
    expect(gridTrackWidth({ contentWidth: 800, trackCount: 0, gap: 16 })).toBe(
      0,
    );
  });
});

describe("gridSpanSteps", () => {
  test("offers every span from one track to the whole row", () => {
    const steps = gridSpanSteps({ trackCount: 3, trackWidth: 100, gap: 10 });

    expect(steps).toEqual([
      { value: "1", size: 100 },
      { value: "2", size: 210 },
      { value: "3", size: 320 },
    ]);
  });

  test("a two column row off the twelve grid stops at two", () => {
    expect(
      gridSpanSteps({ trackCount: 2, trackWidth: 400, gap: 0 }).map(
        (step) => step.value,
      ),
    ).toEqual(["1", "2"]);
  });
});

describe("nearestResizeStep", () => {
  const steps = gridSpanSteps({ trackCount: 12, trackWidth: 80, gap: 0 });

  test("lands on the span whose width the edge is nearest", () => {
    expect(nearestResizeStep(steps, 485)?.value).toBe("6");
    expect(nearestResizeStep(steps, 630)?.value).toBe("8");
  });

  test("a tie keeps the smaller span until the midpoint is crossed", () => {
    // 6 spans = 480, 7 spans = 560, midpoint 520
    expect(nearestResizeStep(steps, 520)?.value).toBe("6");
    expect(nearestResizeStep(steps, 521)?.value).toBe("7");
  });

  test("dragging past either end holds at the first or last span", () => {
    expect(nearestResizeStep(steps, -200)?.value).toBe("1");
    expect(nearestResizeStep(steps, 5000)?.value).toBe("12");
  });

  test("no steps, no answer", () => {
    expect(nearestResizeStep([], 100)).toBeNull();
  });
});

describe("targetSizeFromDrag", () => {
  test("the right and bottom edges grow with the pointer", () => {
    expect(
      targetSizeFromDrag({ startSize: 300, pointerDelta: 40, edge: "right" }),
    ).toBe(340);
    expect(
      targetSizeFromDrag({ startSize: 300, pointerDelta: -40, edge: "bottom" }),
    ).toBe(260);
  });

  test("the left edge grows when dragged leftwards", () => {
    expect(
      targetSizeFromDrag({ startSize: 300, pointerDelta: -40, edge: "left" }),
    ).toBe(340);
  });
});

describe("offeredSteps", () => {
  test("keeps only values the field offers, in step order", () => {
    const steps = gridSpanSteps({ trackCount: 4, trackWidth: 10, gap: 0 });

    expect(
      offeredSteps(steps, ["auto", "4", "1", "2"]).map((step) => step.value),
    ).toEqual(["1", "2", "4"]);
  });

  test("a field offering none of the steps leaves nothing to drag", () => {
    const steps = gridSpanSteps({ trackCount: 2, trackWidth: 10, gap: 0 });

    expect(offeredSteps(steps, ["480px", "none"])).toEqual([]);
  });
});

describe("isStackedGrid", () => {
  test("every column full width is a stacked row", () => {
    expect(isStackedGrid([328, 328], 328)).toBe(true);
  });

  test("columns side by side are not", () => {
    expect(isStackedGrid([154, 154], 328)).toBe(false);
  });

  test("a single column spanning the row is not stacked", () => {
    expect(isStackedGrid([328], 328)).toBe(false);
  });

  test("a hidden column does not break the reading", () => {
    expect(isStackedGrid([328, 0, 328], 328)).toBe(true);
  });
});

describe("hasEqualTracks", () => {
  test("a twelve track grid counts in spans", () => {
    expect(hasEqualTracks(Array(12).fill(80))).toBe(true);
  });

  test("proportional tracks from a free percentage do not", () => {
    expect(hasEqualTracks([375, 625])).toBe(false);
  });

  test("no tracks, or unreadable ones, do not", () => {
    expect(hasEqualTracks([])).toBe(false);
    expect(hasEqualTracks([NaN, NaN])).toBe(false);
  });
});
