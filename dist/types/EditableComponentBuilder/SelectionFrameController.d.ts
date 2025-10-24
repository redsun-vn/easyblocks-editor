import type { useSortable } from "@dnd-kit/sortable";
import { ContextParams } from "@redsun-vn/easyblocks-core";
import React, { MouseEvent, ReactNode } from "react";
import { ActionsType } from "../types";
type SelectionFrameControllerProps = {
    isActive: boolean;
    isChildrenSelectionDisabled: boolean;
    onSelect: (event: MouseEvent<HTMLElement>) => void;
    children: ReactNode;
    stitches: any;
    sortable: ReturnType<typeof useSortable>;
    id: string;
    direction: "horizontal" | "vertical";
    path: string;
    focussedField: string[];
    actions: ActionsType;
    translationFiles: {
        [key: string]: any;
    };
    contextParams: ContextParams;
};
declare function SelectionFrameController({ isActive, isChildrenSelectionDisabled, children, onSelect, stitches, sortable, id, direction, path, focussedField, actions, translationFiles, contextParams, }: SelectionFrameControllerProps): React.JSX.Element;
export { SelectionFrameController };
//# sourceMappingURL=SelectionFrameController.d.ts.map