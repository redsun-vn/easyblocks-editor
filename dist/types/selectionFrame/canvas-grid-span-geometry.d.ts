import type { ResizeGeometry } from "./canvas-resize-geometry";
/** An element's width inside its padding: what its children are laid out in. */
export declare function contentWidthOf(element: HTMLElement, view: Window): number;
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
export declare function findGridItem(frame: HTMLElement, view: Window): {
    item: HTMLElement;
    grid: HTMLElement;
} | null;
/**
 * The spans a block on a grid can be dragged to, with the width each gives
 * it, or `null` when the block is not on a grid or the grid is not drawing
 * spans at all.
 */
export declare function readGridSpan(frame: HTMLElement, view: Window, values: ReadonlyArray<string>, 
/**
 * The track count the grid is about to have: a row whose twelve-track grid
 * the drag will switch on. Switching keeps every column where it is, so the
 * steps can be worked out from the grid as drawn now.
 */
switchedTracks?: number): ResizeGeometry | null;
//# sourceMappingURL=canvas-grid-span-geometry.d.ts.map