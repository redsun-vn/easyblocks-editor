import { CompilationMetadata, Config, Document, ExternalData, FetchOutputResources, InlineTypeWidgetComponentProps, NonEmptyRenderableContent, TGlobalSectionChange, TokenTypeWidgetComponentProps, WidgetComponentProps } from "@redsun-vn/easyblocks-core";
import React, { ComponentType } from "react";
import { ExternalDataChangeHandler } from "./EasyblocksEditorProps";
import { EditorContextType } from "./EditorContext";
import { SaveAsTemplatePicker, TemplatePicker } from "./TemplatePicker";
import { TEasyblocksEditorMode } from "./types";
declare global {
    interface Window {
        editorWindowAPI?: {
            editorContext?: EditorContextType;
            currentDocument?: Document | null;
            meta?: CompilationMetadata;
            compiled?: NonEmptyRenderableContent;
            externalData?: ExternalData;
            onUpdate?: () => void;
        };
    }
}
type EditorProps = {
    config: Config;
    locale?: string;
    readOnly: boolean;
    mode: TEasyblocksEditorMode;
    defaultLocale?: string;
    documentId: string | null;
    rootComponentId: string | null;
    rootTemplateId: string | null;
    save?: (document: Document) => Promise<void>;
    onClose?: () => void;
    externalData: FetchOutputResources;
    onExternalDataChange: ExternalDataChangeHandler;
    onConfigChange?: () => Promise<void>;
    onGlobalSectionChange?: (payload: TGlobalSectionChange) => Promise<void>;
    widgets?: Record<string, ComponentType<WidgetComponentProps<any>> | ComponentType<InlineTypeWidgetComponentProps<any>> | ComponentType<TokenTypeWidgetComponentProps<any>>>;
    components?: Record<string, ComponentType<any>>;
    pickers?: Record<string, TemplatePicker>;
    SaveAsPicker?: SaveAsTemplatePicker;
};
export declare const Editor: typeof EditorBackendInitializer;
declare function EditorBackendInitializer(props: EditorProps): React.JSX.Element;
export {};
//# sourceMappingURL=Editor.d.ts.map