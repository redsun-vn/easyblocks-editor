import type { useSortable } from "@dnd-kit/sortable";
import React, { MouseEvent, ReactNode } from "react";
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
};
declare function SelectionFrameController({ isActive, isChildrenSelectionDisabled, children, onSelect, stitches, sortable, id, direction, path, }: SelectionFrameControllerProps): React.JSX.Element;
export { SelectionFrameController };
//# sourceMappingURL=SelectionFrameController.d.ts.map