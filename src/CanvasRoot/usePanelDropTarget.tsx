import React, { useCallback, useEffect, useState } from "react";
import { CANVAS_FRAME_PATH_ATTRIBUTE } from "../EditableComponentBuilder/canvasLayers";
import {
  isPanelDrag,
  PANEL_DROP_MESSAGE,
  resolvePanelDropTarget,
  type PanelDropMessage,
  type PanelDropTarget,
} from "../editorSidebar/editorSections/panelDrag";

/**
 * Receiving an item dragged out of a sidebar panel.
 *
 * The panel lives in the parent window and the canvas in an iframe, so the
 * `@dnd-kit` context that moves blocks around inside the canvas cannot see this
 * gesture at all — its sensors read pointer events, and a pointer event belongs
 * to one document. Native drag events are the exception that crosses the
 * boundary, so this listens for those.
 *
 * It only ever answers with a position. Which item is being dragged stays in
 * the panel: a browser withholds a drag's contents until the drop, so there is
 * nothing here to read at the moment the canvas has to decide whether to accept
 * one anyway.
 */

/** Every top-level section, in document order, with the rectangle it occupies. */
function readSectionRects(doc: Document) {
  return Array.from(
    doc.querySelectorAll(`[${CANVAS_FRAME_PATH_ATTRIBUTE}]`),
  )
    .flatMap((element) => {
      const path = element.getAttribute(CANVAS_FRAME_PATH_ATTRIBUTE);
      const index = path?.match(/^data\.(\d+)$/)?.[1];

      // Only the root collection. A frame deeper in the tree carries a longer
      // path, and dropping a section inside another block is not a thing the
      // root collection can express.
      if (index === undefined) {
        return [];
      }

      const rect = element.getBoundingClientRect();

      return [{ index: Number(index), top: rect.top, bottom: rect.bottom }];
    })
    .sort((a, b) => a.index - b.index);
}

const ACCENT = "#7B70F5";

/**
 * What the canvas looks like while it is willing to take the item.
 *
 * The insertion line alone says where, but it does not say *whether*: with only
 * a line, a drag that the canvas never saw looks exactly like one it is about
 * to accept, because both show nothing until the line appears. The frame is the
 * answer to "will this work at all", and the line is the answer to "where".
 * Anywhere without the frame — the sidebar, the top bar, the properties panel —
 * is somewhere the item cannot go, and the pointer keeps the browser's own
 * refusal cursor there because nothing cancels the drag over it.
 */
function AcceptFrame() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        border: `2px solid ${ACCENT}`,
        backgroundColor: "rgba(123, 112, 245, 0.04)",
        pointerEvents: "none",
        zIndex: 2147482999,
      }}
    />
  );
}

/**
 * The line that says where the item would land.
 *
 * Drawn in the canvas rather than as a cursor decoration because the answer is
 * about the page, not the pointer: the same pointer position means a different
 * gap depending on which section it is over.
 */
function InsertionLine({ y }: { y: number }) {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: y,
        height: 0,
        borderTop: `2px solid ${ACCENT}`,
        boxShadow: "0 0 0 1px rgba(123, 112, 245, 0.35)",
        pointerEvents: "none",
        zIndex: 2147483000,
      }}
    />
  );
}

export function usePanelDropTarget() {
  const [target, setTarget] = useState<PanelDropTarget | null>(null);
  // Separate from `target` because the frame and the line answer different
  // questions, and the frame has to be up from the first `dragenter` — before
  // any section has been measured.
  const [isOver, setIsOver] = useState(false);

  const clear = useCallback(() => {
    setTarget(null);
    setIsOver(false);
  }, []);

  useEffect(() => {
    /**
     * Both `dragenter` and `dragover` have to be cancelled for an element to
     * count as a drop target; cancelling only the second leaves the first frame
     * of every new element the pointer crosses deciding for itself, and a page
     * of nested blocks crosses a great many.
     */
    const accept = (event: DragEvent) => {
      event.preventDefault();

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "copy";
      }
    };

    const onDragEnter = (event: DragEvent) => {
      if (!isPanelDrag(event.dataTransfer?.types)) {
        return;
      }

      accept(event);
      setIsOver(true);
    };

    const onDragOver = (event: DragEvent) => {
      if (!isPanelDrag(event.dataTransfer?.types)) {
        return;
      }

      // Without this the browser refuses the drop and the gesture ends with the
      // item snapping back to the panel, which reads as "this does not work".
      accept(event);
      setIsOver(true);

      setTarget(resolvePanelDropTarget(event.clientY, readSectionRects(document)));
    };

    const onDrop = (event: DragEvent) => {
      if (!isPanelDrag(event.dataTransfer?.types)) {
        return;
      }

      event.preventDefault();
      clear();

      const dropped = resolvePanelDropTarget(
        event.clientY,
        readSectionRects(document),
      );

      const message: PanelDropMessage = {
        type: PANEL_DROP_MESSAGE,
        index: dropped.index,
      };

      window.parent.postMessage(message);
    };

    // Fires whenever the pointer crosses any element boundary, including ones
    // inside the canvas, so the line is only dropped when the pointer has left
    // the document itself.
    const onDragLeave = (event: DragEvent) => {
      if (!event.relatedTarget) {
        clear();
      }
    };

    document.addEventListener("dragenter", onDragEnter);
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);
    document.addEventListener("dragleave", onDragLeave);
    // The drag can end anywhere, including back over the panel; the line has to
    // go either way.
    document.addEventListener("dragend", clear);

    return () => {
      document.removeEventListener("dragenter", onDragEnter);
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("drop", onDrop);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("dragend", clear);
    };
  }, [clear]);

  if (!isOver) {
    return null;
  }

  return (
    <>
      <AcceptFrame />
      {target ? <InsertionLine y={target.y} /> : null}
    </>
  );
}
