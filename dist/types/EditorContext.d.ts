import { Backend, CompiledComponentConfig, Document, ExternalTypeDefinition, InlineTypeDefinition, InlineTypeWidgetComponentProps, NoCodeComponentEntry, Template, TokenTypeDefinition, TokenTypeWidgetComponentProps, Widget } from "@redsun-vn/easyblocks-core";
import { EditorContextType as BaseEditorContextType, CompilationCache, InternalAnyField } from "@redsun-vn/easyblocks-core/_internals";
import React, { ComponentType } from "react";
import { Form } from "./form";
import { ActionsType, InternalWidgetComponentProps } from "./types";
export type EditorExternalTypeDefinition = Omit<ExternalTypeDefinition, "widgets"> & {
    widgets: Array<Widget & {
        component?: ComponentType<InternalWidgetComponentProps>;
    }>;
};
type EditorInlineTypeDefinition = Omit<InlineTypeDefinition, "widgets"> & {
    widget: Widget & {
        component?: ComponentType<InlineTypeWidgetComponentProps<any>>;
    };
};
type EditorTokenTypeDefinition = Omit<TokenTypeDefinition, "widgets"> & {
    widget?: Widget & {
        component?: ComponentType<TokenTypeWidgetComponentProps<any>>;
    };
};
export type EditorContextType = Omit<BaseEditorContextType, "types"> & {
    backend: Backend;
    templates?: Template[];
    syncTemplates: () => void;
    focussedField: Array<string>;
    setFocussedField: (field: Array<string> | string) => void;
    form: Form<any, InternalAnyField>;
    isEditing?: boolean;
    actions: ActionsType;
    save: (document: Document) => Promise<void>;
    compiledComponentConfig?: CompiledComponentConfig;
    configAfterAuto?: NoCodeComponentEntry;
    compilationCache: CompilationCache;
    isAdminMode: boolean;
    readOnly: boolean;
    disableCustomTemplates: boolean;
    types: Record<string, EditorExternalTypeDefinition | EditorInlineTypeDefinition | EditorTokenTypeDefinition>;
    components: Record<string, ComponentType<any>>;
};
export declare const EditorContext: React.Context<EditorContextType | null>;
export declare function useEditorContext(): EditorContextType;
export {};
//# sourceMappingURL=EditorContext.d.ts.map