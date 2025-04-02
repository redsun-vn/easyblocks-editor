import { Devices, Locale } from "@redsun-vn/easyblocks-core";
import React from "react";
export declare const TOP_BAR_HEIGHT = 40;
export declare const EditorTopBar: React.FC<{
    saveLabel: string;
    onClose?: () => void;
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
    onAdminModeChange: (x: boolean) => void;
    hideCloseButton: boolean;
    readOnly: boolean;
}>;
//# sourceMappingURL=EditorTopBar.d.ts.map