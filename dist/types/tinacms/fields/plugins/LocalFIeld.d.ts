import { LocalValue } from "@redsun-vn/easyblocks-core";
import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React from "react";
import { FieldRenderProps } from "react-final-form";
declare const LocalFieldPlugin: {
    name: string;
    Component: (props: Omit<import("./wrapFieldWithMeta").FieldProps<Record<string, any>>, "meta"> & FieldRenderProps<LocalValue<any>, HTMLElement, LocalValue<any>> & {
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
export { LocalFieldPlugin };
//# sourceMappingURL=LocalFIeld.d.ts.map