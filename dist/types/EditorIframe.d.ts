import React from "react";
interface EditorIframeWrapperProps {
    onEditorHistoryRedo: () => void;
    onEditorHistoryUndo: () => void;
    width: number;
    height: number;
    transform: string;
    containerRef: React.RefObject<HTMLDivElement>;
}
declare function EditorIframe({ onEditorHistoryRedo, onEditorHistoryUndo, width, height, transform, containerRef, }: EditorIframeWrapperProps): React.JSX.Element;
export { EditorIframe };
//# sourceMappingURL=EditorIframe.d.ts.map