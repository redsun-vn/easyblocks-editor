import React from "react";
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
export declare const RULER_SIZE = 20;
/**
 * `layoutKey` changes whenever the editor moves or resizes the canvas (device,
 * zoom), which is when the rulers have to be measured again.
 */
export declare function CanvasRulers({ layoutKey }: {
    layoutKey: string;
}): React.JSX.Element;
//# sourceMappingURL=canvas-rulers.d.ts.map