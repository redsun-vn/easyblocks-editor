import { EditorContextType, useEditorContext } from "../../EditorContext";

type TokenTypesResult = Record<
  string,
  Extract<EditorContextType["types"][string], { type: "token" }>
>;

export const useTokenTypes = (): TokenTypesResult => {
  const editorContext = useEditorContext();

  const tokenTypes = Object.fromEntries(
    Object.entries(editorContext.types).filter<
      [string, TokenTypesResult[string]]
    >(
      (
        typeDefinitionEntry
      ): typeDefinitionEntry is [string, TokenTypesResult[string]] => {
        return typeDefinitionEntry[1].type === "token";
      }
    )
  );

  return tokenTypes;
};
