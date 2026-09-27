/**
 * Whether the pointer is near the selection, told by two sources that disagree
 * in time.
 *
 * The selected block is in the canvas iframe and reports by `postMessage`,
 * which lands a task after the event that caused it. The controls the
 * selection puts on the canvas — the action bar, the add buttons — are in the
 * editor window and report as it happens. Moving from the block onto a control
 * therefore says "on the control" first and "off the block" second, and a
 * single flag reads that second report as a departure: the controls go away
 * from under the pointer that had only just reached them.
 *
 * So each source keeps its own answer, and the pointer is near the selection
 * while either of them says it is. Order stops mattering.
 */
/** The two places a pointer counts as near the selection. */
export type PointerLocation = "block" | "controls";
export type PointerPresence = Readonly<Record<PointerLocation, boolean>>;
/** The pointer is nowhere near the selection, which is where it starts. */
export declare const NO_POINTER: PointerPresence;
export declare function withPointerAt(presence: PointerPresence, where: PointerLocation, isOver: boolean): PointerPresence;
export declare function isPointerNearSelection(presence: PointerPresence): boolean;
//# sourceMappingURL=pointerPresence.d.ts.map