export declare const ToggleFieldPlugin: {
    name: string;
    type: string;
    Component: (props: Omit<import("./wrapFieldWithMeta").FieldProps<Record<string, any>>, "meta"> & import("..").ToggleProps & {
        layout?: "column" | "row";
        noWrap?: boolean;
        isLabelHidden?: boolean;
    } & {
        children: import("react").ReactNode;
        renderLabel?: (props: {
            label: string;
        }) => import("react").ReactNode;
    }) => import("react").JSX.Element;
};
//# sourceMappingURL=ToggleFieldPlugin.d.ts.map