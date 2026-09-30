/**
 * Keeps a released drag's drawing on the canvas until the canvas has rendered
 * the written value itself, then takes it away.
 *
 * Taking it away at once would show the old widths for as long as the editor
 * takes to render the write. The canvas sends a position message after every
 * render, and each one is a chance to look at the page without the drawing:
 * - it matches the drawing — the write has landed, and the drawing goes;
 * - it still matches the page from before the write — not rendered yet, so
 *   the drawing goes back until the next message;
 * - it matches neither — something else changed the page since (an undo, a
 *   panel edit), and the drawing must not cover that up.
 *
 * Returns what stops the hand-over at once and takes the drawing away.
 */
export declare function handOverToCanvas({ view, draw, undraw, widths, isConnected, onGiveUp, }: {
    /** The canvas window, the only sender whose messages mean it rendered. */
    view: Window;
    draw: () => void;
    undraw: () => void;
    widths: () => Array<number>;
    isConnected: () => boolean;
    /** Runs when the canvas never caught up, after the drawing was taken away. */
    onGiveUp: () => void;
}): () => void;
//# sourceMappingURL=canvas-span-preview-hand-over.d.ts.map