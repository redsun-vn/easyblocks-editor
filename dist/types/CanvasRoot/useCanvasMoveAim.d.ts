import type { CollisionDetection } from "@dnd-kit/core";
import React from "react";
/**
 * Column-aware aiming for a block dragged on the canvas. See `canvasMoveAim`.
 *
 * Wraps the block-by-block collision detection: when the aim applies it reports
 * no collision at all, so no block frame claims a drop that is going somewhere
 * else, and the insertion line drawn here is the only answer on screen.
 */
export declare function useCanvasMoveAim(editorContext: any, fallback: CollisionDetection): {
    collisionDetection: CollisionDetection;
    onDragMove: () => void;
    takeMove: (fromPath: string) => "none" | {
        fromPath: string;
        toPath: string;
        index?: number;
    } | null;
    clear: () => void;
    indicator: React.JSX.Element | null;
};
//# sourceMappingURL=useCanvasMoveAim.d.ts.map