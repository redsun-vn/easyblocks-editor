import type { ResizeGeometry } from "./canvas-resize-geometry";
/** An element's width inside its padding: what its children are laid out in. */
export declare function contentWidthOf(element: HTMLElement, view: Window): number;
/**
 * The spans a block on a grid can be dragged to, with the width each gives
 * it, or `null` when the block is not on a grid or the grid is not drawing
 * spans at all.
 */
export declare function readGridSpan(frame: HTMLElement, view: Window, values: ReadonlyArray<string>): ResizeGeometry | null;
//# sourceMappingURL=canvas-grid-span-geometry.d.ts.map