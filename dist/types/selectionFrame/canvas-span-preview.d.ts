import type { CanvasResizeField } from "./canvas-resize-fields";
export type SpanPreview = {
    /** Draws the grid as it would be with `value`; `false` when the block could not say. */
    show: (value: string) => boolean;
    /** Takes the drawing away: the page goes back to what the stored values draw. */
    clear: () => void;
    /**
     * Keeps the drawing until the canvas has drawn the written value itself, then
     * takes it away. Taking it away earlier would show the old widths for as long
     * as the editor takes to render the write.
     */
    handOver: () => void;
};
/**
 * A span drag drawn straight onto the canvas's grid, without writing.
 *
 * Every write runs the whole editor — compile, panel, canvas — which takes a
 * few hundred milliseconds, far longer than a pointer waits between moves.
 * The grid's own inline styles take a frame. What they say comes from the
 * block's `previewSpans`, its own layout rule, so siblings that share what is
 * left of a row move the way the written value will move them.
 *
 * Returns `null` when the field has no such rule or the grid cannot be found;
 * the drag then writes every step as before.
 */
export declare function startSpanPreview({ resizeField, path, configAfterAuto, breakpointIndex, switchOn, }: {
    resizeField: CanvasResizeField;
    path: string;
    configAfterAuto: Record<string, any>;
    breakpointIndex: string;
    switchOn: boolean;
}): SpanPreview | null;
//# sourceMappingURL=canvas-span-preview.d.ts.map