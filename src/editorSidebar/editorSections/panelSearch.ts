/**
 * Matching a typed query against a panel label.
 *
 * Vietnamese is the language these labels are read and typed in, and a shop
 * owner reaching for "Mở đầu" types `mo dau` — no tone marks, because typing
 * them means switching input mode for a search box they are about to empty
 * again. Folding both sides to plain letters is what makes that find anything.
 */

/** `"Mở đầu — canh giữa"` → `"mo dau — canh giua"`. */
export function foldForSearch(text: string): string {
  return (
    text
      .normalize("NFD")
      // The combining marks NFD just split off. Without this step the folded
      // string still carries them and matches nothing a plain keyboard types.
      .replace(/[̀-ͯ]/g, "")
      // `đ` has no combining form, so decomposition leaves it untouched and it
      // has to be named.
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
  );
}

/**
 * Whether `label` answers `query`.
 *
 * Every word of the query has to appear somewhere in the label, in any order,
 * so `dau mo` finds "Mở đầu" as readily as `mo dau` does. An empty query
 * matches everything, which is what leaves the list whole until something is
 * typed.
 */
export function matchesQuery(label: string, query: string): boolean {
  const words = foldForSearch(query).split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return true;
  }

  const haystack = foldForSearch(label);

  return words.every((word) => haystack.includes(word));
}
