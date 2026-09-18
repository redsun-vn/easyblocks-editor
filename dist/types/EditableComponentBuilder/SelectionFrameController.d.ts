import type { useSortable } from "@dnd-kit/sortable";
import React, { MouseEvent, ReactNode } from "react";
import type { DropIndicatorEdge } from "./dropIndicator";
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
    /** Edge of this block the dragged block would land on, or `null` when it would land elsewhere. */
    dropIndicatorEdge: DropIndicatorEdge;
    /** This block is the one the dragged block would land inside. */
    isDropContainer: boolean;
    /** A drag is in progress and this block would accept it. */
    isDropCandidate: boolean;
    /**
     * Droppables marking the outer edges of the collection. They are positioned against this
     * frame, so they belong inside it: the frame is the only box that knows where the edge is.
     */
    edgeDropTargets?: ReactNode;
};
declare function SelectionFrameController({ isActive, children, onSelect, stitches, sortable, id, direction, path, label, isDraggable, dropRejectionMessage, dropIndicatorEdge, isDropContainer, isDropCandidate, edgeDropTargets, }: SelectionFrameControllerProps): React.JSX.Element;
export { SelectionFrameController };
//# sourceMappingURL=SelectionFrameController.d.ts.map