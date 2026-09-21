function editorVariable<T extends string>(name: T): `--shopstory-editor-${T}` {
  return `--shopstory-editor-${name}`;
}

const BEFORE_ADD_BUTTON_DISPLAY = editorVariable("before-add-button-display");
const BEFORE_ADD_BUTTON_TOP = editorVariable("before-add-button-top");
const BEFORE_ADD_BUTTON_LEFT = editorVariable("before-add-button-left");

const AFTER_ADD_BUTTON_DISPLAY = editorVariable("after-add-button-display");
const AFTER_ADD_BUTTON_TOP = editorVariable("after-add-button-top");
const AFTER_ADD_BUTTON_LEFT = editorVariable("after-add-button-left");

/**
 * The action bar's own position.
 *
 * Its own, and that is the point: it used to read the add button's, which is
 * the middle of the block's top edge — right for a small circle, and the reason
 * a bar six buttons wide sat across the content above the block.
 */
const SELECTION_ACTIONS_DISPLAY = editorVariable("selection-actions-display");
const SELECTION_ACTIONS_TOP = editorVariable("selection-actions-top");
const SELECTION_ACTIONS_LEFT = editorVariable("selection-actions-left");

export {
  BEFORE_ADD_BUTTON_DISPLAY,
  BEFORE_ADD_BUTTON_TOP,
  BEFORE_ADD_BUTTON_LEFT,
  AFTER_ADD_BUTTON_DISPLAY,
  AFTER_ADD_BUTTON_TOP,
  AFTER_ADD_BUTTON_LEFT,
  SELECTION_ACTIONS_DISPLAY,
  SELECTION_ACTIONS_TOP,
  SELECTION_ACTIONS_LEFT,
};
