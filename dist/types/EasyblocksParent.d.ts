import { Config, FetchOutputResources, InlineTypeWidgetComponentProps, WidgetComponentProps } from "@redsun-vn/easyblocks-core";
import React, { ComponentType } from "react";
import { ExternalDataChangeHandler } from "./EasyblocksEditorProps";
import { TemplatePicker } from "./TemplatePicker";
type EasyblocksParentProps = {
    config: Config;
    externalData: FetchOutputResources;
    onExternalDataChange: ExternalDataChangeHandler;
    widgets?: Record<string, ComponentType<WidgetComponentProps<any>> | ComponentType<InlineTypeWidgetComponentProps<any>>>;
    components?: Record<string, ComponentType<any>>;
    pickers?: Record<string, TemplatePicker>;
    isAdminMode?: boolean;
};
export declare function EasyblocksParent(props: EasyblocksParentProps): React.JSX.Element;
export {};
//# sourceMappingURL=EasyblocksParent.d.ts.map