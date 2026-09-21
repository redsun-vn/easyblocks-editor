/**
 * Where the selection's action bar sits.
 *
 * It used to borrow the add button's position, and that was the whole problem:
 * that position is the *middle* of the block's top edge, which is right for a
 * 24px circle and wrong for a bar six buttons wide. The bar hung from the
 * middle of the block and covered whatever was above the middle — most often
 * the words of the section above, which is the one thing the author did not
 * select and did want to read.
 *
 * It hangs off the top-left corner now, outside the block.
 */

/** The bar's own size, from the buttons it is made of. */
const BUTTON_SIZE = 28;
const BUTTON_GAP = 2;
const BAR_PADDING_X = 10;
const BAR_PADDING_Y = 5;

/** Six buttons at most: duplicate, delete, up, down, move to, and the menu. */
const MOST_BUTTONS = 6;

export const ACTIONS_HEIGHT = BUTTON_SIZE + BAR_PADDING_Y * 2;

/**
 * The widest the bar can be, used only to keep it inside the canvas.
 *
 * A ceiling rather than a measurement, and that is safe in one direction only:
 * being generous parks the bar a little further from the right edge than it
 * needed to be, while being mean would let it hang over the edge. Two of the
 * six buttons appear conditionally, so the real width is often smaller.
 */
export const ACTIONS_MAX_WIDTH =
  MOST_BUTTONS * BUTTON_SIZE + (MOST_BUTTONS - 1) * BUTTON_GAP + BAR_PADDING_X * 2;

/** Breathing room between the bar and the block it belongs to. */
const GAP = 8;

type Rect = { top: number; left: number; width: number; height: number };

type Bounds = { top: number; left: number; right: number; bottom: number };

type Viewport = { width: number; height: number };

export type ActionsPosition = {
  top: number;
  left: number;
  display: "block" | "none";
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * What the bar is allowed to occupy: the canvas, narrowed to the scrollable
 * container when the block is inside one.
 */
function resolveBounds(viewport: Viewport, container?: Bounds): Bounds {
  return {
    top: Math.max(0, container?.top ?? 0),
    left: Math.max(0, container?.left ?? 0),
    right: Math.min(viewport.width, container?.right ?? viewport.width),
    bottom: Math.min(viewport.height, container?.bottom ?? viewport.height),
  };
}

function calculateActionsPosition(
  target: Rect,
  viewport: Viewport,
  container?: Bounds
): ActionsPosition {
  const bounds = resolveBounds(viewport, container);

  // A block scrolled out of its container takes its bar with it. Without this
  // the bar stayed put over whatever had scrolled into its place — the same
  // fault the add buttons had.
  const isBlockInView =
    target.top <= bounds.bottom && target.top + target.height >= bounds.top;

  const above = target.top - ACTIONS_HEIGHT - GAP;

  return {
    /**
     * Above the block when there is room for it, and just inside the block's
     * own top edge when there is not.
     *
     * Overlapping the block being edited costs its top-left corner. Overlapping
     * the block above it hides something nobody selected, which is what this
     * replaced — so when only one of the two is possible, the bar covers its
     * own block.
     */
    top:
      above >= bounds.top
        ? above
        : clamp(target.top + GAP, bounds.top, bounds.bottom - ACTIONS_HEIGHT),
    /**
     * The block's left edge, pulled back only as far as staying inside needs.
     *
     * A narrow block against the right edge — the basket column of a header is
     * exactly that — would otherwise push the bar off the canvas.
     */
    left: clamp(
      target.left,
      bounds.left,
      Math.max(bounds.left, bounds.right - ACTIONS_MAX_WIDTH)
    ),
    display: isBlockInView ? "block" : "none",
  };
}

export { calculateActionsPosition };
