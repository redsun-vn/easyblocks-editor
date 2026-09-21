/**
 * Where the selection's action bar sits.
 *
 * It used to borrow the add button's position, and that was the whole problem:
 * that position is the *middle* of the block's top edge, which is right for a
 * 24px circle and wrong for a bar six buttons wide. The bar hung from the
 * middle of the block and covered whatever was above the middle — most often
 * the words of the section above, which is the one thing the author did not
 * select and did want to read.
 *
 * It hangs off the top-left corner now, outside the block.
 */
export declare const ACTIONS_HEIGHT: number;
/**
 * The widest the bar can be, used only to keep it inside the canvas.
 *
 * A ceiling rather than a measurement, and that is safe in one direction only:
 * being generous parks the bar a little further from the right edge than it
 * needed to be, while being mean would let it hang over the edge. Two of the
 * six buttons appear conditionally, so the real width is often smaller.
 */
export declare const ACTIONS_MAX_WIDTH: number;
type Rect = {
    top: number;
    left: number;
    width: number;
    height: number;
};
type Bounds = {
    top: number;
    left: number;
    right: number;
    bottom: number;
};
type Viewport = {
    width: number;
    height: number;
};
export type ActionsPosition = {
    top: number;
    left: number;
    display: "block" | "none";
};
declare function calculateActionsPosition(target: Rect, viewport: Viewport, container?: Bounds): ActionsPosition;
export { calculateActionsPosition };
//# sourceMappingURL=calculateActionsPosition.d.ts.map