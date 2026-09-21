import { ActionsType, TEasyblocksEditorMode } from "@/types";
import { ContextParams } from "@redsun-vn/easyblocks-core";
import React from "react";
export interface MovePlan {
    /** Where the source block sits once the copy has been inserted. */
    sourceToRemove: string;
    /** Where the inserted block sits once the source has been removed. */
    pathToFocus: string;
}
/**
 * Moving a block is an insert followed by a remove, and each of those shifts the indices of
 * everything after it in the same collection. Replaying those shifts is what makes the block
 * that gets removed the original one rather than a neighbour that slid into its place.
 *
 * The insert happens first on purpose: if no collection in the chosen section accepts the
 * block the document is simply left alone, whereas removing first would destroy it.
 */
export declare function planMoveAfterInsert(sourcePath: string, insertedPath: string): MovePlan;
interface ISelectionFrameActionsProps {
    focussedField: string[];
    actions: ActionsType;
    translationFiles: {
        [key: string]: any;
    };
    contextParams: ContextParams;
    editorMode: TEasyblocksEditorMode;
    /** On while the pointer is on the selected block or on the bar itself. */
    isRevealed: boolean;
    /** The bar answering for its own half of "is the pointer near". */
    onPointerNear: (isPointerNear: boolean) => void;
}
export declare const SelectionFrameActions: ({ focussedField, actions, translationFiles, contextParams, editorMode, isRevealed, onPointerNear, }: ISelectionFrameActionsProps) => React.JSX.Element;
export {};
//# sourceMappingURL=SelectionFrameActions.d.ts.map