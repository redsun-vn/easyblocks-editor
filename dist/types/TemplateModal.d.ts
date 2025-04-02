import React from "react";
import { OpenTemplateModalAction } from "./types";
import { Backend } from "@redsun-vn/easyblocks-core";
type TemplateModalProps = {
    action: OpenTemplateModalAction;
    onClose: () => void;
    backend: Backend;
};
export declare const TemplateModal: React.FC<TemplateModalProps>;
export {};
//# sourceMappingURL=TemplateModal.d.ts.map