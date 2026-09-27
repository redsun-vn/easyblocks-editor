import { NoCodeComponentEntry, SchemaProp } from "@redsun-vn/easyblocks-core";
import { CompilationContextType } from "@redsun-vn/easyblocks-core/_internals";
import { WrapperLevel } from "../dropShape/resolveWrapperChain";
import { Form } from "../form";
declare const insertCommand: ({ context, form, schema, templateId, wrapperLevels, }: {
    context: CompilationContextType;
    form: Form;
    schema?: SchemaProp;
    templateId?: string;
    /**
     * The host app's wrapper nesting, when it declared one. Left empty a paste
     * behaves exactly as it always has: it fits or it is refused.
     */
    wrapperLevels?: Array<WrapperLevel>;
}) => (path: string, index: number, item: NoCodeComponentEntry) => string | null;
export { insertCommand };
//# sourceMappingURL=insert.d.ts.map