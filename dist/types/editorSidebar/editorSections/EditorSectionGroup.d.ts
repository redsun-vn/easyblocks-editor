import React from "react";
/** One insertable item, already reduced to what a row needs to draw itself. */
export type TSectionRow = {
    key: string;
    label: string;
    thumbnail?: string;
    onPick: () => void;
    /** Absent on a row that cannot be dragged; the row then only clicks. */
    onDragStart?: (event: React.DragEvent) => void;
    onDragEnd?: () => void;
};
/**
 * One named group of a sidebar panel.
 *
 * `onEnterView` fires the first time the group is close to the viewport, which
 * is what lets the Templates panel show every group at once without asking the
 * backend for all of them up front: a group two screens down costs nothing
 * until it is nearly on screen. The components panel passes nothing, because
 * its items are already in memory.
 *
 * `storageKey` makes the group foldable and is what its folded state is
 * remembered under. Without one the group is simply open, which is right for
 * the single list a search collapses the taxonomy into.
 *
 * `forceOpen` unfolds the group for as long as it is set, and takes the
 * chevron away while it is. A reader who types a query wants the matches, and
 * a heading with a count over a fold they have to remember to open is the kind
 * of quiet failure that reads as a broken search.
 */
export declare const EditorSectionGroup: ({ label, count, rows, isLoading, hasMore, emptyLabel, moreLabel, storageKey, forceOpen, onLoadMore, onEnterView, }: {
    label: string;
    count?: number;
    rows: TSectionRow[];
    isLoading?: boolean;
    hasMore?: boolean;
    emptyLabel?: string;
    moreLabel?: string;
    storageKey?: string;
    forceOpen?: boolean;
    onLoadMore?: () => void;
    onEnterView?: () => void;
}) => React.JSX.Element;
//# sourceMappingURL=EditorSectionGroup.d.ts.map