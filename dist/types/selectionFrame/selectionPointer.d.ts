/**
 * Whether the pointer is on the selected block.
 *
 * The block lives in the canvas iframe and the action bar lives in the window
 * around it, so the two cannot see each other's pointer: an element only ever
 * hears about the pointer inside its own document. This is the canvas telling
 * the window what it knows, over the same channel the selection's position
 * already travels on.
 *
 * Declared here rather than in `easyblocks-core` beside the other editor
 * events, because both ends of it are in this package — putting it in core
 * would make a second package to build and publish for a message neither the
 * core nor anything else ever reads.
 */
export declare const SELECTION_POINTER_CHANGED = "@easyblocks-editor/selection-pointer-changed";
export type SelectionPointerChangedMessage = {
    type: typeof SELECTION_POINTER_CHANGED;
    payload: {
        isPointerOver: boolean;
    };
};
export declare function selectionPointerChanged(isPointerOver: boolean): SelectionPointerChangedMessage;
export declare function isSelectionPointerChanged(data: unknown): data is SelectionPointerChangedMessage;
//# sourceMappingURL=selectionPointer.d.ts.map