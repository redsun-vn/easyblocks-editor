import { TokenValue } from "@redsun-vn/easyblocks-core";
import React from "react";
import { TokenFieldProps } from "../TokenField/TokenFieldPlugin";
interface IFontCustomInputElement extends Omit<TokenFieldProps<TokenValue>, "meta"> {
    customValueTextFieldRef?: React.MutableRefObject<HTMLInputElement | null>;
}
export declare const FontCustomInputElement: ({ input, field, }: IFontCustomInputElement) => React.JSX.Element;
export {};
//# sourceMappingURL=FontCustomInputElement.d.ts.map