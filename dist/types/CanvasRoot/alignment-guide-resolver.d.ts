import type { PanelDropAim, PanelDropSlot, SlotChildRect } from "../editorSidebar/editorSections/panelDropSlots";
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
/**
 * Which line of the collection a child sits on: its start, its centre or its
 * end. A child filling the collection sits on all three, which tells the
 * person nothing, so it counts as none.
 */
export declare function alignedEdge(child: {
    start: number;
    end: number;
}, container: {
    start: number;
    end: number;
}): Edge | null;
/** Whether every child of a row overlaps one band of height: one line, not wrapped. */
export declare function sharesOneLine(children: ReadonlyArray<SlotChildRect>): boolean;
/**
 * The guide for a drop at `aim` into `slot`, or `null` when the neighbours
 * give no line worth drawing.
 *
 * `fromIndex` is the dragged block's own place when it is moving within this
 * collection: it is about to leave that place, so it is no neighbour.
 */
export declare function resolveAlignmentGuide({ slot, aim, fromIndex, }: {
    slot: PanelDropSlot;
    aim: PanelDropAim;
    fromIndex?: number;
}): AlignmentGuide | null;
export {};
//# sourceMappingURL=alignment-guide-resolver.d.ts.map