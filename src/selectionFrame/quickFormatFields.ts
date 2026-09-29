import { shouldFieldBeDisplayed } from "@/tinacms/form-builder/fields-builder";
import { InternalField } from "@redsun-vn/easyblocks-core/_internals";

/**
 * The properties-panel fields that are also offered on the selection's action
 * bar, so the formatting people reach for most can be changed where the block is.
 *
 * Chosen by prop name, because the block library names its formatting props the
 * same way everywhere (`font`, `color`, `align`…), and by type as well, so a prop
 * that only shares the name (`size` as a spacing token, say) is not picked up.
 * Anything else — spacing, shadows, hover states, behaviour switches, data
 * sources, child components, images — stays in the panel: it is either not
 * formatting, or needs more room than a bar has.
 *
 * The order here is the order on the bar: what the text looks like, then its
 * emphasis, then how it sits.
 */
const QUICK_FORMAT_PROPS: ReadonlyArray<{
  prop: string;
  types: ReadonlyArray<string>;
}> = [
  // A font token bundles family, size and weight, so this one control is all three.
  { prop: "font", types: ["font"] },
  { prop: "color", types: ["color"] },
  { prop: "textColor", types: ["color"] },
  { prop: "accent", types: ["color"] },
  { prop: "markerColor", types: ["color"] },
  { prop: "backgroundColor", types: ["color"] },
  { prop: "size", types: ["select"] },
  { prop: "level", types: ["select"] },
  { prop: "fontStyle", types: ["select"] },
  { prop: "italic", types: ["boolean"] },
  { prop: "textTransform", types: ["select"] },
  { prop: "align", types: ["select", "radio-group"] },
  { prop: "textAlign", types: ["select", "radio-group"] },
  { prop: "horizontalAlign", types: ["select", "radio-group"] },
  { prop: "aspectRatio", types: ["select"] },
  { prop: "objectFit", types: ["select"] },
];

function quickFormatRank(field: InternalField): number {
  return QUICK_FORMAT_PROPS.findIndex(
    ({ prop, types }) =>
      prop === field.schemaProp.prop && types.includes(field.schemaProp.type),
  );
}

/**
 * The selection's fields that belong on the bar, in bar order.
 *
 * Takes the fields the panel shows for the same selection, so a field hidden
 * there (a background colour while the button has no background, say) is
 * hidden here too, and every change goes through the panel's own controller.
 */
function pickQuickFormatFields(
  fields: ReadonlyArray<InternalField>,
): Array<InternalField> {
  return fields
    .filter(shouldFieldBeDisplayed)
    .map((field) => ({ field, rank: quickFormatRank(field) }))
    .filter(({ rank }) => rank !== -1)
    .sort((a, b) => a.rank - b.rank)
    .map(({ field }) => field);
}

export { pickQuickFormatFields };
