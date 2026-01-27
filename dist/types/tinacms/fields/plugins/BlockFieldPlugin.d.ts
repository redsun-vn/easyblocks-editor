import { ComponentSchemaProp, NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { Component$$$SchemaProp, InternalField } from "@redsun-vn/easyblocks-core/_internals";
import { FormApi } from "final-form";
import React from "react";
import { Form } from "../../../form";
import { FieldMixedValue } from "../../../types";
import { FieldRenderProps } from "../../form-builder";
interface BlocksFieldDefinition extends InternalField {
    component: "block";
    schemaProp: ComponentSchemaProp | Component$$$SchemaProp;
}
interface BlockFieldProps extends FieldRenderProps<NoCodeComponentEntry[] | FieldMixedValue> {
    field: BlocksFieldDefinition;
    form: FormApi;
    tinaForm: Form;
    isLabelHidden?: boolean;
}
export declare const PanelContext: React.Context<{
    onClose: () => void;
} | undefined>;
export declare const BlockFieldPlugin: {
    __type: string;
    name: string;
    Component: ({ field, input, isLabelHidden }: BlockFieldProps) => React.JSX.Element;
};
export {};
//# sourceMappingURL=BlockFieldPlugin.d.ts.map