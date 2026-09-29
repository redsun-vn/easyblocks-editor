import { CANVAS_FRAME_PATH_ATTRIBUTE } from "../EditableComponentBuilder/canvasLayers";
import type { ResizeGeometry } from "./canvas-resize-geometry";
import {
  gridSpanSteps,
  gridTrackWidth,
  hasEqualTracks,
  isStackedGrid,
  offeredSteps,
} from "./resize-step-resolver";

/** An element's width inside its padding: what its children are laid out in. */
export function contentWidthOf(element: HTMLElement, view: Window) {
  const style = view.getComputedStyle(element);
  return (
    element.clientWidth -
    (parseFloat(style.paddingLeft) || 0) -
    (parseFloat(style.paddingRight) || 0)
  );
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

/**
 * The spans a block on a grid can be dragged to, with the width each gives
 * it, or `null` when the block is not on a grid or the grid is not drawing
 * spans at all.
 */
export function readGridSpan(
  frame: HTMLElement,
  view: Window,
  values: ReadonlyArray<string>,
): ResizeGeometry | null {
  const found = findGridItem(frame, view);

  if (!found) {
    return null;
  }

  const gridStyle = view.getComputedStyle(found.grid);
  const tracks = gridStyle.gridTemplateColumns
    .split(/\s+/)
    .filter(Boolean)
    .map((track) => parseFloat(track));
  const trackCount = tracks.length;

  // Tracks of different widths are proportions (a row with a free percentage
  // column), not a grid a span counts in: a number written there would not
  // mean the width it showed.
  if (!hasEqualTracks(tracks)) {
    return null;
  }
  const gap = parseFloat(gridStyle.columnGap) || 0;
  const contentWidth = contentWidthOf(found.grid, view);

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
