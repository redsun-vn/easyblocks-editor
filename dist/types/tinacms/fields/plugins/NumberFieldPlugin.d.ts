import React from "react";
import { InputProps } from "../components";
export declare const NumberFieldPlugin: {
    name: string;
    Component: (props: Omit<import("./wrapFieldWithMeta").FieldProps<Record<string, any>>, "meta"> & {
        step: string | number;
        min?: number;
        max?: number;
        input: InputProps;
    } & {
        layout?: "column" | "row";
        noWrap?: boolean;
        isLabelHidden?: boolean;
    } & {
        children: React.ReactNode;
        renderLabel?: (props: {
            label: string;
        }) => React.ReactNode;
    }) => React.JSX.Element;
    parse: (value?: string) => number | "" | undefined;
};
//# sourceMappingURL=NumberFieldPlugin.d.ts.map