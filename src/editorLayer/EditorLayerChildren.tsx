import { Colors, Icons, Typography } from "@redsun-vn/easyblocks-design-system";
import React, { useEffect } from "react";
import styled from "styled-components";
import { ILayer } from "../utils/normalizeComponentLayers";

const StyledEditorLayerLabel = styled(Typography)<{ isFocus?: boolean }>`
  display: block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  ${({ isFocus }) => `
    font-weight: ${isFocus ? 700 : 400};
  `}
`;

const StyledEditorLayerComponent = styled(Typography)<{ isFocus?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  padding: 6px 10px;
  gap: 2px;
  ${({ isFocus }) => `
    background: ${isFocus ? Colors.black10 : "transparent"};
  `}

  &:hover {
    background: ${Colors.black10};
  }
`;

export const EditorLayerChildren = ({
  layer,
  currentLayer,
  onClickLayer,
  onFocusLayer,
}: {
  layer: ILayer;
  onClickLayer: (id: string, path: string, rootParentId?: string) => void;
  onFocusLayer?: (layerId: string) => void;
  currentLayer?: string;
}) => {
  useEffect(() => {
    if (currentLayer === layer.path) {
      onFocusLayer?.(layer.id);
    }
  }, [currentLayer]);

  return (
    <StyledEditorLayerComponent
      id={`sidebar-layer-${layer.id}`}
      onClick={() => onClickLayer(layer.id, layer.path, layer.rootParentId)}
      isFocus={currentLayer === layer.path}
    >
      <Icons.LayerChildren size={18} />
      <StyledEditorLayerLabel
        isFocus={currentLayer === layer.path}
        variant="body"
        component="label"
      >
        {layer.component}
      </StyledEditorLayerLabel>
    </StyledEditorLayerComponent>
  );
};
