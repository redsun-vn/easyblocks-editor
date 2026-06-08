import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { FC } from "react";
import { TemplatePicker } from "./TemplatePicker";
import { OpenComponentPickerConfig, TEasyblocksEditorMode } from "./types";
type ModalProps = {
    config: OpenComponentPickerConfig;
    onClose: (config?: NoCodeComponentEntry) => void;
    pickers?: Record<string, TemplatePicker>;
    editorMode: TEasyblocksEditorMode;
};
export declare const ModalPicker: FC<ModalProps>;
export {};
//# sourceMappingURL=ModalPicker.d.ts.map