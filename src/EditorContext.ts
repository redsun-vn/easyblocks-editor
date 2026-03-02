import {
  Backend,
  CompiledComponentConfig,
  Document,
  ExternalTypeDefinition,
  InlineTypeDefinition,
  InlineTypeWidgetComponentProps,
  NoCodeComponentEntry,
  Template,
  TokenTypeDefinition,
  TokenTypeWidgetComponentProps,
  Widget,
} from "@redsun-vn/easyblocks-core";
import {
  EditorContextType as BaseEditorContextType,
  CompilationCache,
  InternalAnyField,
} from "@redsun-vn/easyblocks-core/_internals";
import React, { ComponentType, useContext } from "react";
import { Form } from "./form";
import { ActionsType, InternalWidgetComponentProps } from "./types";

export type EditorExternalTypeDefinition = Omit<
  ExternalTypeDefinition,
  "widgets"
> & {
  widgets: Array<
    Widget & {
      component?: ComponentType<InternalWidgetComponentProps>;
    }
  >;
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

export type TemplateQueryType = {
  filters?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type TemplateType = {
  query: TemplateQueryType;
  items: Template[];
  count: Record<string, { matchedCount: number; total: number }>;
};

export type EditorContextType = Omit<
  BaseEditorContextType,
  "types" | "templates"
> & {
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
  isAdminMode: boolean;
  readOnly: boolean;
  disableCustomTemplates: boolean;
  types: Record<
    string,
    | EditorExternalTypeDefinition
    | EditorInlineTypeDefinition
    | EditorTokenTypeDefinition
  >;
  components: Record<string, ComponentType<any>>;
  globalSections?: {
    [sectionName: string]: {
      [entryId: string]: {
        label: string;
        entry?: NoCodeComponentEntry;
        pages: string[];
      };
    };
  };
};

export const EditorContext = React.createContext<EditorContextType | null>(
  null,
);

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("EditorContext not defined");
  }
  return context;
}
