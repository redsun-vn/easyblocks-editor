import { NoCodeComponentEntry, Template } from "@redsun-vn/easyblocks-core";
import { findComponentDefinitionById } from "@redsun-vn/easyblocks-core/_internals";
import { GetShapeDefinition } from "./collectionSlots";
import { peelPackagingWrapper } from "./peelPackagingWrapper";
import { resolveDropShape } from "./resolveDropShape";
import { resolveWrapperChain, WrapperLevel } from "./resolveWrapperChain";

/**
 * What connects the shape rule to the editor it runs inside.
 *
 * The rule itself takes a plain "look this component up" function so it can be
 * tested without building a compilation context. These are the three places the
 * editor supplies that function, kept together so the three insertion paths —
 * a drop from the panel, a pick from the add dialog, and a paste — cannot drift
 * into disagreeing about what a dropped block should look like.
 */

/** Both an editor context and a compilation context can answer this. */
export function getShapeDefinition(context: any): GetShapeDefinition {
  return (componentId: string) =>
    findComponentDefinitionById(componentId, context) as any;
}

/**
 * The nesting the host app wraps a loose component in, read off the template it
 * named in its config. Empty when the app named none, which turns wrapping off
 * and leaves a drop that does not fit to be refused.
 */
export function resolveWrapperLevels({
  templates,
  dropWrapperTemplateId,
  context,
}: {
  templates: Array<Template> | undefined;
  dropWrapperTemplateId: string | undefined;
  context: any;
}): Array<WrapperLevel> {
  if (!dropWrapperTemplateId) {
    return [];
  }

  const template = (templates ?? []).find(
    (candidate) => candidate.id === dropWrapperTemplateId,
  );

  return template?.entry
    ? resolveWrapperChain(template.entry, getShapeDefinition(context))
    : [];
}

/** The payload inside a template, with packaging rows and columns taken off. */
export function coreOf(
  entry: NoCodeComponentEntry,
  context: any,
): NoCodeComponentEntry {
  return peelPackagingWrapper(entry, getShapeDefinition(context));
}

/**
 * The shape an entry should take to land in a slot, or `null` when none fits.
 */
export function resolveShapeForSlot({
  entry,
  accepts,
  wrapperLevels,
  context,
}: {
  entry: NoCodeComponentEntry;
  accepts: Array<string> | undefined;
  wrapperLevels: Array<WrapperLevel>;
  context: any;
}): NoCodeComponentEntry | null {
  if (!accepts) {
    return null;
  }

  return resolveDropShape({
    entry,
    accepts,
    wrapperLevels,
    getDefinition: getShapeDefinition(context),
  });
}
