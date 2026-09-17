import { CompilationContextType } from "@redsun-vn/easyblocks-core/_internals";
import {
  getAllowedComponentTypes,
  getDropRejectionMessage,
  getSortableDisabledState,
  isPathsParentEqual,
} from "./EditableComponentBuilder/BlockControls";
import { planMoveAfterInsert } from "./EditableComponentBuilder/SelectionFrameActions";
import { getSortableItems, resolveDragEndOutcome } from "./EditorChildWindow";
import { EditorContextType } from "./EditorContext";
import { testEditorContext } from "./utils/tests";

/**
 * Moving a block out of its current parent and into another one is live behaviour with a
 * dedicated branch in the parent window (duplicate -> insert -> remove). It is the part of
 * drag and drop most easily broken by loosening which blocks may start a drag, so it is
 * pinned here.
 */

const definitions = {
  links: [],
  actions: [],
  textModifiers: [],
  components: [
    {
      id: "$RootSection",
      tags: ["root"],
      styles: null,
      schema: [
        {
          prop: "data",
          type: "component-collection",
          accepts: ["section"],
        },
      ],
    },
    {
      id: "$Grid",
      tags: ["section"],
      styles: null,
      schema: [
        {
          prop: "Cards",
          type: "component-collection",
          accepts: ["card"],
        },
      ],
    },
    {
      id: "$TextSection",
      tags: ["section"],
      styles: null,
      schema: [
        {
          prop: "Title",
          type: "component",
          accepts: ["card"],
        },
      ],
    },
    {
      id: "$BannerCard",
      tags: ["card"],
      styles: null,
      schema: [],
    },
  ],
};

const context = {
  ...testEditorContext,
  definitions,
} as unknown as CompilationContextType & EditorContextType;

/** Root collection with two grids, each holding its own card collection. */
function createDocument() {
  return {
    _id: "root",
    _component: "$RootSection",
    data: [
      {
        _id: "grid-a",
        _component: "$Grid",
        Cards: [
          { _id: "card-a1", _component: "$BannerCard" },
          { _id: "card-a2", _component: "$BannerCard" },
        ],
      },
      {
        _id: "grid-b",
        _component: "$Grid",
        Cards: [{ _id: "card-b1", _component: "$BannerCard" }],
      },
    ],
  };
}

function dragSubject(
  active: { id: string; path: string },
  over: { id: string; path: string } | null,
) {
  return {
    active: {
      id: active.id,
      data: { current: { path: active.path, sortable: { index: 0 } } },
    },
    over: over
      ? {
          id: over.id,
          data: { current: { path: over.path, sortable: { index: 0 } } },
        }
      : null,
  };
}

describe("dragging a block into a different parent", () => {
  describe("drop targets in other collections are registered", () => {
    it("registers every collection at every depth, not only the root one", () => {
      const items = getSortableItems(createDocument() as any, context);

      // Root collection.
      expect(items).toEqual(expect.arrayContaining(["grid-a", "grid-b"]));
      // Both nested collections, which is what makes another parent reachable.
      expect(items).toEqual(
        expect.arrayContaining(["card-a1", "card-a2", "card-b1"]),
      );
    });

    it("gives each collection its own before and after edge droppables", () => {
      const items = getSortableItems(createDocument() as any, context);

      expect(items).toEqual(
        expect.arrayContaining([
          "grid-a.before",
          "grid-b.after",
          // Without these, a card could never be dropped at the edges of the other grid.
          "card-a1.before",
          "card-a2.after",
          "card-b1.before",
          "card-b1.after",
        ]),
      );
    });

    it("registers a placeholder for an empty collection so it can still receive a block", () => {
      const document = createDocument();
      document.data[1].Cards = [];

      const items = getSortableItems(document as any, context);

      expect(items).toContain("placeholder.grid-b");
    });
  });

  describe("a finished drag across parents is reported to the parent window", () => {
    it("emits a move carrying both paths when the block lands in another collection", () => {
      const outcome = resolveDragEndOutcome(
        dragSubject(
          { id: "card-a1", path: "data.0.Cards.0" },
          { id: "card-b1", path: "data.1.Cards.0" },
        ),
      );

      expect(outcome.type).toBe("move");
      expect(outcome.type === "move" && outcome.event).toEqual({
        type: "@easyblocks-editor/item-moved",
        payload: {
          fromPath: "data.0.Cards.0",
          toPath: "data.1.Cards.0",
          placement: undefined,
        },
      });
    });

    it("keeps the placement when dropping on the edge of another collection", () => {
      const outcome = resolveDragEndOutcome(
        dragSubject(
          { id: "card-a1", path: "data.0.Cards.0" },
          { id: "card-b1.before", path: "data.1.Cards.0" },
        ),
      );

      expect(outcome.type === "move" && outcome.event.payload).toEqual({
        fromPath: "data.0.Cards.0",
        toPath: "data.1.Cards.0",
        placement: "before",
      });
    });

    it("still reports a plain reorder inside one collection", () => {
      const outcome = resolveDragEndOutcome(
        dragSubject(
          { id: "card-a1", path: "data.0.Cards.0" },
          { id: "card-a2", path: "data.0.Cards.1" },
        ),
      );

      expect(outcome.type === "move" && outcome.event.payload).toEqual({
        fromPath: "data.0.Cards.0",
        toPath: "data.0.Cards.1",
        placement: undefined,
      });
    });

    it("reselects the block instead of moving it when it is dropped on itself", () => {
      const outcome = resolveDragEndOutcome(
        dragSubject(
          { id: "card-a1", path: "data.0.Cards.0" },
          { id: "card-a1", path: "data.0.Cards.0" },
        ),
      );

      expect(outcome).toEqual({ type: "refocus", path: "data.0.Cards.0" });
    });

    it("reselects the block when it is dropped outside any target", () => {
      const outcome = resolveDragEndOutcome(
        dragSubject({ id: "card-a1", path: "data.0.Cards.0" }, null),
      );

      expect(outcome).toEqual({ type: "refocus", path: "data.0.Cards.0" });
    });

    it("rejects a drag payload that does not carry a path", () => {
      expect(() =>
        resolveDragEndOutcome({
          active: { id: "card-a1", data: { current: { sortable: {} } } },
          over: null,
        }),
      ).toThrow();
    });
  });

  describe("which parents accept the dragged block", () => {
    it("recognises a drop into a different collection", () => {
      expect(isPathsParentEqual("data.0.Cards.0", "data.1.Cards.0")).toBe(false);
      expect(isPathsParentEqual("data.0.Cards.0", "data.0.Cards.1")).toBe(true);
      expect(isPathsParentEqual("data.0", "data.1")).toBe(true);
    });

    it("lists the types a parent collection accepts", () => {
      const grid = definitions.components.find((c) => c.id === "$Grid")!;
      const root = definitions.components.find((c) => c.id === "$RootSection")!;

      expect(getAllowedComponentTypes(grid as any)).toEqual(["card"]);
      expect(getAllowedComponentTypes(root as any)).toEqual(["section"]);
    });

    it("accepts nothing through a fixed component slot", () => {
      const textSection = definitions.components.find(
        (c) => c.id === "$TextSection",
      )!;

      // `component` slots are fixed: they are never a drop target, so no accepted types.
      expect(getAllowedComponentTypes(textSection as any)).toEqual([]);
    });
  });

  describe("which blocks can be picked up", () => {
    const capabilities = (
      overrides: Partial<Parameters<typeof getSortableDisabledState>[0]> = {},
    ) =>
      getSortableDisabledState({
        isEditingDisabled: false,
        isFixedSlot: false,
        isMultiSelection: false,
        canAcceptDraggedComponent: true,
        ...overrides,
      });

    it("lets a block be dragged when nothing is selected", () => {
      // The regression this phase fixes: a freshly opened editor has no selection, and
      // dragging used to require one.
      expect(capabilities().draggable).toBe(false);
    });

    it("keeps a block droppable even when it cannot be picked up itself", () => {
      expect(capabilities({ isMultiSelection: true })).toEqual({
        draggable: true,
        droppable: false,
      });
    });

    it("switches both off inside a fixed slot", () => {
      expect(capabilities({ isFixedSlot: true })).toEqual({
        draggable: true,
        droppable: true,
      });
    });

    it("switches both off where editing is disabled", () => {
      expect(capabilities({ isEditingDisabled: true })).toEqual({
        draggable: true,
        droppable: true,
      });
    });

    it("refuses the drop, but not the drag, when the type is not accepted", () => {
      expect(capabilities({ canAcceptDraggedComponent: false })).toEqual({
        draggable: false,
        droppable: true,
      });
    });
  });

  describe("telling the user why a drop is refused", () => {
    const t = (key: string) =>
      ({
        "editor.canvas.drop.rejected.fixed": "{target} không nhận khối nào khác",
        "editor.canvas.drop.rejected.type":
          "{target} chỉ nhận: {types}",
      })[key] ?? key;

    it("says nothing when the block is accepted", () => {
      expect(
        getDropRejectionMessage({
          isFixedSlot: false,
          canAcceptDraggedComponent: true,
          targetLabel: "Lưới",
          acceptedTypes: ["card"],
          t,
        }),
      ).toBeUndefined();
    });

    it("names the target and the types it accepts", () => {
      expect(
        getDropRejectionMessage({
          isFixedSlot: false,
          canAcceptDraggedComponent: false,
          targetLabel: "Lưới",
          acceptedTypes: ["card", "banner"],
          t,
        }),
      ).toBe("Lưới chỉ nhận: card, banner");
    });

    it("does not list types a fixed slot could never take", () => {
      expect(
        getDropRejectionMessage({
          isFixedSlot: true,
          canAcceptDraggedComponent: true,
          targetLabel: "Tiêu đề",
          acceptedTypes: ["card"],
          t,
        }),
      ).toBe("Tiêu đề không nhận khối nào khác");
    });

    it("falls back to the fixed wording when the target lists no type at all", () => {
      expect(
        getDropRejectionMessage({
          isFixedSlot: false,
          canAcceptDraggedComponent: false,
          targetLabel: "Tiêu đề",
          acceptedTypes: [],
          t,
        }),
      ).toBe("Tiêu đề không nhận khối nào khác");
    });
  });

  describe("moving a block with the toolbar instead of the mouse", () => {
    it("removes the original, not the neighbour that slid into its place", () => {
      // Source sits after the insertion point in the same collection, so inserting pushed
      // it down by one.
      expect(planMoveAfterInsert("data.5", "data.2").sourceToRemove).toBe(
        "data.6",
      );
    });

    it("leaves a source that the insert did not move alone", () => {
      expect(planMoveAfterInsert("data.1", "data.4").sourceToRemove).toBe(
        "data.1",
      );
    });

    it("focuses where the block ends up once the original is gone", () => {
      expect(planMoveAfterInsert("data.1", "data.4")).toEqual({
        sourceToRemove: "data.1",
        pathToFocus: "data.3",
      });
    });

    it("handles a move into another parent", () => {
      expect(
        planMoveAfterInsert("data.0.Cards.0", "data.1.Cards.2"),
      ).toEqual({
        sourceToRemove: "data.0.Cards.0",
        pathToFocus: "data.1.Cards.2",
      });
    });
  });
});
