import { useDndMonitor } from "@dnd-kit/core";
import React, { useEffect, useRef, useState } from "react";
import { CanvasRulers } from "./canvas-rulers";
import { ACCENT } from "./usePanelDropTarget";

/**
 * Rulers on the top and left edges, and a fine dotted line through the
 * pointer on each axis that crosses them, for reading positions and what lines
 * up with what by eye.
 *
 * Shown with the block outlines (the canvas root decides). The lines hide
 * while a block is dragged — the drag draws its own guides, and one line per
 * axis is the rule there — while the rulers stay.
 *
 * The lines are moved by writing their style directly, not through state, so
 * following the pointer never re-renders anything.
 */
const lineStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  display: "none",
  opacity: 0.8,
  pointerEvents: "none",
  zIndex: 2147482000,
};

export function CanvasCursorCrosshair() {
  const vertical = useRef<HTMLDivElement>(null);
  const horizontal = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useDndMonitor({
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => setIsDragging(false),
    onDragCancel: () => setIsDragging(false),
  });

  useEffect(() => {
    if (isDragging) {
      return;
    }

    const show = (visible: boolean) => {
      for (const line of [vertical.current, horizontal.current]) {
        if (line) line.style.display = visible ? "block" : "none";
      }
    };
    const onMove = (event: PointerEvent) => {
      // A tap has no hover to follow; the lines would stay where it landed.
      if (event.pointerType === "touch") {
        return;
      }

      if (vertical.current) {
        vertical.current.style.transform = `translateX(${event.clientX}px)`;
      }

      if (horizontal.current) {
        horizontal.current.style.transform = `translateY(${event.clientY}px)`;
      }

      show(true);
    };
    // Leaving the iframe is a mouseout with nowhere to go.
    const onOut = (event: MouseEvent) => {
      if (!event.relatedTarget) show(false);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
    };
  }, [isDragging]);

  return (
    <>
      <CanvasRulers />
      {isDragging ? null : (
        <>
          <div
            ref={vertical}
            style={{ ...lineStyle, height: "100vh", borderLeft: `1px dotted ${ACCENT}` }}
          />
          <div
            ref={horizontal}
            style={{ ...lineStyle, width: "100vw", borderTop: `1px dotted ${ACCENT}` }}
          />
        </>
      )}
    </>
  );
}
