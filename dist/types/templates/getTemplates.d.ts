import { InternalTemplate } from "@redsun-vn/easyblocks-core";
import { EditorContextType, TemplateQueryType } from "../EditorContext";
export declare function getTemplates(editorContext: EditorContextType, configTemplates?: InternalTemplate[], query?: TemplateQueryType): Promise<{
    items: NonNullable<EditorContextType["templates"]>["items"];
    count: NonNullable<EditorContextType["templates"]>["count"];
}>;
//# sourceMappingURL=getTemplates.d.ts.map