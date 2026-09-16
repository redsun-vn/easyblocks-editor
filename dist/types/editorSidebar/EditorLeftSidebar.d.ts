import { IThemeConfig } from "@redsun-vn/easyblocks-core";
import React from "react";
import { TEasyblocksEditorMode, TLeftSidebar } from "../types";
interface TEditorLeftSidebar {
    showLeftSidebar: TLeftSidebar | null;
    globalSections: IThemeConfig["globalSections"];
    sidebarNodeRef?: React.MutableRefObject<HTMLDivElement | null>;
    editorMode: TEasyblocksEditorMode;
}
export declare const EditorLeftSidebar: ({ showLeftSidebar, globalSections, sidebarNodeRef, editorMode, }: TEditorLeftSidebar) => React.JSX.Element;
export {};
//# sourceMappingURL=EditorLeftSidebar.d.ts.map