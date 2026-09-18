import { toArray } from "@/utils/array/toArray";
import { useDndContext } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  CompiledCustomComponentConfig,
  CompiledShopstoryComponentConfig,
  ComponentCollectionSchemaProp,
  SerializedRenderableComponentDefinition,
} from "@redsun-vn/easyblocks-core";
import {
  parsePath,
  useEasyblocksMetadata,
} from "@redsun-vn/easyblocks-core/_internals";
import React, { Fragment } from "react";
import { EditorContextType } from "../EditorContext";
import { getTranslation } from "../useTranslation";
import {
  RICH_TEXT_PART_CONFIG_PATH_REGEXP,
  isConfigPathRichTextPart,
} from "../utils/isConfigPathRichTextPart";
import { getComponentLabel } from "../utils/selection/canvasSelectionPaths";
import { resolveDropIndicatorEdge } from "./dropIndicator";
import { SelectionFrameController } from "./SelectionFrameController";

interface BlocksControlsProps {
  children: React.ReactNode;
  path: string;
  disabled?: boolean;
  direction: "horizontal" | "vertical";
  id: string;
  templateId: string;
  compiled: CompiledShopstoryComponentConfig | CompiledCustomComponentConfig;
  index: number;
  length: number;
}
export function BlocksControls({
  children,
  path,
  disabled,
  direction,
  id,
  templateId,
  index,
  length,
}: BlocksControlsProps) {
  const editorContext: EditorContextType =
    window.parent.editorWindowAPI?.editorContext ?? ({} as EditorContextType);
  const { focussedField = [], setFocussedField, form } = editorContext;

  const meta = useEasyblocksMetadata();
  const dndContext = useDndContext();
  const { t } = getTranslation(editorContext);

  const isActive = focussedField
    .map((focusedField: string) => {
      // If the focused field is rich text part path, we want to show the frame around rich text parent component.
      if (isConfigPathRichTextPart(focusedField)) {
        return focusedField.replace(RICH_TEXT_PART_CONFIG_PATH_REGEXP, "");
      }

      return focusedField;
    })
    .includes(path);

  const entryPathParseResult = parsePath(path, form);
  const entryComponentDefinition = meta.vars.definitions.components.find(
    (c) => c.id === entryPathParseResult.parent!.templateId,
  );

  // component` could be draggable, but right now we only support collections.
  const isEntryComponentOrComponentFixed =
    entryComponentDefinition!.schema.some(
      (s) =>
        s.prop === entryPathParseResult.parent!.fieldName &&
        s.type === "component",
    );

  const isMultiSelection = focussedField.length > 1;

  const draggedEntryPathParseResult = dndContext.active
    ? parsePath(dndContext.active.data.current!.path, form)
    : null;

  const draggedComponentDefinition = draggedEntryPathParseResult
    ? meta.vars.definitions.components.find(
        (c) => c.id === draggedEntryPathParseResult.templateId,
      )
    : null;

  const canDraggedComponentBeDropped =
    entryComponentDefinition && draggedComponentDefinition
      ? getAllowedComponentTypes(entryComponentDefinition).some((type) => {
          return (
            toArray(draggedComponentDefinition.type ?? []).includes(type) ||
            draggedComponentDefinition.id === type
          );
        })
      : true;

  const sortableDisabledState = getSortableDisabledState({
    isEditingDisabled: disabled === true,
    isFixedSlot: isEntryComponentOrComponentFixed,
    isMultiSelection,
    canAcceptDraggedComponent: canDraggedComponentBeDropped,
  });

  const isDroppableDisabled = sortableDisabledState.droppable;

  const componentLabel = getComponentLabel(templateId, editorContext, t);

  const sortable = useSortable({
    id,
    // `label` rides along so the drag preview in the canvas can name what is
    // being carried without resolving the path a second time.
    data: {
      path,
      label: componentLabel,
    },
    disabled: sortableDisabledState,
    strategy:
      direction === "horizontal"
        ? horizontalListSortingStrategy
        : verticalListSortingStrategy,
  });

  if (disabled) {
    return <>{children}</>;
  }

  const focusOnBlock = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    if (isActive) {
      return;
    } else {
      event.preventDefault();
    }

    const closestEditableElementFromTarget = (
      event.target as HTMLElement
    ).closest('[contenteditable="true"]');

    const isActiveElementContentEditable =
      document.activeElement?.getAttribute("contenteditable") === "true";

    // If target of event is within a content editable element we don't want to focus block.
    // If active element is a content editable element, we also don't want to focus block.
    // The latter is helpful when we start text selection within the content editable element
    // and end selection outside of anchor element.
    if (closestEditableElementFromTarget || isActiveElementContentEditable) {
      return;
    }

    const isMultipleSelection = event.shiftKey;

    function getNextFocusedField() {
      if (isMultipleSelection) {
        if (focussedField.includes(path)) {
          const result = focussedField.filter(
            (fieldName: string) => fieldName !== path,
          );

          if (result.length > 0) {
            return result;
          }

          return [];
        }

        return [...focussedField, path];
      }

      return path;
    }

    const nextFocusedField = getNextFocusedField();

    setFocussedField(nextFocusedField);

    if (isMultipleSelection) {
      document.getSelection()?.removeAllRanges();
    }
  };

  const isBlockBeingDragged = sortable.active?.data.current?.path === path;

  const dropRejectionMessage =
    sortable.active && !isBlockBeingDragged
      ? getDropRejectionMessage({
          isFixedSlot: isEntryComponentOrComponentFixed,
          canAcceptDraggedComponent: canDraggedComponentBeDropped,
          targetLabel: getComponentLabel(
            entryPathParseResult.parent!.templateId,
            editorContext,
            t,
          ),
          acceptedTypes: entryComponentDefinition
            ? getAllowedComponentTypes(entryComponentDefinition)
            : [],
          t,
        })
      : undefined;

  const isActivePathInDifferentCollection =
    sortable.active &&
    !isPathsParentEqual(sortable.active.data.current!.path, path);

  // A drag coming from another collection is the only one that cannot reach the outer edges
  // of this one by hovering a block: the order of the two paths already decides that side.
  const hasCollectionStartTarget =
    !isDroppableDisabled &&
    isActivePathInDifferentCollection &&
    sortable.activeIndex < sortable.index &&
    index === 0;

  const hasCollectionEndTarget =
    !isDroppableDisabled &&
    isActivePathInDifferentCollection &&
    sortable.activeIndex > sortable.index &&
    index === length - 1;

  // The block the dragged one would land inside. `over` is whatever droppable is
  // under the pointer, which is nearly always a deeply nested block, so the line
  // on its edge answers "at which boundary" but never "inside what" — and inside
  // what is the question a drop over a three-column footer actually raises.
  const overPath = dndContext.over?.data.current?.path as string | undefined;
  const isDropContainer =
    !!sortable.active &&
    !!overPath &&
    overPath !== path &&
    parsePath(overPath, form).parent?.path === path;

  const overId = dndContext.over ? String(dndContext.over.id) : null;

  /**
   * This block is the one the drop would land against.
   *
   * Read off `over` rather than off CSS `:hover`, which is what the first
   * attempt used and why no border ever appeared: during a drag the overlay
   * chip travels under the cursor, so `:hover` lands on the chip instead of on
   * the block beneath it. `over` is also the value the drop itself uses, so the
   * border cannot disagree with where the block actually goes.
   */
  const isDropTarget =
    !!sortable.active &&
    !isDroppableDisabled &&
    !isBlockBeingDragged &&
    (overId === id || overId === `${id}.before` || overId === `${id}.after`);

  const dropIndicatorEdge = resolveDropIndicatorEdge({
    id,
    overId,
    activeIndex: sortable.activeIndex,
    index: sortable.index,
    isDroppableDisabled,
    isBeingDragged: isBlockBeingDragged,
  });

  return (
    <SelectionFrameController
      isActive={isActive}
      onSelect={focusOnBlock}
      stitches={meta.stitches}
      sortable={sortable}
      id={id}
      direction={direction}
      path={path}
      label={componentLabel}
      isDraggable={!sortableDisabledState.draggable}
      dropRejectionMessage={dropRejectionMessage}
      dropIndicatorEdge={dropIndicatorEdge}
      isDropContainer={isDropContainer}
      isDropTarget={isDropTarget}
      edgeDropTargets={
        <Fragment>
          {hasCollectionStartTarget && (
            <CollectionEdgeDropTarget
              id={id}
              direction={direction}
              path={path}
              position="before"
            />
          )}
          {hasCollectionEndTarget && (
            <CollectionEdgeDropTarget
              id={id}
              direction={direction}
              path={path}
              position="after"
            />
          )}
        </Fragment>
      }
    >
      {children}
    </SelectionFrameController>
  );
}

export interface SortableDisabledStateInput {
  /** The block lives in a subtree where editing is switched off. */
  isEditingDisabled: boolean;
  /** The block fills a fixed `component` slot, so it has no collection to be reordered in. */
  isFixedSlot: boolean;
  /** More than one block is selected. */
  isMultiSelection: boolean;
  /** The parent collection accepts the type of the block currently being dragged. */
  canAcceptDraggedComponent: boolean;
}

/** `@dnd-kit` reads both flags as *disabled*: `true` switches the capability off. */
export interface SortableDisabledState {
  draggable: boolean;
  droppable: boolean;
}

/**
 * Which blocks may be picked up and which may receive a drop.
 *
 * Dragging deliberately does not depend on what is selected. It used to: a block could only
 * be picked up when it was the selection, or its parent, sibling or descendant. A freshly
 * opened editor has no selection, so no block could be dragged at all and drag and drop read
 * as broken.
 */
export function getSortableDisabledState({
  isEditingDisabled,
  isFixedSlot,
  isMultiSelection,
  canAcceptDraggedComponent,
}: SortableDisabledStateInput): SortableDisabledState {
  return {
    // Group drag stays off on purpose: the cross-frame move event carries a single
    // `fromPath`, so a multi-selection cannot be expressed without changing that contract.
    // Multiple blocks are still moved together with cut and paste.
    draggable: isEditingDisabled || isFixedSlot || isMultiSelection,
    droppable: isEditingDisabled || isFixedSlot || !canAcceptDraggedComponent,
  };
}

export interface DropRejectionInput {
  isFixedSlot: boolean;
  canAcceptDraggedComponent: boolean;
  /** Name of the component that owns the collection being dropped into. */
  targetLabel: string;
  /** Component types that collection accepts. */
  acceptedTypes: Array<string>;
  t: (key: string) => string;
}

/**
 * Why this block refuses the block being dragged, or `undefined` when it accepts it.
 *
 * A refused target used to just stay inert, which left no way to tell "nothing happens here"
 * apart from "drag and drop is broken".
 */
export function getDropRejectionMessage({
  isFixedSlot,
  canAcceptDraggedComponent,
  targetLabel,
  acceptedTypes,
  t,
}: DropRejectionInput): string | undefined {
  if (!isFixedSlot && canAcceptDraggedComponent) {
    return undefined;
  }

  // A fixed slot, or a collection that lists no accepted type, can never take the block,
  // so naming the types would say nothing.
  if (isFixedSlot || acceptedTypes.length === 0) {
    return t("editor.canvas.drop.rejected.fixed").replace(
      "{target}",
      targetLabel,
    );
  }

  return t("editor.canvas.drop.rejected.type")
    .replace("{target}", targetLabel)
    .replace("{types}", acceptedTypes.join(", "));
}

/**
 * Component types a block accepts into its collections. A drop is refused when the dragged
 * block matches none of them, which is what keeps a block from landing in a parent that
 * cannot hold it.
 */
export function getAllowedComponentTypes(
  componentDefinition: SerializedRenderableComponentDefinition,
) {
  const collectionSchemaProps =
    componentDefinition.schema.filter<ComponentCollectionSchemaProp>(
      (s): s is ComponentCollectionSchemaProp =>
        s.type === "component-collection",
    );

  const allowedComponentTypes = collectionSchemaProps.flatMap((s) => s.accepts);
  return Array.from(new Set(allowedComponentTypes));
}

/**
 * Whether two block paths sit in the same collection. Drops into a *different* collection are
 * the move-to-another-parent case: they need the extra before/after placeholders, and the
 * parent window resolves them through insert + remove instead of a plain reorder.
 */
export function isPathsParentEqual(path1: string, path2: string) {
  const activePathParts = path1.split(".");
  const currentPathParts = path2.split(".");

  return (
    activePathParts.slice(0, -1).join(".") ===
    currentPathParts.slice(0, -1).join(".")
  );
}

/**
 * How wide the band straddling a collection edge is, in canvas pixels. Wide enough to aim at,
 * narrow enough that the middle of the block still means "drop next to this block".
 */
const EDGE_DROP_TARGET_SIZE = 24;

/**
 * Hit area for the outer edge of a collection, registered as `<id>.before` / `<id>.after` so
 * a finished drag carries an explicit placement.
 *
 * It draws nothing: the frame around the block owns the insertion line, because the frame is
 * the box whose edge the block will land on. This element used to place itself with
 * `top`/`left: -100%`, which resolves against the nearest positioned ancestor rather than the
 * block — with an unpositioned collection container that put the hit area, and the line it
 * used to draw, an arbitrary distance away from the edge it stands for.
 */
function CollectionEdgeDropTarget({
  id,
  direction,
  path,
  position,
}: {
  id: string;
  direction: string;
  path: string;
  position: "before" | "after";
}) {
  const meta = useEasyblocksMetadata();

  const sortable = useSortable({
    id: `${id}.${position}`,
    data: {
      path,
    },
    disabled: {
      draggable: true,
      droppable: false,
    },
  });

  const isHorizontal = direction === "horizontal";
  const edge =
    position === "before"
      ? isHorizontal
        ? "left"
        : "top"
      : isHorizontal
        ? "right"
        : "bottom";

  const wrapperStyles = meta.stitches.css({
    position: "absolute",
    [edge]: `-${EDGE_DROP_TARGET_SIZE / 2}px`,
    ...(isHorizontal
      ? { top: 0, bottom: 0, width: `${EDGE_DROP_TARGET_SIZE}px` }
      : { left: 0, right: 0, height: `${EDGE_DROP_TARGET_SIZE}px` }),
    // Collisions are resolved from measured rectangles, not from hit testing, so the band
    // still catches the drag while staying out of the way of clicks on the block itself.
    pointerEvents: "none",
  });

  return (
    <div
      className={wrapperStyles().className}
      ref={sortable.setDroppableNodeRef}
    />
  );
}
