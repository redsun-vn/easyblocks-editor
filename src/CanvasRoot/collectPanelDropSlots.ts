import { dotNotationGet } from "@/utils/object/dotNotationGet";
import { findComponentDefinition } from "@redsun-vn/easyblocks-core/_internals";
import { getCollectionSlots, isEntry } from "../dropShape/collectionSlots";
import { CANVAS_FRAME_PATH_ATTRIBUTE } from "../EditableComponentBuilder/canvasLayers";
import {
  parseSlotPath,
  type PanelDropSlot,
  type SlotBounds,
} from "../editorSidebar/editorSections/panelDropSlots";

/**
 * Reading the collections a panel drop could land in off the canvas.
 *
 * Every editable frame already carries its own dot path, at every depth — the
 * gesture was ignoring all but the root ones, not working from a canvas that
 * lacked the information. So this measures what is drawn and groups the frames by
 * the collection holding them.
 *
 * A collection only appears here if its schema prop asked to, with
 * `panelDropTarget`. That gate is the whole reason nothing changes for a document
 * built out of components that predate this: their slots do not set the flag, so
 * the only collection ever offered is the root one, which is all the gesture
 * could reach before.
 */

function toBounds(rect: DOMRect): SlotBounds {
  return {
    top: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
  };
}

function union(a: SlotBounds, b: SlotBounds): SlotBounds {
  return {
    top: Math.min(a.top, b.top),
    bottom: Math.max(a.bottom, b.bottom),
    left: Math.min(a.left, b.left),
    right: Math.max(a.right, b.right),
  };
}

const slotKey = (parentPath: string, prop: string) => `${parentPath}|${prop}`;

export function collectPanelDropSlots(
  doc: Document,
  editorContext: any,
): Array<PanelDropSlot> {
  const slots = new Map<string, PanelDropSlot>();

  /*
   * The root collection is seeded rather than discovered, because a page with no
   * sections draws no frames at all and still has to accept the first thing
   * anybody drags onto it. Its bounds cover the canvas so that a drop over open
   * space below the last section still finds it.
   */
  slots.set(slotKey("", "data"), {
    parentPath: "",
    prop: "data",
    children: [],
    bounds: {
      top: 0,
      left: 0,
      right: Math.max(doc.documentElement.clientWidth, 0),
      bottom: Math.max(
        doc.documentElement.scrollHeight,
        doc.documentElement.clientHeight,
      ),
    },
  });

  const frames = Array.from(
    doc.querySelectorAll(`[${CANVAS_FRAME_PATH_ATTRIBUTE}]`),
  );

  const entryAt = (path: string): unknown =>
    path === ""
      ? editorContext.form.values
      : dotNotationGet(editorContext.form.values, path);

  const slotsOf = (path: string) => {
    const entry = entryAt(path);

    if (!isEntry(entry)) {
      return [];
    }

    const definition = findComponentDefinition(entry, editorContext);

    return definition ? getCollectionSlots(definition as any) : [];
  };

  const isOptedIn = (parentPath: string, prop: string) =>
    slotsOf(parentPath).some(
      (slot) => slot.prop === prop && slot.panelDropTarget,
    );

  // Collections that already hold something: each child contributes its own
  // rectangle, and the collection's area is everything its children cover.
  for (const element of frames) {
    const path = element.getAttribute(CANVAS_FRAME_PATH_ATTRIBUTE);

    if (!path) {
      continue;
    }

    const parsed = parseSlotPath(path);

    if (!parsed) {
      continue;
    }

    // The root stays available without opting in, since that is where every panel
    // drop went before this existed.
    if (parsed.parentPath !== "" && !isOptedIn(parsed.parentPath, parsed.prop)) {
      continue;
    }

    const bounds = toBounds(element.getBoundingClientRect());
    const key = slotKey(parsed.parentPath, parsed.prop);
    const existing = slots.get(key);
    const childRect = { index: parsed.index, ...bounds };

    if (existing) {
      existing.children.push(childRect);
      // The seeded root keeps its canvas-wide area; every other collection is only
      // as big as what it holds.
      if (parsed.parentPath !== "") {
        existing.bounds = existing.children.length === 1
          ? bounds
          : union(existing.bounds, bounds);
      }
      continue;
    }

    slots.set(key, {
      parentPath: parsed.parentPath,
      prop: parsed.prop,
      children: [childRect],
      bounds,
    });
  }

  // Empty collections have no children to measure, so their own component's frame
  // stands in. Without this an empty column could not be aimed at, and an empty
  // column is exactly what somebody building a page drops the first thing into.
  for (const element of frames) {
    const path = element.getAttribute(CANVAS_FRAME_PATH_ATTRIBUTE);

    if (!path) {
      continue;
    }

    for (const slot of slotsOf(path)) {
      if (!slot.panelDropTarget) {
        continue;
      }

      const key = slotKey(path, slot.prop);

      if (slots.has(key)) {
        continue;
      }

      slots.set(key, {
        parentPath: path,
        prop: slot.prop,
        children: [],
        bounds: toBounds(element.getBoundingClientRect()),
      });
    }
  }

  return [...slots.values()];
}
