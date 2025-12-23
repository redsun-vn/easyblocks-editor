import React from "react";
import { ILayer } from "../utils/normalizeComponentLayers";
import { EditorLayerChildren } from "./EditorLayerChildren";
import { EditorLayerGroup } from "./EditorLayerGroup";

export const EditorLayerDetail = ({
  layers,
  currentLayer,
  onClickLayer,
  onFocusLayer,
}: {
  layers: ILayer[];
  currentLayer?: string;
  onClickLayer?: (id: string, path: string, rootParentId?: string) => void;
  onFocusLayer?: (layerId: string) => void;
}) => {
  return layers.map((layer) => {
    if (layer.children.length) {
      return (
        <EditorLayerGroup
          currentLayer={currentLayer}
          onClickLayer={(id, path, rootParentId) =>
            onClickLayer?.(id, path, rootParentId)
          }
          onFocusLayer={(layerId) => onFocusLayer?.(layerId)}
          layer={layer}
          key={layer.id}
        />
      );
    }

    return (
      <EditorLayerChildren
        currentLayer={currentLayer}
        onClickLayer={(id, path, rootParentId) =>
          onClickLayer?.(id, path, rootParentId)
        }
        onFocusLayer={(layerId) => onFocusLayer?.(layerId)}
        layer={layer}
        key={layer.id}
      />
    );
  });
};
