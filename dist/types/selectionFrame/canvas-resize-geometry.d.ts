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
};
/**
 * The block's size and the values a drag can reach, or `null` when a drag
 * could not change anything the page shows — then no handle is offered.
 */
export declare function readResizeGeometry({ path, axis, values, }: {
    path: string;
    axis: "x" | "y";
    values: ReadonlyArray<string>;
}): ResizeGeometry | null;
//# sourceMappingURL=canvas-resize-geometry.d.ts.map