import { toArray } from "@/utils/array/toArray";
import { dotNotationGet } from "@/utils/object/dotNotationGet";
import type React from "react";
import type { EditorContextType } from "../EditorContext";
import type { Drag, ResizeEdge } from "./canvas-resize-drag-types";
import { CanvasResizeField, canvasResizeChoices } from "./canvas-resize-fields";
import { readResizeGeometry } from "./canvas-resize-geometry";
import { pendingSwitch } from "./canvas-resize-parent-switch";
import { startSpanPreview } from "./canvas-span-preview";
import { nearestResizeStep } from "./resize-step-resolver";

/**
 * A press on a resize handle, turned into a drag: the page measured as drawn
 * now, the value it starts from, what Esc would put back, and — for a span
 * the block can draw — the preview that stands in for writing.
 *
 * `null` when the press is not a drag: not the main button, or nothing on the
 * page a drag could change. The pointer is captured only for a real drag.
 */
export function beginResizeDrag({
  edge,
  event,
  resizeField,
  path,
  editorContext,
  configAfterAuto,
}: {
  edge: ResizeEdge;
  event: React.PointerEvent;
  resizeField: CanvasResizeField;
  path: string;
  editorContext: EditorContextType;
  configAfterAuto: Record<string, any>;
}): Drag | null {
  const choices = canvasResizeChoices(resizeField, editorContext.types);
  const pending = pendingSwitch(resizeField, path, editorContext.form.values);
  const geometry = readResizeGeometry({
    path,
    axis: resizeField.option.axis,
    choices,
    switchedTracks: pending?.tracks,
  });
  const restorePath = pending
    ? pending.parentPath
    : toArray(resizeField.field.name)[0];
  const start = geometry && nearestResizeStep(geometry.steps, geometry.size);

  if (!geometry || !start || event.button !== 0) {
    return null;
  }

  event.preventDefault();
  event.stopPropagation();

  const handle = event.currentTarget as HTMLElement;
  const layer = handle.offsetParent as HTMLElement | null;
  handle.setPointerCapture(event.pointerId);

  return {
    edge,
    pointerId: event.pointerId,
    startPointer: edge === "bottom" ? event.clientY : event.clientX,
    scale:
      layer && layer.offsetWidth > 0
        ? layer.getBoundingClientRect().width / layer.offsetWidth
        : 1,
    geometry,
    choices: new Map(choices.map((choice) => [choice.key, choice])),
    startValue: start.value,
    lastValue: start.value,
    hasWritten: false,
    pending,
    restorePath,
    originalRawValue: dotNotationGet(editorContext.form.values, restorePath),
    preview: startSpanPreview({
      resizeField,
      path,
      configAfterAuto,
      breakpointIndex: editorContext.breakpointIndex,
      switchOn: pending !== null,
    }),
  };
}
