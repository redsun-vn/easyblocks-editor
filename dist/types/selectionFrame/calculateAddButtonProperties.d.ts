import type { EditingInfoBase } from "@redsun-vn/easyblocks-core";
declare function calculateAddButtonsProperties(direction: Required<EditingInfoBase>["direction"], targetElementRect: DOMRect, viewport: {
    width: number;
    height: number;
}, containerElementRect?: DOMRect): {
    before: {
        top: number;
        left: number;
        display: "block" | "none";
    };
    after: {
        top: number;
        left: number;
        display: "block" | "none";
    };
};
export { calculateAddButtonsProperties };
//# sourceMappingURL=calculateAddButtonProperties.d.ts.map