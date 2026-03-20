import React from "react";
interface EditorIframeWrapperProps {
    onEditorHistoryRedo: () => void;
    onEditorHistoryUndo: () => void;
    onSave?: () => void;
    isSaving?: boolean;
    width: number;
    height: number;
    transform: string;
    containerRef: React.RefObject<HTMLDivElement>;
}
declare function EditorIframe({ onEditorHistoryRedo, onEditorHistoryUndo, onSave, isSaving, width, height, transform, containerRef, }: EditorIframeWrapperProps): React.JSX.Element;
export { EditorIframe };
//# sourceMappingURL=EditorIframe.d.ts.map