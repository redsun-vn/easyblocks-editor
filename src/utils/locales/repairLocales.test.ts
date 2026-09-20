import { repairLocales } from "./repairLocales";

describe("repairLocales", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("leaves a correct list alone", () => {
    const locales = [
      { code: "en", isDefault: true },
      { code: "pl", fallback: "en" },
      { code: "de" },
    ];

    expect(repairLocales(locales)).toEqual(locales);
  });

  test("marks the first as default when none is", () => {
    expect(repairLocales([{ code: "en" }, { code: "pl" }])).toEqual([
      { code: "en", isDefault: true },
      { code: "pl" },
    ]);
  });

  test("keeps only the first of several defaults", () => {
    expect(
      repairLocales([
        { code: "en", isDefault: true },
        { code: "pl", isDefault: true },
        { code: "de" },
      ])
    ).toEqual([
      { code: "en", isDefault: true },
      { code: "pl", isDefault: false },
      { code: "de" },
    ]);
  });

  test("drops a fallback from the default locale", () => {
    expect(
      repairLocales([
        { code: "en", isDefault: true, fallback: "pl" },
        { code: "pl" },
      ])
    ).toEqual([{ code: "en", isDefault: true }, { code: "pl" }]);
  });

  test("drops a fallback that names a locale which is not there", () => {
    expect(
      repairLocales([
        { code: "en", isDefault: true },
        { code: "de", fallback: "enxxx" },
      ])
    ).toEqual([{ code: "en", isDefault: true }, { code: "de" }]);
  });

  test("breaks a circular fallback chain", () => {
    const repaired = repairLocales([
      { code: "en", isDefault: true },
      { code: "pl1", fallback: "pl2" },
      { code: "pl2", fallback: "pl3" },
      { code: "pl3", fallback: "pl1" },
    ]);

    // Whichever link is cut, following any chain must now end rather than loop.
    repaired.forEach((locale) => {
      const seen: string[] = [];
      let current: typeof locale | undefined = locale;

      while (current?.fallback) {
        expect(seen).not.toContain(current.code);
        seen.push(current.code);
        current = repaired.find((x) => x.code === current!.fallback);
      }
    });
  });

  test("does not change the caller's own array", () => {
    const locales = [{ code: "en" }, { code: "pl" }];

    repairLocales(locales);

    expect(locales).toEqual([{ code: "en" }, { code: "pl" }]);
  });

  test("still refuses an empty list, which nothing can repair", () => {
    expect(() => repairLocales([])).toThrowError("empty");
  });
});
