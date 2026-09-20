import { Locale } from "@redsun-vn/easyblocks-core";
/**
 * A usable locale list, built from whatever the shop actually has.
 *
 * `checkLocalesCorrectness` throws on every one of these problems, and it is
 * called from inside the editor's render. That is fine for a developer wiring
 * up a config, and wrong for a shop: the list comes from tenant data, so a
 * language table with two defaults — or none, or a fallback pointing at a
 * language somebody deleted — emptied the editor completely, with no way back
 * in for the person whose shop it is.
 *
 * So the strict check stays where it is, for callers that want it, and this is
 * what the editor uses instead. Every repair is announced, because each one is
 * something the shop's language settings should be corrected for.
 *
 * An empty list is the one thing not repaired: there is no language to fall
 * back to, and it means the editor was mounted with nothing configured rather
 * than with something misconfigured.
 */
export declare function repairLocales(locales: Locale[]): Locale[];
//# sourceMappingURL=repairLocales.d.ts.map