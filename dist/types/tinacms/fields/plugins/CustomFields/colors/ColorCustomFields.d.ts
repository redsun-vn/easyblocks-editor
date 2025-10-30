import { TokenValue } from "@redsun-vn/easyblocks-core";
import React from "react";
import { TokenFieldProps } from "../../TokenField/TokenFieldPlugin";
interface IFontCustomInputElement extends Omit<TokenFieldProps<TokenValue>, "meta"> {
    customValueTextFieldRef?: React.MutableRefObject<HTMLInputElement | null>;
}
export interface ICustomField {
    key: string;
    label: string;
    options?: {
        id: string;
        value: string;
        label: string;
    }[];
    type: "string" | "number";
    inputType: "select" | "text";
    value?: string | number;
    defaultValue?: string | number;
}
export declare const ColorCustomFields: ({ input }: IFontCustomInputElement) => React.JSX.Element;
export {};
//# sourceMappingURL=ColorCustomFields.d.ts.map