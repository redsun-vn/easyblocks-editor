import { PlaceholderAppearance } from "@redsun-vn/easyblocks-core";
import React from "react";
/**
 * Whether an empty slot takes the block being dragged over it.
 *
 * Two behaviours live here on purpose. The default one compares the dragged
 * block against `type`, a single string that `ComponentBuilder` derives by
 * collapsing the slot's whole `accepts` list down to one entry. That collapse
 * is lossy: no list yields a `type` that lets both a `button` and an `item`
 * through, so slots holding a mixed list silently refuse half of what their
 * picker offers.
 *
 * A slot opts out of the collapse with `placeholderStrictAccepts`, which makes
 * `ComponentBuilder` pass the full `accepts` list as `accepts` here. The slot
 * then takes exactly what its picker offers, because it reads `accepts` the way
 * `unrollAcceptsFieldIntoComponents` does: an entry naming a component type
 * matches every component of that type, and an entry naming a component id
 * matches that one component.
 *
 * Slots that do not opt in never reach the second branch, so their behaviour —
 * including the refusals they have today — stays exactly as it was.
 */
declare function canDropIntoPlaceholder({ draggedId, draggedTypes, type, accepts, }: {
    draggedId: string;
    draggedTypes: string[];
    type: string;
    accepts?: string[];
}): boolean;
type TypePlaceholderComponentBuilderProps = {
    id: string;
    path: string;
    appearance?: PlaceholderAppearance;
    type: string;
    /**
     * Present only for slots that opted in with `placeholderStrictAccepts`.
     * When absent, the drop check below runs exactly as it always has.
     */
    accepts?: string[];
    onClick: () => void;
    meta: any;
};
export { canDropIntoPlaceholder };
export default function TypePlaceholder(props: TypePlaceholderComponentBuilderProps): React.JSX.Element;
//# sourceMappingURL=Placeholder.d.ts.map