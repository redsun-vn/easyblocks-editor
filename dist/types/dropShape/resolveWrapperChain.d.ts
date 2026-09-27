import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { GetShapeDefinition } from "./collectionSlots";
export type WrapperLevel = {
    /** The wrapper entry itself, with its own values — column count, spans, spacing. */
    entry: NoCodeComponentEntry;
    /** The collection prop the next level down sits in. */
    prop: string;
};
/**
 * The nesting a host app uses to put a loose component on a page, read off one of
 * its own templates.
 *
 * The chain is not hard-coded here because `BlockRow` and `BlockColumn` are the
 * host app's components, not the editor's: an editor that named them would only
 * work for one app. Instead the app points at a template it already ships — the
 * one-column row — and this walks it.
 *
 * Reading it from a real template rather than from a separate list is what keeps
 * the two from drifting: change the template and the wrapper changes with it,
 * because there is only ever one description of it.
 *
 * Returned innermost first, so `levels[0]` is the column and `levels[1]` the row.
 * A caller wanting one layer takes `levels[0]`; wanting two takes both.
 */
export declare function resolveWrapperChain(wrapperEntry: NoCodeComponentEntry, getDefinition: GetShapeDefinition): Array<WrapperLevel>;
/**
 * `core` placed inside the innermost `depth` levels of a wrapper chain.
 *
 * The wrapper keeps every value it was authored with — the row's column count,
 * the column's span — and only its collection prop is replaced. Ids are left
 * alone because every insertion path duplicates the config on the way in, which
 * is where fresh ids come from.
 */
export declare function wrapWithChain(core: NoCodeComponentEntry, levels: Array<WrapperLevel>, depth: number): NoCodeComponentEntry;
//# sourceMappingURL=resolveWrapperChain.d.ts.map