import { SelectionFramePositionChangedEvent } from "@redsun-vn/easyblocks-core/_internals";
import { CanvasResizeField, canvasResizeChoices } from "./canvas-resize-fields";
import { readResizeGeometry } from "./canvas-resize-geometry";
import type { EditorContextType } from "../EditorContext";

/** The selected block's box, in canvas pixels, as the position messages give it. */
export type TargetBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function isPositionChanged(
  data: unknown,
): data is SelectionFramePositionChangedEvent["data"] {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { type?: unknown }).type ===
      "@easyblocks-editor/selection-frame-position-changed"
  );
}

/** What a drag of this field could reach on the page now, if anything. */
export function geometryOf(
  path: string,
  resizeField: CanvasResizeField | undefined,
  types: EditorContextType["types"],
) {
  return resizeField
    ? readResizeGeometry({
        path,
        axis: resizeField.option.axis,
        choices: canvasResizeChoices(resizeField, types),
      })
    : null;
}

/** The name of the breakpoint being edited, for the chip. */
export function deviceLabel({
  devices,
  breakpointIndex,
}: {
  devices: Array<{ id: string; label?: string }>;
  breakpointIndex: string;
}) {
  const device = devices.find((candidate) => candidate.id === breakpointIndex);
  return device?.label ?? breakpointIndex;
}
