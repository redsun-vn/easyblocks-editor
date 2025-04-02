import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React, { ReactNode } from "react";
import { Form } from "../../../form";
import { FieldRenderProps } from "../../form-builder";
type ExtraFieldMetaWrapperFields = {
    layout?: "column" | "row";
    noWrap?: boolean;
    isLabelHidden?: boolean;
};
export interface FieldProps<InputProps extends Record<string, unknown>> extends FieldRenderProps<any, HTMLElement> {
    field: InternalField;
    form: Form;
}
type InputFieldType<ExtraFieldProps extends Record<string, unknown>, InputProps extends Record<string, unknown>> = Omit<FieldProps<InputProps>, "meta"> & ExtraFieldProps & ExtraFieldMetaWrapperFields & {
    children: ReactNode;
    renderLabel?: (props: {
        label: string;
    }) => ReactNode;
};
export declare function FieldMetaWrapper<ExtraFieldProps extends Record<string, unknown> = Record<string, unknown>, InputProps extends Record<string, unknown> = Record<string, unknown>>({ children, field, input, noWrap, layout, renderLabel, isLabelHidden, }: InputFieldType<ExtraFieldProps, InputProps>): React.JSX.Element;
export declare function wrapFieldsWithMeta<ExtraFieldProps extends Record<string, any> = Record<string, any>, InputProps extends Record<string, any> = Record<string, any>>(Field: React.ComponentType<InputFieldType<ExtraFieldProps, InputProps>>, extraProps?: ExtraFieldMetaWrapperFields): (props: InputFieldType<ExtraFieldProps, InputProps>) => React.JSX.Element;
export {};
//# sourceMappingURL=wrapFieldWithMeta.d.ts.map