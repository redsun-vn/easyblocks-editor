/**
 * Which sidebar groups this viewer has folded away.
 *
 * Groups open by default, so only the closed ones are worth storing: a first
 * visit, a cleared browser, a blocked storage — all of them fall through to
 * the whole library on show, which is the state somebody who has never used
 * the panel needs. What is stored is the exception the reader chose.
 *
 * It lives in `localStorage` because it is a convenience for one person at one
 * browser: nothing here belongs to the shop, and a teammate opening the same
 * theme should not inherit somebody else's folded panel.
 */
/** Whether the viewer has folded this group away. */
export declare const isGroupCollapsed: (key: string) => boolean;
/** Folds a group away, or opens it again, for this browser. */
export declare const setGroupCollapsed: (key: string, collapsed: boolean) => void;
//# sourceMappingURL=panelCollapse.d.ts.map