import { EditorContextType } from "./EditorContext";
/**
 * The language the editor speaks when nothing else decides.
 *
 * Also the fallback when the chosen one has no file: a shop picks its content
 * languages from a table of 163, and the editor is translated into a handful,
 * so most shops name a language the panel has never heard of.
 */
export declare const DEFAULT_UI_LOCALE = "en-US";
export declare const getTranslation: (editorContext: EditorContextType) => {
    t: (key: string) => any;
};
export declare const useTranslation: () => {
    t: (key: string) => any;
};
//# sourceMappingURL=useTranslation.d.ts.map