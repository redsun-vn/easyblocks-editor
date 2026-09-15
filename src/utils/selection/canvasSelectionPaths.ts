import {
  findComponentDefinitionById,
  parsePath,
} from "@redsun-vn/easyblocks-core/_internals";
import type { EditorContextType } from "../../EditorContext";
import { pathToCompiledPath } from "../../pathToCompiledPath";
import {
  RICH_TEXT_PART_CONFIG_PATH_REGEXP,
  isConfigPathRichTextPart,
} from "../isConfigPathRichTextPart";
import { dotNotationGet } from "../object/dotNotationGet";

type Translate = (key: string) => string;

type SelectionBreadcrumbItem = {
  path: string;
  label: string;
};

/**
 * A selected rich text part is framed by its $richText component, so moving the
 * selection around starts from that component.
 */
function getFramedPath(path: string): string {
  return isConfigPathRichTextPart(path)
    ? path.replace(RICH_TEXT_PART_CONFIG_PATH_REGEXP, "")
    : path;
}

/**
 * A path that no longer points at a component entry (e.g. the item was just removed)
 * resolves to its closest existing ancestor with a leftover field name.
 */
function isComponentPath(path: string, editorContext: EditorContextType) {
  return parsePath(path, editorContext.form).fieldName === undefined;
}

/**
 * Whether the component at `path` renders inside a selection frame on the canvas.
 * Mirrors rendering: the page root has no frame, children of `noInline` slots are built
 * without EditableComponentBuilder, and BlocksControls skips the frame for compiled
 * components marked `noInline` (`selectable: false` in editing info).
 */
function hasSelectionFrame(
  path: string,
  editorContext: EditorContextType,
): boolean {
  const { parent } = parsePath(path, editorContext.form);

  if (!parent) {
    return false;
  }

  const schemaProp = findComponentDefinitionById(
    parent.templateId,
    editorContext,
  )?.schema.find((schemaProp) => schemaProp.prop === parent.fieldName);

  if (!schemaProp || ("noInline" in schemaProp && schemaProp.noInline)) {
    return false;
  }

  const compiledComponent = dotNotationGet(
    editorContext.compiledComponentConfig,
    pathToCompiledPath(path, editorContext),
  );

  return (
    compiledComponent !== undefined && !compiledComponent.__editing?.noInline
  );
}

/**
 * Framed components that contain `path`, nearest first: the layers a user can move the
 * selection up to from the canvas.
 */
function getSelectableAncestorPaths(
  path: string,
  editorContext: EditorContextType,
): Array<string> {
  const ancestorPaths: Array<string> = [];

  try {
    const framedPath = getFramedPath(path);

    if (!isComponentPath(framedPath, editorContext)) {
      return [];
    }

    if (framedPath !== path && hasSelectionFrame(framedPath, editorContext)) {
      ancestorPaths.push(framedPath);
    }

    let parent = parsePath(framedPath, editorContext.form).parent;

    while (parent) {
      if (hasSelectionFrame(parent.path, editorContext)) {
        ancestorPaths.push(parent.path);
      }

      parent = parsePath(parent.path, editorContext.form).parent;
    }
  } catch {
    return [];
  }

  return ancestorPaths;
}

/**
 * Focus after "select parent": the nearest framed ancestor of every focused item, once
 * each. Top-level sections have no framed parent, so selecting their parent clears focus.
 */
function getParentFocusedFields(
  focusedFields: Array<string>,
  editorContext: EditorContextType,
): Array<string> {
  const parentPaths = focusedFields.flatMap((focusedField) =>
    getSelectableAncestorPaths(focusedField, editorContext).slice(0, 1),
  );

  return Array.from(new Set(parentPaths));
}

/**
 * Component name shown by canvas selection UI (hover label, breadcrumb). Falls back to
 * the component id when its definition has no label.
 */
function getComponentLabel(
  templateId: string,
  editorContext: EditorContextType,
  translate: Translate,
): string {
  const definition = findComponentDefinitionById(templateId, editorContext);

  return translate(definition?.label ?? templateId);
}

/**
 * Breadcrumb for a focused path: framed ancestors outermost first, then the framed
 * selection itself. Empty when the path no longer points at a component.
 */
function getSelectionBreadcrumb(
  path: string,
  editorContext: EditorContextType,
  translate: Translate,
): Array<SelectionBreadcrumbItem> {
  try {
    const framedPath = getFramedPath(path);

    if (!isComponentPath(framedPath, editorContext)) {
      return [];
    }

    return getSelectableAncestorPaths(framedPath, editorContext)
      .reverse()
      .concat(framedPath)
      .map((crumbPath) => ({
        path: crumbPath,
        label: getComponentLabel(
          parsePath(crumbPath, editorContext.form).templateId,
          editorContext,
          translate,
        ),
      }));
  } catch {
    return [];
  }
}

export {
  getComponentLabel,
  getParentFocusedFields,
  getSelectableAncestorPaths,
  getSelectionBreadcrumb,
};

export type { SelectionBreadcrumbItem };
