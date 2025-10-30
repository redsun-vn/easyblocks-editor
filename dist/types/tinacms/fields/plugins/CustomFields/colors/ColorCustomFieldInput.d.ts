import React from "react";
import { ICustomField } from "./ColorCustomFields";
export declare const ColorCustomFieldInput: ({ inputType, options, customField, onChange, }: {
    inputType?: "select" | "text";
    options?: {
        id: string;
        value: string;
        label: string;
    }[];
    customField: ICustomField;
    onChange: (key: string, value: string | number, type: string) => void;
}) => React.JSX.Element | undefined;
//# sourceMappingURL=ColorCustomFieldInput.d.ts.map