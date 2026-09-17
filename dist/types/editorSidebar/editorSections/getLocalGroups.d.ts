import { EditorContextType } from "../../EditorContext";
export declare const getLocalComponents: (editorContext: EditorContextType) => any[];
export declare const getLocalGroups: (localComponents: any[]) => string[];
/**
 * Display label for a component category.
 *
 * Categories travel through the config as plain strings ("Layout", "Content"),
 * because that is what a component definition writes into `.group`. The editor
 * has no list of the host app's categories, so the translation file decides:
 * a `definition.category.<lowercased>` entry means "this is a known built-in
 * category, here is its localized name".
 *
 * `t` returns the key unchanged when it is missing, and that is exactly the
 * signal used here — a shop's own group string ("Banner tết") has no entry, so
 * the raw string is shown instead of a half-translated key. Without that check
 * every unknown group would render as `definition.category.banner tết`.
 */
export declare const getCategoryLabel: (t: (key: string) => string, group: string) => string;
//# sourceMappingURL=getLocalGroups.d.ts.map