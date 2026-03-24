import { Colors, Icons, Typography } from "@redsun-vn/easyblocks-design-system";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { ILayer } from "../utils/normalizeComponentLayers";
import { EditorLayerDetail } from "./EditorLayerDetail";

const StyledEditorLayerLabel = styled(Typography)<{ isFocus?: boolean }>`
  display: block;
  cursor: pointer;
  ${({ isFocus }) => `
    font-weight: ${isFocus ? 700 : 400};
  `}
`;

const StyledEditorLayerComponent = styled(Typography)<{ isFocus?: boolean }>`
  display: flex;
  align-items: center;
  width: fit-content;
  min-width: 100%;
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

const StyledWrapperChevronIcon = styled(Typography)<{ isOpen: boolean }>`
  transition: transform 0.2s ease;
  ${({ isOpen }) => `transform: rotate(${isOpen ? 180 : 0}deg);`}
`;

const StyledWrapperEditorLayerDetail = styled.div<{ isOpen: boolean }>`
  padding-left: 18px;
  ${({ isOpen }) => `
    height: ${isOpen ? "100%" : "0%"}; 
    display: ${isOpen ? "block" : "none"};
    `}
`;

export const RawEditorLayerGroup = ({
  layer,
  currentLayer,
  onClickLayer,
  onFocusLayer,
}: {
  layer: ILayer;
  onClickLayer: (id: string, path: string, rootParentId?: string) => void;
  currentLayer?: string;
  onFocusLayer?: (layerId: string) => void;
}) => {
  const [openedLayer, setOpenedLayer] = React.useState<boolean>(false);
  const expandClickRef = useRef(false);
  const isFocus = currentLayer === layer.path;

  const onExpandLayer = useCallback(() => {
    expandClickRef.current = true;
    onClickLayer(layer.id, layer.path, layer.rootParentId);

    setOpenedLayer((prev) => !prev);
  }, [layer.path, onClickLayer]);

  useEffect(() => {
    if (!currentLayer) {
      return;
    }

    if (currentLayer === layer.path) {
      onFocusLayer?.(layer.id);
    }

    if (expandClickRef.current) {
      expandClickRef.current = false;
      return;
    }

    const shouldOpen =
      currentLayer.length >= layer.path.length &&
      currentLayer.startsWith(layer.path);
    shouldOpen ? setOpenedLayer(shouldOpen) : null;
  }, [currentLayer, layer.path, layer.id]);

  return (
    <>
      <StyledEditorLayerComponent
        id={`sidebar-layer-${layer.id}`}
        onClick={onExpandLayer}
        isFocus={isFocus}
      >
        <StyledWrapperChevronIcon isOpen={openedLayer}>
          <Icons.ChevronDown size={16} />
        </StyledWrapperChevronIcon>
        <Icons.LayerGroup size={18} />
        <StyledEditorLayerLabel
          isFocus={isFocus}
          variant="body"
          component="label"
        >
          {layer.component}
        </StyledEditorLayerLabel>
      </StyledEditorLayerComponent>

      <StyledWrapperEditorLayerDetail isOpen={openedLayer}>
        <EditorLayerDetail
          onFocusLayer={onFocusLayer}
          currentLayer={currentLayer}
          onClickLayer={onClickLayer}
          layers={layer.children}
        />
      </StyledWrapperEditorLayerDetail>
    </>
  );
};

export const EditorLayerGroup = React.memo(RawEditorLayerGroup);
EditorLayerGroup.displayName = "EditorLayerGroup";
