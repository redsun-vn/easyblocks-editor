/**
 * Dragging an item out of a sidebar panel and onto the canvas.
 *
 * The canvas already drags blocks around, but that gesture is `@dnd-kit` and it
 * lives entirely inside the canvas iframe: its sensors read pointer events from
 * the iframe's own document, so a drag begun in the sidebar — a different
 * document — is invisible to it. Native HTML5 drag events are the one gesture
 * that does cross a frame boundary, which is why the panel uses them instead of
 * joining the existing context.
 *
 * What travels is only a marker. During `dragover` a browser will tell a page
 * which *types* the drag carries but not their contents, so the canvas could
 * never read a payload at the moment it has to decide whether to accept the
 * drop. The item itself is left on the shared `editorWindowAPI` object the two
 * frames already talk through, and this mime type is what says a drag belongs
 * to us.
 */

/** Says a drag came from a sidebar panel. Lowercase: browsers normalise it. */
export const PANEL_DRAG_MIME = "application/x-easyblocks-panel-item";

/** Posted to the parent window when an item is dropped on the canvas. */
export const PANEL_DROP_MESSAGE = "@easyblocks-editor/panel-drop";

export type PanelDropMessage = {
  type: typeof PANEL_DROP_MESSAGE;
  /** Where in the root collection the item goes, 0..sectionCount. */
  index: number;
};

/** Where the item would land, and where to draw the line that says so. */
export type PanelDropTarget = {
  index: number;
  /** Viewport y inside the canvas, for the insertion line. */
  y: number;
};

type SectionRect = { top: number; bottom: number };

/**
 * Which gap the pointer is aiming at.
 *
 * A section's midpoint is the boundary: above it the item goes before that
 * section, below it after. Midpoint rather than the nearest edge because a
 * section is often taller than the screen — with edges, the whole middle of a
 * tall section would aim at nothing, and the drop would have no answer for most
 * of the page.
 *
 * An empty page still has an answer, index 0, rather than no target at all. The
 * first thing a shop owner drags is dropped onto nothing.
 */
export function resolvePanelDropTarget(
  pointerY: number,
  rects: SectionRect[],
): PanelDropTarget {
  if (rects.length === 0) {
    return { index: 0, y: 0 };
  }

  for (let index = 0; index < rects.length; index += 1) {
    const rect = rects[index];

    if (pointerY < rect.top + (rect.bottom - rect.top) / 2) {
      return { index, y: rect.top };
    }
  }

  return { index: rects.length, y: rects[rects.length - 1].bottom };
}

/** Whether a drag event is one of ours, asked at a moment when only types are readable. */
export function isPanelDrag(types: readonly string[] | undefined): boolean {
  return Boolean(types?.includes(PANEL_DRAG_MIME));
}
