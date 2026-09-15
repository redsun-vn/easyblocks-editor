/**
 * Attributes set on every canvas selection frame. Hover styles and the layer context
 * menu read them straight from the DOM, without tracking component state.
 */
declare const CANVAS_FRAME_PATH_ATTRIBUTE = "data-easyblocks-path";
declare const CANVAS_FRAME_LABEL_ATTRIBUTE = "data-easyblocks-label";
type CanvasLayer = {
    path: string;
    label: string;
};
/**
 * Selection frames among hit-tested elements (e.g. `document.elementsFromPoint`), kept
 * in the given order so the topmost layer under the pointer comes first.
 */
declare function getCanvasLayers(elements: Array<Element>): Array<CanvasLayer>;
export { CANVAS_FRAME_LABEL_ATTRIBUTE, CANVAS_FRAME_PATH_ATTRIBUTE, getCanvasLayers, };
export type { CanvasLayer };
//# sourceMappingURL=canvasLayers.d.ts.map