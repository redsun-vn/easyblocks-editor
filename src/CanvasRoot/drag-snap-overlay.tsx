import { useDndMonitor } from "@dnd-kit/core";
import React, { useEffect, useRef, useState } from "react";
import { CANVAS_FRAME_PATH_ATTRIBUTE } from "../EditableComponentBuilder/canvasLayers";
import { AlignmentGuideLine } from "./alignment-guide-line";
import {
  resolveDragSnap,
  type SnapGuide,
  type SnapRect,
} from "./drag-snap-resolver";
import { ACCENT } from "./usePanelDropTarget";

/**
 * The dragged block's outline, carried by the pointer, and the guides it snaps
 * to.
 *
 * The pointer carries a chip (`DragPreview`), not the block, so nothing on
 * screen had the block's size to line up with anything. This draws that size
 * as a faint dashed box and lets it snap onto the nearest edge or centre of the
 * blocks around it. It is a measuring aid only: where the block lands is still
 * the insertion line's answer, because the page is laid out in flow and has no
 * free x/y to keep.
 *
 * State lives here rather than in the canvas root, so following the pointer
 * re-renders this layer and not the whole page.
 */

/** How close a line must come before the outline jumps onto it, in screen pixels. */
const SNAP_DISTANCE = 6;

type Point = { x: number; y: number };

type Session = { origin: SnapRect; start: Point; path: string; scale: number };

type View = { outline: SnapRect; guides: Array<SnapGuide> };

const shift = (rect: SnapRect, dx: number, dy: number): SnapRect => ({
  left: rect.left + dx,
  right: rect.right + dx,
  top: rect.top + dy,
  bottom: rect.bottom + dy,
});

function pointOf(event: Event | null): Point | null {
  if (event && "touches" in event) {
    const touch = (event as TouchEvent).touches[0];

    return touch ? { x: touch.clientX, y: touch.clientY } : null;
  }

  return event && "clientX" in event
    ? { x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY }
    : null;
}

/**
 * Screen pixels per canvas pixel. The canvas is an iframe the editor may scale
 * down to fit, and a snap distance is felt on screen, not in page pixels.
 */
function canvasScale() {
  try {
    const frame = window.frameElement as HTMLElement | null;
    const drawn = frame?.getBoundingClientRect().width ?? 0;

    return frame && drawn > 0 && frame.offsetWidth > 0
      ? drawn / frame.offsetWidth
      : 1;
  } catch {
    return 1;
  }
}

/**
 * Every block frame in view, other than the dragged block and what it holds.
 * Told apart by path rather than by node, so a frame React remounts mid-drag
 * still counts as the dragged block.
 */
function measureNeighbours(path: string): Array<SnapRect> {
  const rects: Array<SnapRect> = [];

  document
    .querySelectorAll(`[${CANVAS_FRAME_PATH_ATTRIBUTE}]`)
    .forEach((frame) => {
      const framePath = frame.getAttribute(CANVAS_FRAME_PATH_ATTRIBUTE) ?? "";

      if (framePath === path || framePath.startsWith(`${path}.`)) {
        return;
      }

      const rect = frame.getBoundingClientRect();

      if (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth
      ) {
        rects.push(rect);
      }
    });

  return rects;
}

export function DragSnapOverlay() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View | null>(null);
  const pointer = useRef<Point | null>(null);

  const end = () => {
    setSession(null);
    setView(null);
  };

  useDndMonitor({
    onDragStart(event) {
      const path = event.active.data.current?.path;
      const start = pointOf(event.activatorEvent);
      const dragged =
        typeof path === "string"
          ? document.querySelector(
              `[${CANVAS_FRAME_PATH_ATTRIBUTE}="${CSS.escape(path)}"]`,
            )
          : null;

      if (!dragged || !start) {
        return;
      }

      const { left, right, top, bottom } = dragged.getBoundingClientRect();

      pointer.current = start;
      setSession({
        origin: { left, right, top, bottom },
        start,
        path,
        // The editor does not rescale the canvas mid-drag.
        scale: canvasScale(),
      });
    },
    onDragEnd: end,
    onDragCancel: end,
  });

  useEffect(() => {
    if (!session) {
      return;
    }

    let frame = 0;

    // One measure per frame: every block is measured again because the drag
    // itself shifts them (sorting, auto-scroll).
    const update = () => {
      frame = 0;

      const at = pointer.current ?? session.start;
      const moving = shift(
        session.origin,
        at.x - session.start.x,
        at.y - session.start.y,
      );
      const snap = resolveDragSnap(
        moving,
        measureNeighbours(session.path),
        SNAP_DISTANCE / session.scale,
      );
      const next = { outline: shift(moving, snap.dx, snap.dy), guides: snap.guides };

      // Unchanged geometry keeps the current view: no render for a frame
      // that would draw the same thing.
      setView((current) =>
        current && JSON.stringify(current) === JSON.stringify(next)
          ? current
          : next,
      );
    };
    const schedule = () => {
      frame = frame || requestAnimationFrame(update);
    };
    const onPointer = (event: Event) => {
      pointer.current = pointOf(event) ?? pointer.current;
      schedule();
    };

    schedule();
    window.addEventListener("mousemove", onPointer, { passive: true });
    window.addEventListener("touchmove", onPointer, { passive: true });
    window.addEventListener("scroll", schedule, { capture: true, passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onPointer);
      window.removeEventListener("touchmove", onPointer);
      window.removeEventListener("scroll", schedule, { capture: true });
    };
  }, [session]);

  // Both, so a frame measured just before the drag ended draws nothing.
  if (!session || !view) {
    return null;
  }

  const { outline, guides } = view;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: outline.top,
          left: outline.left,
          width: outline.right - outline.left,
          height: outline.bottom - outline.top,
          boxSizing: "border-box",
          border: `1px dashed ${ACCENT}`,
          background: "rgba(123, 112, 245, 0.06)",
          pointerEvents: "none",
          zIndex: 2147482999,
        }}
      />
      {guides.map((guide) => (
        <AlignmentGuideLine key={guide.orientation} guide={guide} />
      ))}
    </>
  );
}
