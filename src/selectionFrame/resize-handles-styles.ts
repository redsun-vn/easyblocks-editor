import { Colors } from "@redsun-vn/easyblocks-design-system";
import { styled } from "styled-components";

/** Where a handle sits on the selected block. */
export type HandlePlace = "left" | "right" | "bottom" | "corner";

/** Screen pixels. Divided by the zoom so a handle stays catchable at any zoom. */
const HANDLE_LENGTH = 24;
const HANDLE_THICKNESS = 6;
const HIT_AREA = 14;

const CURSORS: Record<HandlePlace, string> = {
  left: "ew-resize",
  right: "ew-resize",
  bottom: "ns-resize",
  corner: "nwse-resize",
};

function hitBox(place: HandlePlace, scale: number) {
  const length = HANDLE_LENGTH / scale;
  const hit = HIT_AREA / scale;

  switch (place) {
    case "bottom":
      return `left: calc(50% - ${length / 2}px); bottom: -${hit / 2}px; width: ${length}px; height: ${hit}px;`;
    case "corner":
      return `right: -${hit / 2}px; bottom: -${hit / 2}px; width: ${hit}px; height: ${hit}px;`;
    default:
      return `top: calc(50% - ${length / 2}px); ${place}: -${hit / 2}px; width: ${hit}px; height: ${length}px;`;
  }
}

function mark(place: HandlePlace, scale: number) {
  const long = HANDLE_LENGTH / scale;
  const thin = HANDLE_THICKNESS / scale;

  switch (place) {
    case "bottom":
      return `width: ${long}px; height: ${thin}px;`;
    case "corner":
      return `width: ${thin * 1.6}px; height: ${thin * 1.6}px;`;
    default:
      return `width: ${thin}px; height: ${long}px;`;
  }
}

export const Layer = styled.div`
  position: absolute;
  pointer-events: none;
`;

export const Handle = styled.div<{ $place: HandlePlace; $scale: number }>`
  position: absolute;
  pointer-events: auto;
  touch-action: none;
  display: grid;
  place-items: center;
  cursor: ${({ $place }) => CURSORS[$place]};
  ${({ $place, $scale }) => hitBox($place, $scale)}

  &::before {
    content: "";
    box-sizing: border-box;
    border-radius: 3px;
    background: var(--tina-color-primary, #2296fe);
    border: 1px solid ${Colors.white};
    box-shadow: 0 0 0 1px ${Colors.black900};
    ${({ $place, $scale }) => mark($place, $scale)}
  }
`;

export const Chip = styled.div<{ $place: HandlePlace; $scale: number }>`
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
  ${({ $place, $scale }) =>
    $place === "left" || $place === "right"
      ? `top: 50%; ${$place}: 12px; transform: translateY(-50%) scale(${1 / $scale});`
      : `left: 50%; bottom: -28px; transform: translateX(-50%) scale(${1 / $scale});`}
`;
