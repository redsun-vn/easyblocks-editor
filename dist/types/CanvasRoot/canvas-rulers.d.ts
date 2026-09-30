import React from "react";
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
export declare const RULER_SIZE = 20;
export declare function CanvasRulers(): React.JSX.Element;
//# sourceMappingURL=canvas-rulers.d.ts.map