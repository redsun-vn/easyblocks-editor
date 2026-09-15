import { getCanvasLayers } from "./canvasLayers";

function createElement(attributes: Record<string, string>): Element {
  return {
    getAttribute: (name: string) => attributes[name] ?? null,
  } as unknown as Element;
}

describe("getCanvasLayers", () => {
  test("keeps only selection frames, topmost first", () => {
    const elementsUnderPointer = [
      createElement({ class: "heading" }),
      createElement({
        "data-easyblocks-path": "data.0.Content.0.Items.0",
        "data-easyblocks-label": "Text",
      }),
      createElement({ class: "stack-item" }),
      createElement({
        "data-easyblocks-path": "data.0.Content.0",
        "data-easyblocks-label": "Stack",
      }),
      createElement({ id: "body" }),
    ];

    expect(getCanvasLayers(elementsUnderPointer)).toEqual([
      { path: "data.0.Content.0.Items.0", label: "Text" },
      { path: "data.0.Content.0", label: "Stack" },
    ]);
  });

  test("falls back to the path when a frame has no label", () => {
    expect(
      getCanvasLayers([createElement({ "data-easyblocks-path": "data.0" })]),
    ).toEqual([{ path: "data.0", label: "data.0" }]);
  });
});
