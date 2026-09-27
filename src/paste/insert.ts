import { includesAny } from "@/utils/array/includesAny";
import {
  ComponentCollectionSchemaProp,
  ComponentSchemaProp,
  NoCodeComponentEntry,
  SchemaProp,
} from "@redsun-vn/easyblocks-core";
import {
  CompilationContextType,
  duplicateConfig,
  findComponentDefinition,
} from "@redsun-vn/easyblocks-core/_internals";
import { resolveShapeForSlot } from "../dropShape/editorShapeAdapters";
import { WrapperLevel } from "../dropShape/resolveWrapperChain";
import { Form } from "../form";
import { normalizeToStringArray } from "../normalizeToStringArray";
import { reconcile } from "./reconcile";

const getTypes = (schema?: SchemaProp) => {
  if (schema?.type === "component-collection" || schema?.type === "component") {
    return (schema as ComponentCollectionSchemaProp | ComponentSchemaProp)
      .accepts;
  }
  return [];
};

const insertCommand = ({
  context,
  form,
  schema,
  templateId,
  wrapperLevels = [],
}: {
  context: CompilationContextType;
  form: Form;
  schema?: SchemaProp;
  templateId?: string;
  /**
   * The host app's wrapper nesting, when it declared one. Left empty a paste
   * behaves exactly as it always has: it fits or it is refused.
   */
  wrapperLevels?: Array<WrapperLevel>;
}) => {
  const types = getTypes(schema);

  const reconcileItem = reconcile({
    context,
    templateId,
    fieldName: schema?.prop,
  });

  return (path: string, index: number, item: NoCodeComponentEntry) => {
    const itemDefinition = findComponentDefinition(item, context);
    if (!itemDefinition) {
      return null;
    }

    const itemTypes = [
      itemDefinition.id,
      ...normalizeToStringArray(itemDefinition.type),
    ];

    /*
     * A paste is reshaped for where it lands, the same way a drop is: pasting a
     * section into a column that accepts its contents directly leaves the row
     * and column behind rather than nesting them pointlessly.
     *
     * Only for a slot that asked for it. Reshaping every paste would change what
     * lands in containers that predate this rule, and those are the ones with
     * documents already built on today's behaviour — so a slot that never opted
     * in runs the original expression and nothing else. The gate is the same one
     * the canvas uses, read off the slot rather than guessed from the content.
     */
    const isShapedSlot =
      (schema as { panelDropTarget?: boolean } | undefined)?.panelDropTarget ===
      true;

    let shaped = item;

    if (isShapedSlot) {
      const alternative = resolveShapeForSlot({
        entry: item,
        accepts: types,
        wrapperLevels,
        context,
      });

      if (!alternative) {
        return null;
      }

      shaped = alternative;
    } else if (!includesAny(types, itemTypes)) {
      return null;
    }

    const reconciledItem = reconcileItem(shaped);
    const duplicatedItem = duplicateConfig(reconciledItem, context);

    form.mutators.insert(path, index, duplicatedItem);

    return `${path}.${index}`;
  };
};

export { insertCommand };
