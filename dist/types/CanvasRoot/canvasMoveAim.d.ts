import { type PanelDropAim, type PanelDropSlot } from "../editorSidebar/editorSections/panelDropSlots";
/**
 * Where a block already on the canvas lands when it is dragged across columns.
 *
 * The block-by-block targeting that dragging used before only knows about
 * blocks: a column's own space is a droppable only when the row it sits in can
 * take the dragged block, and a row takes nothing but columns. So the empty part
 * of a column — the part somebody aims at to put a block beside another — was
 * no target at all, and the nearest-block fallback answered with whatever sat
 * closest, often a block in the neighbouring column or nothing. Moving a block
 * from one column to another, in the same row or a different one, was down to
 * luck.
 *
 * This aims the way a drop from the panel does — the collection under the
 * pointer and the gap in it — so both gestures agree on where a block goes.
 *
 * It only takes over for a block living in a collection that opted in with
 * `panelDropTarget`, and never for a drop at the page root or into an older
 * container: those keep the block-by-block targeting exactly as it was.
 */
export type CanvasMoveAim = PanelDropAim & {
    /** How many items the target collection holds right now. */
    length: number;
};
export declare function resolveCanvasMoveAim({ slots, fromPath, topmostPath, pointer, legacyOverPath, canHold, }: {
    slots: Array<PanelDropSlot>;
    fromPath: string;
    /** The frame painted on top under the pointer. */
    topmostPath: string | null;
    pointer: {
        x: number;
        y: number;
    };
    /**
     * Collection path of what the block-by-block targeting found, if anything. An
     * older container found there keeps the drop, so a block can still be put
     * into one that sits inside a column.
     */
    legacyOverPath: string | null;
    canHold: (slot: PanelDropSlot) => boolean;
}): CanvasMoveAim | null;
/**
 * The aim as the parent window's move event reads it, or `null` when the block
 * would land where it already is.
 *
 * Within one collection the parent reorders to the index `toPath` ends in,
 * counted after the block has left its place. Across two it inserts into the
 * collection `toPath` sits in — or is, for an empty one — at `index`. The index
 * travels with the event rather than being worked out from `placement`,
 * because that arithmetic predates this and older documents depend on it
 * exactly as it is.
 */
export declare function toItemMove(aim: CanvasMoveAim, fromPath: string): {
    fromPath: string;
    toPath: string;
    index?: number;
} | null;
/**
 * Which path to remove and which to select after an aimed move has inserted the
 * block at `index` in `collectionPath`.
 */
export declare function planAimedMove(sourcePath: string, collectionPath: string, index: number): {
    sourceToRemove: string;
    pathToFocus: string;
};
//# sourceMappingURL=canvasMoveAim.d.ts.map