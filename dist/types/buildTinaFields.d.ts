import { FieldPortal } from "@redsun-vn/easyblocks-core";
import { InternalAnyTinaField, InternalField } from "@redsun-vn/easyblocks-core/_internals";
import type { EditorContextType } from "./EditorContext";
export declare function isFieldPortal(x: InternalAnyTinaField | FieldPortal): x is FieldPortal;
export declare function buildTinaFields(path: string, editorContext: EditorContextType): import("@redsun-vn/easyblocks-core/_internals").InternalAnyField[];
/**
 * The fields the properties panel shows for the whole selection: every field of
 * a single block, or only the fields all of the selected blocks share.
 */
export declare function buildTinaFieldsForSelection(focussedField: Array<string>, editorContext: EditorContextType): Array<InternalField>;
//# sourceMappingURL=buildTinaFields.d.ts.map