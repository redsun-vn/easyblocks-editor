import { CompiledCustomComponentConfig, CompiledShopstoryComponentConfig, SerializedRenderableComponentDefinition } from "@redsun-vn/easyblocks-core";
import React from "react";
interface BlocksControlsProps {
    children: React.ReactNode;
    path: string;
    disabled?: boolean;
    direction: "horizontal" | "vertical";
    id: string;
    templateId: string;
    compiled: CompiledShopstoryComponentConfig | CompiledCustomComponentConfig;
    index: number;
    length: number;
}
export declare function BlocksControls({ children, path, disabled, direction, id, templateId, index, length, }: BlocksControlsProps): React.JSX.Element;
export interface SortableDisabledStateInput {
    /** The block lives in a subtree where editing is switched off. */
    isEditingDisabled: boolean;
    /** The block fills a fixed `component` slot, so it has no collection to be reordered in. */
    isFixedSlot: boolean;
    /** More than one block is selected. */
    isMultiSelection: boolean;
    /** The parent collection accepts the type of the block currently being dragged. */
    canAcceptDraggedComponent: boolean;
}
/** `@dnd-kit` reads both flags as *disabled*: `true` switches the capability off. */
export interface SortableDisabledState {
    draggable: boolean;
    droppable: boolean;
}
/**
 * Which blocks may be picked up and which may receive a drop.
 *
 * Dragging deliberately does not depend on what is selected. It used to: a block could only
 * be picked up when it was the selection, or its parent, sibling or descendant. A freshly
 * opened editor has no selection, so no block could be dragged at all and drag and drop read
 * as broken.
 */
export declare function getSortableDisabledState({ isEditingDisabled, isFixedSlot, isMultiSelection, canAcceptDraggedComponent, }: SortableDisabledStateInput): SortableDisabledState;
export interface DropRejectionInput {
    isFixedSlot: boolean;
    canAcceptDraggedComponent: boolean;
    /** Name of the component that owns the collection being dropped into. */
    targetLabel: string;
    /** Component types that collection accepts. */
    acceptedTypes: Array<string>;
    t: (key: string) => string;
}
/**
 * Why this block refuses the block being dragged, or `undefined` when it accepts it.
 *
 * A refused target used to just stay inert, which left no way to tell "nothing happens here"
 * apart from "drag and drop is broken".
 */
export declare function getDropRejectionMessage({ isFixedSlot, canAcceptDraggedComponent, targetLabel, acceptedTypes, t, }: DropRejectionInput): string | undefined;
/**
 * Component types a block accepts into its collections. A drop is refused when the dragged
 * block matches none of them, which is what keeps a block from landing in a parent that
 * cannot hold it.
 */
export declare function getAllowedComponentTypes(componentDefinition: SerializedRenderableComponentDefinition): string[];
/**
 * Whether two block paths sit in the same collection. Drops into a *different* collection are
 * the move-to-another-parent case: they need the extra before/after placeholders, and the
 * parent window resolves them through insert + remove instead of a plain reorder.
 */
export declare function isPathsParentEqual(path1: string, path2: string): boolean;
export {};
//# sourceMappingURL=BlockControls.d.ts.map