import { Field, NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import React from "react";
import type { FieldRenderProps } from "react-final-form";
interface IdentityFieldProps extends FieldRenderProps<NoCodeComponentEntry, HTMLElement> {
    field: Field;
}
declare function IdentityField({ input, field }: IdentityFieldProps): React.JSX.Element | null;
declare const IdentityFieldPlugin: {
    name: string;
    Component: typeof IdentityField;
};
export { IdentityFieldPlugin };
//# sourceMappingURL=IdentityFieldPlugin.d.ts.map