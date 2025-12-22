import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
export interface ILayer {
    id: string;
    component: string;
    path: string;
    children: ILayer[];
    rootParentId?: string;
}
export declare const normalizeComponentLayers: (components: NoCodeComponentEntry, prefix?: string, _rootParentId?: string) => ILayer[];
//# sourceMappingURL=normalizeComponentLayers.d.ts.map