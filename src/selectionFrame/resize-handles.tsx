import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useConfigAfterAuto } from "../ConfigAfterAutoContext";
import { useEditorContext } from "../EditorContext";
import { CanvasResizeField } from "./canvas-resize-fields";
import {
  deviceLabel,
  geometryOf,
  isPositionChanged,
  TargetBox,
} from "./resize-handles-helpers";
import { Chip, Handle, HandlePlace, Layer } from "./resize-handles-styles";
import { useCanvasFrameRedraws } from "./use-canvas-frame-redraws";
import { useCanvasResizeDrag } from "./use-canvas-resize-drag";

/**
 * Handles on the selected block's edges for the fields that opted into them:
 * the sides for a width, the bottom for a height, and the corner for both.
 *
 * The box follows the same position messages the action bar hangs from. A
 * handle is offered only while a drag would change something the page shows,
 * and stays put for as long as a drag is on even if that reading changes
 * under it — the canvas redraws a moment after each write, and a handle that
 * vanished mid-drag would take the pointer with it.
 */
export function ResizeHandles({
  widthField,
  heightField,
  path,
}: {
  widthField?: CanvasResizeField;
  heightField?: CanvasResizeField;
  path: string;
}) {
  const editorContext = useEditorContext();
  const configAfterAuto = useConfigAfterAuto();
  const [box, setBox] = useState<TargetBox | null>(null);
  const [scale, setScale] = useState(1);
  /** The handle being dragged, which is the one that carries the chip. */
  const [activePlace, setActivePlace] = useState<HandlePlace | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const gestureHasWritten = useRef(false);
  const shared = { path, editorContext, configAfterAuto, gestureHasWritten };
  const width = useCanvasResizeDrag({ ...shared, resizeField: widthField });
  const height = useCanvasResizeDrag({ ...shared, resizeField: heightField });

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

  const redraws = useCanvasFrameRedraws(path, configAfterAuto);

  // Read the page only when the block's size changed or the canvas redrew it,
  // not on every scroll message. The fields are keyed by name: their objects
  // are rebuilt on every write, before the canvas has drawn it.
  const widthKey = widthField ? String(widthField.field.name) : "";
  const heightKey = heightField ? String(heightField.field.name) : "";
  const [widthGeometry, heightGeometry] = useMemo(
    () =>
      box === null
        ? [null, null]
        : [
            geometryOf(path, widthField, editorContext.types),
            geometryOf(path, heightField, editorContext.types),
          ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path, widthKey, heightKey, box?.width, box?.height, redraws],
  );
  const canDragWidth = widthGeometry !== null;
  const canDragHeight = heightGeometry !== null;

  useLayoutEffect(() => {
    const layer = layerRef.current;

    if (layer && layer.offsetWidth > 0) {
      setScale(layer.getBoundingClientRect().width / layer.offsetWidth || 1);
    }
  }, [box?.width]);

  if (!box) {
    return null;
  }

  const showWidth = canDragWidth || width.reading !== null;
  const showHeight = canDragHeight || height.reading !== null;
  const device = deviceLabel(editorContext);

  const handle = (
    place: HandlePlace,
    drags: Array<typeof width>,
    edges: Array<"left" | "right" | "bottom">,
  ) => {
    const labels = drags.flatMap((drag) =>
      drag.reading ? [drag.reading.label] : [],
    );
    const release = () => setActivePlace(null);

    return (
      <Handle
        key={place}
        $place={place}
        $scale={scale}
        onPointerDown={(event) => {
          setActivePlace(place);
          drags.forEach((drag, index) =>
            drag.handlers.onPointerDown(edges[index])(event),
          );
        }}
        onPointerMove={(event) =>
          drags.forEach((drag) => drag.handlers.onPointerMove(event))
        }
        onPointerUp={() => {
          release();
          drags.forEach((drag) => drag.handlers.onPointerUp());
        }}
        onLostPointerCapture={() => {
          release();
          drags.forEach((drag) => drag.handlers.onLostPointerCapture());
        }}
        onPointerCancel={() => {
          release();
          drags.forEach((drag) => drag.handlers.onPointerCancel());
        }}
        // Releasing a drag fires a click, and the canvas area underneath
        // reads a click as "pick nothing".
        onClick={(event) => event.stopPropagation()}
      >
        {activePlace === place && labels.length > 0 && (
          <Chip $place={place} $scale={scale}>
            {labels.join(" × ")} · {device}
          </Chip>
        )}
      </Handle>
    );
  };

  // A width drawn by a grid moves the frame itself; any other size moves the
  // content inside it, which is where the handles belong.
  const content = widthGeometry
    ? widthGeometry.content
    : heightGeometry?.content;
  const layerBox = content
    ? { ...content, top: box.top + content.top, left: box.left + content.left }
    : box;

  // Only a grid span grows from either side. Any other width grows from the
  // edge the block's alignment leaves free, so a left handle would move away
  // from the pointer or at half its pace.
  const isSpan = widthGeometry !== null && !widthGeometry.content;
  // A height given as a ratio follows the width: the corner scales the block.
  const corner: [Array<typeof width>, Array<"right" | "bottom">] =
    heightGeometry?.followsWidth
      ? [[width], ["right"]]
      : [
          [width, height],
          ["right", "bottom"],
        ];

  return (
    <Layer ref={layerRef} style={layerBox}>
      {showWidth && isSpan && handle("left", [width], ["left"])}
      {showWidth && handle("right", [width], ["right"])}
      {showHeight && handle("bottom", [height], ["bottom"])}
      {showWidth && showHeight && handle("corner", ...corner)}
    </Layer>
  );
}
