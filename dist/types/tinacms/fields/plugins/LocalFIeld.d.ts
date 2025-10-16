import { LocalValue } from "@redsun-vn/easyblocks-core";
import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React from "react";
import { FieldRenderProps } from "react-final-form";
declare const LocalFieldPlugin: {
    name: string;
    Component: (props: import("./wrapFieldWithMeta").InputFieldType<FieldRenderProps<LocalValue<any>, HTMLElement, LocalValue<any>> & {
        field: InternalField;
    }, Record<string, any>>) => React.JSX.Element;
};
export { LocalFieldPlugin };
//# sourceMappingURL=LocalFIeld.d.ts.map