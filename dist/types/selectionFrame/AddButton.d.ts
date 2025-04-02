import React from "react";
import { ICON_BUTTON_SIZE } from "../tinacms/styles";
interface AddButtonProps {
    position: "before" | "after";
    index?: number;
    offset?: number | {
        x: number;
        y: number;
    };
    onClick?: () => void;
}
declare function AddButton({ position, index, offset, onClick }: AddButtonProps): React.JSX.Element;
export { AddButton, ICON_BUTTON_SIZE as ADD_BUTTON_SIZE };
//# sourceMappingURL=AddButton.d.ts.map