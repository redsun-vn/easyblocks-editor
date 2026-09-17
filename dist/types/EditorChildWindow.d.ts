import { UniqueIdentifier } from "@dnd-kit/core";
import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { EditorContextType, itemMoved } from "@redsun-vn/easyblocks-core/_internals";
import React from "react";
/**
 * Minimal structural view of a `@dnd-kit` drag end event. `data.current` is `unknown`
 * on purpose: it is untrusted input that `dragDataSchema` validates at this boundary.
 */
export interface DragEndSubject {
    active: {
        id: UniqueIdentifier;
        data: {
            current: unknown;
        };
    };
    over: {
        id: UniqueIdentifier;
        data: {
            current: unknown;
        };
    } | null;
}
/**
 * What a finished drag means. `move` carries the cross-frame event that the parent
 * window turns into a reorder or a move to a different parent; `refocus` reselects
 * the dragged block because nothing changed.
 */
export type DragEndOutcome = {
    type: "move";
    event: ReturnType<typeof itemMoved>;
} | {
    type: "refocus";
    path: string;
};
/**
 * Decides what a finished drag means. Kept pure and separate from the React tree so the
 * move-to-a-different-parent path stays covered by tests: the parent window relies on
 * `fromPath` and `toPath` pointing at different collections to take its insert/remove
 * branch, so any change here silently breaks moving a block out of its parent.
 */
export declare function resolveDragEndOutcome(event: DragEndSubject): DragEndOutcome;
export declare function EasyblocksCanvas({ components, }: {
    components?: Record<string, React.ComponentType<any>>;
}): React.JSX.Element;
/**
 * Every `component-collection` in the tree, at every depth, contributes its items plus a
 * `.before` / `.after` droppable. Those extra ids are what make a collection reachable from
 * a drag that started in a *different* collection, so dropping the last/first slot of another
 * parent keeps working.
 */
export declare function getSortableItems(rootNoCodeEntry: NoCodeComponentEntry, editorContext: EditorContextType): string[];
//# sourceMappingURL=EditorChildWindow.d.ts.map