import { SelectionFramePositionChangedEvent } from "@redsun-vn/easyblocks-core/_internals";
import { CanvasResizeField } from "./canvas-resize-fields";
import type { EditorContextType } from "../EditorContext";
/** The selected block's box, in canvas pixels, as the position messages give it. */
export type TargetBox = {
    top: number;
    left: number;
    width: number;
    height: number;
};
export declare function isPositionChanged(data: unknown): data is SelectionFramePositionChangedEvent["data"];
/** What a drag of this field could reach on the page now, if anything. */
export declare function geometryOf(path: string, resizeField: CanvasResizeField | undefined, types: EditorContextType["types"]): import("./canvas-resize-geometry").ResizeGeometry | null;
/** The name of the breakpoint being edited, for the chip. */
export declare function deviceLabel({ devices, breakpointIndex, }: {
    devices: Array<{
        id: string;
        label?: string;
    }>;
    breakpointIndex: string;
}): string;
//# sourceMappingURL=resize-handles-helpers.d.ts.map