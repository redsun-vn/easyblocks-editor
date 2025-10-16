import { EditorContextType } from "../../EditorContext";
type TokenTypesResult = Record<string, Extract<EditorContextType["types"][string], {
    type: "token";
}>>;
export declare const useTokenTypes: () => TokenTypesResult;
export {};
//# sourceMappingURL=useTokenTypes.d.ts.map