import type { EditorContextType } from "../../EditorContext";
type Translate = (key: string) => string;
type SelectionBreadcrumbItem = {
    path: string;
    label: string;
};
/**
 * Framed components that contain `path`, nearest first: the layers a user can move the
 * selection up to from the canvas.
 */
declare function getSelectableAncestorPaths(path: string, editorContext: EditorContextType): Array<string>;
/**
 * Focus after "select parent": the nearest framed ancestor of every focused item, once
 * each. Top-level sections have no framed parent, so selecting their parent clears focus.
 */
declare function getParentFocusedFields(focusedFields: Array<string>, editorContext: EditorContextType): Array<string>;
/**
 * Component name shown by canvas selection UI (hover label, breadcrumb). Falls back to
 * the component id when its definition has no label.
 */
declare function getComponentLabel(templateId: string, editorContext: EditorContextType, translate: Translate): string;
/**
 * Breadcrumb for a focused path: framed ancestors outermost first, then the framed
 * selection itself. Empty when the path no longer points at a component.
 */
declare function getSelectionBreadcrumb(path: string, editorContext: EditorContextType, translate: Translate): Array<SelectionBreadcrumbItem>;
export { getComponentLabel, getParentFocusedFields, getSelectableAncestorPaths, getSelectionBreadcrumb, };
export type { SelectionBreadcrumbItem };
//# sourceMappingURL=canvasSelectionPaths.d.ts.map