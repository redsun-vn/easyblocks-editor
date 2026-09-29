import { ResizeChoice } from "./canvas-resize-fields";
import { ResizeStep } from "./resize-step-resolver";
/**
 * What a handle needs to know about the block on the canvas, read from the
 * page as it is drawn rather than worked out from the config: the canvas is
 * the only place that knows how wide a track came out.
 */
export type ResizeGeometry = {
    /** The block's size along the dragged axis now, in canvas pixels. */
    size: number;
    /** The values a drag can land on, smallest first, each with its size. */
    steps: Array<ResizeStep>;
    /** How the chip names a value: `7/12` for a span. */
    describe: (value: string) => string;
    /**
     * Where the block's content sits inside its frame, when that is narrower
     * than the frame — a picture held to a max width. The handles hang from it
     * so they sit on the edge that actually moves.
     */
    content?: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    /**
     * The values are aspect ratios, so the height they give follows the width.
     * A corner drag then changes the width alone and the ratio carries the
     * height along, the way a picture is scaled in any design tool.
     */
    followsWidth?: boolean;
};
/** The selected block's frame on the canvas, and the canvas window it is in. */
export declare function findCanvasFrame(path: string): {
    frame: HTMLElement;
    view: Window;
} | null;
/**
 * The block's size and the values a drag can reach, or `null` when a drag
 * could not change anything the page shows — then no handle is offered.
 *
 * Whole numbers across a block's sides are grid spans; everything else is a
 * length of some kind.
 */
export declare function readResizeGeometry({ path, axis, choices, }: {
    path: string;
    axis: "x" | "y";
    choices: ReadonlyArray<ResizeChoice>;
}): ResizeGeometry | null;
//# sourceMappingURL=canvas-resize-geometry.d.ts.map