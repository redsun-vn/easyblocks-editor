import React, { useDeferredValue, useEffect, useState } from "react";
import { CANVAS_FRAME_PATH_ATTRIBUTE } from "../../EditableComponentBuilder/canvasLayers";
import { useEditorContext } from "../../EditorContext";
import { getConfigSnapshot } from "../../utils/config/getConfigSnapshot";
import {
  ILayer,
  normalizeComponentLayers,
} from "../../utils/normalizeComponentLayers";
import { canvasScrollTargetTop } from "./canvasScrollTarget";
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

  const onClickLayer = (id: string, layer: string) => {
    const editorCanvasIframe = window.document.getElementById(
      "editor-canvas",
    ) as HTMLIFrameElement | undefined;

    const canvasWindow = editorCanvasIframe?.contentWindow;

    // Found by path, which is what a canvas selection frame is marked with.
    // Looking it up by `_id` found almost nothing: of the layers in a typical
    // page only a fifth had an element carrying their id, so most clicks fell
    // through the lookup and the canvas never moved. The path is on every
    // frame, and it is the same string this row already hands to
    // `setFocussedField`.
    const targetComponent = editorCanvasIframe?.contentDocument?.querySelector(
      `[${CANVAS_FRAME_PATH_ATTRIBUTE}="${layer}"]`,
    );

    // Every layer scrolls, not only one that reported an enclosing section.
    // The element measures itself; where it sits in the tree changes nothing.
    if (canvasWindow && targetComponent) {
      canvasWindow.scrollTo({
        top: canvasScrollTargetTop({
          elementTop: targetComponent.getBoundingClientRect().top,
          scrollY: canvasWindow.scrollY,
        }),
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
