import { InternalTemplate, TemplateQueryType } from "@redsun-vn/easyblocks-core";
import { InternalComponentDefinition } from "@redsun-vn/easyblocks-core/_internals";
import { EditorContextType } from "../EditorContext";
export declare function getDefaultTemplateForDefinition(def: InternalComponentDefinition, editorContext: EditorContextType): InternalTemplate;
export declare function getTemplates(editorContext: EditorContextType, configTemplates?: InternalTemplate[], query?: TemplateQueryType): Promise<{
    items: NonNullable<EditorContextType["templates"]>["items"];
    count: NonNullable<EditorContextType["templates"]>["count"];
}>;
//# sourceMappingURL=getTemplates.d.ts.map