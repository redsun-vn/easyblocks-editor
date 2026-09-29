import {
  parseSlotPath,
  resolveSlotAim,
  type PanelDropAim,
  type PanelDropSlot,
} from "../editorSidebar/editorSections/panelDropSlots";
import { pickSlotForDrag } from "../editorSidebar/editorSections/slotDescent";

/**
 * Where a block already on the canvas lands when it is dragged across columns.
 *
 * The block-by-block targeting that dragging used before only knows about
 * blocks: a column's own space is a droppable only when the row it sits in can
 * take the dragged block, and a row takes nothing but columns. So the empty part
 * of a column — the part somebody aims at to put a block beside another — was
 * no target at all, and the nearest-block fallback answered with whatever sat
 * closest, often a block in the neighbouring column or nothing. Moving a block
 * from one column to another, in the same row or a different one, was down to
 * luck.
 *
 * This aims the way a drop from the panel does — the collection under the
 * pointer and the gap in it — so both gestures agree on where a block goes.
 *
 * It only takes over for a block living in a collection that opted in with
 * `panelDropTarget`, and never for a drop at the page root or into an older
 * container: those keep the block-by-block targeting exactly as it was.
 */

export type CanvasMoveAim = PanelDropAim & {
  /** How many items the target collection holds right now. */
  length: number;
};

const collectionPathOf = (parentPath: string, prop: string) =>
  parentPath === "" ? prop : `${parentPath}.${prop}`;

const isOptedIn = (slots: Array<PanelDropSlot>, parentPath: string, prop: string) =>
  parentPath !== "" &&
  slots.some((slot) => slot.parentPath === parentPath && slot.prop === prop);

/** Whether a path is `ancestor` itself or somewhere inside it. */
const isWithin = (path: string, ancestor: string) =>
  path === ancestor || path.startsWith(`${ancestor}.`);

export function resolveCanvasMoveAim({
  slots,
  fromPath,
  topmostPath,
  pointer,
  legacyOverPath,
  canHold,
}: {
  slots: Array<PanelDropSlot>;
  fromPath: string;
  /** The frame painted on top under the pointer. */
  topmostPath: string | null;
  pointer: { x: number; y: number };
  /**
   * Collection path of what the block-by-block targeting found, if anything. An
   * older container found there keeps the drop, so a block can still be put
   * into one that sits inside a column.
   */
  legacyOverPath: string | null;
  canHold: (slot: PanelDropSlot) => boolean;
}): CanvasMoveAim | null {
  const from = parseSlotPath(fromPath);

  if (!from || !isOptedIn(slots, from.parentPath, from.prop)) {
    return null;
  }

  if (legacyOverPath !== null) {
    const over = parseSlotPath(`${legacyOverPath}.0`);

    if (over && over.parentPath !== "" && !isOptedIn(slots, over.parentPath, over.prop)) {
      return null;
    }
  }

  const slot = pickSlotForDrag({
    slots,
    path: topmostPath,
    pointer,
    // A block cannot go inside itself.
    canHold: (candidate) =>
      !isWithin(candidate.parentPath, fromPath) && canHold(candidate),
  });

  if (!slot || slot.parentPath === "") {
    return null;
  }

  return { ...resolveSlotAim(pointer, slot), length: slot.children.length };
}

/**
 * The aim as the parent window's move event reads it, or `null` when the block
 * would land where it already is.
 *
 * Within one collection the parent reorders to the index `toPath` ends in,
 * counted after the block has left its place. Across two it inserts into the
 * collection `toPath` sits in — or is, for an empty one — at `index`. The index
 * travels with the event rather than being worked out from `placement`,
 * because that arithmetic predates this and older documents depend on it
 * exactly as it is.
 */
export function toItemMove(
  aim: CanvasMoveAim,
  fromPath: string,
): { fromPath: string; toPath: string; index?: number } | null {
  const from = parseSlotPath(fromPath)!;
  const collection = collectionPathOf(aim.parentPath, aim.prop);

  if (collectionPathOf(from.parentPath, from.prop) === collection) {
    const target = aim.index > from.index ? aim.index - 1 : aim.index;

    return target === from.index
      ? null
      : { fromPath, toPath: `${collection}.${target}` };
  }

  return {
    fromPath,
    toPath: aim.length === 0 ? collection : `${collection}.0`,
    index: aim.index,
  };
}

/**
 * `path` after an item has been inserted at, or removed from, `index` in
 * `collectionPath`: only a path running through that collection at or past the
 * index is renumbered, by one.
 *
 * The shared `shiftPath` every other move goes through gets two cases wrong that
 * an aimed move reaches in one gesture: it does not lift a sub-grid pushed down
 * by an insert right above it — so the original stayed behind as a duplicate —
 * and it renumbers a sibling when something nested inside an earlier one is
 * taken out. Aimed moves use this instead; the rest stay on `shiftPath`.
 */
function renumberThrough(
  path: string,
  collectionPath: string,
  index: number,
  delta: 1 | -1,
): string {
  const prefix = `${collectionPath}.`;

  if (!path.startsWith(prefix)) {
    return path;
  }

  const [position, ...rest] = path.slice(prefix.length).split(".");
  const at = Number(position);
  const reached = delta === 1 ? at >= index : at > index;

  if (!Number.isInteger(at) || !reached) {
    return path;
  }

  return [`${prefix}${at + delta}`, ...rest].join(".");
}

/**
 * Which path to remove and which to select after an aimed move has inserted the
 * block at `index` in `collectionPath`.
 */
export function planAimedMove(
  sourcePath: string,
  collectionPath: string,
  index: number,
): { sourceToRemove: string; pathToFocus: string } {
  const sourceToRemove = renumberThrough(sourcePath, collectionPath, index, 1);
  const removed = sourceToRemove.split(".");
  const removedIndex = Number(removed.pop());

  return {
    sourceToRemove,
    pathToFocus: renumberThrough(
      `${collectionPath}.${index}`,
      removed.join("."),
      removedIndex,
      -1,
    ),
  };
}
