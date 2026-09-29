import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
/**
 * The selection's fields that belong on the bar, in bar order.
 *
 * Takes the fields the panel shows for the same selection, so a field hidden
 * there (a background colour while the button has no background, say) is
 * hidden here too, and every change goes through the panel's own controller.
 */
declare function pickQuickFormatFields(fields: ReadonlyArray<InternalField>): Array<InternalField>;
export { pickQuickFormatFields };
//# sourceMappingURL=quickFormatFields.d.ts.map