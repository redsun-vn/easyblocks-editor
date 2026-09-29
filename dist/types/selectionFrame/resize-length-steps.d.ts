import { ResizeStep } from "./resize-step-resolver";
/** Whether a field's values are aspect ratios rather than lengths. */
export declare function isRatioList(choices: ReadonlyArray<{
    css: string;
}>): boolean;
/** What a length is measured against when it is not in pixels. */
export type LengthReference = {
    /** The width `%` is a share of: the block's containing width. */
    percentOf: number;
    /** The canvas viewport height `vh` is a share of. */
    viewportHeight: number;
    /** The block's width, which a height given as a ratio follows. */
    width: number;
};
/**
 * How big a CSS value draws the block along the dragged axis, or `null` for a
 * value that is not a size — `none`, `fit-content` — which a drag skips.
 *
 * `auto` on the vertical axis is the block at its content height, the least
 * it can be, so it counts as zero: dragging the bottom edge up far enough
 * gives the height back to the content.
 */
export declare function lengthToPixels(css: string, axis: "x" | "y", reference: LengthReference): number | null;
/**
 * The steps a list of CSS values gives, smallest first. Values that are not a
 * size are left out; so are widths beyond what the block can reach, which
 * would all draw the same and leave the drag nothing to tell apart. Of two
 * values that draw the same size, the first listed is kept.
 */
export declare function lengthSteps(choices: ReadonlyArray<{
    key: string;
    css: string;
}>, axis: "x" | "y", reference: LengthReference): Array<ResizeStep>;
//# sourceMappingURL=resize-length-steps.d.ts.map