import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React from "react";
/**
 * Splits the bar into its groups: how the block looks, what can be done with
 * it, and deleting it. Full height and dark enough to read against the white
 * bar — the first one was too faint to tell the groups apart.
 */
export declare const BarDivider: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never> & Partial<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>>> & string;
/**
 * The formatting controls on the selection's bar.
 *
 * Each one is the properties panel's own field, drawn without its label, so it
 * reads and writes exactly what the panel does: the breakpoint being edited, the
 * current language, a rich text selection sent to the canvas, a block's own
 * `change` rules. The label moves into the tooltip.
 */
export declare function SelectionFrameQuickFormat({ fields, onInUseChange, }: {
    fields: ReadonlyArray<InternalField>;
    /**
     * Whether one of the controls has focus. A dropdown's list is in a portal,
     * but React carries its focus events up through here all the same, so an
     * open list counts as in use.
     */
    onInUseChange: (isInUse: boolean) => void;
}): React.JSX.Element;
//# sourceMappingURL=SelectionFrameQuickFormat.d.ts.map