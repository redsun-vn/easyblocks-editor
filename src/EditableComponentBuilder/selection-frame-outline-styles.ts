import { Colors } from "@redsun-vn/easyblocks-design-system";
import { CANVAS_FRAME_PATH_ATTRIBUTE } from "./canvasLayers";

/**
 * Set on the canvas root while the author asks to see every block's boundary.
 * Frames read it through an ancestor selector, so turning it on or off is one
 * attribute flip rather than a re-render of every frame.
 */
export const CANVAS_OUTLINES_ATTRIBUTE = "data-easyblocks-show-outlines";

/**
 * A white ring inside a dark one. Whatever colour sits under a frame, one of
 * the two stands out from it: the white on a dark hero video, the dark on a
 * white page. The insertion line already carried customer content this way;
 * the selection frame now does too, instead of a lone blue hairline that
 * vanished on anything darker than the blue itself.
 */
export const CONTRAST_RING = `0 0 0 2px ${Colors.white}, 0 0 0 3px ${Colors.black900}`;

/**
 * A frame at rest on a canvas showing outlines. Every part that is not the
 * frame itself sits in `:where()`, so these rules weigh the same as the resting
 * rule and lose to hover, selection and every drag state declared after them.
 */
const OUTLINED_FRAME = `:where([${CANVAS_OUTLINES_ATTRIBUTE}=true]) &[data-draggable-active=false]`;

/** The thinner ring hovering uses, so hover never reads as a selection. */
const HOVER_RING = `0 0 0 1px ${Colors.white}`;

/**
 * The frame's own `::after` for its resting, hovered and selected states.
 *
 * Hovered and selected differ in weight, not in opacity: a half-transparent
 * hairline was the old hover, and on a busy background it was not there at all.
 *
 * The outlines rule sits in `:where()` so it adds no specificity: every drag
 * state declared after it (drop target, refusal) still wins, and so does hover.
 */
export function selectionFrameOutlineStyles(hoveredTargetFrame: string) {
  return {
    "&[data-draggable-active=false]::after": {
      content: `''`,
      boxSizing: "border-box",
      display: "block",
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      border: "1px solid var(--tina-color-primary)",
      opacity: 0,
      pointerEvents: "none",
      userSelect: "none",
      transition: "all 100ms",
    },

    // With outlines on, the line says what a block is, not how deep it sits:
    // one colour, three weights. Colour already means selection, drop target
    // and refusal on this canvas, and a colour per depth would sink into
    // whatever colours the page itself uses.
    // Content: a block holding no other block. Dotted and faintest.
    [`${OUTLINED_FRAME}::after`]: {
      opacity: 0.45,
      borderStyle: "dotted",
    },

    // A container: a column, or anything else with blocks inside.
    [`${OUTLINED_FRAME}:where(:has([${CANVAS_FRAME_PATH_ATTRIBUTE}]))::after`]:
      {
        opacity: 0.6,
        borderStyle: "dashed",
      },

    // A section: a frame no other frame contains. Solid and strongest.
    [`${OUTLINED_FRAME}:where(:not([${CANVAS_FRAME_PATH_ATTRIBUTE}] *))::after`]:
      {
        opacity: 0.8,
        borderStyle: "solid",
      },

    // A drop target keeps its own look while the pointer is on it.
    [`&[data-active=false]:not([data-drop-target=true])${hoveredTargetFrame}::after`]:
      {
        opacity: 1,
        borderStyle: "solid",
        boxShadow: HOVER_RING,
      },

    "&[data-active=true]::after": {
      opacity: 1,
      borderStyle: "solid",
      borderWidth: "2px",
      boxShadow: CONTRAST_RING,
    },
  };
}
