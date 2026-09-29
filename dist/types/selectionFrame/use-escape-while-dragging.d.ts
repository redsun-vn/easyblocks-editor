/**
 * Esc cancels a drag, heard in the canvas as well as in the editor: focus
 * stays in the canvas after a block is picked by clicking it, and the canvas's
 * own Esc would otherwise select the parent and take the handle away mid-drag.
 */
export declare function useEscapeWhileDragging(isDragging: boolean, cancel: () => void): void;
//# sourceMappingURL=use-escape-while-dragging.d.ts.map