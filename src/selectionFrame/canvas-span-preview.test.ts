/**
 * @jest-environment jsdom
 */
import { CANVAS_FRAME_PATH_ATTRIBUTE } from "../EditableComponentBuilder/canvasLayers";
import type { CanvasResizeField } from "./canvas-resize-fields";
import { startSpanPreview } from "./canvas-span-preview";

if (typeof (globalThis as any).CSS === "undefined") {
  (globalThis as any).CSS = { escape: (value: string) => value };
}

const spanOf = (value: unknown) => ({
  _itemProps: { BlockRow: { Cells: { span: value } } },
});

const configAfterAuto = {
  data: [
    {
      twelveColumnGrid: true,
      Cells: [spanOf("6"), spanOf("auto"), spanOf("auto")],
    },
  ],
};

/** A row drawn the way BlockRow draws one: a grid, one wrapper per column. */
function drawCanvas() {
  document.body.innerHTML = "";
  const iframe = document.createElement("iframe");
  iframe.id = "editor-canvas";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  const grid = doc.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(12, minmax(0, 1fr))";

  const wrappers = [0, 1, 2].map((index) => {
    const wrapper = doc.createElement("div");
    const frame = doc.createElement("div");
    frame.setAttribute(CANVAS_FRAME_PATH_ATTRIBUTE, `data.0.Cells.${index}`);
    wrapper.appendChild(frame);
    grid.appendChild(wrapper);
    return wrapper;
  });

  doc.body.appendChild(grid);

  return { iframe, grid, wrappers };
}

const fieldWith = (
  previewSpans: CanvasResizeField["option"]["previewSpans"],
): CanvasResizeField =>
  ({
    field: { name: "data.0.Cells.0._itemProps.BlockRow.Cells.span" },
    option: { axis: "x", previewSpans },
  }) as unknown as CanvasResizeField;

/** The rule a row with shared columns follows: the numbered one first. */
const shareTheRest = jest.fn(({ values }: { values: Array<unknown> }) => {
  const first = Number(values[0]);
  const rest = 12 - first;
  return {
    tracks: 12,
    spans: [first, Math.ceil(rest / 2), Math.floor(rest / 2)],
  };
});

const start = (field = fieldWith(shareTheRest), switchOn = false) =>
  startSpanPreview({
    resizeField: field,
    path: "data.0.Cells.0",
    configAfterAuto,
    breakpointIndex: "xl",
    switchOn,
  });

beforeEach(() => {
  jest.useRealTimers();
  shareTheRest.mockClear();
});

describe("startSpanPreview", () => {
  test("draws every column of the grid from the block's own rule", () => {
    const { grid, wrappers } = drawCanvas();
    const post = jest.spyOn(window, "postMessage");

    expect(start()!.show("8")).toBe(true);

    expect(shareTheRest).toHaveBeenCalledWith({
      parent: expect.objectContaining({ twelveColumnGrid: true }),
      values: ["8", "auto", "auto"],
      index: 0,
      switchOn: false,
    });
    expect(grid.style.gridTemplateColumns).toBe("repeat(12, minmax(0, 1fr))");
    expect(wrappers.map((wrapper) => wrapper.style.gridColumn)).toEqual([
      "span 8",
      "span 2",
      "span 2",
    ]);
    // The frame and the handles hear about the move without a canvas render.
    expect(post).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "@easyblocks-editor/selection-frame-position-changed",
      }),
      "*",
    );
    post.mockRestore();
  });

  test("tells the rule the drag will switch the parent's grid on", () => {
    drawCanvas();
    start(fieldWith(shareTheRest), true)!.show("7");

    expect(shareTheRest.mock.calls[0][0]).toMatchObject({ switchOn: true });
  });

  test("a block with no rule is not drawn, so the drag writes instead", () => {
    drawCanvas();
    expect(start(fieldWith(undefined))).toBeNull();
  });

  test("a rule that cannot answer leaves the grid alone", () => {
    const { wrappers } = drawCanvas();
    const preview = start(fieldWith(() => null))!;

    expect(preview.show("8")).toBe(false);
    expect(wrappers.map((wrapper) => wrapper.style.gridColumn)).toEqual([
      "",
      "",
      "",
    ]);
  });

  test("an answer for the wrong number of columns is not drawn", () => {
    drawCanvas();
    const preview = start(fieldWith(() => ({ tracks: 12, spans: [12] })))!;

    expect(preview.show("12")).toBe(false);
  });

  test("clearing puts back exactly the styles the grid had", () => {
    const { grid, wrappers } = drawCanvas();
    wrappers[2].style.gridColumn = "span 3";
    const preview = start()!;

    preview.show("10");
    preview.clear();

    expect(grid.style.gridTemplateColumns).toBe("repeat(12, minmax(0, 1fr))");
    expect(wrappers.map((wrapper) => wrapper.style.gridColumn)).toEqual([
      "",
      "",
      "span 3",
    ]);
  });

  test("after release the drawing stays until the canvas has drawn the page", () => {
    const { iframe, wrappers } = drawCanvas();
    const preview = start()!;

    preview.show("8");
    preview.handOver();

    // The editor's own announcement is not the canvas catching up.
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { type: "@easyblocks-editor/selection-frame-position-changed" },
        source: window,
      }),
    );
    expect(wrappers[0].style.gridColumn).toBe("span 8");

    window.dispatchEvent(
      new MessageEvent("message", {
        data: { type: "@easyblocks-editor/selection-frame-position-changed" },
        source: iframe.contentWindow,
      }),
    );
    expect(wrappers[0].style.gridColumn).toBe("");
  });

  test("a canvas that never catches up does not keep the drawing forever", () => {
    jest.useFakeTimers();
    const { wrappers } = drawCanvas();
    const preview = start()!;

    preview.show("8");
    preview.handOver();
    expect(wrappers[0].style.gridColumn).toBe("span 8");

    jest.runAllTimers();
    expect(wrappers[0].style.gridColumn).toBe("");
  });

  test("a drag started while the last one hands over never keeps its drawing", () => {
    const { grid, wrappers } = drawCanvas();
    const first = start()!;

    first.show("8");
    first.handOver();

    const second = start()!;
    // The first drawing went before the second drag measured the grid.
    expect(wrappers.map((wrapper) => wrapper.style.gridColumn)).toEqual([
      "",
      "",
      "",
    ]);

    second.show("10");
    second.clear();

    expect(grid.style.gridTemplateColumns).toBe("repeat(12, minmax(0, 1fr))");
    expect(wrappers.map((wrapper) => wrapper.style.gridColumn)).toEqual([
      "",
      "",
      "",
    ]);
  });

  test("a grid that is not found draws nothing", () => {
    document.body.innerHTML = "";
    expect(start()).toBeNull();
  });
});
