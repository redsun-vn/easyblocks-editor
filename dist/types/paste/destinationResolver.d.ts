import { CompilationContextType } from "@redsun-vn/easyblocks-core/_internals";
import { Form } from "../form";
import { insertCommand } from "./insert";
export interface Destination {
    name: string;
    index: number;
    insert: ReturnType<typeof insertCommand>;
}
export type ResolveDestination = ReturnType<typeof destinationResolver>;
declare function destinationResolver({ form, context, }: {
    context: CompilationContextType;
    form: Form;
}): (initialDestinationPath: string) => Destination[];
export { destinationResolver };
//# sourceMappingURL=destinationResolver.d.ts.map