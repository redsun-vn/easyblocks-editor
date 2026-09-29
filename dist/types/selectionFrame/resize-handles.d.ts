import React from "react";
import { CanvasResizeField } from "./canvas-resize-fields";
/**
 * Handles on the selected block's edges for a field that opted into them.
 *
 * The box follows the same position messages the action bar hangs from. A
 * handle is offered only while a drag would change something the page shows,
 * and stays put for as long as a drag is on even if that reading changes
 * under it — the canvas redraws a moment after each write, and a handle that
 * vanished mid-drag would take the pointer with it.
 */
export declare function ResizeHandles({ resizeField, path, }: {
    resizeField: CanvasResizeField;
    path: string;
}): React.JSX.Element | null;
//# sourceMappingURL=resize-handles.d.ts.map