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

import { DRAG_HANDLE_SIZE } from "../EditableComponentBuilder/canvasLayers";

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

/**
 * How far past its own edges the bar keeps answering the pointer.
 *
 * Reaching the bar means crossing `GAP`, where the pointer is over neither it
 * nor the block, and that crossing used to read as "the pointer has gone" and
 * take the bar away mid-travel. The bar carries an invisible margin of exactly
 * the width of the gap it has to be reached across.
 */
export const ACTIONS_REACH = GAP;

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

/**
 * Whether the block is big enough to wear the bar inside itself.
 *
 * A header's search icon is not. The bar is both taller and wider than a block
 * that size, so placing it inside covers the icon whole and spills onto
 * whatever sits beside it — in a header that is the next icon along, which is
 * exactly the block the author reaches for next and could no longer hover or
 * click.
 */
function canHostBar(target: Rect) {
  return (
    target.height >= ACTIONS_HEIGHT + GAP && target.width >= ACTIONS_MAX_WIDTH
  );
}

/**
 * Above the block when there is room, and one of two fallbacks when there is
 * not.
 *
 * A block big enough wears the bar inside itself, below its own drag grip.
 * The grip is the one part of the corner that is not free to cover: it is in
 * the canvas iframe and the bar is in the window around it, so the bar is
 * above the grip whatever either of them asks for, and a bar starting at the
 * block's top edge left nothing of the grip to take hold of.
 *
 * A block smaller than the bar has no inside to speak of — the bar covers all
 * of it and reaches past its edges either way — so it goes below the block,
 * where it covers the content underneath rather than the siblings pressed up
 * against it. Below only when below fits: a narrow column taller than the
 * canvas has no bottom edge in view, and chasing it would pin the bar to the
 * foot of the canvas with its block at the head.
 */
function resolveTop(target: Rect, bounds: Bounds) {
  const above = target.top - ACTIONS_HEIGHT - GAP;

  if (above >= bounds.top) {
    return above;
  }

  const below = target.top + target.height + GAP;
  const isBelowInView = below + ACTIONS_HEIGHT <= bounds.bottom;

  const fallback =
    !canHostBar(target) && isBelowInView
      ? below
      : target.top + GAP + DRAG_HANDLE_SIZE;

  return clamp(fallback, bounds.top, bounds.bottom - ACTIONS_HEIGHT);
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

  return {
    top: resolveTop(target, bounds),
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
