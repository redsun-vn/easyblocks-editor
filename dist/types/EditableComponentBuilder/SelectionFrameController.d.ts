import type { useSortable } from "@dnd-kit/sortable";
import React, { MouseEvent, ReactNode } from "react";
type SelectionFrameControllerProps = {
    isActive: boolean;
    onSelect: (event: MouseEvent<HTMLElement>) => void;
    children: ReactNode;
    stitches: any;
    sortable: ReturnType<typeof useSortable>;
    id: string;
    direction: "horizontal" | "vertical";
    path: string;
    label: string;
    /** Whether this block can be picked up right now. Drives the `grab` cursor. */
    isDraggable: boolean;
    /** Why this block refuses the block being dragged, if it refuses it. */
    dropRejectionMessage?: string;
};
declare function SelectionFrameController({ isActive, children, onSelect, stitches, sortable, id, direction, path, label, isDraggable, dropRejectionMessage, }: SelectionFrameControllerProps): React.JSX.Element;
export { SelectionFrameController };
//# sourceMappingURL=SelectionFrameController.d.ts.map