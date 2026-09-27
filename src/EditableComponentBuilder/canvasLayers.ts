/**
 * Attributes set on every canvas selection frame. Hover styles and the layer context
 * menu read them straight from the DOM, without tracking component state.
 */
const CANVAS_FRAME_PATH_ATTRIBUTE = "data-easyblocks-path";
const CANVAS_FRAME_LABEL_ATTRIBUTE = "data-easyblocks-label";

/**
 * Edge length of the square drag grip, in canvas pixels.
 *
 * It sits in the frame's top-left corner, and the editor window draws the
 * selection's action bar over the same canvas — from outside the iframe, so it
 * is above the grip whatever either of them asks for. The bar's placement has
 * to know how much corner to leave alone, which is why this measurement lives
 * out here with the frame's other shared facts rather than beside its styles.
 */
const DRAG_HANDLE_SIZE = 20;

type CanvasLayer = {
  path: string;
  label: string;
};

/**
 * Selection frames among hit-tested elements (e.g. `document.elementsFromPoint`), kept
 * in the given order so the topmost layer under the pointer comes first.
 */
function getCanvasLayers(elements: Array<Element>): Array<CanvasLayer> {
  return elements.flatMap((element) => {
    const path = element.getAttribute(CANVAS_FRAME_PATH_ATTRIBUTE);

    if (path === null) {
      return [];
    }

    return [
      {
        path,
        label: element.getAttribute(CANVAS_FRAME_LABEL_ATTRIBUTE) ?? path,
      },
    ];
  });
}

export {
  CANVAS_FRAME_LABEL_ATTRIBUTE,
  CANVAS_FRAME_PATH_ATTRIBUTE,
  DRAG_HANDLE_SIZE,
  getCanvasLayers,
};

export type { CanvasLayer };
