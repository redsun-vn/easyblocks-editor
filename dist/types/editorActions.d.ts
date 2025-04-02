import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { CompilationContextType } from "@redsun-vn/easyblocks-core/_internals";
import { EditorContextType } from "./EditorContext";
import { Form } from "./form";
import { ResolveDestination } from "./paste/destinationResolver";
import { PasteCommand } from "./paste/manager";
declare function pasteItems({ what, where, resolveDestination, pasteCommand, }: {
    what: Array<NoCodeComponentEntry>;
    where: Array<string>;
    resolveDestination: ResolveDestination;
    pasteCommand: PasteCommand;
}): Array<string> | undefined;
/**
 * Duplicates fields given in `fieldNames` within given `form`.
 * `compilationContext` is used to properly duplicate elements associated with given names.
 * @returns Array of fields to focus
 */
declare function duplicateItems(form: Form, fieldNames: Array<string>, compilationContext: CompilationContextType): Array<string> | undefined;
/**
 * Moves fields given in `fieldNamesToRemove` within given `form` in given `direction`.
 * @returns Array of fields to focus.
 */
declare function moveItems(form: Form, fieldsToMove: Array<string>, direction: "top" | "right" | "bottom" | "left"): Array<string> | undefined;
/**
 * Removes fields given in `fieldNamesToRemove` from given `form`.
 * @returns Array of fields to focus
 */
declare function removeItems(form: Form, fieldNamesToRemove: Array<string>, compilationContext: CompilationContextType): Array<string> | undefined;
declare function replaceItems(paths: string[], newConfig: NoCodeComponentEntry, editorContext: EditorContextType): void;
declare function logItems(form: Form, configPaths: Array<string>): void;
export { duplicateItems, logItems, moveItems, pasteItems, removeItems, replaceItems, };
export declare const shiftPath: (originalPath: string, shiftingPath: string, direction?: "upward" | "downward") => string;
export declare function takeLastOfEachParent(where: string[]): string[];
//# sourceMappingURL=editorActions.d.ts.map