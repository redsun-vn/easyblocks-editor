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
};
declare function SelectionFrameController({ isActive, children, onSelect, stitches, sortable, id, direction, path, label, }: SelectionFrameControllerProps): React.JSX.Element;
export { SelectionFrameController };
//# sourceMappingURL=SelectionFrameController.d.ts.map