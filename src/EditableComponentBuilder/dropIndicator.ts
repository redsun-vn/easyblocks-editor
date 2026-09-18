/**
 * Which edge of a block the insertion line is drawn on while a drag is in progress.
 *
 * `before` is the leading edge of the block — its top in a collection that stacks
 * vertically, its left in one that flows horizontally — and `after` the trailing edge.
 * `null` means the dragged block would not land next to this block at all.
 */
export type DropIndicatorEdge = "before" | "after" | null;

/**
 * Suffixes of the extra droppables that mark the outer edges of a collection. They are the
 * only way to express "put it before the first item" or "after the last one", because a
 * plain block id leaves the placement to be worked out from the order of the two paths.
 */
const EDGE_DROPPABLE_SUFFIX = {
  before: ".before",
  after: ".after",
} as const;

export interface DropIndicatorInput {
  /** Sortable id of the block asking where its line goes. */
  id: string;
  /** Id of the droppable under the pointer, or `null` when the pointer is over none. */
  overId: string | null;
  /** Position of the dragged block in the flattened list of sortable items. */
  activeIndex: number;
  /** Position of this block in that same list. */
  index: number;
  /** This block's collection refuses the block being dragged. */
  isDroppableDisabled: boolean;
  /** This block is the one being dragged. */
  isBeingDragged: boolean;
}

/**
 * Where the block being dragged would land, seen from a single block.
 *
 * Every block runs this against the one droppable `@dnd-kit` reports as hovered, so exactly
 * one line is on screen at a time and it sits on the boundary the block will land on —
 * including a reorder inside one collection and a gap between two middle items, neither of
 * which used to be marked at all.
 *
 * When the hovered droppable is a block rather than a collection edge, the landing side
 * follows the order of the two blocks, which is what the document itself does with the drop:
 * a reorder inside one collection takes the block out and puts it back at the target's
 * index, so dragging downwards lands after the target and dragging upwards lands before it.
 */
export function resolveDropIndicatorEdge({
  id,
  overId,
  activeIndex,
  index,
  isDroppableDisabled,
  isBeingDragged,
}: DropIndicatorInput): DropIndicatorEdge {
  if (overId === null || isDroppableDisabled) {
    return null;
  }

  // Dropping a block onto itself changes nothing, so it gets no line.
  if (isBeingDragged) {
    return null;
  }

  if (overId === `${id}${EDGE_DROPPABLE_SUFFIX.before}`) {
    return "before";
  }

  if (overId === `${id}${EDGE_DROPPABLE_SUFFIX.after}`) {
    return "after";
  }

  // Another block is hovered: its own line is the one to show.
  if (overId !== id) {
    return null;
  }

  // A block missing from the sortable list, or hovering itself, gives no usable order.
  if (activeIndex === -1 || index === -1 || activeIndex === index) {
    return null;
  }

  return activeIndex > index ? "before" : "after";
}
