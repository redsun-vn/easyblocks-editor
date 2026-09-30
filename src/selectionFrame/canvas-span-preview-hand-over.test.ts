/**
 * @jest-environment jsdom
 */
import { handOverToCanvas } from "./canvas-span-preview-hand-over";

const POSITION = {
  type: "@easyblocks-editor/selection-frame-position-changed",
};

/** A page whose widths are what the drawing or the stored values make them. */
function page({ before, drawn }: { before: number[]; drawn: number[] }) {
  const canvas = document.createElement("iframe");
  document.body.appendChild(canvas);

  const state = { drawing: true, rendered: before };
  const handOver = () =>
    handOverToCanvas({
      view: canvas.contentWindow!,
      draw: () => (state.drawing = true),
      undraw: () => (state.drawing = false),
      widths: () => (state.drawing ? drawn : state.rendered),
      isConnected: () => true,
      onGiveUp: () => {},
    });
  const canvasSays = () =>
    window.dispatchEvent(
      new MessageEvent("message", {
        data: POSITION,
        source: canvas.contentWindow,
      }),
    );

  return { state, handOver, canvasSays };
}

afterEach(() => jest.useRealTimers());

describe("handOverToCanvas", () => {
  test("keeps the drawing while the canvas has not rendered the write", () => {
    const { state, handOver, canvasSays } = page({
      before: [300, 600],
      drawn: [400, 500],
    });

    handOver();
    canvasSays();

    expect(state.drawing).toBe(true);
  });

  test("lets go once the page looks like the drawing", () => {
    const { state, handOver, canvasSays } = page({
      before: [300, 600],
      drawn: [400, 500],
    });

    handOver();
    state.rendered = [400, 500];
    canvasSays();

    expect(state.drawing).toBe(false);

    // Later messages change nothing: the hand-over is over.
    state.rendered = [300, 600];
    canvasSays();
    expect(state.drawing).toBe(false);
  });

  test("lets go when something else has changed the page since — an undo", () => {
    const { state, handOver, canvasSays } = page({
      before: [300, 600],
      drawn: [400, 500],
    });

    handOver();
    state.rendered = [450, 450];
    canvasSays();

    expect(state.drawing).toBe(false);
  });

  test("messages that are not the canvas's own change nothing", () => {
    const { state, handOver } = page({ before: [300, 600], drawn: [400, 500] });

    handOver();
    state.rendered = [450, 450];
    window.dispatchEvent(
      new MessageEvent("message", { data: POSITION, source: window }),
    );

    expect(state.drawing).toBe(true);
  });

  test("gives up after a while, and stopping it takes the drawing away", () => {
    jest.useFakeTimers();
    const onGiveUp = jest.fn();
    const first = page({ before: [300], drawn: [400] });
    const canvas = document.createElement("iframe");
    document.body.appendChild(canvas);

    handOverToCanvas({
      view: canvas.contentWindow!,
      draw: () => (first.state.drawing = true),
      undraw: () => (first.state.drawing = false),
      widths: () => [first.state.drawing ? 400 : 300],
      isConnected: () => true,
      onGiveUp,
    });
    jest.runAllTimers();
    expect(first.state.drawing).toBe(false);
    expect(onGiveUp).toHaveBeenCalled();

    const second = page({ before: [300], drawn: [400] });
    const stop = second.handOver();
    stop();
    expect(second.state.drawing).toBe(false);
  });
});
