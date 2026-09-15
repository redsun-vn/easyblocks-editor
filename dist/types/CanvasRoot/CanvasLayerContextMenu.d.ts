import React from "react";
import type { EditorContextType } from "../EditorContext";
/**
 * Right-click menu listing every selection frame under the pointer, topmost first, so
 * layers covered by their children or by overlapping elements stay selectable from the
 * canvas.
 */
declare function CanvasLayerContextMenu({ editorContext, }: {
    editorContext: EditorContextType;
}): React.JSX.Element | null;
export { CanvasLayerContextMenu };
//# sourceMappingURL=CanvasLayerContextMenu.d.ts.map