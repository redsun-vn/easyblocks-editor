import React from "react";
import { ILayer } from "../utils/normalizeComponentLayers";
export declare const RawEditorLayerGroup: ({ layer, currentLayer, onClickLayer, onFocusLayer, }: {
    layer: ILayer;
    onClickLayer: (id: string, path: string, rootParentId?: string) => void;
    currentLayer?: string;
    onFocusLayer?: (layerId: string) => void;
}) => React.JSX.Element;
export declare const EditorLayerGroup: React.MemoExoticComponent<({ layer, currentLayer, onClickLayer, onFocusLayer, }: {
    layer: ILayer;
    onClickLayer: (id: string, path: string, rootParentId?: string) => void;
    currentLayer?: string;
    onFocusLayer?: (layerId: string) => void;
}) => React.JSX.Element>;
//# sourceMappingURL=EditorLayerGroup.d.ts.map