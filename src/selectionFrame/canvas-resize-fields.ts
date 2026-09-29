import { toArray } from "@/utils/array/toArray";
import { CanvasResizeOption } from "@redsun-vn/easyblocks-core";
import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import { EditorContextType } from "../EditorContext";
import { createFieldController } from "../tinacms/form-builder/utils/createFieldController";
import {
  ResponsiveFieldDefinition,
  responsiveFieldController,
} from "../tinacms/fields/plugins/ResponsiveField/responsiveFieldController";
import { RunChangeOptions } from "../types";

/** A panel field a handle on the canvas can set, and which way it drags. */
export type CanvasResizeField = {
  field: InternalField;
  option: CanvasResizeOption;
};

function canvasResizeOf(field: InternalField): CanvasResizeOption | undefined {
  return (field.schemaProp as { canvasResize?: CanvasResizeOption })
    .canvasResize;
}

/**
 * The selection's panel fields that opted into a canvas handle.
 *
 * Only a single block: with several selected, one handle would have to mean a
 * size for all of them, and the panel's own field is the better place for that.
 */
export function pickCanvasResizeFields(
  fields: ReadonlyArray<InternalField>,
): Array<CanvasResizeField> {
  return fields.flatMap((field) => {
    const option = canvasResizeOf(field);

    if (!option || toArray(field.name).length !== 1) {
      return [];
    }

    return [{ field, option }];
  });
}

/**
 * The values a drag steps through: the field's own `steps` when it names them,
 * otherwise every option the panel offers, in the panel's order.
 */
export function canvasResizeValues({
  field,
  option,
}: CanvasResizeField): Array<string> {
  if (option.steps) {
    return option.steps;
  }

  const options = (field.schemaProp as { params?: { options?: unknown } })
    .params?.options;

  if (!Array.isArray(options)) {
    return [];
  }

  return options.map((entry) =>
    typeof entry === "object" && entry !== null && "value" in entry
      ? String((entry as { value: unknown }).value)
      : String(entry),
  );
}

/**
 * Writes one value exactly as picking it in the panel would.
 *
 * The same two controllers the panel chains together do the work: the
 * responsive one decides which breakpoint the value belongs to, and the field
 * one runs the change through the editor — a block's own `change` rules
 * included. Only the history is different: every write after the first of a
 * drag folds into the step the first one made.
 */
export function writeCanvasResizeValue({
  field,
  value,
  editorContext,
  configAfterAuto,
  history,
}: {
  field: InternalField;
  value: string;
  editorContext: EditorContextType;
  configAfterAuto: Record<string, any>;
  history: RunChangeOptions["history"];
}) {
  const contextForThisWrite: EditorContextType = {
    ...editorContext,
    actions: {
      ...editorContext.actions,
      runChange: (callback) =>
        editorContext.actions.runChange(callback, { history }),
    },
  };

  const valueField =
    field.component === "responsive2"
      ? responsiveFieldController({
          field: field as ResponsiveFieldDefinition,
          formValues: editorContext.form.values,
          onChange: () => {},
          editorContext,
          valuesAfterAuto: configAfterAuto,
        }).field
      : field;

  createFieldController({
    field: valueField,
    editorContext: contextForThisWrite,
    format: valueField.format,
    parse: valueField.parse,
  }).onChange(value);
}
