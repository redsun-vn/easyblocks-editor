import { Config, ContextParams, ExternalData, InlineTypeWidgetComponentProps, RequestedExternalData, TGlobalSectionChange, WidgetComponentProps } from "@redsun-vn/easyblocks-core";
import React, { ComponentType } from "react";
import { SaveAsTemplatePicker, TemplatePicker } from "./TemplatePicker";
import { TEasyblocksEditorMode } from "./types";
export type ExternalDataChangeHandler = (externalData: RequestedExternalData, contextParams: ContextParams) => void;
export type EasyblocksEditorProps = {
    config: Config;
    externalData?: ExternalData;
    onExternalDataChange?: ExternalDataChangeHandler;
    onConfigChange?: () => Promise<void>;
    onGlobalSectionChange?: (payload: TGlobalSectionChange) => Promise<void>;
    components?: Record<string, React.ComponentType<any>>;
    widgets?: Record<string, ComponentType<WidgetComponentProps<any>> | ComponentType<InlineTypeWidgetComponentProps<any>>>;
    pickers?: Record<string, TemplatePicker>;
    __debug?: boolean;
    mode: TEasyblocksEditorMode;
    defaultLocale?: string;
    /**
     * The language the editor itself speaks — panel labels, buttons, dialogs.
     *
     * Separate from `contextParams.locale`, which says which language version of
     * the page is being edited. The two were one value, so picking the English
     * version of a page to work on also turned every field label English, and a
     * shop whose default language is one of the other 160-odd we offer got an
     * English panel with nothing said about it.
     *
     * Leave it out and the editor speaks `contextParams.locale` exactly as it
     * always has, so a host that has not been told about this reads the same.
     */
    uiLocale?: string;
    /** Called when the person picks a different editor language, so the host can remember it. */
    onUiLocaleChange?: (uiLocale: string) => void;
    SaveAsPicker?: SaveAsTemplatePicker;
};
//# sourceMappingURL=EasyblocksEditorProps.d.ts.map