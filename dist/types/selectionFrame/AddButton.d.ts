import React from "react";
import { ICON_BUTTON_SIZE } from "../tinacms/styles";
interface AddButtonProps {
    position: "before" | "after";
    index?: number;
    offset?: number | {
        x: number;
        y: number;
    };
    /**
     * On while the pointer is on the selected block or on the controls around
     * it, the same switch the action bar answers to.
     *
     * The button straddles the block's own edge, so half of it lies over the
     * neighbour. On a page of sections that costs nothing; between two header
     * icons pressed together it covered the next icon along and took its clicks,
     * for the whole time the selection lasted. It is only there now while the
     * author is looking at the block it belongs to.
     */
    isRevealed: boolean;
    onClick?: () => void;
}
declare function AddButton({ position, index, offset, isRevealed, onClick, }: AddButtonProps): React.JSX.Element;
export { ICON_BUTTON_SIZE as ADD_BUTTON_SIZE, AddButton };
//# sourceMappingURL=AddButton.d.ts.map