import React from "react";
import { EditorContextType } from "../EditorContext";
import { CanvasResizeField } from "./canvas-resize-fields";
import type { ResizeEdge, ResizeReading } from "./canvas-resize-drag-types";
export type { ResizeEdge, ResizeReading };
/**
 * One drag of a resize handle, from press to release.
 *
 * Each time the edge reaches another value the field is written, so the page
 * reflows under the pointer. The first write makes an undo step and the rest
 * fold into it, which is what makes a whole drag one Ctrl+Z. Esc puts the
 * stored value back, byte for byte, rather than writing the value it showed.
 */
export declare function useCanvasResizeDrag({ resizeField, path, editorContext, configAfterAuto, gestureHasWritten, }: {
    /** Absent when the block has no field for this axis; the hook then does nothing. */
    resizeField: CanvasResizeField | undefined;
    path: string;
    editorContext: EditorContextType;
    configAfterAuto: Record<string, any>;
    /**
     * Whether the gesture has written yet, shared by the hooks one gesture
     * drives: a corner moves a width and a height, and both belong to the same
     * undo step.
     */
    gestureHasWritten: {
        current: boolean;
    };
}): {
    reading: ResizeReading | null;
    handlers: {
        onPointerDown: (edge: ResizeEdge) => (event: React.PointerEvent) => void;
        onPointerMove: (event: React.PointerEvent) => void;
        onPointerUp: () => void;
        onLostPointerCapture: () => void;
        onPointerCancel: () => void;
    };
};
//# sourceMappingURL=use-canvas-resize-drag.d.ts.map