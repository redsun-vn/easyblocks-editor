import { ThemeTokenValue } from "@redsun-vn/easyblocks-core";
import React from "react";
import { EditorContextType } from "../EditorContext";
interface IColorConfiguration {
    onConfigChange?: () => Promise<void>;
    editorContext: EditorContextType;
}
export declare const ColorCard: ({ themeOption, openModal, }: {
    themeOption: {
        [key: string]: ThemeTokenValue<string>;
    };
    openModal: () => void;
}) => React.JSX.Element;
export declare const ColorConfigurations: ({ editorContext, onConfigChange, }: IColorConfiguration) => React.JSX.Element;
export {};
//# sourceMappingURL=ColorConfigurations.d.ts.map