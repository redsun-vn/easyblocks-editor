import { CompilationMetadata, Config, Document, ExternalData, FetchOutputResources, InlineTypeWidgetComponentProps, NonEmptyRenderableContent, TGlobalSectionChange, TokenTypeWidgetComponentProps, WidgetComponentProps } from "@redsun-vn/easyblocks-core";
import { parsePath } from "@redsun-vn/easyblocks-core/_internals";
import React, { ComponentType } from "react";
import { ExternalDataChangeHandler } from "./EasyblocksEditorProps";
import { EditorContextType } from "./EditorContext";
import { SaveAsTemplatePicker, TemplatePicker } from "./TemplatePicker";
import { Form } from "./form";
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
/** A fixed zoom level, or "fit" to always scale the device down to the container. */
export type Zoom = number | "fit";
type EditorProps = {
    config: Config;
    locale?: string;
    readOnly: boolean;
    mode: TEasyblocksEditorMode;
    defaultLocale?: string;
    /** The language the editor's own chrome speaks; see `EasyblocksEditorProps`. */
    uiLocale?: string;
    onUiLocaleChange?: (uiLocale: string) => void;
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
/**
 * The collection a block dropped onto `toPath` should be inserted into.
 *
 * Dropping onto a block means becoming its sibling, so the target is the
 * collection that block lives in. Dropping onto an empty collection's
 * placeholder is the other case: there `parsePath` reports a `fieldName`,
 * because the path ends at the field rather than at an item inside it, and the
 * collection has to be rebuilt from the entry that owns it.
 */
export declare function getCrossParentInsertionPath(toPathParseResult: ReturnType<typeof parsePath>): string;
export declare function calculateInsertionIndex(fromPath: string, toPath: string, placement: "before" | "after" | undefined, form: Form): number;
export {};
//# sourceMappingURL=Editor.d.ts.map