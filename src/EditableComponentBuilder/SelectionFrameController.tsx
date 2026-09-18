import type { useSortable } from "@dnd-kit/sortable";
import { selectionFramePositionChanged } from "@redsun-vn/easyblocks-core/_internals";
import { Colors } from "@redsun-vn/easyblocks-design-system";
import React, { MouseEvent, ReactNode, useEffect, useState } from "react";
import {
  CANVAS_FRAME_LABEL_ATTRIBUTE,
  CANVAS_FRAME_PATH_ATTRIBUTE,
} from "./canvasLayers";
import type { DropIndicatorEdge } from "./dropIndicator";

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
  /** Edge of this block the dragged block would land on, or `null` when it would land elsewhere. */
  dropIndicatorEdge: DropIndicatorEdge;
  /**
   * Droppables marking the outer edges of the collection. They are positioned against this
   * frame, so they belong inside it: the frame is the only box that knows where the edge is.
   */
  edgeDropTargets?: ReactNode;
};

/**
 * Thickness of the insertion line, in canvas pixels. The canvas is scaled down by the zoom
 * control, so the line is drawn thinner than this wherever the device does not fit the
 * viewport at 1:1, which is what made a hairline unreadable.
 */
const DROP_INDICATOR_THICKNESS = 6;

/** Innermost hovered frame: the one a click selects, since clicks select deepest-first. */
const HOVERED_TARGET_FRAME = `:hover:not(:has([${CANVAS_FRAME_PATH_ATTRIBUTE}]:hover))`;

/** Marks the refusal bubble so the frame around it can reveal it on hover. */
const DROP_REJECTION_ATTRIBUTE = "data-easyblocks-drop-rejection";

/** Marks the drag grip so the frame around it can reveal it on hover. */
const DRAG_HANDLE_ATTRIBUTE = "data-easyblocks-drag-handle";

/** Edge length of the square grip, in canvas pixels. */
const DRAG_HANDLE_SIZE = 20;

/** Six dots, the conventional "pick this up" mark. */
function DragHandleGlyph() {
  return (
    <svg
      width="10"
      height="14"
      viewBox="0 0 10 14"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {[2, 7, 12].flatMap((cy) =>
        [2, 8].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" />),
      )}
    </svg>
  );
}

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
  dropIndicatorEdge,
  edgeDropTargets,
}: SelectionFrameControllerProps) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useUpdateFramePosition({
    node,
    isDisabled: !isActive,
  });

  // The line straddles the boundary the block will land on, so half of it sits outside this
  // frame and half inside: it reads as a gap between two blocks rather than a border of one.
  const dropIndicatorBar = {
    content: `''`,
    display: "block",
    position: "absolute",
    zIndex: 9999999,
    pointerEvents: "none",
    userSelect: "none",
    borderRadius: "2px",
    backgroundColor: Colors.purple,
    // Purple is the one accent the canvas does not already use: the selection and hover
    // frames, the add-block placeholders and the sidebar are all the same blue, which is
    // what made the insertion line indistinguishable from the rest of the drag feedback.
    // The double ring carries it over customer content: the white one holds up on a dark
    // section, the dark one on a light section.
    boxShadow: `0 0 0 2px ${Colors.white}, 0 0 0 3px ${Colors.black900}`,
    ...(direction === "horizontal"
      ? { top: 0, bottom: 0, width: `${DROP_INDICATOR_THICKNESS}px` }
      : { left: 0, right: 0, height: `${DROP_INDICATOR_THICKNESS}px` }),
  };

  const leadingEdge = direction === "horizontal" ? "left" : "top";
  const trailingEdge = direction === "horizontal" ? "right" : "bottom";
  const dropIndicatorOffset = `-${DROP_INDICATOR_THICKNESS / 2}px`;

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
      left: `${DRAG_HANDLE_SIZE}px`,
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

    "&[data-drop-indicator=before]::before": {
      ...dropIndicatorBar,
      [leadingEdge]: dropIndicatorOffset,
    },

    "&[data-drop-indicator=after]::before": {
      ...dropIndicatorBar,
      [trailingEdge]: dropIndicatorOffset,
    },

    "&[data-draggable-active=true]": {
      opacity: 0.5,
    },

    // The grip is revealed by the same hover that reveals the label, so picking a
    // block up still takes no prior selection — it just takes aiming at a control
    // instead of at the block, which is what stopped a press-and-nudge anywhere
    // inside a section from turning into a drag.
    [`&[data-draggable-enabled=true][data-draggable-dragging=false]${HOVERED_TARGET_FRAME} [${DRAG_HANDLE_ATTRIBUTE}]`]:
      {
        opacity: 1,
        pointerEvents: "auto",
      },

    [`&[data-active=true][data-draggable-dragging=false] [${DRAG_HANDLE_ATTRIBUTE}]`]:
      {
        opacity: 1,
        pointerEvents: "auto",
      },

    "&[data-drop-rejected=true]": {
      cursor: "no-drop",
    },

    // The refusal only concerns the block actually under the pointer.
    [`&${HOVERED_TARGET_FRAME} [${DROP_REJECTION_ATTRIBUTE}]`]: {
      opacity: 1,
    },
  });

  const dragHandleClassName = stitches.css({
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999999,
    boxSizing: "border-box",
    width: `${DRAG_HANDLE_SIZE}px`,
    height: `${DRAG_HANDLE_SIZE}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: "4px",
    backgroundColor: "var(--tina-color-primary)",
    color: "#fff",
    cursor: "grab",
    opacity: 0,
    // Hidden means untouchable: a transparent 20px box sitting on every block's
    // top-left corner would swallow clicks meant for the content under it.
    pointerEvents: "none",
    transition: "opacity 100ms",
    userSelect: "none",
    touchAction: "none",

    "&:active": {
      cursor: "grabbing",
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
      data-drop-indicator={dropIndicatorEdge ?? "none"}
      data-draggable-active={
        sortable.active !== null && sortable.active?.id === id
      }
      className={wrapperClassName().className}
      ref={(node) => {
        setNode(node);
        sortable.setNodeRef(node);
      }}
      onClick={onSelect}
    >
      {isDraggable && (
        <div
          {...{ [DRAG_HANDLE_ATTRIBUTE]: "" }}
          className={dragHandleClassName().className}
          title={label}
          // Selecting is the frame's job; grabbing the grip must not also
          // change what the sidebar is editing.
          onClick={(event) => event.stopPropagation()}
          {...sortable.attributes}
          {...sortable.listeners}
        >
          <DragHandleGlyph />
        </div>
      )}
      {edgeDropTargets}
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
