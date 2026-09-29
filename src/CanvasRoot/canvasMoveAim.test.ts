import {
  resolveSlotAim,
  type PanelDropSlot,
} from "../editorSidebar/editorSections/panelDropSlots";
import {
  descendToNearestChildSlot,
  pickSlotForDrag,
} from "../editorSidebar/editorSections/slotDescent";
import {
  planAimedMove,
  resolveCanvasMoveAim,
  toItemMove,
} from "./canvasMoveAim";

/**
 * A header like the one that exposed this: one row of three columns — logo,
 * menu, icons — where the icons column holds a single mini cart pushed to the
 * right, and a second row below it with one column of two blocks. Coordinates
 * are canvas pixels. Columns are 26px tall inside a 54px row, so the strips
 * above and below them, and the 16px gutters between them, belong to the row.
 */
const ROOT: PanelDropSlot = {
  parentPath: "",
  prop: "data",
  children: [
    { index: 0, top: 105, bottom: 159, left: 0, right: 1100 },
    { index: 1, top: 159, bottom: 400, left: 0, right: 1100 },
  ],
  bounds: { top: 0, bottom: 2000, left: 0, right: 1100 },
  accepts: ["section"],
};

const HEADER_CELLS: PanelDropSlot = {
  parentPath: "data.0",
  prop: "Cells",
  children: [
    { component: "BlockColumn", index: 0, top: 119, bottom: 145, left: 16, right: 300 },
    { component: "BlockColumn", index: 1, top: 119, bottom: 145, left: 316, right: 800 },
    { component: "BlockColumn", index: 2, top: 119, bottom: 145, left: 816, right: 1084 },
  ],
  bounds: { top: 119, bottom: 145, left: 16, right: 1084 },
  axis: "horizontal",
  accepts: ["BlockColumn"],
};

const LOGO: PanelDropSlot = {
  parentPath: "data.0.Cells.0",
  prop: "Items",
  children: [{ index: 0, top: 119, bottom: 145, left: 16, right: 90 }],
  bounds: { top: 119, bottom: 145, left: 16, right: 90 },
  axis: "horizontal",
  accepts: ["item"],
};

const MENU: PanelDropSlot = {
  parentPath: "data.0.Cells.1",
  prop: "Items",
  children: [
    { index: 0, top: 119, bottom: 145, left: 400, right: 560 },
    { index: 1, top: 119, bottom: 145, left: 570, right: 700 },
  ],
  bounds: { top: 119, bottom: 145, left: 400, right: 700 },
  accepts: ["item"],
};

const ICONS: PanelDropSlot = {
  parentPath: "data.0.Cells.2",
  prop: "Items",
  children: [{ index: 0, top: 119, bottom: 145, left: 1050, right: 1084 }],
  bounds: { top: 119, bottom: 145, left: 1050, right: 1084 },
  axis: "horizontal",
  accepts: ["item"],
};

const LOWER_CELLS: PanelDropSlot = {
  parentPath: "data.1",
  prop: "Cells",
  children: [{ component: "BlockColumn", index: 0, top: 170, bottom: 390, left: 16, right: 1084 }],
  bounds: { top: 170, bottom: 390, left: 16, right: 1084 },
  accepts: ["BlockColumn"],
};

const LOWER: PanelDropSlot = {
  parentPath: "data.1.Cells.0",
  prop: "Items",
  children: [
    { index: 0, top: 170, bottom: 280, left: 16, right: 1084 },
    { index: 1, top: 280, bottom: 390, left: 16, right: 1084 },
  ],
  bounds: { top: 170, bottom: 390, left: 16, right: 1084 },
  accepts: ["item"],
};

const EMPTY: PanelDropSlot = {
  parentPath: "data.1.Cells.1",
  prop: "Items",
  children: [],
  bounds: { top: 170, bottom: 390, left: 600, right: 1084 },
  accepts: ["item"],
};

const SLOTS = [ROOT, HEADER_CELLS, LOGO, MENU, ICONS, LOWER_CELLS, LOWER];

const acceptsItems = (slot: PanelDropSlot) => (slot.accepts ?? []).includes("item");
const acceptsColumns = (slot: PanelDropSlot) =>
  (slot.accepts ?? []).includes("BlockColumn");

const aimItem = (
  fromPath: string,
  topmostPath: string | null,
  pointer: { x: number; y: number },
  slots = SLOTS,
) =>
  resolveCanvasMoveAim({
    slots,
    fromPath,
    topmostPath,
    pointer,
    legacyOverPath: null,
    canHold: acceptsItems,
  });

describe("a row's own space aims into its nearest column", () => {
  it("sends the gutter left of the icons column into that column, not a new one", () => {
    expect(descendToNearestChildSlot(SLOTS, HEADER_CELLS, { x: 810, y: 132 })).toBe(
      ICONS,
    );
  });

  it("sends the strip above a short column into the column under it", () => {
    expect(descendToNearestChildSlot(SLOTS, HEADER_CELLS, { x: 500, y: 110 })).toBe(
      MENU,
    );
  });

  it("keeps a column that holds content as the answer", () => {
    expect(descendToNearestChildSlot(SLOTS, LOWER, { x: 500, y: 200 })).toBe(LOWER);
  });

  it("never descends from the page root", () => {
    expect(descendToNearestChildSlot(SLOTS, ROOT, { x: 500, y: 1500 })).toBe(ROOT);
  });
});

describe("a single item in a horizontal column", () => {
  it("reads the left of the item as before it, whatever the height", () => {
    const aim = resolveSlotAim({ x: 900, y: 144 }, ICONS);

    expect(aim.index).toBe(0);
    expect(aim.line.axis).toBe("horizontal");
  });

  it("reads the right of the item as after it", () => {
    expect(resolveSlotAim({ x: 1083, y: 120 }, ICONS).index).toBe(1);
  });
});

describe("dragging a block on the canvas across columns", () => {
  it("moves a menu item beside the cart when released left of it in the same row", () => {
    const aim = aimItem("data.0.Cells.1.Items.1", "data.0.Cells.2", { x: 900, y: 132 });

    expect(aim).toMatchObject({ parentPath: "data.0.Cells.2", prop: "Items", index: 0 });
    expect(toItemMove(aim!, "data.0.Cells.1.Items.1")).toEqual({
      fromPath: "data.0.Cells.1.Items.1",
      toPath: "data.0.Cells.2.Items.0",
      index: 0,
    });
  });

  it("lands in a column, not between columns, when released in the gutter", () => {
    const aim = aimItem("data.0.Cells.1.Items.1", "data.0", { x: 812, y: 132 });

    expect(aim).toMatchObject({ parentPath: "data.0.Cells.2", prop: "Items" });
  });

  it("moves a block into a column of another row", () => {
    const aim = aimItem("data.0.Cells.1.Items.0", "data.1.Cells.0.Items.1", {
      x: 500,
      y: 360,
    });

    expect(toItemMove(aim!, "data.0.Cells.1.Items.0")).toEqual({
      fromPath: "data.0.Cells.1.Items.0",
      toPath: "data.1.Cells.0.Items.0",
      index: 2,
    });
  });

  it("moves a block into an empty column by its collection path", () => {
    const aim = aimItem(
      "data.0.Cells.1.Items.0",
      "data.1.Cells.1",
      { x: 800, y: 250 },
      [...SLOTS, EMPTY],
    );

    expect(toItemMove(aim!, "data.0.Cells.1.Items.0")).toEqual({
      fromPath: "data.0.Cells.1.Items.0",
      toPath: "data.1.Cells.1.Items",
      index: 0,
    });
  });

  it("still reorders columns when the dragged block is a column", () => {
    const aim = resolveCanvasMoveAim({
      slots: SLOTS,
      fromPath: "data.0.Cells.2",
      topmostPath: "data.0.Cells.0.Items.0",
      pointer: { x: 20, y: 132 },
      legacyOverPath: null,
      canHold: acceptsColumns,
    });

    expect(aim).toMatchObject({ parentPath: "data.0", prop: "Cells", index: 0 });
    expect(toItemMove(aim!, "data.0.Cells.2")).toEqual({
      fromPath: "data.0.Cells.2",
      toPath: "data.0.Cells.0",
    });
  });

  it("counts a reorder in one column after the block has left its place", () => {
    const aim = aimItem("data.1.Cells.0.Items.0", "data.1.Cells.0.Items.1", {
      x: 500,
      y: 380,
    });

    expect(toItemMove(aim!, "data.1.Cells.0.Items.0")).toEqual({
      fromPath: "data.1.Cells.0.Items.0",
      toPath: "data.1.Cells.0.Items.1",
    });
  });

  it("reports no move when the block would land where it is", () => {
    const aim = aimItem("data.1.Cells.0.Items.0", "data.1.Cells.0.Items.0", {
      x: 500,
      y: 180,
    });

    expect(toItemMove(aim!, "data.1.Cells.0.Items.0")).toBeNull();
  });

  it("never aims a block into its own inside", () => {
    // A column dragged over its own item: the row still holds it, its own
    // collection is never offered.
    const aim = resolveCanvasMoveAim({
      slots: SLOTS,
      fromPath: "data.0.Cells.2",
      topmostPath: "data.0.Cells.2.Items.0",
      pointer: { x: 1060, y: 132 },
      legacyOverPath: null,
      canHold: (slot) => acceptsColumns(slot) || acceptsItems(slot),
    });

    expect(aim).toMatchObject({ parentPath: "data.0", prop: "Cells" });
  });

});

describe("where the block-by-block targeting still decides", () => {
  it("leaves a block from an older container alone", () => {
    expect(aimItem("data.3.Stack.0", "data.0.Cells.2", { x: 900, y: 132 })).toBeNull();
  });

  it("leaves a section dragged at the page root alone", () => {
    expect(
      resolveCanvasMoveAim({
        slots: SLOTS,
        fromPath: "data.1",
        topmostPath: "data.0",
        pointer: { x: 500, y: 130 },
        legacyOverPath: null,
        canHold: (slot) => (slot.accepts ?? []).includes("section"),
      }),
    ).toBeNull();
  });

  it("lets an older container found under the pointer keep the drop", () => {
    expect(
      resolveCanvasMoveAim({
        slots: SLOTS,
        fromPath: "data.0.Cells.1.Items.0",
        topmostPath: "data.1.Cells.0.Items.0",
        pointer: { x: 500, y: 200 },
        legacyOverPath: "data.1.Cells.0.Items.0.Stack",
        canHold: acceptsItems,
      }),
    ).toBeNull();
  });

  it("answers nothing when no column can hold the block", () => {
    expect(
      resolveCanvasMoveAim({
        slots: SLOTS,
        fromPath: "data.0.Cells.1.Items.0",
        topmostPath: "data.0",
        pointer: { x: 500, y: 132 },
        legacyOverPath: null,
        canHold: () => false,
      }),
    ).toBeNull();
  });
});

describe("a column holding nothing but sub-grids", () => {
  /** One column whose only item is a nested row of two columns. */
  const OUTER_CELLS: PanelDropSlot = {
    parentPath: "data.0",
    prop: "Cells",
    children: [{ component: "BlockColumn", index: 0, top: 0, bottom: 300, left: 0, right: 1000 }],
    bounds: { top: 0, bottom: 300, left: 0, right: 1000 },
    accepts: ["BlockColumn"],
  };
  const OUTER_ITEMS: PanelDropSlot = {
    parentPath: "data.0.Cells.0",
    prop: "Items",
    children: [{ component: "BlockRow", index: 0, top: 0, bottom: 100, left: 0, right: 1000 }],
    bounds: { top: 0, bottom: 100, left: 0, right: 1000 },
    accepts: ["BlockContainer", "item"],
  };
  const INNER_CELLS: PanelDropSlot = {
    parentPath: "data.0.Cells.0.Items.0",
    prop: "Cells",
    children: [
      { component: "BlockColumn", index: 0, top: 0, bottom: 100, left: 0, right: 500 },
      { component: "BlockColumn", index: 1, top: 0, bottom: 100, left: 500, right: 1000 },
    ],
    bounds: { top: 0, bottom: 100, left: 0, right: 1000 },
    accepts: ["BlockColumn"],
  };
  const INNER_LEFT: PanelDropSlot = {
    parentPath: "data.0.Cells.0.Items.0.Cells.0",
    prop: "Items",
    children: [{ component: "Text", index: 0, top: 0, bottom: 100, left: 0, right: 500 }],
    bounds: { top: 0, bottom: 100, left: 0, right: 500 },
    accepts: ["item"],
  };
  const NESTED = [ROOT, OUTER_CELLS, OUTER_ITEMS, INNER_CELLS, INNER_LEFT];

  it("stays the answer below its sub-grid instead of reaching into it", () => {
    expect(descendToNearestChildSlot(NESTED, OUTER_ITEMS, { x: 300, y: 200 })).toBe(
      OUTER_ITEMS,
    );
  });

  it("puts the block after the sub-grid, in the outer column", () => {
    const aim = resolveCanvasMoveAim({
      slots: NESTED,
      fromPath: "data.0.Cells.0.Items.0.Cells.0.Items.0",
      topmostPath: "data.0.Cells.0",
      pointer: { x: 300, y: 200 },
      legacyOverPath: null,
      canHold: acceptsItems,
    });

    expect(aim).toMatchObject({ parentPath: "data.0.Cells.0", prop: "Items", index: 1 });
  });
});

describe("removing the source after an aimed move", () => {
  it("removes the original when the block lands just above the sub-grid it came from", () => {
    // The insert at Items.1 pushes the sub-grid to Items.2.
    expect(
      planAimedMove("data.0.Cells.0.Items.1.Cells.0.Items.0", "data.0.Cells.0.Items", 1),
    ).toEqual({
      sourceToRemove: "data.0.Cells.0.Items.2.Cells.0.Items.0",
      pathToFocus: "data.0.Cells.0.Items.1",
    });
  });

  it("leaves a source before the landing gap where it is", () => {
    expect(
      planAimedMove("data.0.Cells.0.Items.0.Cells.1.Items.0", "data.0.Cells.0.Items", 1),
    ).toEqual({
      sourceToRemove: "data.0.Cells.0.Items.0.Cells.1.Items.0",
      pathToFocus: "data.0.Cells.0.Items.1",
    });
  });

  it("selects the block where it ends up once a source above it is gone", () => {
    expect(
      planAimedMove("data.0.Cells.0.Items.0", "data.0.Cells.0.Items.2.Cells.0.Items", 0),
    ).toEqual({
      sourceToRemove: "data.0.Cells.0.Items.0",
      pathToFocus: "data.0.Cells.0.Items.1.Cells.0.Items.0",
    });
  });

  it("leaves a source in an unrelated collection alone", () => {
    expect(planAimedMove("data.1.Cells.0.Items.3", "data.0.Cells.2.Items", 0)).toEqual({
      sourceToRemove: "data.1.Cells.0.Items.3",
      pathToFocus: "data.0.Cells.2.Items.0",
    });
  });
});
