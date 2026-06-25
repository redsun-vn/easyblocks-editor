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
