import React from "react";
import { InputProps } from "../components";
export declare const NumberFieldPlugin: {
    name: string;
    Component: (props: import("./wrapFieldWithMeta").InputFieldType<{
        step: string | number;
        min?: number;
        max?: number;
        input: InputProps;
    }, Record<string, any>>) => React.JSX.Element;
    parse: (value?: string) => number | "" | undefined;
};
//# sourceMappingURL=NumberFieldPlugin.d.ts.map