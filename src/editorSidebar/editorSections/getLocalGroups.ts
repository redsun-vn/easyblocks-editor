import { ComponentSchemaProp } from "@redsun-vn/easyblocks-core";
import { findComponentDefinition } from "@redsun-vn/easyblocks-core/_internals";
import { EditorContextType } from "../../EditorContext";
import { unrollAcceptsFieldIntoComponents } from "../../unrollAcceptsFieldIntoComponents";

// Shared local-group derivation, used by both the EditorSections sidebar and the
// TemplateModal group field so they show the same set of local component groups.

// Components the root "data" field accepts (the local section components).
export const getLocalComponents = (
  editorContext: EditorContextType,
): any[] => {
  const schemaProp = findComponentDefinition(
    editorContext.form.values,
    editorContext,
  )?.schema.find((x) => x.prop === "data") as ComponentSchemaProp;

  return unrollAcceptsFieldIntoComponents(schemaProp?.accepts, editorContext);
};

// Distinct `.group` values of the visible local components ("others" when unset).
export const getLocalGroups = (localComponents: any[]): string[] => {
  const groups = new Set<string>();
  localComponents.forEach((component: any) => {
    if (component.visible === false) return;
    groups.add(component.group || "others");
  });

  return [...groups];
};

/**
 * Display label for a component category.
 *
 * Categories travel through the config as plain strings ("Layout", "Content"),
 * because that is what a component definition writes into `.group`. The editor
 * has no list of the host app's categories, so the translation file decides:
 * a `definition.category.<lowercased>` entry means "this is a known built-in
 * category, here is its localized name".
 *
 * `t` returns the key unchanged when it is missing, and that is exactly the
 * signal used here — a shop's own group string ("Banner tết") has no entry, so
 * the raw string is shown instead of a half-translated key. Without that check
 * every unknown group would render as `definition.category.banner tết`.
 */
export const getCategoryLabel = (
  t: (key: string) => string,
  group: string,
): string => {
  const raw = group.trim();
  if (!raw) return group;

  const key = `definition.category.${raw.toLowerCase()}`;
  const translated = t(key);

  return translated === key ? group : translated;
};
