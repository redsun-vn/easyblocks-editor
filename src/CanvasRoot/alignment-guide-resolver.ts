import type {
  PanelDropAim,
  PanelDropSlot,
  SlotChildRect,
} from "../editorSidebar/editorSections/panelDropSlots";

/**
 * The second line a drag draws: across the insertion line, where the dropped
 * block will line up with its neighbours.
 *
 * The insertion line already says where along a collection the block lands.
 * What it does not say is where across: a column that centres its blocks puts
 * the new one on the centre line, one that starts them at the left puts it at
 * the left. That is read from the neighbours the block lands between, which
 * the collection has already laid out the same way it will lay out this one.
 *
 * "The collection" here is the box its blocks take up together — the slot's
 * bounds are the union of its children, not the column's own frame. So a
 * collection of one block, or of blocks all the same width, gives no guide:
 * nothing in it tells a start from a centre.
 *
 * Geometry only, so it is tested without a browser.
 */

/** Same shape as the insertion line, so both draw with one component. */
export type AlignmentGuide = PanelDropAim["line"];

type Edge = "start" | "center" | "end";

/** How close two coordinates must be to count as the same line, in pixels. */
const SAME_LINE = 1.5;

const isSame = (a: number, b: number) => Math.abs(a - b) < SAME_LINE;

/** A child's extent across the collection, and the collection's own. */
function across(
  rect: SlotChildRect | PanelDropSlot["bounds"],
  axis: PanelDropSlot["axis"],
) {
  return axis === "horizontal"
    ? { start: rect.top, end: rect.bottom }
    : { start: rect.left, end: rect.right };
}

/**
 * Which line of the collection a child sits on: its start, its centre or its
 * end. A child filling the collection sits on all three, which tells the
 * person nothing, so it counts as none.
 */
export function alignedEdge(
  child: { start: number; end: number },
  container: { start: number; end: number },
): Edge | null {
  const fillsStart = isSame(child.start, container.start);
  const fillsEnd = isSame(child.end, container.end);

  if (fillsStart && fillsEnd) {
    return null;
  }

  if (fillsStart) {
    return "start";
  }

  if (fillsEnd) {
    return "end";
  }

  const childCentre = (child.start + child.end) / 2;
  const containerCentre = (container.start + container.end) / 2;

  return isSame(childCentre, containerCentre) ? "center" : null;
}

/** Whether every child of a row overlaps one band of height: one line, not wrapped. */
export function sharesOneLine(children: ReadonlyArray<SlotChildRect>) {
  if (children.length === 0) {
    return true;
  }

  const lowestTop = Math.max(...children.map((child) => child.top));
  const highestBottom = Math.min(...children.map((child) => child.bottom));

  return lowestTop < highestBottom;
}

/**
 * The guide for a drop at `aim` into `slot`, or `null` when the neighbours
 * give no line worth drawing.
 *
 * `fromIndex` is the dragged block's own place when it is moving within this
 * collection: it is about to leave that place, so it is no neighbour.
 */
export function resolveAlignmentGuide({
  slot,
  aim,
  fromIndex,
}: {
  slot: PanelDropSlot;
  aim: PanelDropAim;
  fromIndex?: number;
}): AlignmentGuide | null {
  const axis = aim.line.axis;
  const neighbours = slot.children.filter(
    (child) =>
      child.index !== fromIndex &&
      (child.index === aim.index - 1 || child.index === aim.index),
  );

  // The one before the gap first: it is the one the eye reads down from.
  neighbours.sort((a, b) => a.index - b.index);

  // A row that wraps onto several lines has no one line its blocks share, and
  // a guide read across all of them could point where the block will not go.
  if (axis === "horizontal" && !sharesOneLine(slot.children)) {
    return null;
  }

  const container = across(slot.bounds, axis);

  for (const neighbour of neighbours) {
    const extent = across(neighbour, axis);
    const edge = alignedEdge(extent, container);

    if (!edge) {
      continue;
    }

    const position =
      edge === "start"
        ? extent.start
        : edge === "end"
          ? extent.end
          : (extent.start + extent.end) / 2;

    // Along the collection, from the first neighbour to the last, taking in
    // the gap the insertion line marks.
    const along = neighbours.flatMap((child) =>
      axis === "horizontal"
        ? [child.left, child.right]
        : [child.top, child.bottom],
    );
    const lineAt = axis === "horizontal" ? aim.line.x : aim.line.y;
    const from = Math.min(lineAt, ...along);
    const to = Math.max(lineAt, ...along);

    return axis === "horizontal"
      ? { axis: "vertical", x: from, y: position, length: to - from }
      : { axis: "horizontal", x: position, y: from, length: to - from };
  }

  return null;
}
