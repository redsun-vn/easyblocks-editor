import { isLeftSidebarPanelAllowed } from "./leftSidebarPanels";
import { TLeftSidebar } from "../types";

const ALL_PANELS: TLeftSidebar[] = [
  "components",
  "templates",
  "global-sections",
  "layers",
];

describe("isLeftSidebarPanelAllowed", () => {
  it("withholds nothing from a shop owner", () => {
    ALL_PANELS.forEach((panel) => {
      expect(isLeftSidebarPanelAllowed("user", panel)).toBe(true);
    });
  });

  it("withholds nothing from an admin", () => {
    ALL_PANELS.forEach((panel) => {
      expect(isLeftSidebarPanelAllowed("admin", panel)).toBe(true);
    });
  });

  // The rule this module exists for: a seller building a template gets the
  // parts, never the shelf their finished template will be listed on.
  it("gives the template editor its components", () => {
    expect(isLeftSidebarPanelAllowed("admin-template", "components")).toBe(true);
    expect(isLeftSidebarPanelAllowed("admin-template", "layers")).toBe(true);
  });

  it("keeps the template library out of the template editor", () => {
    expect(isLeftSidebarPanelAllowed("admin-template", "templates")).toBe(false);
  });

  // A template is not a site, so it has no site-wide header or footer to edit.
  it("keeps global sections out of the template editor", () => {
    expect(isLeftSidebarPanelAllowed("admin-template", "global-sections")).toBe(
      false,
    );
  });
});
