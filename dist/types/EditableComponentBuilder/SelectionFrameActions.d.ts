import { ActionsType, TEasyblocksEditorMode } from "@/types";
import { ContextParams } from "@redsun-vn/easyblocks-core";
import React from "react";
interface ISelectionFrameActionsProps {
    focussedField: string[];
    actions: ActionsType;
    translationFiles: {
        [key: string]: any;
    };
    contextParams: ContextParams;
    editorMode: TEasyblocksEditorMode;
}
export declare const SelectionFrameActions: ({ focussedField, actions, translationFiles, contextParams, editorMode, }: ISelectionFrameActionsProps) => React.JSX.Element;
export {};
//# sourceMappingURL=SelectionFrameActions.d.ts.map