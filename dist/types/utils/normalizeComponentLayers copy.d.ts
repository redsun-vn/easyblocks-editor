export interface ILayer {
    id: string;
    component: string;
    path: string;
    children: ILayer[];
}
export declare const normalizeComponentLayers: (components: any, prefix?: string) => ILayer[];
//# sourceMappingURL=normalizeComponentLayers%20copy.d.ts.map