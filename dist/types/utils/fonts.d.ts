import { EditorContextType } from "@redsun-vn/easyblocks-core/_internals";
interface IFont {
    id: string;
    value: string;
    label: string;
}
export declare function getFontFamilies(): IFont[];
export declare function getFontWeights(): IFont[];
export declare function getLineHeights(): IFont[];
export declare function getFontSizes(editorContext: EditorContextType): IFont[];
export {};
//# sourceMappingURL=fonts.d.ts.map