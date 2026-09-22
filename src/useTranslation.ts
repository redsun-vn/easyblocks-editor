import { EditorContextType, useEditorContext } from "./EditorContext";

/**
 * The language the editor speaks when nothing else decides.
 *
 * Also the fallback when the chosen one has no file: a shop picks its content
 * languages from a table of 163, and the editor is translated into a handful,
 * so most shops name a language the panel has never heard of.
 */
export const DEFAULT_UI_LOCALE = "en-US";

const fallbackTranslation = DEFAULT_UI_LOCALE;

/**
 * Which translation file the editor's chrome reads.
 *
 * `uiLocale`, not `contextParams.locale`. The content locale answers "which
 * language version of this page am I editing", and reading the panel's words
 * out of it meant one control did two unrelated jobs: switching to the English
 * version of a page to work on it also turned every field label, group heading
 * and block name English, with no way back short of switching the content
 * again.
 *
 * `uiLocale` falls back to the content locale in `Editor`, so an editor whose
 * host never sets it reads exactly as it did before.
 */
function pickTranslationFile(editorContext: {
  translationFiles?: EditorContextType["translationFiles"];
  uiLocale?: string;
}) {
  const { translationFiles = {}, uiLocale } = editorContext;

  return uiLocale && translationFiles[uiLocale]
    ? translationFiles[uiLocale]
    : translationFiles[fallbackTranslation];
}

export const getTranslation = (editorContext: EditorContextType) => {
  const t = (key: string) => {
    const files = pickTranslationFile(editorContext);
    return files?.[key] ?? key;
  };

  return {
    t,
  };
};

export const useTranslation = () => {
  const editorContext = useEditorContext();

  const t = (key: string) => {
    const files = pickTranslationFile(editorContext);
    return files?.[key] ?? key;
  };

  return {
    t,
  };
};
