import { ExternalReference, FetchCompoundResourceResultValues } from "@redsun-vn/easyblocks-core";
import React from "react";
import { FieldMixedValue } from "../../../../types";
import { FieldRenderProps } from "../../../form-builder";
type ExternalFieldProps = FieldRenderProps<ExternalReference | FieldMixedValue, any>;
export declare const ExternalFieldPlugin: {
    name: string;
    Component: (props: ExternalFieldProps) => React.JSX.Element;
};
export declare function getBasicResourcesOfType(compoundResourceValues: FetchCompoundResourceResultValues, type: string): ({
    type: "text";
    value: string;
    label?: string;
    key: string;
} | {
    type: string & Record<never, never>;
    value: import("@redsun-vn/easyblocks-core").NonNullish;
    label?: string;
    key: string;
})[];
export declare function CompoundResourceValueSelect(props: {
    options: Array<{
        id: string;
        key: string;
        label: string;
    }>;
    resource: {
        id: null;
        key: undefined;
    } | {
        id: string;
        key: string | undefined;
    };
    onResourceKeyChange: (id: string, key: string) => void;
}): React.JSX.Element;
export {};
//# sourceMappingURL=ExternalField.d.ts.map