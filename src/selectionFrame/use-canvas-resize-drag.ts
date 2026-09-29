import { toArray } from "@/utils/array/toArray";
import { dotNotationGet } from "@/utils/object/dotNotationGet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { EditorContextType } from "../EditorContext";
import {
  CanvasResizeField,
  canvasResizeValues,
  writeCanvasResizeValue,
} from "./canvas-resize-fields";
import { readResizeGeometry, ResizeGeometry } from "./canvas-resize-geometry";
import { nearestResizeStep, targetSizeFromDrag } from "./resize-step-resolver";

export type ResizeEdge = "left" | "right" | "bottom";

/** What the chip beside the dragged edge says while a drag is on. */
export type ResizeReading = { edge: ResizeEdge; label: string };

type Drag = {
  edge: ResizeEdge;
  pointerId: number;
  startPointer: number;
  /** Canvas pixels per screen pixel: the canvas is drawn scaled by the zoom. */
  scale: number;
  geometry: ResizeGeometry;
  lastValue: string;
  hasWritten: boolean;
  /** The field's stored value before the drag, to put back on Esc. */
  originalRawValue: unknown;
};

function canvasWindow(): Window | null {
  const iframe = document.getElementById(
    "editor-canvas",
  ) as HTMLIFrameElement | null;
  return iframe?.contentWindow ?? null;
}

/**
 * One drag of a resize handle, from press to release.
 *
 * Each time the edge reaches another value the field is written, so the page
 * reflows under the pointer. The first write makes an undo step and the rest
 * fold into it, which is what makes a whole drag one Ctrl+Z. Esc puts the
 * stored value back, byte for byte, rather than writing the value it showed.
 */
export function useCanvasResizeDrag({
  resizeField,
  path,
  editorContext,
  configAfterAuto,
}: {
  resizeField: CanvasResizeField;
  path: string;
  editorContext: EditorContextType;
  configAfterAuto: Record<string, any>;
}) {
  const drag = useRef<Drag | null>(null);
  const [reading, setReading] = useState<ResizeReading | null>(null);
  const fieldName = toArray(resizeField.field.name)[0];

  const end = useCallback(() => {
    drag.current = null;
    setReading(null);
  }, []);

  const cancel = useCallback(() => {
    const current = drag.current;

    if (current?.hasWritten) {
      editorContext.actions.runChange(
        () => {
          editorContext.form.change(fieldName, current.originalRawValue);
        },
        { history: "replace" },
      );
    }

    end();
  }, [editorContext, fieldName, end]);

  // Esc is heard in the canvas too: focus stays there after a block is picked
  // by clicking it, and the canvas's own Esc would otherwise select the parent
  // and take the handle away mid-drag.
  useEffect(() => {
    if (!reading) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        event.preventDefault();
        cancel();
      }
    };

    const targets = [window, canvasWindow()].filter(
      (target): target is Window => target !== null,
    );

    targets.forEach((target) =>
      target.addEventListener("keydown", onKeyDown, true),
    );

    return () =>
      targets.forEach((target) =>
        target.removeEventListener("keydown", onKeyDown, true),
      );
  }, [reading, cancel]);

  const onPointerDown = (edge: ResizeEdge) => (event: React.PointerEvent) => {
    const geometry = readResizeGeometry({
      path,
      axis: resizeField.option.axis,
      values: canvasResizeValues(resizeField),
    });
    const start = geometry && nearestResizeStep(geometry.steps, geometry.size);

    if (!geometry || !start || event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const handle = event.currentTarget as HTMLElement;
    const layer = handle.offsetParent as HTMLElement | null;
    handle.setPointerCapture(event.pointerId);

    drag.current = {
      edge,
      pointerId: event.pointerId,
      startPointer: edge === "bottom" ? event.clientY : event.clientX,
      scale:
        layer && layer.offsetWidth > 0
          ? layer.getBoundingClientRect().width / layer.offsetWidth
          : 1,
      geometry,
      lastValue: start.value,
      hasWritten: false,
      originalRawValue: dotNotationGet(editorContext.form.values, fieldName),
    };

    setReading({ edge, label: geometry.describe(start.value) });
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const current = drag.current;

    // No button held means this is a hover, not a drag, whatever state says.
    if (
      !current ||
      current.pointerId !== event.pointerId ||
      (event.buttons & 1) === 0
    ) {
      return;
    }

    const pointer = current.edge === "bottom" ? event.clientY : event.clientX;
    const step = nearestResizeStep(
      current.geometry.steps,
      targetSizeFromDrag({
        startSize: current.geometry.size,
        pointerDelta: (pointer - current.startPointer) / current.scale,
        edge: current.edge,
      }),
    );

    if (!step || step.value === current.lastValue) {
      return;
    }

    writeCanvasResizeValue({
      field: resizeField.field,
      value: step.value,
      editorContext,
      configAfterAuto,
      history: current.hasWritten ? "replace" : "push",
    });
    current.hasWritten = true;
    current.lastValue = step.value;
    setReading({
      edge: current.edge,
      label: current.geometry.describe(step.value),
    });
  };

  return {
    reading,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      // Losing the pointer — the handle re-rendered away, the window lost
      // focus — ends the drag where it stands rather than leaving it armed.
      onLostPointerCapture: end,
      onPointerCancel: cancel,
    },
  };
}
