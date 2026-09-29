import React from "react";
import { type PanelDropAim } from "../editorSidebar/editorSections/panelDropSlots";
/**
 * Receiving an item dragged out of a sidebar panel.
 *
 * The panel lives in the parent window and the canvas in an iframe, so the
 * `@dnd-kit` context that moves blocks around inside the canvas cannot see this
 * gesture at all — its sensors read pointer events, and a pointer event belongs
 * to one document. Native drag events are the exception that crosses the
 * boundary, so this listens for those.
 *
 * It only ever answers with a position. Which item is being dragged stays in
 * the panel: a browser withholds a drag's contents until the drop, so there is
 * nothing here to read at the moment the canvas has to decide whether to accept
 * one anyway.
 *
 * The position is now a collection and an index within it, not an index into the
 * page. Aiming only at the root meant a pointer released inside a column was
 * answered with a gap between two sections instead — the item did arrive, just
 * not where it was aimed, and nothing said so. Which collections can be aimed at
 * is decided by `collectPanelDropSlots`, and a collection has to opt in, so a
 * document of older components still has exactly one answer available.
 */
export declare const ACCENT = "#7B70F5";
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