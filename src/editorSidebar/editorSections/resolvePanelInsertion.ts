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
  ) as { accepts?: string[]; panelDropTarget?: boolean } | undefined;

  if (!slot?.accepts) {
    return null;
  }

  /*
   * Only a slot that opted in gets reshaped. Everything else takes the entry
   * exactly as its author wrote it, which is what this code did before any of
   * this existed.
   *
   * That matters in two directions. A document built out of components that
   * predate the rule has no opted-in slot anywhere, so every drop it can make
   * lands byte for byte as before. And the page root does not opt in either, so
   * a section template dropped there keeps the band its author drew — without
   * this, a row holding one section-typed block would be unwrapped on the way
   * in and the band's own padding would go with it.
   */
  const block = slot.panelDropTarget
    ? resolveShapeForSlot({
        entry,
        accepts: slot.accepts,
        wrapperLevels: resolveWrapperLevels({
          templates: editorContext.configTemplates,
          dropWrapperTemplateId: editorContext.dropWrapperTemplateId,
          context: editorContext,
        }),
        context: editorContext,
      })
    : entry;

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
