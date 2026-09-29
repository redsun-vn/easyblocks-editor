import { dotNotationGet } from "@/utils/object/dotNotationGet";
import { buildTinaFieldsForSelection } from "../buildTinaFields";
import { parseSlotPath } from "../editorSidebar/editorSections/panelDropSlots";
import { EditorContextType } from "../EditorContext";
import { RunChangeOptions } from "../types";
import {
  CanvasResizeField,
  writeCanvasResizeValue,
} from "./canvas-resize-fields";

/**
 * The parent switch a drag has to turn on before it can step in its unit,
 * when the field names one and the parent has it off. A row stores its
 * columns' widths in tracks of its own until its twelve-track grid is on;
 * turning it on first gives every drag the same twelve steps.
 */
export function pendingSwitch(
  resizeField: CanvasResizeField | undefined,
  path: string,
  formValues: Record<string, unknown>,
): { parentPath: string; prop: string; tracks: number } | null {
  const parentSwitch = resizeField?.option.parentSwitch;
  const parentPath = parseSlotPath(path)?.parentPath;

  if (!parentSwitch || !parentPath) {
    return null;
  }

  const isOn = dotNotationGet(formValues, `${parentPath}.${parentSwitch.prop}`);

  return isOn === true ? null : { parentPath, ...parentSwitch };
}

/**
 * Turns the parent switch on the way the panel's own switch would, so the
 * parent's change rules rewrite the columns' stored widths and the page does
 * not move.
 */
export function turnSwitchOn({
  pending,
  editorContext,
  configAfterAuto,
  history,
}: {
  pending: NonNullable<ReturnType<typeof pendingSwitch>>;
  editorContext: EditorContextType;
  configAfterAuto: Record<string, any>;
  history: RunChangeOptions["history"];
}) {
  const field = buildTinaFieldsForSelection(
    [pending.parentPath],
    editorContext,
  ).find((candidate) => candidate.schemaProp.prop === pending.prop);

  if (!field) {
    return false;
  }

  writeCanvasResizeValue({
    field,
    value: true,
    editorContext,
    configAfterAuto,
    history,
  });

  return true;
}
