import { EditorContextType } from "../EditorContext";
import { RunChangeOptions } from "../types";
import { CanvasResizeField } from "./canvas-resize-fields";
import type { Drag } from "./canvas-resize-drag-types";
/**
 * The parent switch a drag has to turn on before it can step in its unit,
 * when the field names one and the parent has it off. A row stores its
 * columns' widths in tracks of its own until its twelve-track grid is on;
 * turning it on first gives every drag the same twelve steps.
 */
export declare function pendingSwitch(resizeField: CanvasResizeField | undefined, path: string, formValues: Record<string, unknown>): {
    parentPath: string;
    prop: string;
    tracks: number;
} | null;
/**
 * Turns the parent switch on the way the panel's own switch would, so the
 * parent's change rules rewrite the columns' stored widths and the page does
 * not move.
 */
export declare function turnSwitchOn({ pending, editorContext, configAfterAuto, history, }: {
    pending: NonNullable<ReturnType<typeof pendingSwitch>>;
    editorContext: EditorContextType;
    configAfterAuto: Record<string, any>;
    history: RunChangeOptions["history"];
}): boolean;
/**
 * Writes one value of a drag the way picking it in the panel would, turning
 * the parent switch on first when the drag needs it. The first write of a
 * gesture makes an undo step and every later one folds into it.
 */
export declare function writeResizeStep({ drag, value, resizeField, editorContext, configAfterAuto, gestureHasWritten, }: {
    drag: Drag;
    /** The step's key: what a choice is found by. */
    value: string;
    resizeField: CanvasResizeField;
    editorContext: EditorContextType;
    configAfterAuto: Record<string, any>;
    gestureHasWritten: {
        current: boolean;
    };
}): void;
//# sourceMappingURL=canvas-resize-parent-switch.d.ts.map