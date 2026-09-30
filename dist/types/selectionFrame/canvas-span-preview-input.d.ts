/**
 * What a block's `previewSpans` is asked with, read from the page's values
 * after auto: the parent's values and every sibling's value of the dragged
 * field, each at the breakpoint being edited.
 *
 * The field is an item field, stored on each item under the same suffix —
 * `_itemProps.<parent>.<collection>.<prop>` — so a sibling's value is found by
 * swapping the item's index and keeping the suffix.
 */
export declare function readSpanPreviewInput({ fieldName, path, configAfterAuto, breakpointIndex, }: {
    fieldName: string;
    /** The dragged item's path: `<parent>.<collection>.<index>`. */
    path: string;
    configAfterAuto: Record<string, any>;
    breakpointIndex: string;
}): {
    parent: Record<string, unknown>;
    values: Array<unknown>;
    index: number;
    /** The collection's path, whose items are the grid's items in order. */
    collectionPath: string;
} | null;
//# sourceMappingURL=canvas-span-preview-input.d.ts.map