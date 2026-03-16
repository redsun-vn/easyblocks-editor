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
    allowCustom?: boolean;
}
export declare const FontCustomField: ({ customField, onChange, }: {
    type?: "select" | "text";
    options?: {
        id: string;
        value: string;
        label: string;
    }[];
    customField: ICustomField;
    onChange: (key: string, value: string | number, type: string) => void;
    [key: string]: any;
}) => React.JSX.Element;
export declare const FontCustomFields: ({ input, field }: IFontCustomInputElement) => React.JSX.Element;
export {};
//# sourceMappingURL=FontCustomFields.d.ts.map