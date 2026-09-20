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
export declare function toKeySegment(text: string): string;
export declare function translatePanelGroup(group: string, t: (key: string) => string): string;
/**
 * A label is usually already a key, so that is tried first and the derivation
 * is the fallback — the other way round from a group, which is never a key.
 */
export declare function translatePanelLabel(label: string, t: (key: string) => string): string;
/** Kept for the panel group check in `website-builder`, which names this. */
export declare const toGroupKeySegment: typeof toKeySegment;
//# sourceMappingURL=panelTranslation.d.ts.map