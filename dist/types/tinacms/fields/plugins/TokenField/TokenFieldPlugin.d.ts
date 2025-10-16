import { TokenValue as CoreTokenValue, Field, NonNullish, ThemeTokenValue } from "@redsun-vn/easyblocks-core";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FieldMixedValue } from "../../../../types";
interface TokenField<TokenValue extends NonNullish = NonNullish> extends Field {
    tokens: {
        [key: string]: ThemeTokenValue<TokenValue>;
    };
    normalizeCustomValue?: (value: string) => any;
    allowCustom?: boolean;
    extraValues?: Array<string | {
        value: string;
        label: string;
    }>;
}
export interface TokenFieldProps<TokenValue extends NonNullish> extends FieldRenderProps<CoreTokenValue | FieldMixedValue, HTMLSelectElement> {
    field: TokenField<TokenValue>;
}
export declare const TokenFieldPlugin: {
    name: string;
    type: string;
    Component: (props: import("../wrapFieldWithMeta").InputFieldType<TokenFieldProps<NonNullish>, Record<string, any>>) => React.JSX.Element;
};
export {};
//# sourceMappingURL=TokenFieldPlugin.d.ts.map