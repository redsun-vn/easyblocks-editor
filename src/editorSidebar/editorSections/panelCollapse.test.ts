/**
 * @jest-environment jsdom
 *
 * Declared here rather than in `jest.config.ts`: this is the only suite that
 * needs a browser, and the rest run faster without one.
 */

import { isGroupCollapsed, setGroupCollapsed } from "./panelCollapse";

const STORAGE_KEY = "easyblocks.editor.sidebar.collapsedGroups";

describe("panelCollapse", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("a group nobody has touched is open", () => {
    expect(isGroupCollapsed("components:blockIntro")).toBe(false);
  });

  test("remembers a group the viewer folded away", () => {
    setGroupCollapsed("components:blockIntro", true);

    expect(isGroupCollapsed("components:blockIntro")).toBe(true);
  });

  test("opening one group leaves the others folded", () => {
    setGroupCollapsed("components:blockIntro", true);
    setGroupCollapsed("components:blockShop", true);
    setGroupCollapsed("components:blockIntro", false);

    expect(isGroupCollapsed("components:blockIntro")).toBe(false);
    expect(isGroupCollapsed("components:blockShop")).toBe(true);
  });

  test("the two panels keep their own state for a group of the same name", () => {
    setGroupCollapsed("templates:saved", true);

    expect(isGroupCollapsed("components:saved")).toBe(false);
  });

  // What is stored is what a reader would have to fold by hand again, so a
  // group that is open must leave nothing behind.
  test("does not store a group that is open", () => {
    setGroupCollapsed("components:blockIntro", true);
    setGroupCollapsed("components:blockIntro", false);

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("[]");
  });

  describe("when the stored value is not what we left there", () => {
    test.each([
      ["not JSON at all", "{{{"],
      ["an object", '{"components:blockIntro":true}'],
      ["a bare string", '"components:blockIntro"'],
      ["null", "null"],
    ])("treats %s as nothing stored", (_name, raw) => {
      window.localStorage.setItem(STORAGE_KEY, raw);

      expect(isGroupCollapsed("components:blockIntro")).toBe(false);
    });

    test("keeps the usable keys out of a mixed list", () => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([1, null, "components:blockIntro", { a: 1 }]),
      );

      expect(isGroupCollapsed("components:blockIntro")).toBe(true);
    });
  });

  describe("when storage is unavailable", () => {
    const realStorage = Object.getOwnPropertyDescriptor(
      window,
      "localStorage",
    ) as PropertyDescriptor;

    const throwEverything = () => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new Error("access to site data is blocked");
        },
      });
    };

    afterEach(() => {
      Object.defineProperty(window, "localStorage", realStorage);
    });

    test("reads as open rather than throwing", () => {
      throwEverything();

      expect(isGroupCollapsed("components:blockIntro")).toBe(false);
    });

    test("swallows a write it cannot make", () => {
      throwEverything();

      expect(() =>
        setGroupCollapsed("components:blockIntro", true),
      ).not.toThrow();
    });
  });
});
