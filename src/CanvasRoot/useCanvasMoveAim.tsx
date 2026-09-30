import { dotNotationGet } from "@/utils/object/dotNotationGet";
import { toArray } from "@/utils/array/toArray";
import type { CollisionDetection } from "@dnd-kit/core";
import { findComponentDefinition } from "@redsun-vn/easyblocks-core/_internals";
import React, { useCallback, useRef, useState } from "react";
import { getCollectionSlots, isEntry } from "../dropShape/collectionSlots";
import {
  parseSlotPath,
  type PanelDropSlot,
} from "../editorSidebar/editorSections/panelDropSlots";
import {
  resolveCanvasMoveAim,
  toItemMove,
  type CanvasMoveAim,
} from "./canvasMoveAim";
import {
  collectPanelDropSlots,
  topmostFramePath,
} from "./collectPanelDropSlots";
import { InsertionLine } from "./usePanelDropTarget";

/**
 * Whether the block at `path` sits in a collection that opted in with
 * `panelDropTarget`. Answered from the schema alone, before anything on the
 * canvas is measured, so a drag inside older components costs nothing extra
 * and runs exactly the code it always did.
 */
function isInOptedInCollection(path: string, editorContext: any) {
  const parsed = parseSlotPath(path);

  if (!parsed || parsed.parentPath === "") {
    return false;
  }

  const parent = dotNotationGet(editorContext.form.values, parsed.parentPath);
  const definition = isEntry(parent)
    ? findComponentDefinition(parent, editorContext)
    : undefined;

  return (
    !!definition &&
    getCollectionSlots(definition as any).some(
      (slot) => slot.prop === parsed.prop && slot.panelDropTarget,
    )
  );
}

/** The collection a block-by-block collision stands for. */
function collectionOfCollision(
  collisions: ReturnType<CollisionDetection>,
): string | null {
  const container = collisions[0]?.data?.droppableContainer;
  const path = container?.data.current?.path;

  if (typeof path !== "string") {
    return null;
  }

  // An empty collection's placeholder already carries the collection's path.
  return String(container.id).startsWith("placeholder.")
    ? path
    : path.split(".").slice(0, -1).join(".");
}

/**
 * Keeps the current line when the next one is the same, so a line that has
 * not moved does not re-render the page at pointer rate.
 */
function keepIfSame<Line extends CanvasMoveAim["line"]>(next: Line | null) {
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

/**
 * Column-aware aiming for a block dragged on the canvas. See `canvasMoveAim`.
 *
 * Wraps the block-by-block collision detection: when the aim applies it reports
 * no collision at all, so no block frame claims a drop that is going somewhere
 * else, and the insertion line drawn here is the only answer on screen.
 */
export function useCanvasMoveAim(
  editorContext: any,
  fallback: CollisionDetection,
) {
  const aimRef = useRef<CanvasMoveAim | null>(null);
  const [line, setLine] = useState<CanvasMoveAim["line"] | null>(null);

  const collisionDetection = useCallback<CollisionDetection>(
    (args) => {
      const legacy = fallback(args);
      const fromPath = args.active.data.current?.path;
      const pointer = args.pointerCoordinates;

      aimRef.current = null;

      if (
        typeof fromPath !== "string" ||
        !pointer ||
        !isInOptedInCollection(fromPath, editorContext)
      ) {
        return legacy;
      }

      const dragged = dotNotationGet(editorContext.form.values, fromPath);
      const definition = isEntry(dragged)
        ? findComponentDefinition(dragged, editorContext)
        : undefined;

      if (!definition) {
        return legacy;
      }

      const ids = [definition.id, ...toArray(definition.type ?? [])];
      const canHold = (slot: PanelDropSlot) =>
        (slot.accepts ?? []).some((accepted) => ids.includes(accepted));

      const slots = collectPanelDropSlots(document, editorContext);

      aimRef.current = resolveCanvasMoveAim({
        slots,
        fromPath,
        topmostPath: topmostFramePath(document, pointer),
        pointer,
        legacyOverPath: collectionOfCollision(legacy),
        canHold,
      });

      return aimRef.current ? [] : legacy;
    },
    [editorContext, fallback],
  );

  /**
   * Keeps the line in step with the aim; collision detection cannot set state.
   * Only a changed gap is stored: the state lives above the whole document, so
   * a new object on every pointer move would render the page at pointer rate.
   */
  const onDragMove = useCallback(() => {
    setLine(keepIfSame(aimRef.current?.line ?? null));
  }, []);

  /**
   * The move this drag ends in, `"none"` when the aim applies but the block
   * would stay put, or `null` when the block-by-block outcome decides.
   */
  const takeMove = useCallback((fromPath: string) => {
    const aim = aimRef.current;

    aimRef.current = null;
    setLine(null);

    if (!aim) {
      return null;
    }

    return toItemMove(aim, fromPath) ?? "none";
  }, []);

  const clear = useCallback(() => {
    aimRef.current = null;
    setLine(null);
  }, []);

  const indicator = line ? <InsertionLine line={line} /> : null;

  return { collisionDetection, onDragMove, takeMove, clear, indicator };
}
