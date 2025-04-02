import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React from "react";
import { FieldRenderProps } from "react-final-form";
export declare const PositionFieldPlugin: {
    name: string;
    Component: (props: Omit<import("./wrapFieldWithMeta").FieldProps<Record<string, any>>, "meta"> & FieldRenderProps<"top-center" | "top-left" | "top-right" | "center-center" | "center-left" | "center-right" | "bottom-center" | "bottom-left" | "bottom-right", HTMLInputElement, "top-center" | "top-left" | "top-right" | "center-center" | "center-left" | "center-right" | "bottom-center" | "bottom-left" | "bottom-right"> & {
        field: InternalField;
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
};
//# sourceMappingURL=PositionFieldPlugin.d.ts.map