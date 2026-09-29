/**
 * A count that goes up whenever the selected block's frame or anything drawn
 * directly in it changes size on the canvas.
 *
 * A picture narrowing inside its frame after a write sends no position
 * message — the frame itself did not move — so the handles would sit on the
 * old edge until something else happened. Watching the canvas's own resize
 * observer answers exactly when the page has redrawn, however long that took.
 * `refreshKey` re-attaches it after a write, when the canvas may have drawn
 * the block's content afresh.
 */
export declare function useCanvasFrameRedraws(path: string, refreshKey: unknown): number;
//# sourceMappingURL=use-canvas-frame-redraws.d.ts.map