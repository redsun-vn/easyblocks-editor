import { type PanelDropSlot } from "../editorSidebar/editorSections/panelDropSlots";
/**
 * Path of the frame painted on top at a point, or `null` over open canvas.
 *
 * Paint order, not geometry: a sticky header keeps its place while the page
 * scrolls underneath, so two frames can contain the same point and the deeper
 * one is the one nobody can see.
 */
export declare function topmostFramePath(doc: Document, pointer: {
    x: number;
    y: number;
}): string | null;
export declare function collectPanelDropSlots(doc: Document, editorContext: any): Array<PanelDropSlot>;
//# sourceMappingURL=collectPanelDropSlots.d.ts.map