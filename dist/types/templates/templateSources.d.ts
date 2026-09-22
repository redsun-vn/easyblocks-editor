import { TEasyblocksEditorMode } from "../types";
/**
 * A remote template library.
 *
 * `shop` is the store's own templates. `public` is the system library: its rows
 * carry no `shop_id`, and every shop-side query is pinned to a shop id down in
 * Elasticsearch, so they can never come back through the shop read however it
 * is filtered. Showing them needs a genuinely different endpoint rather than a
 * filter applied to the shop result.
 */
export type TTemplateSource = "shop" | "public";
/**
 * The template libraries a mode may read.
 *
 * Admin edits the system library directly, so its own shop path already holds
 * exactly those templates and a second public read would be a duplicate.
 *
 * It lives in its own module because the two surfaces that offer templates —
 * the left panel and the picker dialog's list — have to read the same libraries
 * or they disagree about what the shop has. They did: the panel read both and
 * the dialog read only the shop, so a shop whose only visible template came
 * from the system library saw a category in one place and an empty library in
 * the other.
 */
export declare function getTemplateSources(mode: TEasyblocksEditorMode): TTemplateSource[];
//# sourceMappingURL=templateSources.d.ts.map