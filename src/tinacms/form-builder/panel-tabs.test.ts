import { resolvePanelTabs } from "./panel-tabs";

const stylesField = { schemaProp: { tab: undefined } };
const dataField = { schemaProp: { tab: "data" as const } };
const advancedField = { schemaProp: { tab: "advanced" as const } };

describe("resolvePanelTabs", () => {
  test("a component without an advanced field keeps the three tabs it always had", () => {
    expect(resolvePanelTabs([stylesField, dataField], "styles")).toEqual({
      tabIds: ["styles", "data", "animation"],
      activeTab: "styles",
    });
  });

  test("a component with an advanced field gets a fourth tab, after the others", () => {
    expect(
      resolvePanelTabs([stylesField, advancedField], "styles").tabIds,
    ).toEqual(["styles", "data", "animation", "advanced"]);
  });

  test("the advanced tab stays open while the selected component has it", () => {
    expect(resolvePanelTabs([advancedField], "advanced").activeTab).toBe(
      "advanced",
    );
  });

  test("selecting a component without the advanced tab while on it opens styles", () => {
    expect(resolvePanelTabs([stylesField, dataField], "advanced")).toEqual({
      tabIds: ["styles", "data", "animation"],
      activeTab: "styles",
    });
  });

  test("a component with no fields still shows the three tabs", () => {
    expect(resolvePanelTabs([], "data")).toEqual({
      tabIds: ["styles", "data", "animation"],
      activeTab: "data",
    });
  });
});
