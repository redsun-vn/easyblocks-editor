import React, { useCallback, useEffect, useState } from "react";
import {
  isPanelDrag,
  PANEL_DROP_MESSAGE,
  type PanelDropMessage,
} from "../editorSidebar/editorSections/panelDrag";
import {
  pickSlotForPath,
  resolveSlotAim,
  type PanelDropAim,
} from "../editorSidebar/editorSections/panelDropSlots";
import { descendToNearestChildSlot } from "../editorSidebar/editorSections/slotDescent";
import { collectPanelDropSlots, topmostFramePath } from "./collectPanelDropSlots";

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
 *
 * The position is now a collection and an index within it, not an index into the
 * page. Aiming only at the root meant a pointer released inside a column was
 * answered with a gap between two sections instead — the item did arrive, just
 * not where it was aimed, and nothing said so. Which collections can be aimed at
 * is decided by `collectPanelDropSlots`, and a collection has to opt in, so a
 * document of older components still has exactly one answer available.
 */

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
 * gap depending on which block it is over.
 *
 * It follows the collection rather than always lying flat. A row of columns is
 * filled across, so a horizontal line in it would sit along a column instead of
 * between two, pointing at the wrong gap — and it is only as long as the
 * collection it belongs to, because a line spanning the window says "between two
 * sections" no matter which column it was actually drawn for.
 */
export function InsertionLine({ line }: { line: PanelDropAim["line"] }) {
  const isAcross = line.axis === "horizontal";

  return (
    <div
      style={{
        position: "fixed",
        top: line.y,
        left: line.x,
        width: isAcross ? 0 : line.length,
        height: isAcross ? line.length : 0,
        [isAcross ? "borderLeft" : "borderTop"]: `2px solid ${ACCENT}`,
        boxShadow: "0 0 0 1px rgba(123, 112, 245, 0.35)",
        pointerEvents: "none",
        zIndex: 2147483000,
      }}
    />
  );
}

export function usePanelDropTarget(editorContext: any) {
  const [aim, setAim] = useState<PanelDropAim | null>(null);
  // Separate from `aim` because the frame and the line answer different
  // questions, and the frame has to be up from the first `dragenter` — before
  // anything has been measured.
  const [isOver, setIsOver] = useState(false);

  const clear = useCallback(() => {
    setAim(null);
    setIsOver(false);
  }, []);

  /**
   * Which collection the pointer is in, and where in it the item would go.
   *
   * Measured fresh on every `dragover` rather than once at `dragenter`, because
   * the page moves under the pointer: an accordion opens, an image finishes
   * loading, the canvas scrolls. A stale rectangle would answer with a gap that
   * is no longer there.
   */
  const aimAt = useCallback(
    (event: DragEvent): PanelDropAim | null => {
      const pointer = { x: event.clientX, y: event.clientY };

      /*
       * Paint order, not geometry, decides which block the pointer is on. A
       * sticky header keeps its place while the page scrolls underneath it, so
       * more than one block can contain the same point and the deeper of the two
       * is the one nobody can see. `elementsFromPoint` answers with what is
       * actually on top, which is what the person is pointing at.
       */
      const slots = collectPanelDropSlots(document, editorContext);
      const slot = pickSlotForPath(slots, topmostFramePath(document, pointer));

      // A row's own space means the column nearest the pointer, never a new
      // column — see `descendToNearestChildSlot`.
      return slot
        ? resolveSlotAim(pointer, descendToNearestChildSlot(slots, slot, pointer))
        : null;
    },
    [editorContext],
  );

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

      setAim(aimAt(event));
    };

    const onDrop = (event: DragEvent) => {
      if (!isPanelDrag(event.dataTransfer?.types)) {
        return;
      }

      event.preventDefault();
      clear();

      const dropped = aimAt(event);

      if (!dropped) {
        return;
      }

      const message: PanelDropMessage = {
        type: PANEL_DROP_MESSAGE,
        index: dropped.index,
        parentPath: dropped.parentPath,
        prop: dropped.prop,
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
  }, [aimAt, clear]);

  if (!isOver) {
    return null;
  }

  return (
    <>
      <AcceptFrame />
      {aim ? <InsertionLine line={aim.line} /> : null}
    </>
  );
}
