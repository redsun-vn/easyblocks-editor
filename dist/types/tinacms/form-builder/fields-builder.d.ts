import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React from "react";
import { Form } from "../../form";
export interface FieldBuilderProps {
    form: Form;
    field: InternalField;
    noWrap?: boolean;
    isLabelHidden?: boolean;
}
export declare function FieldBuilder({ form, field, noWrap, isLabelHidden, }: FieldBuilderProps): React.JSX.Element | null;
export interface FieldsBuilderProps {
    form: Form;
    fields: InternalField[];
}
export declare function FieldsBuilder({ form, fields }: FieldsBuilderProps): React.JSX.Element;
//# sourceMappingURL=fields-builder.d.ts.map