import React from "react";
import { EditorContextType } from "../EditorContext";
import { useTranslation } from "../useTranslation";

interface IFontConfiguration {
  onConfigChange?: () => Promise<void>;
  editorContext: EditorContextType;
}

export const FontConfigurations = ({ editorContext }: IFontConfiguration) => {
  const fontTokens = editorContext.theme.fonts;
  const backend = editorContext.backend;
  const { t } = useTranslation();

  return <div>{Object.values(fontTokens).map((f) => f.label)}</div>;
};
