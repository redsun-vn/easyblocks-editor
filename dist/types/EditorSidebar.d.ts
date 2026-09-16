import React from "react";
import { Form } from "./form";
import { SaveAsTemplatePicker } from "./TemplatePicker";
type EditorSidebarProps = {
    focussedField: Array<string>;
    form: Form;
    SaveAsPicker?: SaveAsTemplatePicker;
    /** True while nothing is selected: the panel keeps its width but shows a hint. */
    isCollapsed?: boolean;
};
export declare const EditorSidebar: React.FC<EditorSidebarProps>;
export {};
//# sourceMappingURL=EditorSidebar.d.ts.map