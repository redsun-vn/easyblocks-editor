import React from "react";
/** One insertable item, already reduced to what a row needs to draw itself. */
export type TSectionRow = {
    key: string;
    label: string;
    thumbnail?: string;
    onPick: () => void;
};
/**
 * One named group of a sidebar panel.
 *
 * `onEnterView` fires the first time the group is close to the viewport, which
 * is what lets the Templates panel show every group at once without asking the
 * backend for all of them up front: a group two screens down costs nothing
 * until it is nearly on screen. The components panel passes nothing, because
 * its items are already in memory.
 */
export declare const EditorSectionGroup: ({ label, count, rows, isLoading, hasMore, emptyLabel, moreLabel, onLoadMore, onEnterView, }: {
    label: string;
    count?: number;
    rows: TSectionRow[];
    isLoading?: boolean;
    hasMore?: boolean;
    emptyLabel?: string;
    moreLabel?: string;
    onLoadMore?: () => void;
    onEnterView?: () => void;
}) => React.JSX.Element;
//# sourceMappingURL=EditorSectionGroup.d.ts.map