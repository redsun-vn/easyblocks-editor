import { NoCodeComponentEntry, SchemaProp } from "@redsun-vn/easyblocks-core";
import { CompilationContextType } from "@redsun-vn/easyblocks-core/_internals";
import { Form } from "../form";
declare const insertCommand: ({ context, form, schema, templateId, }: {
    context: CompilationContextType;
    form: Form;
    schema?: SchemaProp;
    templateId?: string;
}) => (path: string, index: number, item: NoCodeComponentEntry) => string | null;
export { insertCommand };
//# sourceMappingURL=insert.d.ts.map