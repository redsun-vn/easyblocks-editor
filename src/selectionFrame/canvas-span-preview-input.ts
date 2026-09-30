import { dotNotationGet } from "@/utils/object/dotNotationGet";
import { responsiveValueGet } from "@redsun-vn/easyblocks-core";
import { parseSlotPath } from "../editorSidebar/editorSections/panelDropSlots";

/**
 * What a block's `previewSpans` is asked with, read from the page's values
 * after auto: the parent's values and every sibling's value of the dragged
 * field, each at the breakpoint being edited.
 *
 * The field is an item field, stored on each item under the same suffix —
 * `_itemProps.<parent>.<collection>.<prop>` — so a sibling's value is found by
 * swapping the item's index and keeping the suffix.
 */
export function readSpanPreviewInput({
  fieldName,
  path,
  configAfterAuto,
  breakpointIndex,
}: {
  fieldName: string;
  /** The dragged item's path: `<parent>.<collection>.<index>`. */
  path: string;
  configAfterAuto: Record<string, any>;
  breakpointIndex: string;
}): {
  parent: Record<string, unknown>;
  values: Array<unknown>;
  index: number;
  /** The collection's path, whose items are the grid's items in order. */
  collectionPath: string;
} | null {
  const slot = parseSlotPath(path);

  if (!slot || !fieldName.startsWith(`${path}.`)) {
    return null;
  }

  const suffix = fieldName.slice(path.length);
  const collectionPath = slot.parentPath
    ? `${slot.parentPath}.${slot.prop}`
    : slot.prop;
  const parent = dotNotationGet(configAfterAuto, slot.parentPath);
  const items = dotNotationGet(configAfterAuto, collectionPath);

  // A localised collection keeps its items per locale, and is not a grid a
  // span is drawn on.
  if (
    !parent ||
    typeof parent !== "object" ||
    !Array.isArray(items) ||
    slot.index >= items.length
  ) {
    return null;
  }

  return {
    parent: Object.fromEntries(
      Object.entries(parent).map(([prop, value]) => [
        prop,
        responsiveValueGet(value as any, breakpointIndex),
      ]),
    ),
    values: items.map((_, index) =>
      responsiveValueGet(
        dotNotationGet(configAfterAuto, `${collectionPath}.${index}${suffix}`),
        breakpointIndex,
      ),
    ),
    index: slot.index,
    collectionPath,
  };
}
