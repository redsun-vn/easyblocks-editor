import {
  ACTIONS_HEIGHT,
  ACTIONS_MAX_WIDTH,
  calculateActionsPosition,
} from "./calculateActionsPosition";

const VIEWPORT = { width: 1366, height: 768 };

/** The gap the bar keeps from its block, written once so the sums below read. */
const GAP = 8;

const block = (rect: Partial<Parameters<typeof calculateActionsPosition>[0]>) => ({
  top: 200,
  left: 100,
  width: 400,
  height: 300,
  ...rect,
});

describe("calculateActionsPosition", () => {
  it("hangs off the block's top-left corner, not its middle", () => {
    const { top, left } = calculateActionsPosition(block({}), VIEWPORT);

    expect(left).toBe(100);
    expect(top).toBe(200 - ACTIONS_HEIGHT - GAP);
  });

  it("flips inside the block when there is no room above", () => {
    // The fault this replaced: a section at the top of the canvas put the bar
    // off-screen, or over whatever sat above it.
    const { top } = calculateActionsPosition(block({ top: 4 }), VIEWPORT);

    expect(top).toBe(4 + GAP);
  });

  it("stays inside the canvas when the block is against the right edge", () => {
    // A narrow column at the right — a header's basket is exactly this.
    const { left } = calculateActionsPosition(
      block({ left: VIEWPORT.width - 60, width: 60 }),
      VIEWPORT
    );

    expect(left).toBe(VIEWPORT.width - ACTIONS_MAX_WIDTH);
  });

  it("never leaves the canvas on the left", () => {
    const { left } = calculateActionsPosition(block({ left: -40 }), VIEWPORT);

    expect(left).toBe(0);
  });

  describe("inside a scrollable container", () => {
    const CONTAINER = { top: 100, left: 50, right: 500, bottom: 600 };

    it("measures room against the container, not the whole canvas", () => {
      // There is room above this block on the canvas, but not inside its
      // container, so the bar goes inside the block rather than over the
      // container's own edge.
      const { top } = calculateActionsPosition(
        block({ top: 110 }),
        VIEWPORT,
        CONTAINER
      );

      expect(top).toBe(110 + GAP);
    });

    it("keeps the bar inside the container's right edge", () => {
      const { left } = calculateActionsPosition(
        block({ left: 460, width: 40 }),
        VIEWPORT,
        CONTAINER
      );

      expect(left).toBe(CONTAINER.right - ACTIONS_MAX_WIDTH);
    });

    it("hides once the block has scrolled out of its container", () => {
      const { display } = calculateActionsPosition(
        block({ top: 700, height: 100 }),
        VIEWPORT,
        CONTAINER
      );

      expect(display).toBe("none");
    });

    it("shows while any part of the block is still in view", () => {
      const { display } = calculateActionsPosition(
        block({ top: 560, height: 300 }),
        VIEWPORT,
        CONTAINER
      );

      expect(display).toBe("block");
    });
  });
});
