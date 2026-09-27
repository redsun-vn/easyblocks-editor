import { dotNotationGet } from "@/utils/object/dotNotationGet";
import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { findComponentDefinition } from "@redsun-vn/easyblocks-core/_internals";
import { isEntry } from "../../dropShape/collectionSlots";
import {
  resolveShapeForSlot,
  resolveWrapperLevels,
} from "../../dropShape/editorShapeAdapters";

/** Where a drop landed, as the canvas reported it. */
export type PanelDropTargetSlot = {
  /** Dot path of the component owning the collection; empty for the document root. */
  parentPath: string;
  prop: string;
  index: number;
};

export type PanelInsertion = {
  /** Dot path of the array to splice into, which `insertItem` takes as `name`. */
  name: string;
  index: number;
  block: NoCodeComponentEntry;
};

/**
 * Turning a drop into an insertion: where the array is, and what shape goes in it.
 *
 * Both halves are needed together because they answer each other. A column that
 * accepts a mini cart directly wants the mini cart, while the page root wants the
 * row and column around it, and the only thing that decides between them is what
 * the collection accepts — never the component, and never a setting on the
 * template.
 *
 * `null` means nothing should be inserted. That is the only guard there is:
 * `insertItem` splices the block into the array as given, without consulting
 * `accepts`, so a caller that ignores a `null` here writes a child into a slot
 * that cannot hold it.
 */
export function resolvePanelInsertion({
  entry,
  target,
  editorContext,
}: {
  entry: NoCodeComponentEntry;
  target: PanelDropTargetSlot;
  editorContext: any;
}): PanelInsertion | null {
  const parentEntry =
    target.parentPath === ""
      ? editorContext.form.values
      : dotNotationGet(editorContext.form.values, target.parentPath);

  if (!isEntry(parentEntry)) {
    return null;
  }

  const parentDefinition = findComponentDefinition(parentEntry, editorContext);

  const slot = parentDefinition?.schema.find(
    (schemaProp) =>
      schemaProp.prop === target.prop &&
      schemaProp.type === "component-collection",
  ) as { accepts?: string[] } | undefined;

  if (!slot?.accepts) {
    return null;
  }

  const block = resolveShapeForSlot({
    entry,
    accepts: slot.accepts,
    wrapperLevels: resolveWrapperLevels({
      templates: editorContext.configTemplates,
      dropWrapperTemplateId: editorContext.dropWrapperTemplateId,
      context: editorContext,
    }),
    context: editorContext,
  });

  if (!block) {
    return null;
  }

  return {
    name:
      target.parentPath === ""
        ? target.prop
        : `${target.parentPath}.${target.prop}`,
    index: target.index,
    block,
  };
}
