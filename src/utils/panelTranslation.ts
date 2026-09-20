/**
 * Panel headings and field labels, translated without touching a definition.
 *
 * A definition names a group in plain English — `group: "Section margins"` —
 * and there are 188 such names across a thousand declarations, most of them in
 * the frozen component set. Field labels are mostly proper i18n keys, but 751
 * of them are plain English too. Turning each one into a key would mean editing
 * every definition that has one.
 *
 * Deriving the key from the words instead leaves every definition alone, and it
 * is already the spelling the locale files use: they carry
 * `definition.schema.group.sectionMargins` and `definition.schema.label.left`
 * and hundreds more.
 */

/**
 * `"Section margins"` → `"sectionMargins"`.
 *
 * Words split on anything that is not a letter or a digit, so the separators
 * definitions actually use — spaces, `-`, `/`, `&` — all behave the same. Every
 * word after the first is capitalised and otherwise lowercased, which is what
 * makes `"Login by Social"` land on the `loginBySocial` key that already exists.
 */
export function toKeySegment(text: string): string {
  const words = text.split(/[^A-Za-z0-9]+/).filter(Boolean);

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();

      if (index === 0) {
        return lower;
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

/**
 * The translation for `text` under `prefix`, or `text` itself.
 *
 * `t` hands back the key it was given when a locale has no entry for it, so
 * words nobody has translated keep reading exactly as they read today. That is
 * what makes this safe to switch on for every component at once.
 */
function translateUnder(
  text: string,
  prefix: string,
  t: (key: string) => string,
): string {
  const segment = toKeySegment(text);

  // A key has to start with a letter, which also keeps numbers out of this
  // entirely. Dropdowns are full of them — `1:1`, `1/1`, `3:2`, `32`, `50%`,
  // `50` — and stripping the punctuation collapses pairs of them onto one key,
  // so translating either would put the wrong words on the other. Numbers read
  // the same in every language anyway.
  if (!/^[a-z]/.test(segment)) {
    return text;
  }

  // Text that is not written in the Latin alphabet cannot produce a sensible
  // key: a handful of labels are written in Vietnamese already, and stripping
  // the diacritics turns "Tất cả" into `tTC`. Those are a separate problem —
  // they show Vietnamese to an English reader — and inventing a key for them
  // here would only hide it.
  if (/[^\u0000-\u007F]/.test(text)) {
    return text;
  }

  const key = `${prefix}.${segment}`;
  const translated = t(key);

  return translated === key ? text : translated;
}

export function translatePanelGroup(
  group: string,
  t: (key: string) => string,
): string {
  return translateUnder(group, "definition.schema.group", t);
}

/**
 * A label is usually already a key, so that is tried first and the derivation
 * is the fallback — the other way round from a group, which is never a key.
 */
export function translatePanelLabel(
  label: string,
  t: (key: string) => string,
): string {
  const asKey = t(label);

  if (asKey !== label) {
    return asKey;
  }

  return translateUnder(label, "definition.schema.label", t);
}

/** Kept for the panel group check in `website-builder`, which names this. */
export const toGroupKeySegment = toKeySegment;
