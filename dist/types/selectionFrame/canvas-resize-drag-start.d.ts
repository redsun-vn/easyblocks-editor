import type React from "react";
import type { EditorContextType } from "../EditorContext";
import type { Drag, ResizeEdge } from "./canvas-resize-drag-types";
import { CanvasResizeField } from "./canvas-resize-fields";
/**
 * A press on a resize handle, turned into a drag: the page measured as drawn
 * now, the value it starts from, what Esc would put back, and — for a span
 * the block can draw — the preview that stands in for writing.
 *
 * `null` when the press is not a drag: not the main button, or nothing on the
 * page a drag could change. The pointer is captured only for a real drag.
 */
export declare function beginResizeDrag({ edge, event, resizeField, path, editorContext, configAfterAuto, }: {
    edge: ResizeEdge;
    event: React.PointerEvent;
    resizeField: CanvasResizeField;
    path: string;
    editorContext: EditorContextType;
    configAfterAuto: Record<string, any>;
}): Drag | null;
//# sourceMappingURL=canvas-resize-drag-start.d.ts.map