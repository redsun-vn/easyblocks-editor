import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React from "react";
import { FieldMixedValue } from "../../../types";
import { FieldRenderProps } from "../../form-builder";
type Option = {
    value: string;
    label: string;
} | {
    isDivider: true;
};
interface SelectFieldProps extends InternalField {
    options: (Option | string)[];
}
export interface SelectFieldComponentProps extends FieldRenderProps<string | FieldMixedValue> {
    name: Array<string> | string;
    field: SelectFieldProps;
    disabled?: boolean;
    options?: (Option | string)[];
}
export declare const SelectFieldComponent: React.FC<SelectFieldComponentProps>;
export {};
//# sourceMappingURL=Select.d.ts.map