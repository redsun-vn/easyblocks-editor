import { TooltipTriggerAria } from "@react-aria/tooltip";
import { CSSProperties, RefCallback } from "react";
interface TooltipOptions {
    isDisabled?: boolean;
    onClick?: () => void;
}
type TooltipResult = {
    isOpen: boolean;
    arrowProps: {
        ref: RefCallback<HTMLElement>;
        style: CSSProperties;
    };
} & TooltipTriggerAria;
declare function useTooltip({ isDisabled, onClick, }?: TooltipOptions): TooltipResult;
export { useTooltip };
//# sourceMappingURL=useTooltip.d.ts.map