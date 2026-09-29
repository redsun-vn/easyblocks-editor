import { type PanelDropSlot } from "../editorSidebar/editorSections/panelDropSlots";
import { type AlignmentGuide } from "./alignment-guide-resolver";
import { type CanvasMoveAim } from "./canvasMoveAim";
/**
 * The alignment guide for an aim, from the collection it lands in. The dragged
 * block's own place counts only when it is moving within that collection.
 */
export declare function guideFor(slots: Array<PanelDropSlot>, aim: CanvasMoveAim, fromPath: string): AlignmentGuide | null;
/**
 * Keeps the current line when the next one is the same, so a line that has
 * not moved does not re-render the page at pointer rate.
 */
export declare function keepIfSame<Line extends {
    x: number;
    y: number;
    length: number;
    axis: string;
}>(next: Line | null): (current: Line | null) => Line | null;
//# sourceMappingURL=canvas-move-guide.d.ts.map