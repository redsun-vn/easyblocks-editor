import { Backend, CompiledComponentConfig, Document, ExternalTypeDefinition, InlineTypeDefinition, InlineTypeWidgetComponentProps, InternalTemplate, NoCodeComponentEntry, Template, TemplateQueryType, TokenTypeDefinition, TokenTypeWidgetComponentProps, Widget } from "@redsun-vn/easyblocks-core";
import { EditorContextType as BaseEditorContextType, CompilationCache, InternalAnyField } from "@redsun-vn/easyblocks-core/_internals";
import React, { ComponentType } from "react";
import { Form } from "./form";
import { ActionsType, InternalWidgetComponentProps, TEasyblocksEditorMode } from "./types";
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
export type EditorTokenTypeDefinition = Omit<TokenTypeDefinition, "widgets"> & {
    widget?: Widget & {
        component?: ComponentType<TokenTypeWidgetComponentProps<any>>;
    };
};
export type TemplateType = {
    query: TemplateQueryType;
    items: Template[];
    count: Record<string, {
        matchedCount: number;
        total: number;
    }>;
};
export type EditorContextType = Omit<BaseEditorContextType, "types" | "templates"> & {
    backend: Backend;
    isFetchingTemplates?: boolean;
    templates?: TemplateType;
    syncTemplateQuery?: (props: TemplateQueryType) => void;
    syncTemplates: (props?: {
        mode?: "create" | "edit" | "delete";
        template?: Template;
        getAllMode?: "replace" | "append";
    }) => void;
    focussedField: Array<string>;
    setFocussedField: (field: Array<string> | string) => void;
    form: Form<any, InternalAnyField>;
    isEditing?: boolean;
    actions: ActionsType;
    save: (document: Document) => Promise<void>;
    compiledComponentConfig?: CompiledComponentConfig;
    configAfterAuto?: NoCodeComponentEntry;
    compilationCache: CompilationCache;
    mode: TEasyblocksEditorMode;
    readOnly: boolean;
    disableCustomTemplates: boolean;
    /**
     * The built-in library as the host declared it, before anything is fetched.
     *
     * `templates` above is the union of this and the shop's saved templates, and
     * it arrives only once something asks for it. The sidebar needs the built-in
     * half straight away and must not show the other half beside it.
     */
    configTemplates: InternalTemplate[];
    /** The order the sidebar lists component categories in; empty means by name. */
    categoryOrder: string[];
    types: Record<string, EditorExternalTypeDefinition | EditorInlineTypeDefinition | EditorTokenTypeDefinition>;
    components: Record<string, ComponentType<any>>;
};
export declare const EditorContext: React.Context<EditorContextType | null>;
export declare function useEditorContext(): EditorContextType;
export {};
//# sourceMappingURL=EditorContext.d.ts.map