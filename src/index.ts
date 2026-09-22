export { EasyblocksEditor } from "./EasyblocksEditor";
export type { ExternalDataChangeHandler } from "./EasyblocksEditorProps";
export { EditorContext, useEditorContext } from "./EditorContext";
// The rail button for the template panel draws this, and so does the picker
// dialog's own components/templates switch in the host app. Two drawings of the
// same glyph would drift, and the two surfaces are meant to read as one choice.
export { TemplateIcon } from "./icons/TemplateIcon";
export type { EditorContextType } from "./EditorContext";
export type {
  SaveAsTemplatePickerProps,
  TemplatePickerProps,
  TemplatesDictionary,
} from "./TemplatePicker";
export type { EditorWindowAPI, TEasyblocksEditorMode } from "./types";
