import React from "react";
import { ILayer } from "../../utils/normalizeComponentLayers";
export declare const EditorLayerDetail: ({ layers, currentLayer, onClickLayer, onFocusLayer, }: {
    layers: ILayer[];
    currentLayer?: string;
    onClickLayer?: (id: string, path: string, rootParentId?: string) => void;
    onFocusLayer?: (layerId: string) => void;
}) => React.JSX.Element[];
//# sourceMappingURL=EditorLayerDetail.d.ts.map