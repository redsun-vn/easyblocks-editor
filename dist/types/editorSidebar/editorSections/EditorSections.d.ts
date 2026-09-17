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
/**
 * Where a section picked from the drawer lands in the root collection: directly after the
 * selected section, which is where the user is looking. With nothing selected there is no
 * such position, so it goes to the end.
 *
 * `focussedField` can point deep inside a section (`data.2.Cards.0`); only the top level
 * index matters, because the drawer always inserts into the root `data` collection.
 */
export declare function getSectionInsertionIndex(focussedField: Array<string>, sectionCount: number): number;
export declare const EditorSections: React.FC;
//# sourceMappingURL=EditorSections.d.ts.map