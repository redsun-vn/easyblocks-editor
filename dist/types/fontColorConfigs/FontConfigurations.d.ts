import React from "react";
import { EditorContextType } from "../EditorContext";
interface IFontConfiguration {
    onConfigChange?: () => Promise<void>;
    editorContext: EditorContextType;
}
export declare const FontConfigurations: ({ editorContext, onConfigChange, }: IFontConfiguration) => React.JSX.Element;
export {};
//# sourceMappingURL=FontConfigurations.d.ts.map