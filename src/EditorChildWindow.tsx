import { useForceRerender } from "@/utils/hooks/useForceRerender";
import {
  CollisionDetection,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  pointerWithin,
  useSensor,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Easyblocks, NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import {
  EasyblocksMetadataProvider,
  EditorContextType,
  RichTextEditor,
  TextEditor,
  configTraverse,
  itemMoved,
} from "@redsun-vn/easyblocks-core/_internals";
import { TooltipProvider } from "@redsun-vn/easyblocks-design-system/Tooltip";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { CanvasRoot } from "./CanvasRoot/CanvasRoot";
import { usePanelDropTarget } from "./CanvasRoot/usePanelDropTarget";
import EditableComponentBuilder from "./EditableComponentBuilder/EditableComponentBuilder.editor";
import TypePlaceholder from "./Placeholder";
import SkeletonEditorCanvasArea from "./SkeletonEditorCanvasArea";

const dragDataSchema = z.object({
  path: z.string(),
  // Written by the block being dragged so the preview can name itself. Optional
  // because a drag can start before the block has resolved its own label.
  label: z.string().optional(),
  sortable: z.object({
    index: z.number(),
  }),
});

/**
 * What the pointer carries while a block is being dragged.
 *
 * Until this existed a drag moved nothing on screen: the source block dimmed in
 * place and an insertion line appeared on whatever was hovered, so there was no
 * object under the cursor and nothing tying the two halves of the gesture
 * together. It wears the same purple as the insertion line for that reason —
 * what you are carrying and where it will land read as one thing.
 *
 * A chip rather than a copy of the block: a section is as wide as the page, and
 * a page-wide ghost following the cursor hides the very boundary being aimed at.
 */
function DragPreview({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        maxWidth: "260px",
        padding: "4px 10px",
        borderRadius: "4px",
        backgroundColor: "#7B70F5",
        color: "#fff",
        fontFamily: "var(--tina-font-family)",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "18px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        cursor: "grabbing",
        pointerEvents: "none",
      }}
    >
      <svg
        width="10"
        height="14"
        viewBox="0 0 10 14"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        {[2, 7, 12].flatMap((cy) =>
          [2, 8].map((cx) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" />
          )),
        )}
      </svg>
      {label}
    </div>
  );
}

/**
 * Minimal structural view of a `@dnd-kit` drag end event. `data.current` is `unknown`
 * on purpose: it is untrusted input that `dragDataSchema` validates at this boundary.
 */
export interface DragEndSubject {
  active: { id: UniqueIdentifier; data: { current: unknown } };
  over: { id: UniqueIdentifier; data: { current: unknown } } | null;
}

/**
 * What a finished drag means. `move` carries the cross-frame event that the parent
 * window turns into a reorder or a move to a different parent; `refocus` reselects
 * the dragged block because nothing changed.
 */
export type DragEndOutcome =
  | { type: "move"; event: ReturnType<typeof itemMoved> }
  | { type: "refocus"; path: string };

/**
 * Decides what a finished drag means. Kept pure and separate from the React tree so the
 * move-to-a-different-parent path stays covered by tests: the parent window relies on
 * `fromPath` and `toPath` pointing at different collections to take its insert/remove
 * branch, so any change here silently breaks moving a block out of its parent.
 */
export function resolveDragEndOutcome(event: DragEndSubject): DragEndOutcome {
  const activeData = dragDataSchema.parse(event.active.data.current);

  if (!event.over) {
    // No drop target under the pointer: nothing moved, so reselect the dragged block.
    return { type: "refocus", path: activeData.path };
  }

  if (event.over.id === event.active.id) {
    // Dropped onto itself: nothing moved either.
    return { type: "refocus", path: activeData.path };
  }

  const overData = dragDataSchema.parse(event.over.data.current);

  return {
    type: "move",
    event: itemMoved({
      fromPath: activeData.path,
      toPath: overData.path,
      // Placeholder droppables are registered as `<id>.before` / `<id>.after`; a plain
      // block id has no suffix and leaves the placement for the parent to work out.
      placement: ifValidPlacement(event.over.id.toString().split(".")[1]),
    }),
  };
}

/** Squared distance from a point to the nearest point of a rectangle; 0 inside it. */
export function squaredDistanceToRect(
  pointer: { x: number; y: number },
  rect: { left: number; top: number; width: number; height: number },
): number {
  const dx = Math.max(rect.left - pointer.x, 0, pointer.x - (rect.left + rect.width));
  const dy = Math.max(rect.top - pointer.y, 0, pointer.y - (rect.top + rect.height));

  return dx * dx + dy * dy;
}

/**
 * How far outside a block the pointer may stray and still be aimed at it, in
 * canvas pixels. Wide enough for a gutter or a section's padding, narrow enough
 * that the answer is always a block the user can see themselves pointing at.
 */
const NEAREST_BLOCK_REACH = 64;

/**
 * The block a drop is aimed at.
 *
 * Whatever is under the pointer wins, and when nothing is, the nearest block
 * within arm's reach does. The fallback matters more than it sounds: blocks are
 * separated by margins, padding and grid gaps that belong to no block at all,
 * and aiming into one of those gaps used to leave the drag with no target — no
 * border, no insertion line, nothing to say the drop would work.
 *
 * Two limits keep that fallback honest, and both were learnt the hard way: a
 * block dropped into a gap landed somewhere the eye could not find it, still
 * present in the layer tree but rendered nowhere. It has to skip blocks that
 * refuse the drag, because dnd-kit only excludes those from its own algorithms
 * and not from this list, and a collection that cannot hold the block will not
 * show it either. And it has to stop at a fixed reach, because "nearest" across
 * a whole page is not aim, it is a guess — past that the drag has no target and
 * the drop leaves the document alone.
 *
 * The rectangle intersection this replaced could not do the job at all. It
 * measures the dragged block's own rectangle, and the dragged block never
 * moves — the canvas draws no ghost, it carries a chip instead — so that
 * rectangle stayed where the drag began and answered with the neighbours of
 * where the block already was.
 */
export function pointerNearestCollisionDetection(
  args: Parameters<CollisionDetection>[0],
) {
  const pointerCollisions = pointerWithin(args);

  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  const pointer = args.pointerCoordinates;

  if (!pointer) {
    return [];
  }

  let nearestContainer: (typeof args.droppableContainers)[number] | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;

  const maxDistance = NEAREST_BLOCK_REACH * NEAREST_BLOCK_REACH;

  for (const container of args.droppableContainers) {
    if (container.disabled) continue;

    const rect = args.droppableRects.get(container.id);

    if (!rect) continue;

    const distance = squaredDistanceToRect(pointer, rect);

    if (distance <= maxDistance && distance < nearestDistance) {
      nearestDistance = distance;
      nearestContainer = container;
    }
  }

  return nearestContainer
    ? [{ id: nearestContainer.id, data: { droppableContainer: nearestContainer } }]
    : [];
}

export function EasyblocksCanvas({
  components,
}: {
  components?: Record<string, React.ComponentType<any>>;
}) {
  const { meta, compiled, externalData, editorContext }: any =
    window.parent.editorWindowAPI;

  const [enabled, setEnabled] = useState(false);
  const activeDraggedEntryPath = useRef<string | null>(null);
  // Name of the block currently being carried; null when no drag is in flight.
  const [draggedLabel, setDraggedLabel] = useState<string | null>(null);
  const { forceRerender } = useForceRerender();
  // An item dragged out of a sidebar panel. A separate gesture from the one
  // below on purpose — see the note in `usePanelDropTarget`.
  const panelDropIndicator = usePanelDropTarget();
  // Ten pixels was the price of the whole block being the handle: any press that
  // drifted had to be assumed accidental. Now that a drag starts from a grip, the
  // press is already deliberate, and a shorter threshold is what makes the block
  // answer the gesture instead of lagging behind it.
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 4,
    },
  });
  // Touch needs a hold instead of a distance: on a touch screen a short drag is how the
  // page is scrolled, so a block is only picked up once the finger has stayed put.
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 8,
    },
  });

  useEffect(() => {
    if (window.self === window.top) {
      throw new Error("No host");
    } else {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (window.parent && window.parent.editorWindowAPI) {
      window.parent.editorWindowAPI.onUpdate = () => {
        // Force re-render when child gets info from parent that data changed
        forceRerender();
      };
    }
  });

  const shouldNotRender = !enabled || !meta || !compiled || !externalData;

  if (shouldNotRender) {
    return (
      <div>
        <SkeletonEditorCanvasArea />
      </div>
    );
  }

  const sortableItems = getSortableItems(
    editorContext.form.values,
    editorContext,
  );

  return (
    /* EasyblocksMetadataProvider must be defined in case of nested <Easyblocks /> components are used! */
    <EasyblocksMetadataProvider meta={meta}>
      <TooltipProvider>
        <CanvasRoot>
          <DndContext
            sensors={[mouseSensor, touchSensor]}
            collisionDetection={pointerNearestCollisionDetection}
            onDragStart={(event) => {
              document.documentElement.style.cursor = "grabbing";
              const activeData = dragDataSchema.parse(event.active.data.current);
              activeDraggedEntryPath.current = activeData.path;
              setDraggedLabel(activeData.label ?? null);
              window.parent.editorWindowAPI?.editorContext?.setFocussedField(
                [],
              );
            }}
            onDragEnd={(event) => {
              document.documentElement.style.cursor = "";
              setDraggedLabel(null);

              const outcome = resolveDragEndOutcome(event);

              if (outcome.type === "refocus") {
                window.parent.editorWindowAPI?.editorContext?.setFocussedField(
                  outcome.path,
                );
                return;
              }

              requestAnimationFrame(() => {
                window.parent.postMessage(outcome.event);
              });
            }}
            onDragCancel={(event) => {
              document.documentElement.style.cursor = "";
              setDraggedLabel(null);
              // If the drag was canceled, we want to refocus dragged item.
              window.parent.editorWindowAPI?.editorContext?.setFocussedField(
                dragDataSchema.parse(event.active.data.current).path,
              );
            }}
          >
            <SortableContext items={sortableItems}>
              <Easyblocks
                renderableDocument={{
                  renderableContent: compiled,
                  meta,
                }}
                externalData={externalData}
                components={{
                  ...components,
                  "@easyblocks/rich-text.editor": RichTextEditor,
                  "@easyblocks/text.editor": TextEditor,
                  "EditableComponentBuilder.editor": EditableComponentBuilder,
                  Placeholder: TypePlaceholder,
                }}
              />
            </SortableContext>
            {/* No drop animation: the chip is not the block, so flying it into
                the block's new position would animate the wrong object. */}
            <DragOverlay dropAnimation={null} style={{ pointerEvents: "none" }}>
              {draggedLabel !== null ? (
                <DragPreview label={draggedLabel} />
              ) : null}
            </DragOverlay>
          </DndContext>
          {panelDropIndicator}
        </CanvasRoot>
      </TooltipProvider>
    </EasyblocksMetadataProvider>
  );
}

/**
 * Every `component-collection` in the tree, at every depth, contributes its items plus a
 * `.before` / `.after` droppable. Those extra ids are what make a collection reachable from
 * a drag that started in a *different* collection, so dropping the last/first slot of another
 * parent keeps working.
 */
export function getSortableItems(
  rootNoCodeEntry: NoCodeComponentEntry,
  editorContext: EditorContextType,
) {
  const sortableItems: Array<string> = [];

  configTraverse(
    rootNoCodeEntry,
    editorContext,
    ({ value, schemaProp, config }) => {
      if (schemaProp.type === "component-collection") {
        if (value.length === 0) {
          sortableItems.push(`placeholder.${config._id}`);
          return;
        }

        sortableItems.push(`${value[0]._id}.before`);
        sortableItems.push(
          ...(value as Array<NoCodeComponentEntry>).map((v) => v._id),
        );
        sortableItems.push(`${value.at(-1)._id}.after`);
      }
    },
  );

  return sortableItems;
}
function ifValidPlacement(value: string): "before" | "after" | undefined {
  if (value === "before" || value === "after") {
    return value;
  }

  return;
}
