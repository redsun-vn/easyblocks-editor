import React from "react";
/**
 * Template glyph: a framed page with a header band, drawn locally rather than
 * taken from the design system.
 *
 * The design system has no "template" icon, and adding one there would not help
 * here: this package resolves `@redsun-vn/easyblocks-design-system` from an
 * installed git build, so a new export only becomes visible after that package
 * is published — which the release rules for this change forbid. The three
 * existing candidates are all taken: `Master` is a four-diamond cluster that
 * reads as "component", while `Duplicate` and `LayerGroup` already mean
 * "duplicate this block" and "select the parent block" on the block toolbar.
 *
 * Lives in its own module because both the panel rail button and the rows
 * inside the template panel draw it, and two copies would drift apart.
 */
export declare const TemplateIcon: React.FC<{
    size?: number;
}>;
//# sourceMappingURL=TemplateIcon.d.ts.map