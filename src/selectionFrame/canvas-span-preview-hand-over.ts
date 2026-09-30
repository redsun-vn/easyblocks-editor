import { isPositionChanged } from "./resize-handles-helpers";

/** How long a committed drag's drawing may wait for the canvas to catch up. */
const HAND_OVER_TIMEOUT_MS = 2000;

/**
 * Keeps a released drag's drawing on the canvas until the canvas has rendered
 * the written value itself, then takes it away.
 *
 * Taking it away at once would show the old widths for as long as the editor
 * takes to render the write. The canvas sends a position message after every
 * render, and each one is a chance to look at the page without the drawing:
 * - it matches the drawing — the write has landed, and the drawing goes;
 * - it still matches the page from before the write — not rendered yet, so
 *   the drawing goes back until the next message;
 * - it matches neither — something else changed the page since (an undo, a
 *   panel edit), and the drawing must not cover that up.
 *
 * Returns what stops the hand-over at once and takes the drawing away.
 */
export function handOverToCanvas({
  view,
  draw,
  undraw,
  widths,
  isConnected,
  onGiveUp,
}: {
  /** The canvas window, the only sender whose messages mean it rendered. */
  view: Window;
  draw: () => void;
  undraw: () => void;
  widths: () => Array<number>;
  isConnected: () => boolean;
  /** Runs when the canvas never caught up, after the drawing was taken away. */
  onGiveUp: () => void;
}): () => void {
  const expected = widths();
  undraw();
  const before = widths();
  draw();

  const matches = (now: Array<number>, other: Array<number>) =>
    now.every((width, index) => Math.abs(width - other[index]) < 1);

  const stop = () => {
    window.removeEventListener("message", onMessage);
    window.clearTimeout(timer);
  };

  function onMessage(event: MessageEvent) {
    if (event.source !== view || !isPositionChanged(event.data)) {
      return;
    }

    if (!isConnected()) {
      stop();
      return;
    }

    undraw();
    const now = widths();

    if (matches(now, expected) || !matches(now, before)) {
      stop();
    } else {
      draw();
    }
  }

  const timer = window.setTimeout(() => {
    stop();
    undraw();
    onGiveUp();
  }, HAND_OVER_TIMEOUT_MS);

  window.addEventListener("message", onMessage);

  return () => {
    stop();
    undraw();
  };
}
