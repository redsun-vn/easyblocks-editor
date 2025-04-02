import { Option } from "@redsun-vn/easyblocks-core";
import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React from "react";
import { FieldMixedValue } from "../../../types";
import { FieldRenderProps } from "../../form-builder";
interface RadioGroupFieldProps extends InternalField {
    options: Option[];
    direction?: "horizontal" | "vertical";
    variant?: "radio" | "button";
}
export interface RadioGroupProps extends FieldRenderProps<string | FieldMixedValue> {
    name: string;
    field: RadioGroupFieldProps;
    disabled?: boolean;
    options?: (Option | string)[];
}
export declare const RadioGroup: React.FC<RadioGroupProps>;
export {};
//# sourceMappingURL=RadioGroup.d.ts.map