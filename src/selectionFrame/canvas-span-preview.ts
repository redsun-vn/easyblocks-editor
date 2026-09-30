import { selectionFramePositionChanged } from "@redsun-vn/easyblocks-core/_internals";
import { findGridItem } from "./canvas-grid-span-geometry";
import { findCanvasFrame } from "./canvas-resize-geometry";
import type { CanvasResizeField } from "./canvas-resize-fields";
import { handOverToCanvas } from "./canvas-span-preview-hand-over";
import { readSpanPreviewInput } from "./canvas-span-preview-input";

/**
 * The hand-over still waiting on each grid. A drag that starts before the
 * last one handed over would otherwise take that drawing for the grid's own
 * styles, and put it back when it ends.
 */
const handOversInProgress = new WeakMap<HTMLElement, () => void>();

export type SpanPreview = {
  /** Draws the grid as it would be with `value`; `false` when the block could not say. */
  show: (value: string) => boolean;
  /** Takes the drawing away: the page goes back to what the stored values draw. */
  clear: () => void;
  /**
   * Keeps the drawing until the canvas has drawn the written value itself, then
   * takes it away. Taking it away earlier would show the old widths for as long
   * as the editor takes to render the write.
   */
  handOver: () => void;
};

/**
 * A span drag drawn straight onto the canvas's grid, without writing.
 *
 * Every write runs the whole editor — compile, panel, canvas — which takes a
 * few hundred milliseconds, far longer than a pointer waits between moves.
 * The grid's own inline styles take a frame. What they say comes from the
 * block's `previewSpans`, its own layout rule, so siblings that share what is
 * left of a row move the way the written value will move them.
 *
 * Returns `null` when the field has no such rule or the grid cannot be found;
 * the drag then writes every step as before.
 */
export function startSpanPreview({
  resizeField,
  path,
  configAfterAuto,
  breakpointIndex,
  switchOn,
}: {
  resizeField: CanvasResizeField;
  path: string;
  configAfterAuto: Record<string, any>;
  breakpointIndex: string;
  switchOn: boolean;
}): SpanPreview | null {
  const previewSpans = resizeField.option.previewSpans;
  const fieldName = resizeField.field.name;

  if (!previewSpans || typeof fieldName !== "string") {
    return null;
  }

  const input = readSpanPreviewInput({
    fieldName,
    path,
    configAfterAuto,
    breakpointIndex,
  });
  const selected = findCanvasFrame(path);

  if (!input || !selected) {
    return null;
  }

  // Every item's box on the grid, in collection order: the item a span sits
  // on is the grid's child, which may wrap the item's frame.
  const grid = findGridItem(selected.frame, selected.view)?.grid;
  const items = input.values.map((_, index) => {
    const found = findCanvasFrame(`${input.collectionPath}.${index}`);
    const gridItem = found && findGridItem(found.frame, found.view);
    return gridItem && gridItem.grid === grid ? gridItem.item : null;
  });

  if (!grid || items.some((item) => item === null)) {
    return null;
  }

  const gridBox: HTMLElement = grid;
  const boxes = items as Array<HTMLElement>;

  handOversInProgress.get(gridBox)?.();
  handOversInProgress.delete(gridBox);
  const original = {
    tracks: gridBox.style.gridTemplateColumns,
    spans: boxes.map((box) => box.style.gridColumn),
  };
  let drawn: { tracks: number; spans: Array<number> } | null = null;
  let stopHandOver: (() => void) | null = null;

  const draw = (layout: { tracks: number; spans: Array<number> }) => {
    gridBox.style.gridTemplateColumns = `repeat(${layout.tracks}, minmax(0, 1fr))`;
    boxes.forEach((box, index) => {
      box.style.gridColumn = `span ${layout.spans[index]}`;
    });
  };

  const undraw = () => {
    gridBox.style.gridTemplateColumns = original.tracks;
    boxes.forEach((box, index) => {
      box.style.gridColumn = original.spans[index];
    });
  };

  // The frame, the action bar and the handles hang from the canvas's position
  // messages, and the canvas sends none for a change it did not render. The
  // editor says it on the canvas's behalf, in the canvas's own coordinates.
  const announcePosition = () => {
    const container = selected.frame
      .closest("[data-easyblocks-scrollable-root]")
      ?.getBoundingClientRect();

    window.postMessage(
      selectionFramePositionChanged(
        selected.frame.getBoundingClientRect(),
        container,
      ),
      "*",
    );
  };

  return {
    show(value) {
      const values = [...input.values];
      values[input.index] = value;

      const layout = previewSpans({
        parent: input.parent,
        values,
        index: input.index,
        switchOn,
      });

      if (!layout || layout.spans.length !== boxes.length) {
        return false;
      }

      drawn = layout;
      draw(layout);
      announcePosition();
      return true;
    },

    clear() {
      stopHandOver?.();
      undraw();
      announcePosition();
    },

    handOver() {
      if (!drawn) {
        undraw();
        return;
      }

      const layout = drawn;
      const finish = handOverToCanvas({
        view: selected.view,
        draw: () => draw(layout),
        undraw,
        widths: () => boxes.map((box) => box.getBoundingClientRect().width),
        isConnected: () => gridBox.isConnected,
        onGiveUp: announcePosition,
      });

      stopHandOver = finish;
      handOversInProgress.set(gridBox, finish);
    },
  };
}
