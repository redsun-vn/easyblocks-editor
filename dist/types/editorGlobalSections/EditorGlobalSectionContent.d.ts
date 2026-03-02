import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import React from "react";
export declare const EditorGlobalSectionContent: ({ sectionContent, openedSections, globalSectionMenu, onClickGlobalSection, }: {
    sectionContent: {
        [entryId: string]: {
            label: string;
            entry: NoCodeComponentEntry;
            pages: string[];
        };
    };
    openedSections: string[];
    globalSectionMenu: {
        id: string;
        name: string;
    };
    onClickGlobalSection: (sectionId: string) => void;
}) => React.JSX.Element;
//# sourceMappingURL=EditorGlobalSectionContent.d.ts.map