import { Backend } from "@redsun-vn/easyblocks-core";
import React from "react";
import { OpenTemplateModalAction, TEasyblocksEditorMode } from "./types";
type TemplateModalProps = {
    action: OpenTemplateModalAction;
    onClose: () => void;
    backend: Backend;
    mode: TEasyblocksEditorMode;
};
export declare const TemplateModal: React.FC<TemplateModalProps>;
export {};
//# sourceMappingURL=TemplateModal.d.ts.map