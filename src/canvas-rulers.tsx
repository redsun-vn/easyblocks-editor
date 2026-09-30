import React, { useEffect, useRef } from "react";
import { ACCENT } from "./CanvasRoot/usePanelDropTarget";

/**
 * Rulers along the top and left edges of the canvas, marked in page pixels:
 * a short tick every 10, a longer one every 50 and a numbered one every 100.
 *
 * They sit in the editor, just outside the canvas iframe, in a strip the
 * canvas column leaves free for them (`RULER_SIZE`). Drawn inside the iframe
 * they covered the top and left of the page being edited.
 *
 * They read page coordinates — the canvas's own scroll, divided by the scale
 * the editor draws the canvas at — so a number means the same place in the
 * page however it is scrolled or zoomed. A mark on each ruler follows the
 * pointer over the canvas, continuing the crosshair drawn inside it.
 */

/** Thickness of each ruler, in editor pixels. */
export const RULER_SIZE = 20;

const BACKGROUND = "#f8f8fb";
const BORDER = "#d9d7e4";
const TICK = "#9b98ae";
const LABEL = "#6b6880";

type Orientation = "horizontal" | "vertical";

/** Where the canvas is drawn and which part of the page it shows. */
type CanvasView = {
  left: number;
  top: number;
  width: number;
  height: number;
  scale: number;
  scrollX: number;
  scrollY: number;
};

function drawRuler(
  canvas: HTMLCanvasElement,
  orientation: Orientation,
  start: number,
  length: number,
  scale: number,
) {
  const isHorizontal = orientation === "horizontal";
  const width = isHorizontal ? length : RULER_SIZE;
  const height = isHorizontal ? RULER_SIZE : length;
  const density = window.devicePixelRatio || 1;
  const context = canvas.getContext("2d");
  // Ticks closer than 4 pixels on screen blur into a bar; zoomed far out,
  // only every fifth one is drawn.
  const step = 10 * scale >= 4 ? 10 : 50;

  canvas.width = Math.round(width * density);
  canvas.height = Math.round(height * density);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  if (!context) {
    return;
  }

  context.setTransform(density, 0, 0, density, 0, 0);
  context.fillStyle = BACKGROUND;
  context.fillRect(0, 0, width, height);
  context.font = "9px system-ui, -apple-system, sans-serif";
  context.fillStyle = LABEL;
  context.strokeStyle = TICK;
  context.lineWidth = 1;
  context.beginPath();

  const end = start + length / scale;

  for (let value = Math.ceil(start / step) * step; value <= end; value += step) {
    // Half a pixel in, so a 1px line covers one row of pixels, not two.
    const at = Math.round((value - start) * scale) + 0.5;
    const size = value % 100 === 0 ? RULER_SIZE : value % 50 === 0 ? 8 : 4;

    if (isHorizontal) {
      context.moveTo(at, RULER_SIZE);
      context.lineTo(at, RULER_SIZE - size);
    } else {
      context.moveTo(RULER_SIZE, at);
      context.lineTo(RULER_SIZE - size, at);
    }

    if (value % 100 !== 0) {
      continue;
    }

    const label = String(value);

    if (isHorizontal) {
      context.fillText(label, at + 3, 9);
    } else {
      // Read bottom to top, just below its tick, as rulers usually do.
      context.save();
      context.translate(10, at + 3 + context.measureText(label).width);
      context.rotate(-Math.PI / 2);
      context.fillText(label, 0, 0);
      context.restore();
    }
  }

  context.stroke();

  // The edge that faces the page.
  context.strokeStyle = BORDER;
  context.beginPath();

  if (isHorizontal) {
    context.moveTo(0, RULER_SIZE - 0.5);
    context.lineTo(width, RULER_SIZE - 0.5);
  } else {
    context.moveTo(RULER_SIZE - 0.5, 0);
    context.lineTo(RULER_SIZE - 0.5, height);
  }

  context.stroke();
}

function readView(iframe: HTMLIFrameElement): CanvasView | null {
  const rect = iframe.getBoundingClientRect();
  const view = iframe.contentWindow;

  if (!view || rect.width === 0 || iframe.offsetWidth === 0) {
    return null;
  }

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    scale: rect.width / iframe.offsetWidth,
    scrollX: view.scrollX,
    scrollY: view.scrollY,
  };
}

const fixed: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  display: "block",
  pointerEvents: "none",
  zIndex: 2,
};

const markStyle: React.CSSProperties = {
  ...fixed,
  display: "none",
  background: ACCENT,
  zIndex: 3,
};

/**
 * `layoutKey` changes whenever the editor moves or resizes the canvas (device,
 * zoom), which is when the rulers have to be measured again.
 */
export function CanvasRulers({ layoutKey }: { layoutKey: string }) {
  const top = useRef<HTMLCanvasElement>(null);
  const left = useRef<HTMLCanvasElement>(null);
  const corner = useRef<HTMLDivElement>(null);
  const markX = useRef<HTMLDivElement>(null);
  const markY = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iframe = document.getElementById(
      "editor-canvas",
    ) as HTMLIFrameElement | null;

    if (!iframe) {
      return;
    }

    let frame = 0;
    let boundWindow: Window | null = null;

    const draw = () => {
      frame = 0;

      const view = readView(iframe);
      const parts = [top.current, left.current, corner.current];

      for (const part of parts) {
        if (part) part.style.visibility = view ? "visible" : "hidden";
      }

      if (!view || !top.current || !left.current || !corner.current) {
        return;
      }

      drawRuler(top.current, "horizontal", view.scrollX, view.width, view.scale);
      drawRuler(left.current, "vertical", view.scrollY, view.height, view.scale);
      top.current.style.transform = `translate(${view.left}px, ${view.top - RULER_SIZE}px)`;
      left.current.style.transform = `translate(${view.left - RULER_SIZE}px, ${view.top}px)`;
      corner.current.style.transform = `translate(${view.left - RULER_SIZE}px, ${view.top - RULER_SIZE}px)`;
    };
    const schedule = () => {
      frame = frame || requestAnimationFrame(draw);
    };

    const showMarks = (visible: boolean) => {
      for (const mark of [markX.current, markY.current]) {
        if (mark) mark.style.display = visible ? "block" : "none";
      }
    };
    const onPointer = (event: PointerEvent) => {
      const view = readView(iframe);

      if (!view || event.pointerType === "touch") {
        return;
      }

      const x = view.left + event.clientX * view.scale;
      const y = view.top + event.clientY * view.scale;

      if (markX.current) {
        markX.current.style.transform = `translate(${x}px, ${view.top - RULER_SIZE}px)`;
      }

      if (markY.current) {
        markY.current.style.transform = `translate(${view.left - RULER_SIZE}px, ${y}px)`;
      }

      showMarks(true);
    };
    const onOut = (event: MouseEvent) => {
      if (!event.relatedTarget) showMarks(false);
    };

    // The canvas document is replaced whenever the iframe loads, so its
    // listeners are bound again each time.
    const bind = () => {
      unbind();
      boundWindow = iframe.contentWindow;
      boundWindow?.addEventListener("scroll", schedule, { passive: true });
      boundWindow?.document.addEventListener("pointermove", onPointer, {
        passive: true,
      });
      boundWindow?.document.addEventListener("mouseout", onOut);
      schedule();
    };
    const unbind = () => {
      boundWindow?.removeEventListener("scroll", schedule);
      boundWindow?.document.removeEventListener("pointermove", onPointer);
      boundWindow?.document.removeEventListener("mouseout", onOut);
      boundWindow = null;
    };

    const resizeObserver = new ResizeObserver(schedule);

    resizeObserver.observe(iframe);
    bind();
    iframe.addEventListener("load", bind);
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      unbind();
      resizeObserver.disconnect();
      iframe.removeEventListener("load", bind);
      window.removeEventListener("resize", schedule);
    };
  }, [layoutKey]);

  return (
    <>
      <canvas ref={top} style={fixed} />
      <canvas ref={left} style={fixed} />
      <div
        ref={corner}
        style={{
          ...fixed,
          width: RULER_SIZE,
          height: RULER_SIZE,
          background: BACKGROUND,
          borderRight: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
          boxSizing: "border-box",
        }}
      />
      <div ref={markX} style={{ ...markStyle, width: 1, height: RULER_SIZE }} />
      <div ref={markY} style={{ ...markStyle, width: RULER_SIZE, height: 1 }} />
    </>
  );
}
