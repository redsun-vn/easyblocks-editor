import { CANVAS_FRAME_PATH_ATTRIBUTE } from "../EditableComponentBuilder/canvasLayers";
import { ResizeChoice } from "./canvas-resize-fields";
import { isRatioList, lengthSteps } from "./resize-length-steps";
import { contentWidthOf, readGridSpan } from "./canvas-grid-span-geometry";
import { ResizeStep } from "./resize-step-resolver";

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
  /**
   * Where the block's content sits inside its frame, when that is narrower
   * than the frame — a picture held to a max width. The handles hang from it
   * so they sit on the edge that actually moves.
   */
  content?: { left: number; top: number; width: number; height: number };
  /**
   * The values are aspect ratios, so the height they give follows the width.
   * A corner drag then changes the width alone and the ratio carries the
   * height along, the way a picture is scaled in any design tool.
   */
  followsWidth?: boolean;
};

/** The selected block's frame on the canvas, and the canvas window it is in. */
export function findCanvasFrame(
  path: string,
): { frame: HTMLElement; view: Window } | null {
  const iframe = document.getElementById(
    "editor-canvas",
  ) as HTMLIFrameElement | null;
  const doc = iframe?.contentDocument;
  const view = doc?.defaultView;
  const frame = doc?.querySelector<HTMLElement>(
    `[${CANVAS_FRAME_PATH_ATTRIBUTE}="${CSS.escape(path)}"]`,
  );

  return view && frame ? { frame, view } : null;
}

/**
 * The box the block's own content draws, inside its frame.
 *
 * The frame stretches to the slot it sits in, so its box says nothing about a
 * picture held to a narrower `max-width`. What the block draws is its in-flow
 * children; the frame's own controls are positioned out of flow and left out.
 */
function contentBox(frame: HTMLElement, view: Window) {
  const drawn = Array.from(frame.children).filter((child) => {
    const { position, display } = view.getComputedStyle(child);
    return (
      position !== "absolute" && position !== "fixed" && display !== "none"
    );
  });

  const frameRect = frame.getBoundingClientRect();

  if (drawn.length === 0) {
    return {
      left: 0,
      top: 0,
      width: frameRect.width,
      height: frameRect.height,
    };
  }

  // A box with no size (an empty placeholder, display: contents) draws
  // nothing, and would pull the union towards the frame's corner.
  const rects = drawn
    .map((child) => child.getBoundingClientRect())
    .filter((rect) => rect.width > 0 || rect.height > 0);

  if (rects.length === 0) {
    return {
      left: 0,
      top: 0,
      width: frameRect.width,
      height: frameRect.height,
    };
  }
  const left = Math.min(...rects.map((rect) => rect.left));
  const top = Math.min(...rects.map((rect) => rect.top));

  return {
    left: left - frameRect.left,
    top: top - frameRect.top,
    width: Math.max(...rects.map((rect) => rect.right)) - left,
    height: Math.max(...rects.map((rect) => rect.bottom)) - top,
  };
}

/**
 * The block measured against a list of lengths: pixels, shares of the width
 * it is given or of the screen, ratios, theme tokens.
 */
function readLengths(
  frame: HTMLElement,
  view: Window,
  axis: "x" | "y",
  choices: ReadonlyArray<ResizeChoice>,
): ResizeGeometry {
  const box = contentBox(frame, view);
  const labels = new Map(choices.map((choice) => [choice.key, choice.label]));

  return {
    size: axis === "x" ? box.width : box.height,
    steps: lengthSteps(choices, axis, {
      // The frame is the box the block is laid out in, so a percentage is a
      // share of its width.
      percentOf: contentWidthOf(frame, view),
      viewportHeight: view.innerHeight,
      width: box.width,
    }),
    describe: (key) => labels.get(key) ?? key,
    content: box,
    followsWidth: axis === "y" && isRatioList(choices),
  };
}

/** A span is a bare whole number; a token or a length carries a unit. */
const isWholeNumber = (css: string) => /^\d+$/.test(css.trim());

/**
 * The block's size and the values a drag can reach, or `null` when a drag
 * could not change anything the page shows — then no handle is offered.
 *
 * Whole numbers across a block's sides are grid spans; everything else is a
 * length of some kind.
 */
export function readResizeGeometry({
  path,
  axis,
  choices,
}: {
  path: string;
  axis: "x" | "y";
  choices: ReadonlyArray<ResizeChoice>;
}): ResizeGeometry | null {
  const found = findCanvasFrame(path);

  if (!found) {
    return null;
  }

  const { frame, view } = found;
  const spans = choices
    .filter((choice) => isWholeNumber(choice.css))
    .map((choice) => choice.key);
  const geometry =
    axis === "x" && spans.length > 0
      ? readGridSpan(frame, view, spans)
      : readLengths(frame, view, axis, choices);

  return geometry && geometry.steps.length >= 2 ? geometry : null;
}
