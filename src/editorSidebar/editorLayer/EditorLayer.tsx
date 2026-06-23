import React, { useDeferredValue, useEffect, useState } from "react";
import { useEditorContext } from "../../EditorContext";
import { getConfigSnapshot } from "../../utils/config/getConfigSnapshot";
import {
  ILayer,
  normalizeComponentLayers,
} from "../../utils/normalizeComponentLayers";
import { EditorLayerDetail } from "./EditorLayerDetail";

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
      "editor-canvas",
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

  const onFocusLayer = (layerId: string) => {
    if (layerId) {
      const targetEditorLayer = document.getElementById("editor-layers");
      const targetComponent = document.getElementById(
        `sidebar-layer-${layerId}`,
      );
      const top =
        (targetComponent?.getBoundingClientRect()?.top ?? 0) -
        (targetEditorLayer?.getBoundingClientRect()?.top ?? 0) +
        (targetEditorLayer?.scrollTop ?? 0);

      targetEditorLayer?.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    initLayers();
  }, [editorContext.form.values]);

  return deferredLayers ? (
    <EditorLayerDetail
      onFocusLayer={onFocusLayer}
      currentLayer={deferredCurrentLayer}
      onClickLayer={onClickLayer}
      layers={deferredLayers}
    />
  ) : null;
};
