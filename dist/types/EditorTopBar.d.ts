import { Devices, Locale } from "@redsun-vn/easyblocks-core";
import React from "react";
import { EditorHistory } from "./EditorHistory";
export declare const TOP_BAR_HEIGHT = 40;
export declare const EditorTopBar: React.FC<{
    name?: string;
    saveLabel: string;
    onClose?: () => void;
    onSaveDocument?: () => void;
    onConfigChange?: () => Promise<void>;
    editorHistoryInstance: EditorHistory;
    isSaving?: boolean;
    onIsEditingChange: () => void;
    viewport: string;
    onViewportChange: (viewport: string) => void;
    devices: Devices;
    isEditing: boolean;
    onUndo: () => void;
    onRedo: () => void;
    locales: Locale[];
    locale: string;
    onLocaleChange: (locale: string) => void;
    hideCloseButton: boolean;
    readOnly: boolean;
}>;
//# sourceMappingURL=EditorTopBar.d.ts.map