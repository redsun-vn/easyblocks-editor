import { SelectionFramePositionChangedEvent } from "@redsun-vn/easyblocks-core/_internals";
import { Colors } from "@redsun-vn/easyblocks-design-system";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { styled } from "styled-components";
import { useConfigAfterAuto } from "../ConfigAfterAutoContext";
import { useEditorContext } from "../EditorContext";
import { CanvasResizeField, canvasResizeValues } from "./canvas-resize-fields";
import { readResizeGeometry } from "./canvas-resize-geometry";
import { ResizeEdge, useCanvasResizeDrag } from "./use-canvas-resize-drag";

/** The selected block's box, in canvas pixels, as the position messages give it. */
type TargetBox = { top: number; left: number; width: number; height: number };

/** Screen pixels. Divided by the zoom so a handle stays catchable at any zoom. */
const HANDLE_LENGTH = 24;
const HANDLE_THICKNESS = 6;
const HIT_AREA = 14;

const Layer = styled.div`
  position: absolute;
  pointer-events: none;
`;

const Handle = styled.div<{ $edge: ResizeEdge; $scale: number }>`
  position: absolute;
  pointer-events: auto;
  touch-action: none;
  display: grid;
  place-items: center;
  cursor: ${({ $edge }) => ($edge === "bottom" ? "ns-resize" : "ew-resize")};
  ${({ $edge, $scale }) => {
    const length = HANDLE_LENGTH / $scale;
    const hit = HIT_AREA / $scale;
    return $edge === "bottom"
      ? `left: calc(50% - ${length / 2}px); bottom: -${hit / 2}px; width: ${length}px; height: ${hit}px;`
      : `top: calc(50% - ${length / 2}px); ${$edge}: -${hit / 2}px; width: ${hit}px; height: ${length}px;`;
  }}

  &::before {
    content: "";
    box-sizing: border-box;
    border-radius: 3px;
    background: var(--tina-color-primary, #2296fe);
    border: 1px solid ${Colors.white};
    box-shadow: 0 0 0 1px ${Colors.black900};
    ${({ $edge, $scale }) =>
      $edge === "bottom"
        ? `width: ${HANDLE_LENGTH / $scale}px; height: ${HANDLE_THICKNESS / $scale}px;`
        : `width: ${HANDLE_THICKNESS / $scale}px; height: ${HANDLE_LENGTH / $scale}px;`}
  }
`;

const Chip = styled.div<{ $edge: ResizeEdge; $scale: number }>`
  position: absolute;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${Colors.black900};
  color: ${Colors.white};
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  white-space: nowrap;
  pointer-events: none;
  ${({ $edge, $scale }) =>
    $edge === "bottom"
      ? `left: 50%; bottom: -28px; transform: translateX(-50%) scale(${1 / $scale});`
      : `top: 50%; ${$edge}: 12px; transform: translateY(-50%) scale(${1 / $scale});`}
`;

function isPositionChanged(
  data: unknown,
): data is SelectionFramePositionChangedEvent["data"] {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { type?: unknown }).type ===
      "@easyblocks-editor/selection-frame-position-changed"
  );
}

/**
 * Handles on the selected block's edges for a field that opted into them.
 *
 * The box follows the same position messages the action bar hangs from. A
 * handle is offered only while a drag would change something the page shows,
 * and stays put for as long as a drag is on even if that reading changes
 * under it — the canvas redraws a moment after each write, and a handle that
 * vanished mid-drag would take the pointer with it.
 */
export function ResizeHandles({
  resizeField,
  path,
}: {
  resizeField: CanvasResizeField;
  path: string;
}) {
  const editorContext = useEditorContext();
  const configAfterAuto = useConfigAfterAuto();
  const [box, setBox] = useState<TargetBox | null>(null);
  const [scale, setScale] = useState(1);
  const layerRef = useRef<HTMLDivElement>(null);
  const { reading, handlers } = useCanvasResizeDrag({
    resizeField,
    path,
    editorContext,
    configAfterAuto,
  });

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (isPositionChanged(event.data)) {
        const { top, left, width, height } = event.data.payload.target;
        setBox({ top, left, width, height });
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Read the page only when the block's size or the config changed, not on
  // every scroll message.
  const isDraggable = useMemo(
    () =>
      box !== null &&
      readResizeGeometry({
        path,
        axis: resizeField.option.axis,
        values: canvasResizeValues(resizeField),
      }) !== null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path, resizeField, box?.width, box?.height, configAfterAuto],
  );

  useLayoutEffect(() => {
    const layer = layerRef.current;

    if (layer && layer.offsetWidth > 0) {
      setScale(layer.getBoundingClientRect().width / layer.offsetWidth || 1);
    }
  }, [box?.width]);

  if (!box || (!isDraggable && !reading)) {
    return null;
  }

  const edges: ReadonlyArray<ResizeEdge> =
    resizeField.option.axis === "x" ? ["left", "right"] : ["bottom"];

  return (
    <Layer ref={layerRef} style={box}>
      {edges.map((edge) => (
        <Handle
          key={edge}
          $edge={edge}
          $scale={scale}
          {...handlers}
          onPointerDown={handlers.onPointerDown(edge)}
          // Releasing a drag fires a click, and the canvas area underneath
          // reads a click as "pick nothing".
          onClick={(event) => event.stopPropagation()}
        >
          {reading?.edge === edge && (
            <Chip $edge={edge} $scale={scale}>
              {reading.label} · {deviceLabel(editorContext)}
            </Chip>
          )}
        </Handle>
      ))}
    </Layer>
  );
}

function deviceLabel({
  devices,
  breakpointIndex,
}: {
  devices: Array<{ id: string; label?: string }>;
  breakpointIndex: string;
}) {
  const device = devices.find((candidate) => candidate.id === breakpointIndex);
  return device?.label ?? breakpointIndex;
}
