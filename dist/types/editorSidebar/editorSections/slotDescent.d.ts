import { type PanelDropSlot } from "./panelDropSlots";
/**
 * Aiming past a collection of containers into the container itself.
 *
 * A row's own space — its padding, the gutter between two columns, the strip
 * above a column that is shorter than the row — belongs to the row, not to any
 * column. Aimed at literally, a drop there lands between two columns, and a
 * search bar released beside the cart icon of a header arrived as a column of
 * its own. Nobody pointing at the gap beside an icon means "a new column": they
 * mean the column the icon is in, so that is where the aim goes.
 *
 * Only a collection that takes its children by their own component id — a row,
 * which takes columns and nothing else — and whose every child is exactly one
 * opted-in collection is descended. A column is where content lives and stays
 * the answer, even one holding nothing but sub-grids: it takes those by type,
 * and descending there would put the block between the sub-grid's columns — the
 * very thing this exists to stop. The root never descends: a pointer over
 * open canvas below the last section means "a new section", as it always has.
 */
/** Squared distance from a point to the nearest point of a rectangle; 0 inside it. */
export declare function squaredDistanceToRect(pointer: {
    x: number;
    y: number;
}, rect: {
    left: number;
    top: number;
    width: number;
    height: number;
}): number;
/** The collection inside the child nearest the pointer, or `slot` itself when it holds content. */
export declare function descendToNearestChildSlot(slots: Array<PanelDropSlot>, slot: PanelDropSlot, pointer: {
    x: number;
    y: number;
}): PanelDropSlot;
/**
 * The collection a drag that knows what it carries is aimed at.
 *
 * Walks outwards from the frame under the pointer, as `pickSlotForPath` does,
 * and takes the first collection that can hold the block — trying the column
 * nearest the pointer whenever the collection itself is a row that cannot. A
 * column being dragged is held by the row, so columns still reorder among
 * themselves; a block inside one is not, so it moves to the nearest column.
 */
export declare function pickSlotForDrag({ slots, path, pointer, canHold, }: {
    slots: Array<PanelDropSlot>;
    path: string | null;
    pointer: {
        x: number;
        y: number;
    };
    canHold: (slot: PanelDropSlot) => boolean;
}): PanelDropSlot | null;
//# sourceMappingURL=slotDescent.d.ts.map