import isPropValid from "@emotion/is-prop-valid";
import {
  Config,
  FetchOutputResources,
  InlineTypeWidgetComponentProps,
  TGlobalSectionChange,
  WidgetComponentProps,
} from "@redsun-vn/easyblocks-core";
import {
  GlobalModalStyles,
  ModalContext,
} from "@redsun-vn/easyblocks-design-system/modals";
import { Toaster } from "@redsun-vn/easyblocks-design-system/Toaster";
import { TooltipProvider } from "@redsun-vn/easyblocks-design-system/Tooltip";
import React, { ComponentType } from "react";
import { ShouldForwardProp, StyleSheetManager } from "styled-components";
import { ExternalDataChangeHandler } from "./EasyblocksEditorProps";
import { Editor } from "./Editor";
import { parseQueryParams } from "./parseQueryParams";
import { SearchableSmallPickerModal } from "./SearchableSmallPickerModal";
import { SectionPickerModal } from "./SectionPicker";
import { ColorTokenWidget } from "./sidebar/ColorTokenWidget";
import { DocumentDataWidgetComponent } from "./sidebar/DocumentDataWidget";
import { SpaceTokenWidget } from "./sidebar/SpaceTokenWidget";
import { SaveAsTemplatePicker, TemplatePicker } from "./TemplatePicker";
import { GlobalStyles } from "./tinacms/styles";
import { TEasyblocksEditorMode } from "./types";

type EasyblocksParentProps = {
  config: Config;
  externalData: FetchOutputResources;
  onExternalDataChange: ExternalDataChangeHandler;
  onConfigChange?: () => Promise<void>;
  onGlobalSectionChange?: (payload: TGlobalSectionChange) => Promise<void>;
  widgets?: Record<
    string,
    | ComponentType<WidgetComponentProps<any>>
    | ComponentType<InlineTypeWidgetComponentProps<any>>
  >;
  components?: Record<string, ComponentType<any>>;
  pickers?: Record<string, TemplatePicker>;
  mode: TEasyblocksEditorMode;
  defaultLocale?: string;
  SaveAsPicker?: SaveAsTemplatePicker;
};

const shouldForwardProp: ShouldForwardProp<"web"> = (propName, target) => {
  if (typeof target === "string") {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
};

const builtinWidgets: EasyblocksParentProps["widgets"] = {
  color: ColorTokenWidget,
  space: SpaceTokenWidget,
  "@easyblocks/document-data": DocumentDataWidgetComponent as any,
};

const builinPickers: EasyblocksParentProps["pickers"] = {
  large: SectionPickerModal,
  compact: SearchableSmallPickerModal,
  "large-3": SectionPickerModal,
};

export function EasyblocksParent(props: EasyblocksParentProps) {
  const editorSearchParams = parseQueryParams();

  return (
    <StyleSheetManager
      shouldForwardProp={shouldForwardProp}
      enableVendorPrefixes
    >
      <ModalContext.Provider
        value={() => {
          return document.querySelector("#modalContainer");
        }}
      >
        <GlobalStyles />
        <GlobalModalStyles />
        <TooltipProvider>
          <div
            id={"modalContainer"}
            style={{ position: "fixed", left: 0, top: 0, zIndex: 100000 }}
          />
          <Editor
            config={props.config}
            locale={editorSearchParams.locale ?? undefined}
            readOnly={editorSearchParams.readOnly ?? true}
            documentId={editorSearchParams.documentId}
            rootComponentId={editorSearchParams.rootComponentId ?? null}
            rootTemplateId={editorSearchParams.rootTemplateId}
            externalData={props.externalData}
            onExternalDataChange={props.onExternalDataChange}
            onConfigChange={props.onConfigChange}
            onGlobalSectionChange={props.onGlobalSectionChange}
            widgets={{
              ...builtinWidgets,
              ...props.widgets,
            }}
            components={props.components}
            pickers={{
              ...builinPickers,
              ...props.pickers,
            }}
            mode={props.mode}
            defaultLocale={props.defaultLocale}
            SaveAsPicker={props.SaveAsPicker}
          />
        </TooltipProvider>
        <Toaster position="bottom-left" containerStyle={{ zIndex: 100100 }} />
      </ModalContext.Provider>
    </StyleSheetManager>
  );
}
