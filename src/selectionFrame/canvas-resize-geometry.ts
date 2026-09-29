import { CANVAS_FRAME_PATH_ATTRIBUTE } from "../EditableComponentBuilder/canvasLayers";
import {
  gridSpanSteps,
  gridTrackWidth,
  isStackedGrid,
  offeredSteps,
  ResizeStep,
} from "./resize-step-resolver";

/**
 * What a handle needs to know about the block on the canvas, read from the
 * page as it is drawn rather than worked out from the config: the canvas is
 * the only place that knows how wide a track came out.
 */
export type ResizeGeometry = {
  /** The block's size along the dragged axis now, in canvas pixels. */
  size: number;
  /** The values a drag can land on, smallest first, each with its size. */
  steps: Array<ResizeStep>;
  /** How the chip names a value: `7/12` for a span. */
  describe: (value: string) => string;
};

function canvasDocument(): Document | null {
  const iframe = document.getElementById(
    "editor-canvas",
  ) as HTMLIFrameElement | null;

  return iframe?.contentDocument ?? null;
}

function isGrid(element: Element, view: Window) {
  const { display } = view.getComputedStyle(element);
  return display === "grid" || display === "inline-grid";
}

/**
 * The block's grid item and the grid it sits in: the nearest ancestor of the
 * frame, the frame included, whose parent lays out on a grid. A row puts one
 * wrapper per column between its grid and the column, and that wrapper is the
 * box whose width a span decides.
 *
 * The walk stops at the next frame up. That frame owns the collection the
 * block lives in, and a grid above it — a section's, a page's — has nothing
 * to do with this block's span.
 */
function findGridItem(frame: HTMLElement, view: Window) {
  let item: HTMLElement = frame;

  while (item.parentElement) {
    const parent: HTMLElement = item.parentElement;

    if (isGrid(parent, view)) {
      return { item, grid: parent };
    }

    if (parent.hasAttribute(CANVAS_FRAME_PATH_ATTRIBUTE)) {
      return null;
    }

    item = parent;
  }

  return null;
}

function readGridSpan(
  frame: HTMLElement,
  view: Window,
  values: ReadonlyArray<string>,
): ResizeGeometry | null {
  const found = findGridItem(frame, view);

  if (!found) {
    return null;
  }

  const gridStyle = view.getComputedStyle(found.grid);
  const trackCount = gridStyle.gridTemplateColumns
    .split(/\s+/)
    .filter(Boolean).length;
  const gap = parseFloat(gridStyle.columnGap) || 0;
  const contentWidth =
    found.grid.clientWidth -
    (parseFloat(gridStyle.paddingLeft) || 0) -
    (parseFloat(gridStyle.paddingRight) || 0);

  // A row stacked for a phone draws every column full width whatever it
  // stores, so a drag there would save a value nobody sees.
  const itemWidths = Array.from(found.grid.children).map(
    (child) => child.getBoundingClientRect().width,
  );

  if (isStackedGrid(itemWidths, contentWidth)) {
    return null;
  }

  return {
    size: found.item.getBoundingClientRect().width,
    steps: offeredSteps(
      gridSpanSteps({
        trackCount,
        gap,
        trackWidth: gridTrackWidth({ contentWidth, trackCount, gap }),
      }),
      values,
    ),
    describe: (value) => `${value}/${trackCount}`,
  };
}

/**
 * The block's size and the values a drag can reach, or `null` when a drag
 * could not change anything the page shows — then no handle is offered.
 */
export function readResizeGeometry({
  path,
  axis,
  values,
}: {
  path: string;
  axis: "x" | "y";
  values: ReadonlyArray<string>;
}): ResizeGeometry | null {
  const doc = canvasDocument();
  const view = doc?.defaultView;
  const frame = doc?.querySelector<HTMLElement>(
    `[${CANVAS_FRAME_PATH_ATTRIBUTE}="${CSS.escape(path)}"]`,
  );

  if (!view || !frame || axis !== "x") {
    return null;
  }

  const geometry = readGridSpan(frame, view, values);

  return geometry && geometry.steps.length >= 2 ? geometry : null;
}
