import React, { CSSProperties, ReactNode } from "react";
interface TooltipProps {
    children: ReactNode;
    style?: CSSProperties;
}
declare const Tooltip: React.ForwardRefExoticComponent<TooltipProps & React.RefAttributes<HTMLDivElement>>;
export { Tooltip, TooltipBody, TooltipArrow };
declare const TooltipBody: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
declare const TooltipArrow: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
//# sourceMappingURL=Tooltip.d.ts.map