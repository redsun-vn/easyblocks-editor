/**
 * Matching a typed query against a panel label.
 *
 * Vietnamese is the language these labels are read and typed in, and a shop
 * owner reaching for "Mở đầu" types `mo dau` — no tone marks, because typing
 * them means switching input mode for a search box they are about to empty
 * again. Folding both sides to plain letters is what makes that find anything.
 */
/** `"Mở đầu — canh giữa"` → `"mo dau — canh giua"`. */
export declare function foldForSearch(text: string): string;
/**
 * Whether `label` answers `query`.
 *
 * Every word of the query has to appear somewhere in the label, in any order,
 * so `dau mo` finds "Mở đầu" as readily as `mo dau` does. An empty query
 * matches everything, which is what leaves the list whole until something is
 * typed.
 */
export declare function matchesQuery(label: string, query: string): boolean;
//# sourceMappingURL=panelSearch.d.ts.map