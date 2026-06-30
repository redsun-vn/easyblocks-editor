import { Colors } from "@redsun-vn/easyblocks-design-system";
import React, { useState } from "react";
import { styled } from "styled-components";
import { ExtraKeys, useWindowKeyDown } from "./useWindowKeyDown";
import { debounce } from "lodash";
import { DeviceFrame } from "./DeviceFrame";

interface EditorIframeWrapperProps {
  onEditorHistoryRedo: () => void;
  onEditorHistoryUndo: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  width: number;
  height: number;
  transform: string;
  containerRef: React.RefObject<HTMLDivElement>;
  showDeviceFrame?: boolean;
  viewport?: string;
}

function EditorIframe({
  onEditorHistoryRedo,
  onEditorHistoryUndo,
  onSave,
  isSaving,
  width,
  height,
  transform,
  containerRef,
  showDeviceFrame = false,
  viewport = "fit-screen",
}: EditorIframeWrapperProps) {
  const [isIframeReady, setIframeReady] = useState(false);
  const debouncedSave = debounce((fn: () => void) => fn(), 200);

  const handleIframeLoaded = () => {
    setIframeReady(true);
  };

  const onKeyDownSave = () => {
    if (onSave && !isSaving) {
      debouncedSave(onSave);
    }
  };

  useWindowKeyDown("z", onEditorHistoryUndo, {
    extraKeys: [ExtraKeys.META_KEY],
    isDisabled: !isIframeReady,
  });

  useWindowKeyDown("z", onEditorHistoryRedo, {
    extraKeys: [ExtraKeys.META_KEY, ExtraKeys.SHIFT_KEY],
    isDisabled: !isIframeReady,
  });

  useWindowKeyDown("z", onEditorHistoryUndo, {
    extraKeys: [ExtraKeys.CTRL_KEY],
    isDisabled: !isIframeReady,
  });

  useWindowKeyDown("y", onEditorHistoryRedo, {
    extraKeys: [ExtraKeys.CTRL_KEY],
    isDisabled: !isIframeReady,
  });

  useWindowKeyDown("s", onKeyDownSave, {
    extraKeys: [ExtraKeys.CTRL_KEY],
    isDisabled: !isIframeReady,
  });

  useWindowKeyDown("s", onKeyDownSave, {
    extraKeys: [ExtraKeys.META_KEY],
    isDisabled: !isIframeReady,
  });

  return (
    <IframeContainer ref={containerRef}>
      <IframeInnerContainer>
        <Iframe
          id="editor-canvas"
          src={window.location.href}
          onLoad={handleIframeLoaded}
          style={{
            // These properties will change a lot during resizing, so we don't pass it to styled component to prevent
            // class name recalculations
            width,
            height,
            transform,
          }}
        />

        <DeviceFrame
          viewport={viewport}
          width={width}
          height={height}
          transform={transform}
          visible={showDeviceFrame}
        />
      </IframeInnerContainer>
    </IframeContainer>
  );
}

export { EditorIframe };

const IframeContainer = styled.div`
  position: relative;
  flex: 1 1 auto;
  background: ${Colors.black100};
  isolation: isolate;
`;

const IframeInnerContainer = styled.div`
  position: absolute; // absolute to prevent grid container having effect on parent div width (div can be oversized)
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  align-items: center;
`;

const Iframe = styled.iframe`
  background: white;
  border: none;
  transform-origin: center;
`;
