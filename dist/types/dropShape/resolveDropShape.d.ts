import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { GetShapeDefinition } from "./collectionSlots";
import { WrapperLevel } from "./resolveWrapperChain";
/**
 * Whether a slot takes this entry.
 *
 * The same test `paste/insert.ts` applies at insertion: a slot's `accepts` names
 * either a component id or a component type, and an entry qualifies on either.
 */
export declare function fitsSlot(entry: NoCodeComponentEntry, accepts: Array<string>, getDefinition: GetShapeDefinition): boolean;
export type ResolveDropShapeInput = {
    /** The entry as the template author wrote it. */
    entry: NoCodeComponentEntry;
    /** `accepts` of the slot the drop is aimed at. */
    accepts: Array<string>;
    /** Innermost first, from `resolveWrapperChain`. Empty disables re-wrapping. */
    wrapperLevels: Array<WrapperLevel>;
    getDefinition: GetShapeDefinition;
};
/**
 * The shape an entry should take to land in a particular slot.
 *
 * One question decides it, and it is asked of the target rather than of the
 * component: what does this slot accept? A component dropped into a column that
 * already accepts it needs no row and no column around it, while the same
 * component dropped on the page root needs both, because a root takes sections
 * and a loose component is not one. Nothing here is configured per component.
 *
 * Candidates are tried shortest first:
 *
 *   1. `core` — the payload, with packaging peeled off.
 *   2. `entry` — exactly what the author wrote, wrapper and all.
 *   3. `core` inside one authored wrapper level.
 *   4. `core` inside two.
 *
 * The order is where the work happens. A column accepts both a mini cart and a
 * row — the row so that sub-grids are possible — so both `core` and `entry` fit
 * and only preferring the shorter one removes the pointless nesting that made a
 * dropped block awkward to move.
 *
 * Rung 2 sits above the rebuilt wrappers for a reason worth keeping: the authored
 * wrapper carries the author's band padding, and a rebuilt one carries none. At
 * page root, where that padding is the whole point of the band, rung 2 is what
 * preserves it. The rebuilt rungs only run when nothing authored can fit, which
 * is how a bare component reaches a root at all.
 *
 * `null` means no shape fits, and the caller must not insert. That matters more
 * than it looks: `insertItem` performs no `accepts` check of its own — the form
 * mutators splice into the array as given — so this function is the only thing
 * standing between a drop and a tree that cannot hold it.
 */
export declare function resolveDropShape({ entry, accepts, wrapperLevels, getDefinition, }: ResolveDropShapeInput): NoCodeComponentEntry | null;
//# sourceMappingURL=resolveDropShape.d.ts.map