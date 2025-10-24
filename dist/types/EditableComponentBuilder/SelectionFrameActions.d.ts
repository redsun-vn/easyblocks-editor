import { ContextParams } from "@redsun-vn/easyblocks-core";
import React from "react";
import { ActionsType } from "../types";
interface ISelectionFrameActionsProps {
    focussedField: string[];
    actions: ActionsType;
    translationFiles: {
        [key: string]: any;
    };
    contextParams: ContextParams;
}
export declare const SelectionFrameActions: ({ focussedField, actions, translationFiles, contextParams, }: ISelectionFrameActionsProps) => React.JSX.Element;
export {};
//# sourceMappingURL=SelectionFrameActions.d.ts.map