import { TokenValue as CoreTokenValue, NonNullish } from "@redsun-vn/easyblocks-core";
import React, { ReactNode } from "react";
import { FieldInputProps } from "react-final-form";
import { EditorTokenTypeDefinition } from "../../../../EditorContext";
import { FieldMixedValue } from "../../../../types";
import { TokenField } from "./TokenFieldPlugin";
interface IColorFieldPluginProps {
    type: "list" | "grid";
    tokenTypeDefinition: EditorTokenTypeDefinition;
    shouldShowCustomValueInput: boolean;
    inputValue: unknown;
    setInputValue: React.Dispatch<unknown>;
    input: FieldInputProps<CoreTokenValue | FieldMixedValue, HTMLSelectElement>;
    selectValue: string;
    onSelectChange: (selectedValue: string) => void;
    field: TokenField<NonNullish>;
    SelectColorTokenItem: React.ForwardRefExoticComponent<{
        children: ReactNode;
        previewColor?: string;
        value: string;
        isDisabled?: boolean;
    } & React.RefAttributes<HTMLDivElement>>;
    options: {
        id: string;
        label: string;
    }[];
}
export declare const ColorOptions: ({ field, options, shape, }: Pick<IColorFieldPluginProps, "field" | "options"> & {
    shape?: "circle" | "rectangle";
}) => React.JSX.Element[];
export declare const ColorFieldPlugin: ({ type, tokenTypeDefinition, shouldShowCustomValueInput, inputValue, setInputValue, input, selectValue, onSelectChange, field, SelectColorTokenItem, options, }: IColorFieldPluginProps) => React.JSX.Element;
export {};
//# sourceMappingURL=ColorFieldPlugin.d.ts.map