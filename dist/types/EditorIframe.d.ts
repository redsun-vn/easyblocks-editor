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
    showDeviceFrame?: boolean;
    viewport?: string;
}
declare function EditorIframe({ onEditorHistoryRedo, onEditorHistoryUndo, onSave, isSaving, width, height, transform, containerRef, showDeviceFrame, viewport, }: EditorIframeWrapperProps): React.JSX.Element;
export { EditorIframe };
//# sourceMappingURL=EditorIframe.d.ts.map