import {
  inferSlotAxis,
  parseSlotPath,
  pickSlotForPath,
  resolveSlotAim,
  type PanelDropSlot,
  type SlotChildRect,
} from "./panelDropSlots";

const child = (
  index: number,
  box: { top: number; bottom: number; left?: number; right?: number },
): SlotChildRect => ({
  index,
  top: box.top,
  bottom: box.bottom,
  left: box.left ?? 0,
  right: box.right ?? 1000,
});

/** Three stacked sections, 100 tall each, full width. */
const ROOT_SLOT: PanelDropSlot = {
  parentPath: "",
  prop: "data",
  children: [
    child(0, { top: 0, bottom: 100 }),
    child(1, { top: 100, bottom: 200 }),
    child(2, { top: 200, bottom: 300 }),
  ],
  bounds: { top: 0, bottom: 300, left: 0, right: 1000 },
};

/** Two items stacked inside a column that occupies the left half of section 0. */
const COLUMN_SLOT: PanelDropSlot = {
  parentPath: "data.0.Cells.0",
  prop: "Items",
  children: [
    child(0, { top: 10, bottom: 50, left: 0, right: 500 }),
    child(1, { top: 50, bottom: 90, left: 0, right: 500 }),
  ],
  bounds: { top: 10, bottom: 90, left: 0, right: 500 },
};

/** Two columns side by side inside a row. */
const ROW_SLOT: PanelDropSlot = {
  parentPath: "data.0",
  prop: "Cells",
  children: [
    child(0, { top: 0, bottom: 100, left: 0, right: 500 }),
    child(1, { top: 0, bottom: 100, left: 500, right: 1000 }),
  ],
  bounds: { top: 0, bottom: 100, left: 0, right: 1000 },
};

describe("parseSlotPath", () => {
  it("reads a root section as the root collection", () => {
    expect(parseSlotPath("data.2")).toEqual({
      parentPath: "",
      prop: "data",
      index: 2,
    });
  });

  it("reads a nested item as its own collection", () => {
    expect(parseSlotPath("data.0.Cells.1.Items.3")).toEqual({
      parentPath: "data.0.Cells.1",
      prop: "Items",
      index: 3,
    });
  });

  it("refuses a path that does not end in an index", () => {
    expect(parseSlotPath("data.0.Cells")).toBeNull();
    expect(parseSlotPath("data")).toBeNull();
  });
});

describe("inferSlotAxis", () => {
  it("reads stacked children as vertical", () => {
    expect(inferSlotAxis(COLUMN_SLOT.children)).toBe("vertical");
  });

  it("reads side-by-side children as horizontal", () => {
    expect(inferSlotAxis(ROW_SLOT.children)).toBe("horizontal");
  });

  it("treats a lone child as vertical, having nothing to compare", () => {
    expect(inferSlotAxis([child(0, { top: 0, bottom: 100 })])).toBe("vertical");
  });
});

describe("resolveSlotAim", () => {
  it("aims before a child while above its midpoint", () => {
    const aim = resolveSlotAim({ x: 10, y: 10 }, ROOT_SLOT);

    expect(aim).toMatchObject({ parentPath: "", prop: "data", index: 0 });
    expect(aim.line).toMatchObject({ y: 0, axis: "vertical" });
  });

  it("aims after a child once past its midpoint", () => {
    expect(resolveSlotAim({ x: 10, y: 60 }, ROOT_SLOT)).toMatchObject({
      index: 1,
    });
  });

  it("aims past the last child at the end of the collection", () => {
    const aim = resolveSlotAim({ x: 10, y: 290 }, ROOT_SLOT);

    expect(aim.index).toBe(3);
    expect(aim.line).toMatchObject({ y: 300 });
  });

  it("uses the horizontal midpoint in a row of columns", () => {
    expect(resolveSlotAim({ x: 100, y: 50 }, ROW_SLOT)).toMatchObject({
      index: 0,
    });
    expect(resolveSlotAim({ x: 400, y: 50 }, ROW_SLOT)).toMatchObject({
      index: 1,
    });
    expect(resolveSlotAim({ x: 900, y: 50 }, ROW_SLOT)).toMatchObject({
      index: 2,
    });
  });

  it("draws a vertical line across a row, between the columns", () => {
    expect(resolveSlotAim({ x: 400, y: 50 }, ROW_SLOT).line).toMatchObject({
      x: 500,
      axis: "horizontal",
    });
  });

  it("answers index 0 for an empty collection", () => {
    const empty: PanelDropSlot = {
      parentPath: "data.0.Cells.0",
      prop: "Items",
      children: [],
      bounds: { top: 20, bottom: 28, left: 0, right: 500 },
    };

    expect(resolveSlotAim({ x: 100, y: 24 }, empty)).toMatchObject({
      parentPath: "data.0.Cells.0",
      prop: "Items",
      index: 0,
    });
  });

  it("keeps the collection's own indices, not its drawing order", () => {
    const shuffled: PanelDropSlot = {
      ...ROOT_SLOT,
      children: [...ROOT_SLOT.children].reverse(),
    };

    expect(resolveSlotAim({ x: 10, y: 10 }, shuffled)).toMatchObject({
      index: 0,
    });
  });
});

describe("pickSlotForPath", () => {
  const SLOTS = [ROOT_SLOT, ROW_SLOT, COLUMN_SLOT];

  it("sends an item to the collection holding it", () => {
    expect(pickSlotForPath(SLOTS, "data.0.Cells.0.Items.1")).toBe(COLUMN_SLOT);
  });

  it("sends a row to its own collection, which is the gutter between columns", () => {
    expect(pickSlotForPath(SLOTS, "data.0")).toBe(ROW_SLOT);
  });

  it("sends a column to its own collection, so an empty one is reachable", () => {
    expect(pickSlotForPath(SLOTS, "data.0.Cells.0")).toBe(COLUMN_SLOT);
  });

  it("walks outwards past a block that owns nothing droppable", () => {
    // A label inside an item: neither is a collection that opted in, so the
    // column two levels up is what takes the drop.
    expect(pickSlotForPath(SLOTS, "data.0.Cells.0.Items.1.Label.0")).toBe(
      COLUMN_SLOT,
    );
  });

  it("sends a block whose collection never opted in to the page root", () => {
    // The sticky-header case: the header's own collection is absent from the
    // list because it did not opt in, so the drop goes to the root rather than
    // falling through to whatever is painted behind the header.
    expect(pickSlotForPath(SLOTS, "data.2")).toBe(ROOT_SLOT);
  });

  it("answers the root when the pointer is over no block at all", () => {
    expect(pickSlotForPath(SLOTS, null)).toBe(ROOT_SLOT);
  });

  it("answers null when there is nothing to drop into at all", () => {
    expect(pickSlotForPath([], "data.0")).toBeNull();
  });
});
