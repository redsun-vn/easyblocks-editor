import React, { useEffect, useRef } from "react";

/**
 * Rulers along the top and left edges of the canvas, marked in page pixels:
 * a short tick every 10, a longer one every 50 and a numbered one every 100.
 *
 * They read page coordinates, not window ones, so the left ruler scrolls with
 * the page and a number means the same place wherever the page is scrolled to.
 * Drawn on `<canvas>` at the screen's pixel density so the ticks stay sharp,
 * and redrawn only when the page scrolls or the window resizes.
 */

/** Thickness of each ruler, in canvas pixels. */
export const RULER_SIZE = 20;

const STEP = 10;
const BACKGROUND = "rgba(248, 248, 251, 0.94)";
const BORDER = "#d9d7e4";
const TICK = "#9b98ae";
const LABEL = "#6b6880";

type Orientation = "horizontal" | "vertical";

function drawRuler(
  canvas: HTMLCanvasElement,
  orientation: Orientation,
  start: number,
  length: number,
) {
  const isHorizontal = orientation === "horizontal";
  const width = isHorizontal ? length : RULER_SIZE;
  const height = isHorizontal ? RULER_SIZE : length;
  const density = window.devicePixelRatio || 1;
  const context = canvas.getContext("2d");

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

  for (
    let value = Math.ceil(start / STEP) * STEP;
    value <= start + length;
    value += STEP
  ) {
    // Half a pixel in, so a 1px line covers one row of pixels, not two.
    const at = Math.round(value - start) + 0.5;
    const size =
      value % 100 === 0 ? RULER_SIZE : value % 50 === 0 ? 8 : 4;

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

const rulerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  display: "block",
  pointerEvents: "none",
  zIndex: 2147481999,
};

export function CanvasRulers() {
  const top = useRef<HTMLCanvasElement>(null);
  const left = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let frame = 0;

    const draw = () => {
      frame = 0;

      const root = document.documentElement;

      if (top.current) {
        drawRuler(top.current, "horizontal", window.scrollX, root.clientWidth);
      }

      if (left.current) {
        drawRuler(left.current, "vertical", window.scrollY, root.clientHeight);
      }
    };
    const schedule = () => {
      frame = frame || requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <canvas ref={top} style={rulerStyle} />
      <canvas ref={left} style={rulerStyle} />
      <div
        style={{
          ...rulerStyle,
          width: RULER_SIZE,
          height: RULER_SIZE,
          background: BACKGROUND,
          borderRight: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
          boxSizing: "border-box",
          zIndex: 2147482001,
        }}
      />
    </>
  );
}
