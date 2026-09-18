import { ComponentDefinitionShared, Template } from "@redsun-vn/easyblocks-core";
import React from "react";
import { TSectionItemKind } from "./EditorSectionItem";
import { TEasyblocksEditorMode } from "../../types";
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
/** Where an entry in the section list reads its templates from. */
type TSectionSource = "builtin" | "shop" | "public";
/**
 * A remote template library. `builtin` is derived from the local component
 * definitions and never appears here.
 */
export type TTemplateSource = Exclude<TSectionSource, "builtin">;
/** The categories each template library turned out to contain. */
export type TTemplateCategories = Partial<Record<TTemplateSource, string[]>>;
export type TSectionEntry = {
    /** Stable key for hover state and for the per-entry template cache. */
    id: string;
    /** Already localized; the raw category string is kept in `group`. */
    label: string;
    /** Raw `.group` value: a built-in category, or a template category name. */
    group?: string;
    source: TSectionSource;
    kind: TSectionItemKind;
    /**
     * Heading the row sits under. Only template rows carry one: the Templates
     * panel groups its categories by the library they came from, while the
     * Components panel is a single flat list with no heading at all.
     */
    sourceLabel?: string;
};
/**
 * Which of the two panels this instance is. Built-in components and saved
 * templates each own a rail button and a panel, so one instance only ever
 * builds and renders one of the two lists.
 */
export type TSectionPanel = "components" | "templates";
/**
 * Where a section picked from the drawer lands in the root collection: directly after the
 * selected section, which is where the user is looking. With nothing selected there is no
 * such position, so it goes to the end.
 *
 * `focussedField` can point deep inside a section (`data.2.Cards.0`); only the top level
 * index matters, because the drawer always inserts into the root `data` collection.
 */
export declare function getSectionInsertionIndex(focussedField: Array<string>, sectionCount: number): number;
/**
 * The template libraries a mode may read, in the order the panel lists them.
 *
 * Admin edits the system library directly, so its own shop path already holds
 * exactly those templates and a second public read would be a duplicate.
 */
export declare function getTemplateSources(mode: TEasyblocksEditorMode): Array<{
    source: TTemplateSource;
    labelKey: string;
}>;
/**
 * The entries of one panel, and only that panel.
 *
 * The two kinds are built from separate sources and never merged, which is the
 * whole point: the previous `[...new Set([...localGroups, ...remoteGroups])]`
 * put a shop's own group called "Layout" into the same row as the built-in
 * Layout category, so a saved template looked like a stock component.
 *
 * A template library is expanded into one row per category it actually
 * contains, mirroring how the Components panel lists its built-in categories.
 * The collision the split was made to prevent is held off by `sourceLabel`
 * instead: category rows sit under a heading naming their library, so a shop
 * category called "Layout" reads as the shop's, never as the built-in one, and
 * the two libraries may each carry a category of the same name without the
 * panel showing two rows that look identical.
 *
 * A library with no categories contributes nothing — no heading, no row —
 * because `categoriesBySource` only ever lists buckets that matched something.
 */
export declare function buildSectionEntries({ panel, mode, localGroups, categoriesBySource, t, }: {
    panel: TSectionPanel;
    mode: TEasyblocksEditorMode;
    localGroups: string[];
    /** Discovered per library; absent until the discovery read has answered. */
    categoriesBySource?: TTemplateCategories | null;
    t: (key: string) => string;
}): TSectionEntry[];
export declare const EditorSections: React.FC<{
    panel: TSectionPanel;
}>;
export {};
//# sourceMappingURL=EditorSections.d.ts.map