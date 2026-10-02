import type { TTabSchemaProp } from "@redsun-vn/easyblocks-core";
type FieldOnTab = {
    schemaProp?: {
        tab?: TTabSchemaProp;
    };
};
/**
 * Which tabs the properties panel shows for these fields, and which one is open.
 *
 * `advanced` appears only when one of the fields lives on it, so a component
 * without such a field keeps the bar it always had. When the open tab is not in
 * the bar (the user was on `advanced`, then selected a component without it)
 * the panel falls back to `styles` instead of showing an empty tab.
 */
export declare function resolvePanelTabs(fields: ReadonlyArray<FieldOnTab>, activeTab: TTabSchemaProp): {
    tabIds: Array<TTabSchemaProp>;
    activeTab: TTabSchemaProp;
};
export {};
//# sourceMappingURL=panel-tabs.d.ts.map