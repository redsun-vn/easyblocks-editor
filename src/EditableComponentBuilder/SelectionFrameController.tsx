import { CSS } from "@dnd-kit/utilities";
import type { useSortable } from "@dnd-kit/sortable";
import { selectionFramePositionChanged } from "@redsun-vn/easyblocks-core/_internals";
import { selectionPointerChanged } from "@/selectionFrame/selectionPointer";
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
  /** This block is the one the dragged block would land inside. */
  isDropContainer: boolean;
  /** The drop would land against this block. */
  isDropTarget: boolean;
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
const DROP_INDICATOR_THICKNESS = 8;

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
  isDropContainer,
  isDropTarget,
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

    // Mid-drag, the block the drop would land against states plainly that it
    // would take it. A half-opacity hairline — the same one hovering shows when
    // nothing is being dragged — read as "nothing is happening here", which is
    // why aiming at a target felt like aiming somewhere that refuses drops.
    "&[data-drop-target=true]::after": {
      opacity: 1,
      borderColor: Colors.purple,
      borderWidth: "3px",
      // A wash over the whole target, not just a line around it. Two blocks
      // sitting flush in a row leave the eye nowhere to notice a border, and a
      // reorder inside one row is the move that felt like nothing happened.
      backgroundColor: "rgba(123, 112, 245, 0.16)",
      boxShadow: "none",
    },

    // Name of the click target, unless it is already selected: the sidebar shows its name
    // and the label would cover text being edited. While dragging, `::before` is the drop
    // indicator instead.
    [`&[data-active=false][data-draggable-dragging=false]${HOVERED_TARGET_FRAME}::before`]:
      {
      content: `attr(${CANVAS_FRAME_LABEL_ATTRIBUTE})`,
      position: "absolute",
      top: 0,
      // Sits beside the grip when there is one, and reclaims the space when
      // there is not, so a block that cannot be dragged shows no empty gap.
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

    [`&[data-draggable-enabled=true][data-active=false][data-draggable-dragging=false]${HOVERED_TARGET_FRAME}::before`]:
      {
        left: `${DRAG_HANDLE_SIZE}px`,
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

    // The container that will receive the drop, ringed in the same purple as the
    // insertion line. Between them a drag now answers both halves of "where does
    // this go": the ring says inside what, the line says at which boundary.
    "&[data-drop-container=true]": {
      boxShadow: `inset 0 0 0 2px ${Colors.purple}`,
      borderRadius: "2px",
    },


    // The grip is revealed by the same hover that reveals the label, so picking a
    // block up still takes no prior selection — it just takes aiming at a control
    // instead of at the block, which is what stopped a press-and-nudge anywhere
    // inside a section from turning into a drag.
    // `>` and not a descendant selector: every nested block carries a grip of its
    // own, and those grips are descendants of this frame too. Matching them all
    // lit up one per child and buried the section under a grid of handles.
    [`&[data-draggable-enabled=true][data-draggable-dragging=false]${HOVERED_TARGET_FRAME} > [${DRAG_HANDLE_ATTRIBUTE}]`]:
      {
        opacity: 1,
        pointerEvents: "auto",
      },

    [`&[data-active=true][data-draggable-dragging=false] > [${DRAG_HANDLE_ATTRIBUTE}]`]:
      {
        opacity: 1,
        pointerEvents: "auto",
      },

    // A block that refuses the drag says so while the pointer is on it. dnd-kit
    // drops a refusing block out of its own targeting entirely, so it can never
    // be the drag's `over` and the refusal has to hang off the pointer instead.
    // Without this the pointer simply found nothing there, which reads as "this
    // spot does nothing" rather than "this spot will not take it".
    [`&[data-drop-rejected=true][data-draggable-dragging=true]${HOVERED_TARGET_FRAME}`]:
      {
        cursor: "no-drop",
      },

    [`&[data-drop-rejected=true][data-draggable-dragging=true]${HOVERED_TARGET_FRAME}::after`]:
      {
        opacity: 1,
        borderColor: Colors.red,
        borderWidth: "2px",
        borderStyle: "dashed",
        backgroundColor: "rgba(234, 0, 30, 0.12)",
        boxShadow: "none",
      },

    // The refusal only concerns the block actually under the pointer, and `>`
    // keeps it that way: a descendant match would reveal every nested block's
    // bubble as well.
    [`&[data-draggable-dragging=true]${HOVERED_TARGET_FRAME} > [${DROP_REJECTION_ATTRIBUTE}]`]:
      {
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
      data-drop-container={isDropContainer}
      data-drop-target={isDropTarget}
      data-draggable-active={
        sortable.active !== null && sortable.active?.id === id
      }
      className={wrapperClassName().className}
      // The block actually moves. Until now the sortable transform was computed
      // and thrown away, so a reorder showed a dimmed block sitting exactly
      // where it started while its neighbours stayed put — the page looked
      // frozen for the whole gesture. The strategy that produces this only
      // answers for the collection being sorted, so nothing outside it shifts.
      style={{
        transform: CSS.Translate.toString(sortable.transform),
        transition: sortable.transition,
      }}
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

    const reportPointerOver = () => dispatch(selectionPointerChanged(true));
    const reportPointerOut = () => dispatch(selectionPointerChanged(false));

    node.addEventListener("pointerenter", reportPointerOver);
    node.addEventListener("pointerleave", reportPointerOut);

    dispatch(
      selectionFramePositionChanged(
        node.getBoundingClientRect(),
        closestScrollableElement?.getBoundingClientRect(),
      ),
    );

    /**
     * The state the pointer is already in, said out loud once.
     *
     * A block becomes the selection because somebody clicked it, which means
     * the pointer was inside it before these listeners existed — and
     * `pointerenter` does not fire for a pointer that never crossed the edge.
     * Without this the bar stayed hidden until the pointer left the block and
     * came back, which is the opposite of what clicking a block asks for.
     *
     * `:hover` is the browser's own answer to "is the pointer in here", and it
     * is already correct at this moment.
     */
    dispatch(selectionPointerChanged(node.matches(":hover")));

    return () => {
      window.removeEventListener("scroll", updateSelectionFramePosition);
      window.removeEventListener("resize", handleResize);
      closestScrollableElement?.removeEventListener(
        "scroll",
        updateSelectionFramePositionInScrollableContainer,
      );
      node.removeEventListener("pointerenter", reportPointerOver);
      node.removeEventListener("pointerleave", reportPointerOut);
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
