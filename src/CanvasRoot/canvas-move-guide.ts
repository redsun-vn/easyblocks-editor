import {
  parseSlotPath,
  type PanelDropSlot,
} from "../editorSidebar/editorSections/panelDropSlots";
import {
  resolveAlignmentGuide,
  type AlignmentGuide,
} from "./alignment-guide-resolver";
import { toItemMove, type CanvasMoveAim } from "./canvasMoveAim";

/**
 * The alignment guide for an aim, from the collection it lands in. The dragged
 * block's own place counts only when it is moving within that collection.
 */
export function guideFor(
  slots: Array<PanelDropSlot>,
  aim: CanvasMoveAim,
  fromPath: string,
): AlignmentGuide | null {
  const slot = slots.find(
    (candidate) =>
      candidate.parentPath === aim.parentPath && candidate.prop === aim.prop,
  );
  const from = parseSlotPath(fromPath);

  // A drop right beside the block's own place moves nothing; a guide there
  // would suggest a change that will not happen.
  if (toItemMove(aim, fromPath) === null) {
    return null;
  }

  return slot
    ? resolveAlignmentGuide({
        slot,
        aim,
        fromIndex:
          from && from.parentPath === aim.parentPath && from.prop === aim.prop
            ? from.index
            : undefined,
      })
    : null;
}

/**
 * Keeps the current line when the next one is the same, so a line that has
 * not moved does not re-render the page at pointer rate.
 */
export function keepIfSame<
  Line extends { x: number; y: number; length: number; axis: string },
>(next: Line | null) {
  return (current: Line | null) =>
    current === next ||
    (current !== null &&
      next !== null &&
      current.x === next.x &&
      current.y === next.y &&
      current.length === next.length &&
      current.axis === next.axis)
      ? current
      : next;
}
