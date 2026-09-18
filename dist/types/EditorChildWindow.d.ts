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
 * Whatever is under the pointer wins, and when nothing is, the nearest block
 * within arm's reach does. The fallback matters more than it sounds: blocks are
 * separated by margins, padding and grid gaps that belong to no block at all,
 * and aiming into one of those gaps used to leave the drag with no target — no
 * border, no insertion line, nothing to say the drop would work.
 *
 * Two limits keep that fallback honest, and both were learnt the hard way: a
 * block dropped into a gap landed somewhere the eye could not find it, still
 * present in the layer tree but rendered nowhere. It has to skip blocks that
 * refuse the drag, because dnd-kit only excludes those from its own algorithms
 * and not from this list, and a collection that cannot hold the block will not
 * show it either. And it has to stop at a fixed reach, because "nearest" across
 * a whole page is not aim, it is a guess — past that the drag has no target and
 * the drop leaves the document alone.
 *
 * The rectangle intersection this replaced could not do the job at all. It
 * measures the dragged block's own rectangle, and the dragged block never
 * moves — the canvas draws no ghost, it carries a chip instead — so that
 * rectangle stayed where the drag began and answered with the neighbours of
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