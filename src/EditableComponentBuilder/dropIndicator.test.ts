import { resolveDropIndicatorEdge } from "./dropIndicator";

/**
 * The canvas gives no other sign of where a dragged block will land: siblings are not
 * nudged aside, so the line is the whole affordance.
 */

/** A collection of four blocks, in the order they appear in the flattened sortable list. */
const COLLECTION = ["card-0", "card-1", "card-2", "card-3"];

function edgeFor(
  id: string,
  {
    overId,
    draggedId,
    isDroppableDisabled = false,
  }: {
    overId: string | null;
    draggedId: string;
    isDroppableDisabled?: boolean;
  },
) {
  return resolveDropIndicatorEdge({
    id,
    overId,
    activeIndex: COLLECTION.indexOf(draggedId),
    index: COLLECTION.indexOf(id),
    isDroppableDisabled,
    isBeingDragged: id === draggedId,
  });
}

/** Every block in the collection that would draw a line right now. */
function markedBlocks(options: { overId: string | null; draggedId: string }) {
  return COLLECTION.map((id) => [id, edgeFor(id, options)] as const).filter(
    ([, edge]) => edge !== null,
  );
}

describe("where the insertion line goes while dragging", () => {
  describe("reordering inside one collection", () => {
    it("marks the far side of the target when the block is dragged forwards", () => {
      // Taking the block out and putting it back at the target's index leaves it behind
      // the target, so the line belongs on the target's trailing edge.
      expect(edgeFor("card-2", { overId: "card-2", draggedId: "card-0" })).toBe(
        "after",
      );
    });

    it("marks the near side of the target when the block is dragged backwards", () => {
      expect(edgeFor("card-1", { overId: "card-1", draggedId: "card-3" })).toBe(
        "before",
      );
    });

    it("marks a gap between two middle blocks, not only the ends of the collection", () => {
      expect(markedBlocks({ overId: "card-2", draggedId: "card-0" })).toEqual([
        ["card-2", "after"],
      ]);
      expect(markedBlocks({ overId: "card-1", draggedId: "card-3" })).toEqual([
        ["card-1", "before"],
      ]);
    });

    it("draws exactly one line, on the hovered block only", () => {
      expect(
        markedBlocks({ overId: "card-1", draggedId: "card-0" }),
      ).toHaveLength(1);
    });

    it("leaves the block being dragged unmarked", () => {
      expect(
        edgeFor("card-0", { overId: "card-0", draggedId: "card-0" }),
      ).toBeNull();
    });
  });

  describe("dragging into a different collection", () => {
    it("marks the leading edge when the start of the collection is hovered", () => {
      expect(
        edgeFor("card-0", { overId: "card-0.before", draggedId: "card-3" }),
      ).toBe("before");
    });

    it("marks the trailing edge when the end of the collection is hovered", () => {
      expect(
        edgeFor("card-3", { overId: "card-3.after", draggedId: "card-0" }),
      ).toBe("after");
    });

    it("keeps the line on the block that owns the hovered edge", () => {
      expect(
        edgeFor("card-1", { overId: "card-0.before", draggedId: "card-3" }),
      ).toBeNull();
    });

    it("marks a block hovered in the middle of the other collection", () => {
      expect(edgeFor("card-2", { overId: "card-2", draggedId: "card-0" })).toBe(
        "after",
      );
    });
  });

  describe("drops the editor does not allow", () => {
    it("says nothing on a collection that refuses the dragged block", () => {
      expect(
        edgeFor("card-2", {
          overId: "card-2",
          draggedId: "card-0",
          isDroppableDisabled: true,
        }),
      ).toBeNull();
    });

    it("says nothing while the pointer is over no drop target", () => {
      expect(markedBlocks({ overId: null, draggedId: "card-0" })).toEqual([]);
    });

    it("says nothing about a block missing from the sortable list", () => {
      expect(
        resolveDropIndicatorEdge({
          id: "card-9",
          overId: "card-9",
          activeIndex: 0,
          index: -1,
          isDroppableDisabled: false,
          isBeingDragged: false,
        }),
      ).toBeNull();
    });

    it("says nothing when the dragged block is missing from the sortable list", () => {
      expect(
        resolveDropIndicatorEdge({
          id: "card-2",
          overId: "card-2",
          activeIndex: -1,
          index: 2,
          isDroppableDisabled: false,
          isBeingDragged: false,
        }),
      ).toBeNull();
    });

    it("does not mistake another block's edge droppable for its own", () => {
      // `card-1` must not answer for `card-10.before`, which merely starts with its id.
      expect(
        resolveDropIndicatorEdge({
          id: "card-1",
          overId: "card-10.before",
          activeIndex: 0,
          index: 1,
          isDroppableDisabled: false,
          isBeingDragged: false,
        }),
      ).toBeNull();
    });
  });
});
