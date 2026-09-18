import { CollisionDetection, UniqueIdentifier } from "@dnd-kit/core";
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
/**
 * The block a drop is aimed at.
 *
 * Whatever is under the pointer wins, and when nothing is, the nearest block to
 * the pointer does. The fallback matters more than it sounds: blocks are
 * separated by margins, padding and grid gaps that belong to no block at all,
 * and aiming into one of those gaps used to leave the drag with no target — no
 * border, no insertion line, nothing to say the drop would work. Every gap now
 * belongs to whichever block is closest, which is the same thing as giving each
 * block a hit area that reaches halfway into the space around it.
 *
 * The rectangle intersection this replaced could not do that job. It measures
 * the dragged block's own rectangle, and the dragged block never moves — the
 * canvas draws no ghost, it carries a chip instead — so that rectangle stayed
 * at the position the drag started from and answered with the neighbours of
 * where the block already was.
 */
export declare function pointerNearestCollisionDetection(args: Parameters<CollisionDetection>[0]): import("@dnd-kit/core").Collision[];
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