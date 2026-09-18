import { useForceRerender } from "@/utils/hooks/useForceRerender";
import {
  CollisionDetection,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  pointerWithin,
  rectIntersection,
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

function customCollisionDetection(args: Parameters<CollisionDetection>[0]) {
  // First, let's see if there are any collisions with the pointer
  const pointerCollisions = pointerWithin(args);

  // Collision detection algorithms return an array of collisions
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // If there are no collisions with the pointer, return rectangle intersections
  return rectIntersection(args);
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
            collisionDetection={customCollisionDetection}
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
