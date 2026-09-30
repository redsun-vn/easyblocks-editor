import React, { useCallback, useEffect, useRef, useState } from "react";
import { EditorContextType } from "../EditorContext";
import { beginResizeDrag } from "./canvas-resize-drag-start";
import type { CanvasResizeField } from "./canvas-resize-fields";
import { nearestResizeStep, targetSizeFromDrag } from "./resize-step-resolver";
import { useEscapeWhileDragging } from "./use-escape-while-dragging";
import { writeResizeStep } from "./canvas-resize-parent-switch";
import type {
  Drag,
  ResizeEdge,
  ResizeReading,
} from "./canvas-resize-drag-types";

export type { ResizeEdge, ResizeReading };

/**
 * One drag of a resize handle, from press to release.
 *
 * A span whose block says how its grid lays out (`previewSpans`) is drawn
 * straight onto the canvas while the pointer moves, and written once, on
 * release: a write runs the whole editor, far too slow to follow a pointer.
 * Any other size is written each time the edge reaches another value, so the
 * page reflows under the pointer. Either way the first write makes an undo
 * step and the rest fold into it, which is what makes a whole drag one Ctrl+Z.
 * Esc puts the stored value back, byte for byte, rather than writing the value
 * it showed.
 */
export function useCanvasResizeDrag({
  resizeField,
  path,
  editorContext,
  configAfterAuto,
  gestureHasWritten,
}: {
  /** Absent when the block has no field for this axis; the hook then does nothing. */
  resizeField: CanvasResizeField | undefined;
  path: string;
  editorContext: EditorContextType;
  configAfterAuto: Record<string, any>;
  /**
   * Whether the gesture has written yet, shared by the hooks one gesture
   * drives: a corner moves a width and a height, and both belong to the same
   * undo step.
   */
  gestureHasWritten: { current: boolean };
}) {
  const drag = useRef<Drag | null>(null);
  const [reading, setReading] = useState<ResizeReading | null>(null);

  const write = (current: Drag, value: string) =>
    resizeField &&
    writeResizeStep({
      drag: current,
      value,
      resizeField,
      editorContext,
      configAfterAuto,
      gestureHasWritten,
    });

  const end = useCallback(() => {
    drag.current = null;
    setReading(null);
  }, []);

  // Release: a drawn drag writes where it stopped, then leaves the drawing in
  // place until the canvas has drawn the same thing.
  const finish = () => {
    const current = drag.current;

    if (current?.preview) {
      if (current.lastValue !== current.startValue) {
        write(current, current.lastValue);
        current.preview.handOver();
      } else {
        current.preview.clear();
      }
    }

    end();
  };

  const cancel = useCallback(() => {
    const current = drag.current;

    current?.preview?.clear();

    if (current?.hasWritten) {
      editorContext.actions.runChange(
        () => {
          editorContext.form.change(
            current.restorePath,
            current.originalRawValue,
          );
        },
        { history: "replace" },
      );
    }

    end();
  }, [editorContext, end]);

  useEscapeWhileDragging(reading !== null, cancel);

  // A handle that goes away mid-drag — another block selected, the edge no
  // longer offered — never hears the release. What it drew is only a drawing,
  // nothing was written for it, so it goes with the handle.
  useEffect(() => () => drag.current?.preview?.clear(), []);

  const onPointerDown = (edge: ResizeEdge) => (event: React.PointerEvent) => {
    const started =
      resizeField &&
      beginResizeDrag({
        edge,
        event,
        resizeField,
        path,
        editorContext,
        configAfterAuto,
      });

    if (!started) {
      return;
    }

    gestureHasWritten.current = false;
    drag.current = started;
    setReading({ edge, label: started.geometry.describe(started.startValue) });
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const current = drag.current;

    // No button held means this is a hover, not a drag, whatever state says.
    if (
      !current ||
      !resizeField ||
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

    // A block that cannot say how this value lays out is written instead,
    // for the rest of the drag.
    if (current.preview && !current.preview.show(step.value)) {
      current.preview.clear();
      current.preview = null;
    }

    if (!current.preview) {
      write(current, step.value);
    }

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
      onPointerUp: finish,
      // Losing the pointer — the handle re-rendered away, the window lost
      // focus — ends the drag where it stands rather than leaving it armed.
      onLostPointerCapture: finish,
      onPointerCancel: cancel,
    },
  };
}
