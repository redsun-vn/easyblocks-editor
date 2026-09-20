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
export function repairLocales(locales: Locale[]): Locale[] {
  if (locales.length === 0) {
    throw new Error("repairLocales: the list of locales is empty");
  }

  const complain = (message: string) =>
    console.warn(`easyblocks: ${message}; the editor has corrected it`);

  let repaired = locales.map((locale) => ({ ...locale }));

  // Exactly one default, and it is the first one claiming to be.
  const defaults = repaired.filter((locale) => locale.isDefault);

  if (defaults.length === 0) {
    complain(`no locale is marked as default, so "${repaired[0].code}" is`);
    repaired[0].isDefault = true;
  } else if (defaults.length > 1) {
    complain(
      `${defaults.length} locales are marked as default, so only "${defaults[0].code}" stays`
    );

    defaults.slice(1).forEach((locale) => {
      locale.isDefault = false;
    });
  }

  const defaultLocale = repaired.find((locale) => locale.isDefault)!;

  // The default is where every chain ends, so it cannot point anywhere itself.
  if (defaultLocale.fallback) {
    complain(
      `the default locale "${defaultLocale.code}" had a fallback of "${defaultLocale.fallback}"`
    );
    delete defaultLocale.fallback;
  }

  // A fallback naming a language that is not here leads nowhere.
  repaired.forEach((locale) => {
    if (locale.fallback && !repaired.some((x) => x.code === locale.fallback)) {
      complain(
        `locale "${locale.code}" falls back to "${locale.fallback}", which is not in the list`
      );
      delete locale.fallback;
    }
  });

  // A loop would make the fallback lookup spin forever, so the link that
  // closes it is dropped and the chain ends at the default instead.
  repaired.forEach((locale) => {
    const seen: string[] = [];
    let current: Locale | undefined = locale;

    while (current?.fallback) {
      seen.push(current.code);

      if (seen.includes(current.fallback)) {
        complain(
          `locales fall back in a circle: ${[...seen, current.fallback].join(" → ")}`
        );
        delete current.fallback;
        break;
      }

      current = repaired.find((x) => x.code === current!.fallback);
    }
  });

  return repaired;
}
