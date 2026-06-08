import { Config, FetchOutputResources, InlineTypeWidgetComponentProps, TGlobalSectionChange, WidgetComponentProps } from "@redsun-vn/easyblocks-core";
import React, { ComponentType } from "react";
import { ExternalDataChangeHandler } from "./EasyblocksEditorProps";
import { SaveAsTemplatePicker, TemplatePicker } from "./TemplatePicker";
import { TEasyblocksEditorMode } from "./types";
type EasyblocksParentProps = {
    config: Config;
    externalData: FetchOutputResources;
    onExternalDataChange: ExternalDataChangeHandler;
    onConfigChange?: () => Promise<void>;
    onGlobalSectionChange?: (payload: TGlobalSectionChange) => Promise<void>;
    widgets?: Record<string, ComponentType<WidgetComponentProps<any>> | ComponentType<InlineTypeWidgetComponentProps<any>>>;
    components?: Record<string, ComponentType<any>>;
    pickers?: Record<string, TemplatePicker>;
    mode: TEasyblocksEditorMode;
    defaultLocale?: string;
    SaveAsPicker?: SaveAsTemplatePicker;
};
export declare function EasyblocksParent(props: EasyblocksParentProps): React.JSX.Element;
export {};
//# sourceMappingURL=EasyblocksParent.d.ts.map