import { InternalAnyTinaField, InternalField } from "@redsun-vn/easyblocks-core/_internals";
import { EditorContextType } from "../../../EditorContext";
type FieldValue = React.ChangeEvent<HTMLSelectElement | HTMLInputElement> | any;
declare function createFieldController({ field, editorContext, format, parse, }: {
    field: InternalField;
    editorContext: EditorContextType;
    format?: ((value: any, name: string, field: InternalAnyTinaField) => any) | undefined;
    parse?: (value: any, name: string, field: InternalAnyTinaField) => any;
}): {
    onChange(mainNewValue: FieldValue, ...extraNewValues: FieldValue[]): void;
    getValue(): any;
};
export { createFieldController };
//# sourceMappingURL=createFieldController.d.ts.map