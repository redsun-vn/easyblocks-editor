import { CompilationContextType } from "@redsun-vn/easyblocks-core/_internals";
import { Form } from "../form";
import { WrapperLevel } from "../dropShape/resolveWrapperChain";
import { insertCommand } from "./insert";
export interface Destination {
    name: string;
    index: number;
    insert: ReturnType<typeof insertCommand>;
}
export type ResolveDestination = ReturnType<typeof destinationResolver>;
declare function destinationResolver({ form, context, wrapperLevels, }: {
    context: CompilationContextType;
    form: Form;
    /** Passed through to every insert; see `insertCommand`. */
    wrapperLevels?: Array<WrapperLevel>;
}): (initialDestinationPath: string) => Destination[];
export { destinationResolver };
//# sourceMappingURL=destinationResolver.d.ts.map