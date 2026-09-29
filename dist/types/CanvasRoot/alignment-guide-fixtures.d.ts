import type { PanelDropSlot, SlotChildRect } from "../editorSidebar/editorSections/panelDropSlots";
/** A slot the way the canvas measures one: its bounds are its children's union. */
export declare function slotOf(parentPath: string, prop: string, children: Array<SlotChildRect>): PanelDropSlot;
/** A column of blocks stacked 100px apart, each placed by `left` and `width`. */
export declare function column(blocks: Array<{
    left: number;
    width: number;
}>, parentPath?: string): PanelDropSlot;
/** A drop into a vertical collection just before `index`. */
export declare function aimAt(index: number, y: number, parentPath?: string): {
    parentPath: string;
    prop: string;
    index: number;
    length: number;
    line: {
        axis: "vertical";
        x: number;
        y: number;
        length: number;
    };
};
//# sourceMappingURL=alignment-guide-fixtures.d.ts.map