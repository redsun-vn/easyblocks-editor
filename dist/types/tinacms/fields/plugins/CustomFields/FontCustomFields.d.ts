import { TokenValue } from "@redsun-vn/easyblocks-core";
import React from "react";
import { TokenFieldProps } from "../TokenField/TokenFieldPlugin";
interface IFontCustomInputElement extends Omit<TokenFieldProps<TokenValue>, "meta"> {
    customValueTextFieldRef?: React.MutableRefObject<HTMLInputElement | null>;
}
interface ICustomField {
    key: string;
    label: string;
    options?: {
        id: string;
        label: string;
    }[];
    type: "string" | "number";
    inputType: "select" | "text";
    value?: string | number;
    defaultValue?: string | number;
}
export declare const FontCustomFieldInput: ({ inputType, options, customField, onChange, }: {
    inputType?: "select" | "text";
    options?: {
        id: string;
        label: string;
    }[];
    customField: ICustomField;
    onChange: (key: string, value: string | number, type: string) => void;
}) => React.JSX.Element | undefined;
export declare const FontCustomField: ({ customField, onChange, }: {
    type?: "select" | "text";
    options?: {
        id: string;
        label: string;
    }[];
    customField: ICustomField;
    onChange: (key: string, value: string | number, type: string) => void;
    [key: string]: any;
}) => React.JSX.Element;
export declare const FontCustomFields: ({ input }: IFontCustomInputElement) => React.JSX.Element;
export {};
//# sourceMappingURL=FontCustomFields.d.ts.map