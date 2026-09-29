import { DRAG_HANDLE_SIZE } from "../EditableComponentBuilder/canvasLayers";
import {
  ACTIONS_HEIGHT,
  ACTIONS_MAX_WIDTH,
  ACTIONS_REACH,
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

    expect(top).toBe(4 + GAP + DRAG_HANDLE_SIZE);
  });

  it("leaves the whole drag grip clear when it goes inside", () => {
    // The bar is in the editor window and the grip is in the canvas iframe, so
    // the bar is on top of it however either is stacked. Its reach — the
    // invisible margin it answers the pointer across — has to clear the grip
    // too, or the block can be selected and never picked up.
    const top = 4;
    const { top: barTop } = calculateActionsPosition(block({ top }), VIEWPORT);

    expect(barTop - ACTIONS_REACH).toBeGreaterThanOrEqual(
      top + DRAG_HANDLE_SIZE
    );
  });

  describe("a block too small to wear the bar", () => {
    // A header's search icon: shorter and narrower than the bar, pinned to the
    // top of the canvas so there is no room above it either.
    const icon = { top: 4, left: 1200, width: 32, height: 32 };

    it("puts the bar below rather than inside", () => {
      // Inside, the bar covered the icon whole and reached across the icons
      // beside it — the basket next door could be neither hovered nor clicked.
      const { top } = calculateActionsPosition(icon, VIEWPORT);

      expect(top).toBe(icon.top + icon.height + GAP);
    });

    it("counts a block only as tall as the bar as too small", () => {
      // Hosting the bar means room for it and the gap it keeps.
      const { top } = calculateActionsPosition(
        { ...icon, width: 900, height: ACTIONS_HEIGHT },
        VIEWPORT
      );

      expect(top).toBe(icon.top + ACTIONS_HEIGHT + GAP);
    });

    it("counts a tall but narrow block as too small", () => {
      // A narrow column is tall enough to hide the bar and not wide enough:
      // the bar would still reach out over its neighbour.
      const { top } = calculateActionsPosition(
        { ...icon, width: ACTIONS_MAX_WIDTH - 1, height: 600 },
        VIEWPORT
      );

      expect(top).toBe(icon.top + 600 + GAP);
    });

    it("still stays inside the canvas", () => {
      // A canvas with room neither above the icon nor below it — the bar comes
      // back up to the last row that fits rather than leaving the canvas.
      const SHORT = { width: VIEWPORT.width, height: 60 };

      const { top } = calculateActionsPosition(icon, SHORT);

      expect(top).toBe(SHORT.height - ACTIONS_HEIGHT);
    });

    it("stays with a block whose bottom edge is nowhere in view", () => {
      // A narrow column taller than the canvas: chasing its bottom edge would
      // pin the bar to the foot of the canvas with its block at the head, so
      // it stays at the block's own top instead, clear of the grip.
      const { top } = calculateActionsPosition(
        { ...icon, width: 150, height: VIEWPORT.height * 2 },
        VIEWPORT
      );

      expect(top).toBe(icon.top + GAP + DRAG_HANDLE_SIZE);
    });
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

      expect(top).toBe(110 + GAP + DRAG_HANDLE_SIZE);
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

  describe("a bar grown by formatting controls", () => {
    it("pulls back far enough for its drawn width", () => {
      const { left } = calculateActionsPosition(
        block({ left: VIEWPORT.width - 50, width: 40 }),
        VIEWPORT,
        undefined,
        { width: 420, height: ACTIONS_HEIGHT }
      );

      expect(left).toBe(VIEWPORT.width - 420);
    });

    it("sits above the block by its drawn height once it wraps", () => {
      const wrappedHeight = ACTIONS_HEIGHT * 2;
      const { top } = calculateActionsPosition(
        block({ top: 200 }),
        VIEWPORT,
        undefined,
        { width: 300, height: wrappedHeight }
      );

      expect(top).toBe(200 - wrappedHeight - GAP);
    });

    it("never trusts a size measured while the bar was hidden", () => {
      const { top, left } = calculateActionsPosition(
        block({ left: VIEWPORT.width - 50, width: 40, top: 200 }),
        VIEWPORT,
        undefined,
        { width: 0, height: 0 }
      );

      expect(left).toBe(VIEWPORT.width - ACTIONS_MAX_WIDTH);
      expect(top).toBe(200 - ACTIONS_HEIGHT - GAP);
    });
  });
});
