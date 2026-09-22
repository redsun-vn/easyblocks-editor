import { Locale } from "@redsun-vn/easyblocks-core";
import React from "react";
type LanguageSelectProps = {
    /** The languages this shop publishes its pages in. */
    contentLocales: Locale[];
    contentLocale: string;
    onContentLocaleChange: (locale: string) => void;
    /** The languages the editor itself has been translated into. */
    uiLocales: string[];
    uiLocale: string;
    onUiLocaleChange: (locale: string) => void;
};
export declare function LanguageSelect({ contentLocales, contentLocale, onContentLocaleChange, uiLocales, uiLocale, onUiLocaleChange, }: LanguageSelectProps): React.JSX.Element;
export {};
//# sourceMappingURL=LanguageSelect.d.ts.map