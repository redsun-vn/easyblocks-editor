import React from "react";
import { type PanelDropAim } from "../editorSidebar/editorSections/panelDropSlots";
/**
 * The line that says where the item would land.
 *
 * Drawn in the canvas rather than as a cursor decoration because the answer is
 * about the page, not the pointer: the same pointer position means a different
 * gap depending on which block it is over.
 *
 * It follows the collection rather than always lying flat. A row of columns is
 * filled across, so a horizontal line in it would sit along a column instead of
 * between two, pointing at the wrong gap — and it is only as long as the
 * collection it belongs to, because a line spanning the window says "between two
 * sections" no matter which column it was actually drawn for.
 */
export declare function InsertionLine({ line }: {
    line: PanelDropAim["line"];
}): React.JSX.Element;
export declare function usePanelDropTarget(editorContext: any): React.JSX.Element | null;
//# sourceMappingURL=usePanelDropTarget.d.ts.map