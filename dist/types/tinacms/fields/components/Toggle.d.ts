import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React, { FC } from "react";
export interface ToggleProps {
    name: string;
    input: any;
    field: ToggleFieldDefinition;
    disabled?: boolean;
    onBlur: <T>(event?: React.FocusEvent<T>) => void;
    onChange: <T>(event: React.ChangeEvent<T> | any) => void;
    onFocus: <T>(event?: React.FocusEvent<T>) => void;
}
interface ToggleFieldDefinition extends InternalField {
    component: "toggle";
    toggleLabels?: boolean | FieldLabels;
}
type FieldLabels = {
    true: string;
    false: string;
};
export declare const Toggle: FC<ToggleProps>;
export {};
//# sourceMappingURL=Toggle.d.ts.map