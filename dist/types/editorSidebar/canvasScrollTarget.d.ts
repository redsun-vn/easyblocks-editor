/**
 * Where the canvas must scroll to so a clicked layer comes into view.
 *
 * The element's own rect is already measured against the canvas viewport, so
 * adding how far the canvas has scrolled turns it into a position in the
 * document. That is the whole calculation.
 *
 * It is worth saying what it must not do, because the earlier version did it:
 * add the enclosing section's rect on top of the element's. Both are measured
 * from the same viewport, so summing them sent the canvas roughly twice as far
 * as it should whenever a nested layer was clicked, and short of the mark
 * whenever the section had already scrolled above the top edge. Either way the
 * author clicked a layer and the canvas arrived somewhere else, which reads as
 * the panel simply not working.
 */
export declare function canvasScrollTargetTop({ elementTop, scrollY, }: {
    elementTop: number;
    scrollY: number;
}): number;
//# sourceMappingURL=canvasScrollTarget.d.ts.map