/**
 * Panel group titles, translated without touching a single component definition.
 *
 * A definition names its groups in plain English — `group: "Section margins"` —
 * and there are 184 such names across 1023 declarations, most of them in the
 * frozen component set. Turning each one into an i18n key would mean editing all
 * of them. Deriving the key from the name instead leaves every definition alone,
 * and it is already the spelling the locale files use: they carry
 * `definition.schema.group.sectionMargins`, `…layout`, `…padding` and twenty
 * more, each with a Vietnamese value, all of them unreachable until now because
 * the panel rendered the raw English name.
 */

/**
 * `"Section margins"` → `"sectionMargins"`.
 *
 * Words are split on anything that is not a letter or a digit, so the separators
 * definitions actually use — spaces, `-`, `/`, `&` — all behave the same. Every
 * word after the first is capitalised and otherwise lowercased, which is what
 * makes `"Login by Social"` land on the `loginBySocial` key that already exists.
 */
export function toGroupKeySegment(group: string): string {
  const words = group.split(/[^A-Za-z0-9]+/).filter(Boolean);

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

export function panelGroupTranslationKey(group: string): string {
  return `definition.schema.group.${toGroupKeySegment(group)}`;
}

/**
 * The translated title, or the group's own words when nothing translates it.
 *
 * `t` hands back the key it was given when a locale has no entry for it, so a
 * group nobody has translated keeps reading exactly as it reads today. That is
 * what makes this safe to switch on for every component at once.
 */
export function translatePanelGroup(
  group: string,
  t: (key: string) => string,
): string {
  const key = panelGroupTranslationKey(group);
  const translated = t(key);

  return translated === key ? group : translated;
}
