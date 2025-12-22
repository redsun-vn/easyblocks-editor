import { Colors, Typography } from "@redsun-vn/easyblocks-design-system";
import React, { useDeferredValue, useEffect, useState } from "react";
import styled from "styled-components";
import { useEditorContext } from "../EditorContext";
import { getConfigSnapshot } from "../utils/config/getConfigSnapshot";
import {
  ILayer,
  normalizeComponentLayers,
} from "../utils/normalizeComponentLayers";
import { EditorLayerDetail } from "./EditorLayerDetail";

const HorizontalLine = styled.div`
  height: 1px;
  margin-top: -1px;
  background-color: ${Colors.black10};
`;

const StyledEditorLayerRoot = styled.div`
  overflow-x: hidden;
`;

const StyledEditorLayer = styled.div`
  overflow-x: auto;
  padding-top: 20px;
  padding-bottom: 16px;
`;

const StyledEditorLayerTitle = styled(Typography)`
  line-height: 14px;
  font-weight: 700;
  padding: 17px 12px;
`;

export const EditorLayer: React.FC = () => {
  const editorContext = useEditorContext();
  const [layers, setLayers] = useState<ILayer[]>();
  const deferredLayers = useDeferredValue(layers);
  const deferredCurrentLayer = useDeferredValue(editorContext.focussedField[0]);

  const initLayers = async () => {
    const localConfig = editorContext.form.values;
    const localConfigSnapshot = getConfigSnapshot(localConfig);

    setLayers(normalizeComponentLayers(localConfigSnapshot.data));
  };

  const onClickLayer = (id: string, layer: string, rootParentId?: string) => {
    const editorCanvasIframe = window.document.getElementById(
      "editor-canvas"
    ) as HTMLIFrameElement | undefined;

    if (rootParentId) {
      const parentTargetComponent =
        editorCanvasIframe?.contentDocument?.getElementById(rootParentId);
      const childTargetComponent =
        editorCanvasIframe?.contentDocument?.getElementById(id);

      const parentRectTop =
        parentTargetComponent?.getBoundingClientRect()?.top ?? 0;
      const childRectTop =
        childTargetComponent?.getBoundingClientRect()?.top ?? 0;

      const top =
        (rootParentId === id ? parentRectTop : parentRectTop + childRectTop) +
        (editorCanvasIframe?.contentWindow?.scrollY ?? 0);

      editorCanvasIframe?.contentWindow?.scrollTo({
        top,
        behavior: "smooth",
      });
    }
    editorContext.setFocussedField(layer);
  };

  useEffect(() => {
    initLayers();
  }, [editorContext.form.values]);

  return (
    <StyledEditorLayerRoot>
      <StyledEditorLayerTitle>Layer</StyledEditorLayerTitle>

      <HorizontalLine />

      <StyledEditorLayer id="editor-layer">
        {deferredLayers ? (
          <EditorLayerDetail
            currentLayer={deferredCurrentLayer}
            onClickLayer={onClickLayer}
            layers={deferredLayers}
          />
        ) : null}
      </StyledEditorLayer>
    </StyledEditorLayerRoot>
  );
};
