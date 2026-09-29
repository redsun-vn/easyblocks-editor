import { Colors } from "@redsun-vn/easyblocks-design-system";
import { styled } from "styled-components";
import { ADD_BUTTON_SIZE } from "./AddButton";

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

/** Screen pixels between a handle and an add button sharing its edge. */
const ADD_BUTTON_GAP = 6;

/**
 * Where along its edge a handle's middle sits: the edge's middle, or past the
 * add button when one sits there. The add button is drawn in canvas pixels,
 * the handle in screen pixels, hence the two scales.
 */
function middleOf(length: number, scale: number, besideAddButton: boolean) {
  const shift = besideAddButton
    ? ADD_BUTTON_SIZE / 2 + (ADD_BUTTON_GAP + HANDLE_LENGTH / 2) / scale
    : 0;

  return `calc(50% - ${length / 2}px + ${shift}px)`;
}

function hitBox(place: HandlePlace, scale: number, besideAddButton: boolean) {
  const length = HANDLE_LENGTH / scale;
  const hit = HIT_AREA / scale;
  const middle = middleOf(length, scale, besideAddButton);

  switch (place) {
    case "bottom":
      return `left: ${middle}; bottom: -${hit / 2}px; width: ${length}px; height: ${hit}px;`;
    case "corner":
      return `right: -${hit / 2}px; bottom: -${hit / 2}px; width: ${hit}px; height: ${hit}px;`;
    default:
      return `top: ${middle}; ${place}: -${hit / 2}px; width: ${hit}px; height: ${length}px;`;
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

export const Handle = styled.div<{
  $place: HandlePlace;
  $scale: number;
  /** An add button sits in the middle of this handle's edge. */
  $besideAddButton?: boolean;
}>`
  position: absolute;
  pointer-events: auto;
  touch-action: none;
  display: grid;
  place-items: center;
  cursor: ${({ $place }) => CURSORS[$place]};
  ${({ $place, $scale, $besideAddButton = false }) =>
    hitBox($place, $scale, $besideAddButton)}

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
