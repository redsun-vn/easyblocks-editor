export declare const RadioGroupFieldPlugin: {
    name: string;
    Component: (props: Omit<import("./wrapFieldWithMeta").FieldProps<Record<string, any>>, "meta"> & import("..").RadioGroupProps & {
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
//# sourceMappingURL=RadioGroupFieldPlugin.d.ts.map