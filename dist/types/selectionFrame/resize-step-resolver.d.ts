/**
 * The arithmetic behind the resize handles, with nothing in it that needs a
 * browser: which of a field's values a dragged edge has reached.
 *
 * A handle does not write sizes. It picks one of the values the properties
 * panel already offers for the field, the one whose rendered size is nearest
 * to where the edge is. So a drag can only ever save a value somebody could
 * have picked by hand, and each value is exactly one notch of the drag.
 */
/** One value a handle can land on, and how big the block is with it. */
export type ResizeStep = {
    value: string;
    size: number;
};
/**
 * The step whose size is nearest to `targetSize`. A tie goes to the smaller
 * one, so a drag has to cross the midpoint before the block grows.
 */
export declare function nearestResizeStep(steps: ReadonlyArray<ResizeStep>, targetSize: number): ResizeStep | null;
/**
 * How wide a grid item is for each whole number of tracks it can span.
 *
 * `count` tracks of `trackWidth` with a gap between each pair, which is what
 * `grid-column: span N` draws. Values are the numbers `1` to `trackCount` as
 * strings, the way a `select` field stores them.
 */
export declare function gridSpanSteps({ trackCount, trackWidth, gap, }: {
    trackCount: number;
    trackWidth: number;
    gap: number;
}): Array<ResizeStep>;
/**
 * The width of one track of a grid, from the grid's content width.
 *
 * Tracks of a `repeat(N, minmax(0, 1fr))` grid share what the gaps leave, so
 * this holds for the equal-track rows the handles are offered on.
 */
export declare function gridTrackWidth({ contentWidth, trackCount, gap, }: {
    contentWidth: number;
    trackCount: number;
    gap: number;
}): number;
/**
 * Where the dragged edge is asking the block to be, from the size it had when
 * the drag began and how far the pointer has moved since.
 *
 * Dragging a left edge leftwards grows the block, so its movement counts
 * against the size; the right and bottom edges count with it.
 */
export declare function targetSizeFromDrag({ startSize, pointerDelta, edge, }: {
    startSize: number;
    pointerDelta: number;
    edge: "left" | "right" | "bottom";
}): number;
/**
 * Only the steps whose value the field offers: a drag must never save a value
 * the panel would not let somebody pick.
 */
export declare function offeredSteps(steps: ReadonlyArray<ResizeStep>, values: ReadonlyArray<string>): Array<ResizeStep>;
/**
 * Whether a grid is drawing its items one under another — every visible item
 * the full width of the grid — which is how a row stacked for a phone looks.
 * One item alone proves nothing: a single column may simply span the row.
 * Hidden items (no width) are left out of the count.
 */
export declare function isStackedGrid(itemWidths: ReadonlyArray<number>, contentWidth: number): boolean;
//# sourceMappingURL=resize-step-resolver.d.ts.map