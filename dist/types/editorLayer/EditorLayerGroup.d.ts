import React from "react";
import { ILayer } from "../utils/normalizeComponentLayers";
export declare const RawEditorLayerGroup: ({ layer, currentLayer, onClickLayer, }: {
    layer: ILayer;
    onClickLayer: (id: string, path: string, rootParentId?: string) => void;
    currentLayer?: string;
}) => React.JSX.Element;
export declare const EditorLayerGroup: React.MemoExoticComponent<({ layer, currentLayer, onClickLayer, }: {
    layer: ILayer;
    onClickLayer: (id: string, path: string, rootParentId?: string) => void;
    currentLayer?: string;
}) => React.JSX.Element>;
//# sourceMappingURL=EditorLayerGroup.d.ts.map