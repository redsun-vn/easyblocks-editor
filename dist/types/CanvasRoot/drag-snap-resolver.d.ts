/**
 * Where a dragged block's outline snaps to, and the guides that say why.
 *
 * The outline is the block's own box carried by the pointer. On each axis it is
 * compared with the blocks around it by start edge, centre and end edge; the
 * nearest line within `threshold` wins and the outline moves onto it. Only that
 * one line per axis is returned — a page full of lines that happen to agree
 * tells the person nothing about which one the block is sitting on.
 *
 * Geometry only, so it is tested without a browser. Everything is in the
 * canvas's own pixels.
 */
export type SnapRect = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
/** A guide drawn across the canvas: `x`/`y` is where it starts. */
export type SnapGuide = {
    orientation: "vertical" | "horizontal";
    x: number;
    y: number;
    length: number;
};
export type DragSnap = {
    dx: number;
    dy: number;
    guides: Array<SnapGuide>;
};
export declare function resolveDragSnap(moving: SnapRect, candidates: ReadonlyArray<SnapRect>, threshold: number): DragSnap;
//# sourceMappingURL=drag-snap-resolver.d.ts.map