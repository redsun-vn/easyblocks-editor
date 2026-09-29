import { CanvasResizeOption } from "@redsun-vn/easyblocks-core";
import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import { EditorContextType } from "../EditorContext";
import { RunChangeOptions } from "../types";
/** A panel field a handle on the canvas can set, and which way it drags. */
export type CanvasResizeField = {
    field: InternalField;
    option: CanvasResizeOption;
};
/**
 * The selection's panel fields that opted into a canvas handle.
 *
 * Only a single block: with several selected, one handle would have to mean a
 * size for all of them, and the panel's own field is the better place for that.
 */
export declare function pickCanvasResizeFields(fields: ReadonlyArray<InternalField>): Array<CanvasResizeField>;
/**
 * The values a drag steps through: the field's own `steps` when it names them,
 * otherwise every option the panel offers, in the panel's order.
 */
export declare function canvasResizeValues({ field, option, }: CanvasResizeField): Array<string>;
/**
 * Writes one value exactly as picking it in the panel would.
 *
 * The same two controllers the panel chains together do the work: the
 * responsive one decides which breakpoint the value belongs to, and the field
 * one runs the change through the editor — a block's own `change` rules
 * included. Only the history is different: every write after the first of a
 * drag folds into the step the first one made.
 */
export declare function writeCanvasResizeValue({ field, value, editorContext, configAfterAuto, history, }: {
    field: InternalField;
    value: string;
    editorContext: EditorContextType;
    configAfterAuto: Record<string, any>;
    history: RunChangeOptions["history"];
}): void;
//# sourceMappingURL=canvas-resize-fields.d.ts.map