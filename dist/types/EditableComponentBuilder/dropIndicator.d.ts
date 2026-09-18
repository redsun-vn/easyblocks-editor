/**
 * Which edge of a block the insertion line is drawn on while a drag is in progress.
 *
 * `before` is the leading edge of the block — its top in a collection that stacks
 * vertically, its left in one that flows horizontally — and `after` the trailing edge.
 * `null` means the dragged block would not land next to this block at all.
 */
export type DropIndicatorEdge = "before" | "after" | null;
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
export declare function resolveDropIndicatorEdge({ id, overId, activeIndex, index, isDroppableDisabled, isBeingDragged, }: DropIndicatorInput): DropIndicatorEdge;
//# sourceMappingURL=dropIndicator.d.ts.map