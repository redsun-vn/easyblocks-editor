import type { useSortable } from "@dnd-kit/sortable";
import { selectionFramePositionChanged } from "@redsun-vn/easyblocks-core/_internals";
import { Colors } from "@redsun-vn/easyblocks-design-system";
import React, { MouseEvent, ReactNode, useEffect, useState } from "react";
import {
  CANVAS_FRAME_LABEL_ATTRIBUTE,
  CANVAS_FRAME_PATH_ATTRIBUTE,
} from "./canvasLayers";

type SelectionFrameControllerProps = {
  isActive: boolean;
  onSelect: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  stitches: any;
  sortable: ReturnType<typeof useSortable>;
  id: string;
  direction: "horizontal" | "vertical";
  path: string;
  label: string;
  /** Whether this block can be picked up right now. Drives the `grab` cursor. */
  isDraggable: boolean;
  /** Why this block refuses the block being dragged, if it refuses it. */
  dropRejectionMessage?: string;
};

/** Innermost hovered frame: the one a click selects, since clicks select deepest-first. */
const HOVERED_TARGET_FRAME = `:hover:not(:has([${CANVAS_FRAME_PATH_ATTRIBUTE}]:hover))`;

/** Marks the refusal bubble so the frame around it can reveal it on hover. */
const DROP_REJECTION_ATTRIBUTE = "data-easyblocks-drop-rejection";

function SelectionFrameController({
  isActive,
  children,
  onSelect,
  stitches,
  sortable,
  id,
  direction,
  path,
  label,
  isDraggable,
  dropRejectionMessage,
}: SelectionFrameControllerProps) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useUpdateFramePosition({
    node,
    isDisabled: !isActive,
  });

  const isInsertingBefore = sortable.activeIndex > sortable.index;

  const wrapperClassName = stitches.css({
    position: "relative",
    display: "grid",

    // Selection is deepest-first: a click selects the innermost frame under the pointer,
    // so children stay clickable. Ancestors are reached with Esc, the action bar parent
    // button, the breadcrumb under the canvas or the right-click layer menu.

    "&[data-draggable-active=false]::after": {
      content: `''`,
      boxSizing: "border-box",
      display: "block",
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      border: "1px solid var(--tina-color-primary)",
      opacity: 0,
      pointerEvents: "none",
      userSelect: "none",
      transition: "all 100ms",
      boxShadow: "var(--tina-shadow-big)",
    },

    "&[data-active=true]::after": {
      opacity: 1,
    },

    // `:hover` also matches every ancestor frame, so only the click target gets feedback.
    [`&[data-active=false]${HOVERED_TARGET_FRAME}::after`]: {
      opacity: 0.5,
    },

    // Name of the click target, unless it is already selected: the sidebar shows its name
    // and the label would cover text being edited. While dragging, `::before` is the drop
    // indicator instead.
    [`&[data-active=false][data-draggable-dragging=false]${HOVERED_TARGET_FRAME}::before`]:
      {
      content: `attr(${CANVAS_FRAME_LABEL_ATTRIBUTE})`,
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: "var(--tina-z-index-2)",
      padding: "0 6px",
      borderBottomRightRadius: "4px",
      backgroundColor: "var(--tina-color-primary)",
      color: "#fff",
      fontFamily: "var(--tina-font-family)",
      fontSize: "11px",
      fontWeight: 600,
      lineHeight: "18px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      userSelect: "none",
    },

    "&[data-draggable-over=true]::before": {
      position: "absolute",
      ...(direction === "horizontal"
        ? {
            top: 0,
            bottom: 0,
            [isInsertingBefore ? "left" : "right"]: "0px",
            height: "100%",
            width: "4px",
          }
        : {
            left: 0,
            right: 0,
            [isInsertingBefore ? "top" : "bottom"]: "0px",
            width: "100%",
            height: "4px",
          }),

      display: "block",
      content: "''",
      backgroundColor: Colors.blue50,
      borderRadius: "2px",
      // Halo, so the insertion line stays readable on a background of any colour.
      boxShadow: `0 0 0 1px ${Colors.white}`,
      zIndex: 9999999,
    },

    "&[data-draggable-active=true]": {
      opacity: 0.5,
    },

    "&[data-draggable-dragging=true]": {
      cursor: "grabbing",
    },

    // Any block can be picked up without being selected first, so the click target
    // advertises it while nothing is being dragged yet.
    [`&[data-draggable-enabled=true][data-draggable-dragging=false]${HOVERED_TARGET_FRAME}`]:
      {
        cursor: "grab",
      },

    "&[data-drop-rejected=true]": {
      cursor: "no-drop",
    },

    // The refusal only concerns the block actually under the pointer.
    [`&${HOVERED_TARGET_FRAME} [${DROP_REJECTION_ATTRIBUTE}]`]: {
      opacity: 1,
    },
  });

  const dropRejectionClassName = stitches.css({
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999999,
    maxWidth: "280px",
    padding: "2px 6px",
    borderRadius: "4px",
    backgroundColor: Colors.black900,
    color: Colors.white,
    fontFamily: "var(--tina-font-family)",
    fontSize: "11px",
    fontWeight: 500,
    lineHeight: "18px",
    opacity: 0,
    pointerEvents: "none",
    userSelect: "none",
  });

  useEffect(() => {
    return () => {
      // If the the node of active element is not in the DOM anymore we want to deselect it to prevent showing
      // add buttons on the not existing element.
      if (
        isActive &&
        node &&
        !window.document.contains(node) &&
        path === window.parent.editorWindowAPI?.editorContext?.focussedField[0]
      ) {
        window.parent.editorWindowAPI.editorContext.setFocussedField([]);
      }
    };
  });

  return (
    <div
      {...{
        [CANVAS_FRAME_PATH_ATTRIBUTE]: path,
        [CANVAS_FRAME_LABEL_ATTRIBUTE]: label,
      }}
      data-active={isActive}
      data-draggable-enabled={isDraggable}
      data-drop-rejected={dropRejectionMessage !== undefined}
      data-draggable-dragging={sortable.active !== null}
      data-draggable-over={sortable.isOver}
      data-draggable-active={
        sortable.active !== null && sortable.active?.id === id
      }
      className={wrapperClassName().className}
      ref={(node) => {
        setNode(node);
        sortable.setNodeRef(node);
      }}
      onClick={onSelect}
      {...sortable.attributes}
      {...sortable.listeners}
    >
      {dropRejectionMessage !== undefined && (
        <div
          {...{ [DROP_REJECTION_ATTRIBUTE]: "" }}
          role="tooltip"
          className={dropRejectionClassName().className}
        >
          {dropRejectionMessage}
        </div>
      )}
      {children}
    </div>
  );
}

export { SelectionFrameController };

function useUpdateFramePosition({
  node,
  isDisabled,
}: {
  node: HTMLElement | null;
  isDisabled: boolean;
}) {
  const dispatch = window.parent.postMessage;

  useEffect(() => {
    if (isDisabled || !node) {
      return;
    }

    const updateSelectionFramePosition = createThrottledHandler(() => {
      const nodeRect = node.getBoundingClientRect();

      dispatch(
        selectionFramePositionChanged(
          nodeRect,
          window.document.documentElement.getBoundingClientRect(),
        ),
      );
    });

    window.addEventListener("scroll", updateSelectionFramePosition, {
      passive: true,
    });

    const handleResize = createThrottledHandler(() => {
      const nodeRect = node.getBoundingClientRect();
      dispatch(selectionFramePositionChanged(nodeRect));
    });

    window.addEventListener("resize", handleResize, {
      passive: true,
    });

    const updateSelectionFramePositionInScrollableContainer =
      createThrottledHandler((event) => {
        const nodeRect = node.getBoundingClientRect();
        const containerRect = (
          event.target as HTMLElement
        ).getBoundingClientRect();

        dispatch(selectionFramePositionChanged(nodeRect, containerRect));
      });

    const closestScrollableElement = node.closest(
      "[data-easyblocks-scrollable-root]",
    );

    closestScrollableElement?.addEventListener(
      "scroll",
      updateSelectionFramePositionInScrollableContainer,
      {
        passive: true,
      },
    );

    dispatch(
      selectionFramePositionChanged(
        node.getBoundingClientRect(),
        closestScrollableElement?.getBoundingClientRect(),
      ),
    );

    return () => {
      window.removeEventListener("scroll", updateSelectionFramePosition);
      window.removeEventListener("resize", handleResize);
      closestScrollableElement?.removeEventListener(
        "scroll",
        updateSelectionFramePositionInScrollableContainer,
      );
    };
  });
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event#scroll_event_throttling
 */
function createThrottledHandler(callback: (event: Event) => void) {
  let isTicking = false;

  return (event: Event) => {
    if (isTicking) {
      return;
    }

    requestAnimationFrame(() => {
      callback(event);
      isTicking = false;
    });

    isTicking = true;
  };
}
