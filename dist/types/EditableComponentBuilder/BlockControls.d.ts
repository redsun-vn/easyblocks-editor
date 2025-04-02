import { CompiledCustomComponentConfig, CompiledShopstoryComponentConfig } from "@redsun-vn/easyblocks-core";
import React from "react";
interface BlocksControlsProps {
    children: React.ReactNode;
    path: string;
    disabled?: boolean;
    direction: "horizontal" | "vertical";
    id: string;
    templateId: string;
    compiled: CompiledShopstoryComponentConfig | CompiledCustomComponentConfig;
    index: number;
    length: number;
}
export declare function BlocksControls({ children, path, disabled, direction, id, index, length, }: BlocksControlsProps): React.JSX.Element;
export {};
//# sourceMappingURL=BlockControls.d.ts.map