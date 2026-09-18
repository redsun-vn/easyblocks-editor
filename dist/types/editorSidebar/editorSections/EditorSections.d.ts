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
export type TSectionEntry = {
    /** Stable key for hover state and for the per-entry template cache. */
    id: string;
    /** Already localized; the raw category string is kept in `group`. */
    label: string;
    /** Raw `.group` value, only set for built-in categories. */
    group?: string;
    source: TSectionSource;
    kind: TSectionItemKind;
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
 * The entries of one panel, and only that panel.
 *
 * The two kinds are built from separate sources and never merged, which is the
 * whole point: the previous `[...new Set([...localGroups, ...remoteGroups])]`
 * put a shop's own group called "Layout" into the same row as the built-in
 * Layout category, so a saved template looked like a stock component.
 *
 * Each template source stays a single entry instead of being expanded into its
 * group names. A shop that saved templates under "Layout" would otherwise
 * reintroduce the collision one level down, with the same word appearing in
 * both panels. The group string survives as a per-template label in the picker.
 */
export declare function buildSectionEntries({ panel, mode, localGroups, t, }: {
    panel: TSectionPanel;
    mode: TEasyblocksEditorMode;
    localGroups: string[];
    t: (key: string) => string;
}): TSectionEntry[];
export declare const EditorSections: React.FC<{
    panel: TSectionPanel;
}>;
export {};
//# sourceMappingURL=EditorSections.d.ts.map