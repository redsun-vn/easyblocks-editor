import type { EditingInfoBase } from "@redsun-vn/easyblocks-core";
import { ADD_BUTTON_SIZE } from "./AddButton";

function calculateAddButtonsProperties(
  direction: Required<EditingInfoBase>["direction"],
  targetElementRect: DOMRect,
  viewport: {
    width: number;
    height: number;
  },
  containerElementRect?: DOMRect
): {
  before: { top: number; left: number; display: "block" | "none" };
  after: { top: number; left: number; display: "block" | "none" };
} {
  const halfButtonSize = Math.floor(ADD_BUTTON_SIZE / 2);

  if (direction === "vertical") {
    const beforeButtonTopOffset = Math.floor(
      targetElementRect.top - halfButtonSize
    );
    const afterButtonTopOffset = Math.floor(
      targetElementRect.top + targetElementRect.height - halfButtonSize
    );
    const buttonsLeftOffset = Math.floor(
      targetElementRect.left + targetElementRect.width / 2 - halfButtonSize
    );

    const isBeforeButtonVisible = isButtonVisible(
      {
        top: beforeButtonTopOffset + halfButtonSize,
        left: buttonsLeftOffset + halfButtonSize,
      },
      viewport,
      containerElementRect
    );

    const isAfterButtonVisible = isButtonVisible(
      {
        top: afterButtonTopOffset + halfButtonSize,
        left: buttonsLeftOffset + halfButtonSize,
      },
      viewport,
      containerElementRect
    );

    return {
      before: {
        top: beforeButtonTopOffset,
        left: buttonsLeftOffset,
        display: isBeforeButtonVisible ? "block" : "none",
      },
      after: {
        top: afterButtonTopOffset,
        left: buttonsLeftOffset,
        display: isAfterButtonVisible ? "block" : "none",
      },
    };
  } else {
    const buttonsTopOffset = Math.floor(
      targetElementRect.top + targetElementRect.height / 2 - halfButtonSize
    );
    const beforeButtonLeftOffset = Math.floor(
      targetElementRect.left - halfButtonSize
    );
    const afterButtonLeftOffset = Math.floor(
      targetElementRect.left + targetElementRect.width - halfButtonSize
    );

    const isBeforeButtonVisible = isButtonVisible(
      {
        top: buttonsTopOffset + halfButtonSize,
        left: beforeButtonLeftOffset + halfButtonSize,
      },
      viewport,
      containerElementRect
    );
    const isAfterButtonVisible = isButtonVisible(
      {
        top: buttonsTopOffset + halfButtonSize,
        left: afterButtonLeftOffset + halfButtonSize,
      },
      viewport,
      containerElementRect
    );

    return {
      before: {
        top: buttonsTopOffset,
        left: beforeButtonLeftOffset,
        display: isBeforeButtonVisible ? "block" : "none",
      },
      after: {
        top: buttonsTopOffset,
        left: afterButtonLeftOffset,
        display: isAfterButtonVisible ? "block" : "none",
      },
    };
  }
}

export { calculateAddButtonsProperties };

/**
 * A button shows only where it can actually be reached.
 *
 * The container was accepted and then ignored — both branches of the caller
 * returned the same thing — so inside a scrollable container the add buttons
 * stayed on screen after the block they belong to had scrolled out of it,
 * floating over whatever was there instead. Edges count as inside: a block
 * flush with the top of its container still gets its button.
 */
function isButtonVisible(
  target: { top: number; left: number },
  viewport: { width: number; height: number },
  containerElementRect?: DOMRect
) {
  const withinViewport =
    target.top >= 0 &&
    target.top <= viewport.height &&
    target.left >= 0 &&
    target.left <= viewport.width;

  if (!withinViewport || !containerElementRect) {
    return withinViewport;
  }

  return (
    target.top >= containerElementRect.top &&
    target.top <= containerElementRect.bottom &&
    target.left >= containerElementRect.left &&
    target.left <= containerElementRect.right
  );
}
