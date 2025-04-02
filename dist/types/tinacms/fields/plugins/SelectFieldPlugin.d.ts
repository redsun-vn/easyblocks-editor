export declare const SelectFieldPlugin: {
    name: string;
    type: string;
    Component: (props: Omit<import("./wrapFieldWithMeta").FieldProps<Record<string, any>>, "meta"> & import("..").SelectFieldComponentProps & {
        layout?: "column" | "row";
        noWrap?: boolean;
        isLabelHidden?: boolean;
    } & {
        children: import("react").ReactNode;
        renderLabel?: (props: {
            label: string;
        }) => import("react").ReactNode;
    }) => import("react").JSX.Element;
    parse: (value?: string) => string;
};
//# sourceMappingURL=SelectFieldPlugin.d.ts.map