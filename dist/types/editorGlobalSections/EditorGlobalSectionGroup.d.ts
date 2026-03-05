import { IThemeConfig } from "@redsun-vn/easyblocks-core";
import React from "react";
export declare const EditorGlobalSectionGroup: ({ globalSectionGroup, openedSectionGroups, onClickGlobalSectionGroup, }: {
    openedSectionGroups: string[];
    globalSectionGroup: {
        group: {
            id: string;
            name: string;
        };
        groupItem: NonNullable<IThemeConfig["globalSections"]>[string];
    };
    onClickGlobalSectionGroup: (groupId: string) => void;
}) => React.JSX.Element;
//# sourceMappingURL=EditorGlobalSectionGroup.d.ts.map