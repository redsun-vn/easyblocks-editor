/**
 * Attributes set on every canvas selection frame. Hover styles and the layer context
 * menu read them straight from the DOM, without tracking component state.
 */
const CANVAS_FRAME_PATH_ATTRIBUTE = "data-easyblocks-path";
const CANVAS_FRAME_LABEL_ATTRIBUTE = "data-easyblocks-label";

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
  getCanvasLayers,
};

export type { CanvasLayer };
