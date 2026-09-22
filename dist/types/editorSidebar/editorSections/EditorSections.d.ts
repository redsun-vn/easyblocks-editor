import { ComponentDefinitionShared, Template } from "@redsun-vn/easyblocks-core";
import React from "react";
import { getTemplateSources } from "../../templates/templateSources";
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
/** Which list a section row draws from: local definitions, or the store. */
type TSectionSource = "builtin" | "template";
/**
 * A remote template library. Both feed the same category rows; which of them a
 * mode may read is `getTemplateSources`.
 *
 * Re-exported rather than declared: the picker dialog's list reads the same
 * libraries, and the two disagreeing about what a shop has is the bug this
 * shared module exists to prevent.
 */
export type { TTemplateSource } from "../../templates/templateSources";
export { getTemplateSources };
/**
 * A category row of the Templates panel.
 *
 * `uuid` is null on the one row that is not a category at all: the remainder
 * holding every template filed under none.
 */
export type TTemplateCategoryEntry = {
    uuid: string | null;
    name: string | null;
};
export type TSectionEntry = {
    /** Stable key for the selection and for the per-entry template cache. */
    id: string;
    /** Already localized. */
    label: string;
    /** Raw `.group` value of a built-in category. Component rows only. */
    group?: string;
    /**
     * Template category to filter by. Template rows only, and absent on the
     * uncategorized row, which filters on "no category" instead.
     */
    categoryUuid?: string;
    source: TSectionSource;
};
/**
 * Which of the two panels this instance is. Built-in components and saved
 * templates each own a rail button and a panel, so one instance only ever
 * builds and renders one of the two lists.
 */
export type TSectionPanel = "components" | "templates";
/**
 * Where a section picked from the panel lands in the root collection: directly after the
 * selected section, which is where the user is looking. With nothing selected there is no
 * such position, so it goes to the end.
 *
 * `focussedField` can point deep inside a section (`data.2.Cards.0`); only the top level
 * index matters, because the panel always inserts into the root `data` collection.
 */
export declare function getSectionInsertionIndex(focussedField: Array<string>, sectionCount: number): number;
/**
 * The entries of one panel, and only that panel.
 *
 * The two kinds are built from separate sources and never merged, which is the
 * whole point: the previous `[...new Set([...localGroups, ...remoteGroups])]`
 * put a shop's own group called "Layout" into the same row as the built-in
 * Layout category, so a saved template looked like a stock component.
 *
 * The Templates panel lists the template taxonomy — the very categories the
 * save dialog files a template under — rather than the free-text `group`
 * column it used to read. `group` is whatever anybody once typed, so it grew
 * near-duplicates ("product" beside "Product") that are not categories at all.
 * The rows carry no library heading: which library a template came from is not
 * how the user looks for one, and both libraries file into the same taxonomy,
 * so a category holds whatever the caller is allowed to see under that name.
 */
export declare function buildSectionEntries({ panel, localGroups, templateCategories, categoryOrder, t, }: {
    panel: TSectionPanel;
    localGroups: string[];
    /** Discovered categories; absent until the discovery read has answered. */
    templateCategories?: TTemplateCategoryEntry[] | null;
    /** The order the app asked for; empty means sort by name, as before. */
    categoryOrder?: string[];
    t: (key: string) => string;
}): TSectionEntry[];
export declare const EditorSections: React.FC<{
    panel: TSectionPanel;
}>;
//# sourceMappingURL=EditorSections.d.ts.map