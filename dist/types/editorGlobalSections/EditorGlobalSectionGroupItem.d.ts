import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import React from "react";
export declare const EditorGlobalSectionGroupItem: ({ group, groupItem, setOpenDeleteConfirm, setOpenEditSection, }: {
    group: {
        id: string;
        name: string;
    };
    groupItem: {
        id: string;
        component: string;
        label: string;
        pages: string[];
        entry?: NoCodeComponentEntry;
    };
    setOpenDeleteConfirm: React.Dispatch<React.SetStateAction<{
        entryId: string;
        sectionName: string;
        groupName: string;
    } | null>>;
    setOpenEditSection: React.Dispatch<React.SetStateAction<{
        label: string;
        entry: NoCodeComponentEntry;
        groupName: string;
    } | null>>;
}) => React.JSX.Element;
//# sourceMappingURL=EditorGlobalSectionGroupItem.d.ts.map