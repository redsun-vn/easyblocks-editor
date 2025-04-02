import { LocalTextReference, ResponsiveValue } from "@redsun-vn/easyblocks-core";
import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React from "react";
import { FieldRenderProps } from "react-final-form";
type TextFieldProps = FieldRenderProps<ResponsiveValue<string> | LocalTextReference> & {
    field: InternalField & {
        placeholder?: string;
        normalize: (value: string) => string | null;
    };
};
declare function TextField({ input, field, noWrap }: TextFieldProps): React.JSX.Element;
export declare const TextFieldPlugin: {
    name: string;
    Component: typeof TextField;
    parse: (value?: string) => string;
};
export {};
//# sourceMappingURL=TextFieldPlugin.d.ts.map