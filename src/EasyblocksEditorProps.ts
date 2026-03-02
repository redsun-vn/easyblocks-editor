import {
  Config,
  ContextParams,
  ExternalData,
  InlineTypeWidgetComponentProps,
  TGlobalSectionChange,
  RequestedExternalData,
  WidgetComponentProps,
} from "@redsun-vn/easyblocks-core";
import React, { ComponentType } from "react";
import { SaveAsTemplatePicker, TemplatePicker } from "./TemplatePicker";

export type ExternalDataChangeHandler = (
  externalData: RequestedExternalData,
  contextParams: ContextParams,
) => void;

export type EasyblocksEditorProps = {
  config: Config;
  externalData?: ExternalData;
  onExternalDataChange?: ExternalDataChangeHandler;
  onConfigChange?: () => Promise<void>;
  onGlobalSectionChange?: (payload: TGlobalSectionChange) => Promise<void>;
  components?: Record<string, React.ComponentType<any>>;
  widgets?: Record<
    string,
    | ComponentType<WidgetComponentProps<any>>
    | ComponentType<InlineTypeWidgetComponentProps<any>>
  >;
  pickers?: Record<string, TemplatePicker>;
  __debug?: boolean;
  isAdminMode?: boolean;
  defaultLocale?: string;
  SaveAsPicker?: SaveAsTemplatePicker;
};
