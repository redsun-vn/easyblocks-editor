/**
 * @jest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import type { EditorContextType } from "../EditorContext";
import type { CanvasResizeField } from "./canvas-resize-fields";
import { writeCanvasResizeValue } from "./canvas-resize-fields";
import { startSpanPreview } from "./canvas-span-preview";
import { useCanvasResizeDrag } from "./use-canvas-resize-drag";

jest.mock("./canvas-resize-fields", () => ({
  canvasResizeChoices: () =>
    ["4", "6", "8"].map((key) => ({ key, value: key, css: key, label: key })),
  writeCanvasResizeValue: jest.fn(),
}));

// Three steps a hundred pixels apart, the block drawn at the middle one.
jest.mock("./canvas-resize-geometry", () => ({
  readResizeGeometry: () => ({
    size: 600,
    steps: [
      { value: "4", size: 500 },
      { value: "6", size: 600 },
      { value: "8", size: 700 },
    ],
    describe: (value: string) => `${value}/12`,
  }),
}));

jest.mock("./canvas-resize-parent-switch", () => ({
  ...jest.requireActual("./canvas-resize-parent-switch"),
  pendingSwitch: jest.fn(() => null),
}));

// The row's own switch field, as the panel builds it.
jest.mock("../buildTinaFields", () => ({
  buildTinaFieldsForSelection: () => [
    {
      name: "data.0.twelveColumnGrid",
      schemaProp: { prop: "twelveColumnGrid" },
    },
  ],
}));

jest.mock("./canvas-span-preview", () => ({ startSpanPreview: jest.fn() }));

const write = writeCanvasResizeValue as jest.Mock;
const preview = { show: jest.fn(), clear: jest.fn(), handOver: jest.fn() };

const editorContext = {
  types: {},
  breakpointIndex: "xl",
  form: { values: {}, change: jest.fn() },
  actions: { runChange: jest.fn() },
} as unknown as EditorContextType;

const spanField = {
  field: { name: "data.0.Cells.0._itemProps.BlockRow.Cells.span" },
  option: { axis: "x" },
} as unknown as CanvasResizeField;

const pointer = (clientX: number, extra: Record<string, unknown> = {}) =>
  ({
    button: 0,
    buttons: 1,
    pointerId: 1,
    clientX,
    clientY: 0,
    preventDefault: () => {},
    stopPropagation: () => {},
    currentTarget: { setPointerCapture: () => {}, offsetParent: null },
    ...extra,
  }) as unknown as React.PointerEvent;

function drag() {
  const { result } = renderHook(() =>
    useCanvasResizeDrag({
      resizeField: spanField,
      path: "data.0.Cells.0",
      editorContext,
      configAfterAuto: {},
      gestureHasWritten: { current: false },
    }),
  );

  act(() => result.current.handlers.onPointerDown("right")(pointer(0)));

  return {
    result,
    moveTo: (clientX: number) =>
      act(() => result.current.handlers.onPointerMove(pointer(clientX))),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  preview.show.mockReturnValue(true);
  (startSpanPreview as jest.Mock).mockReturnValue(preview);
});

describe("a span drag the block can draw", () => {
  test("writes nothing while the pointer moves, and once on release", () => {
    const { result, moveTo } = drag();

    moveTo(100);
    moveTo(-100);
    moveTo(100);

    expect(preview.show.mock.calls.map(([value]) => value)).toEqual([
      "8",
      "4",
      "8",
    ]);
    expect(write).not.toHaveBeenCalled();
    expect(result.current.reading?.label).toBe("8/12");

    act(() => result.current.handlers.onPointerUp());

    expect(write).toHaveBeenCalledTimes(1);
    expect(write.mock.calls[0][0]).toMatchObject({
      value: "8",
      history: "push",
    });
    expect(preview.handOver).toHaveBeenCalledTimes(1);
    expect(result.current.reading).toBeNull();
  });

  test("the switch the drag needs goes on in the same undo step, on release", () => {
    const { pendingSwitch } = jest.requireMock("./canvas-resize-parent-switch");
    pendingSwitch.mockReturnValueOnce({
      parentPath: "data.0",
      prop: "twelveColumnGrid",
      tracks: 12,
    });
    const { result, moveTo } = drag();

    moveTo(100);
    expect(write).not.toHaveBeenCalled();

    act(() => result.current.handlers.onPointerUp());

    expect(
      write.mock.calls.map(([input]) => [input.value, input.history]),
    ).toEqual([
      [true, "push"],
      ["8", "replace"],
    ]);
  });

  test("a release where it started writes nothing and takes the drawing away", () => {
    const { result, moveTo } = drag();

    moveTo(100);
    moveTo(0);
    act(() => result.current.handlers.onPointerUp());
    // The capture ends right after the release; the drag is already over.
    act(() => result.current.handlers.onLostPointerCapture());

    expect(write).not.toHaveBeenCalled();
    expect(preview.clear).toHaveBeenCalledTimes(1);
    expect(preview.handOver).not.toHaveBeenCalled();
  });

  test("cancelling takes the drawing away and writes nothing", () => {
    const { result, moveTo } = drag();

    moveTo(100);
    act(() => result.current.handlers.onPointerCancel());

    expect(preview.clear).toHaveBeenCalled();
    expect(write).not.toHaveBeenCalled();
    expect(editorContext.actions.runChange).not.toHaveBeenCalled();
  });

  test("a step the block cannot draw is written, and so is the rest of the drag", () => {
    preview.show.mockReturnValue(false);
    const { result, moveTo } = drag();

    moveTo(100);
    moveTo(-100);

    expect(write.mock.calls.map(([input]) => input.value)).toEqual(["8", "4"]);
    expect(preview.show).toHaveBeenCalledTimes(1);

    act(() => result.current.handlers.onPointerUp());
    expect(write).toHaveBeenCalledTimes(2);
  });
});

test("a handle that goes away mid-drag takes its drawing with it", () => {
  const { result, unmount } = renderHook(() =>
    useCanvasResizeDrag({
      resizeField: spanField,
      path: "data.0.Cells.0",
      editorContext,
      configAfterAuto: {},
      gestureHasWritten: { current: false },
    }),
  );

  act(() => result.current.handlers.onPointerDown("right")(pointer(0)));
  act(() => result.current.handlers.onPointerMove(pointer(100)));
  expect(preview.clear).not.toHaveBeenCalled();

  unmount();

  expect(preview.clear).toHaveBeenCalledTimes(1);
  expect(write).not.toHaveBeenCalled();
});

test("a block that cannot draw its spans is written at every step", () => {
  (startSpanPreview as jest.Mock).mockReturnValue(null);
  const { result, moveTo } = drag();

  moveTo(100);
  expect(write).toHaveBeenCalledTimes(1);

  act(() => result.current.handlers.onPointerUp());
  expect(write).toHaveBeenCalledTimes(1);
});
