import React from "react";
/**
 * One insertable item in a sidebar panel.
 *
 * Clicking it adds the thing to the page. There is no intermediate step: the
 * row already shows the picture and the name that a gallery would have shown,
 * so opening one to click the same item again was a click that bought nothing.
 *
 * Dragging it adds the thing *where you let go*. Clicking can only ever put a
 * section after the selected one or at the end, so choosing a position meant
 * adding the section and then moving it — two gestures for one intent.
 *
 * Both gestures stay: a click is the shorter path when the position does not
 * matter, and it is the only path for anyone who cannot drag.
 */
export declare const EditorSectionRow: ({ label, thumbnail, onPick, onDragStart, }: {
    label: string;
    thumbnail?: string;
    onPick: () => void;
    onDragStart?: (event: React.DragEvent) => void;
}) => React.JSX.Element;
//# sourceMappingURL=EditorSectionRow.d.ts.map