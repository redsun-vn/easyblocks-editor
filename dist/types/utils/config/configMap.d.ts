import { NoCodeComponentEntry, SchemaProp } from "@redsun-vn/easyblocks-core";
import { CompilationContextType } from "@redsun-vn/easyblocks-core/_internals";
/**
 * Traverses recursively the config tree (similar to traverseConfig) but behaves like "Array.map". It returns new tree with elements mapped to new ones.
 * Responsive values are mapped "per breakpoint", it smells a bit, maybe in the future we'll have to apply some flag to have option whether we want to disassemble responsives or not.
 */
type ConfigMapCallback = (arg: {
    value: any;
    schemaProp: SchemaProp;
    path: string;
}) => any;
declare function configMap(config: NoCodeComponentEntry, context: CompilationContextType, callback: ConfigMapCallback): NoCodeComponentEntry;
export { configMap };
//# sourceMappingURL=configMap.d.ts.map