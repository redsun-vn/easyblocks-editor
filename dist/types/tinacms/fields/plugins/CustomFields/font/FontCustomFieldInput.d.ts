import React from "react";
import { ICustomField } from "./FontCustomFields";
export declare const FontCustomFieldInput: ({ inputType, options, customField, onChange, }: {
    inputType?: "select" | "text";
    options?: {
        id: string;
        value: string;
        label: string;
    }[];
    customField: ICustomField;
    onChange: (key: string, value: string | number, type: string) => void;
}) => React.JSX.Element | undefined;
//# sourceMappingURL=FontCustomFieldInput.d.ts.map