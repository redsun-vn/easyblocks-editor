import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { GetShapeDefinition } from "./collectionSlots";
/**
 * The payload inside an entry, with packaging rows and columns taken off.
 *
 * A row-and-column pair is packaging when the row holds exactly one column and
 * that column holds exactly one item. Anything else — two columns, or one column
 * with two items — is the arrangement the author drew, and taking it apart would
 * destroy the thing rather than unwrap it.
 *
 * The test counts children and nothing else. It deliberately does not compare
 * the wrapper's own values against their defaults, which was the first idea and
 * is wrong: the single-item section templates carry real padding on the row
 * (48px, against a default of 0) precisely because they sit at page root as a
 * band. That padding belongs to the band, not to the component, so when the
 * component moves inside a column that already manages its own spacing, the
 * padding is supposed to go. Measured over the host app's 126 row-rooted
 * templates: 21 are packaging, and in all 21 the row carries nothing but spacing
 * while the column carries nothing at all, so peeling loses only the band.
 *
 * Two levels come off at a time, never one. Peeling a single level would reduce
 * a column template to its only item, and a column is not packaging — it is
 * something an author places on purpose.
 */
export declare function peelPackagingWrapper(entry: NoCodeComponentEntry, getDefinition: GetShapeDefinition): NoCodeComponentEntry;
//# sourceMappingURL=peelPackagingWrapper.d.ts.map