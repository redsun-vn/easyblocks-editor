import { EditorContextType, useEditorContext } from "./EditorContext";

const fallbackTranslation = "en-US";

export const getTranslation = (editorContext: EditorContextType) => {
  const { translationFiles = {}, contextParams } = editorContext;
  const { locale } = contextParams;

  const t = (key: string) => {
    const files = translationFiles[locale]
      ? translationFiles[locale]
      : translationFiles[fallbackTranslation];
    return files?.[key] ?? key;
  };

  return {
    t,
  };
};

export const useTranslation = () => {
  const { translationFiles = {}, contextParams } = useEditorContext();
  const { locale } = contextParams;

  const t = (key: string) => {
    const files = translationFiles[locale]
      ? translationFiles[locale]
      : translationFiles[fallbackTranslation];
    return files?.[key] ?? key;
  };

  return {
    t,
  };
};
