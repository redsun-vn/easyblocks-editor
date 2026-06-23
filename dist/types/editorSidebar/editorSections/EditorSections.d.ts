import { ComponentDefinitionShared, Template } from "@redsun-vn/easyblocks-core";
import React from "react";
export interface IComponentGroups {
    [key: string]: {
        templates: (ComponentDefinitionShared & {
            group?: string;
            template: Template;
        })[];
        count: {
            matchedCount: number;
            total: number;
        };
    };
}
export type TSectionTemplate = IComponentGroups[string]["templates"][number];
export declare const EditorSections: React.FC;
//# sourceMappingURL=EditorSections.d.ts.map