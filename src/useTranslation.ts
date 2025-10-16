import { EditorContextType, useEditorContext } from "./EditorContext";

export const getTranslation = (editorContext: EditorContextType) => {
  const { translationFiles = {}, contextParams } = editorContext;
  const { locale } = contextParams;

  const t = (key: string) => {
    return translationFiles[locale][key] ?? key;
  };

  return {
    t,
  };
};

export const useTranslation = () => {
  const { translationFiles = {}, contextParams } = useEditorContext();
  const { locale } = contextParams;

  const t = (key: string) => {
    return translationFiles[locale][key] ?? key;
  };

  return {
    t,
  };
};
