/**
 * Choosing which collection a panel drop is aimed at.
 *
 * The gesture used to have one possible answer — a gap between two top-level
 * sections — because the canvas only ever measured frames whose path looked like
 * `data.<n>`. Everything deeper was filtered out, so releasing the pointer over a
 * column did not land in that column; it fell back to an index at the page root
 * and the item arrived somewhere else entirely, with no sign that anything had
 * been redirected.
 *
 * These functions are geometry and string work only. They take rectangles the
 * canvas measured and answer where the item goes, which keeps the part that is
 * easy to get wrong testable without a browser.
 */
export type SlotChildRect = {
    /** Position in the collection. */
    index: number;
    /** The child's component id, when known. */
    component?: string;
    top: number;
    bottom: number;
    left: number;
    right: number;
};
export type SlotBounds = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
/** A collection the pointer could be aiming at. */
export type PanelDropSlot = {
    /** Dot path of the component owning the collection; empty string for the document root. */
    parentPath: string;
    /** The collection prop's name. */
    prop: string;
    children: Array<SlotChildRect>;
    /** The area that counts as being inside this collection. */
    bounds: SlotBounds;
    /**
     * Which way the collection lays its children out, as measured on screen.
     * Only consulted when there are too few children to infer it from.
     */
    axis?: SlotAxis;
    /** Component ids and types the collection takes, when known. */
    accepts?: Array<string>;
};
export type PanelDropAim = {
    parentPath: string;
    prop: string;
    index: number;
    /** Where to draw the insertion line, in canvas viewport coordinates. */
    line: {
        x: number;
        y: number;
        length: number;
        axis: SlotAxis;
    };
};
export type SlotAxis = "vertical" | "horizontal";
/**
 * Splits a frame's path into the collection holding it and its position.
 *
 * Every editable frame's path ends in `<prop>.<index>`, at the root (`data.2`)
 * just as much as deeper in (`data.0.Cells.1.Items.3`), so one rule reads both
 * and the root stops being a special case.
 */
export declare function parseSlotPath(path: string): {
    parentPath: string;
    prop: string;
    index: number;
} | null;
/**
 * Whether a collection lays its children out across or down the page.
 *
 * Read from where the children actually are rather than from the component's
 * settings: a row of columns turns into a stack at a narrow breakpoint, and the
 * insertion line has to follow what is on screen, not what the desktop layout
 * says. Comparing how far apart the first two children are on each axis needs no
 * tolerance value to tune.
 */
export declare function inferSlotAxis(children: Array<SlotChildRect>): SlotAxis;
/**
 * Which gap inside one collection the pointer is aiming at.
 *
 * A child's midpoint is the boundary, not its nearest edge: a section is often
 * taller than the screen, and with edges the whole middle of a tall one would aim
 * at nothing. An empty collection still answers — index 0 — because dropping onto
 * an empty column is the gesture this whole change exists to allow.
 */
export declare function resolveSlotAim(pointer: {
    x: number;
    y: number;
}, slot: PanelDropSlot): PanelDropAim;
/**
 * The collection a frame under the pointer belongs to.
 *
 * Which frame is under the pointer is a paint-order question, answered by
 * `elementsFromPoint` before this is called. What the frame *means* is a tree
 * question, answered here, and keeping the two apart is the whole point: a
 * geometric search for the deepest rectangle containing the pointer picks the
 * wrong one as soon as anything overlaps. A sticky header is the case that
 * proves it — it stays at the top of the canvas while the page scrolls beneath,
 * so a pointer over the header sits inside the header *and* inside whatever row
 * has scrolled under it, and the row is the deeper of the two. The item then
 * lands in a block the person cannot even see.
 *
 * From the frame, three questions in order:
 *
 *   1. Does this block own a collection that takes drops? Reaching a block as
 *      the topmost frame means the pointer is in its own space rather than in
 *      any child, so its own collection is what is being aimed at — this is how
 *      an empty column, and the gutter between two columns, are reachable.
 *   2. Otherwise, does the collection holding it take drops? This is the common
 *      case: the pointer is over an item, and the item's own collection is where
 *      a sibling would go.
 *   3. Otherwise ask the same of its parent, and so on outwards.
 *
 * The root collection ends every walk, so a frame belonging to a collection that
 * never opted in — an older container — sends the drop to the page root, exactly
 * where it would have gone before any of this existed. It does not fall through
 * to whatever happens to be painted behind it.
 */
export declare function pickSlotForPath(slots: Array<PanelDropSlot>, path: string | null): PanelDropSlot | null;
/**
 * Every collection the walk above passes through, innermost first and the root
 * last. `pickSlotForPath` takes the first; a drag that knows what it carries
 * takes the first one that can hold it.
 */
export declare function listSlotCandidates(slots: Array<PanelDropSlot>, path: string | null): Array<PanelDropSlot>;
//# sourceMappingURL=panelDropSlots.d.ts.map