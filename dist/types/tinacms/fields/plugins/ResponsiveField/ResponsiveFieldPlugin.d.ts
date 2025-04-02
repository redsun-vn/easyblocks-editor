import React from "react";
import { ResponsiveFieldDefinition } from "./responsiveFieldController";
type ResponsivePluginProps = {
    input: {
        value: any;
        onChange: (...values: Array<any>) => void;
    };
    field: ResponsiveFieldDefinition;
    tinaForm: any;
    form: any;
    meta: any;
};
export declare const ResponsiveFieldPlugin: {
    name: "responsive2";
    Component: (props: ResponsivePluginProps) => React.JSX.Element;
};
export {};
//# sourceMappingURL=ResponsiveFieldPlugin.d.ts.map