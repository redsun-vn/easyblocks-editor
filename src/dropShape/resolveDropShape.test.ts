import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { ShapeComponentDefinition } from "./collectionSlots";
import { peelPackagingWrapper } from "./peelPackagingWrapper";
import { resolveDropShape } from "./resolveDropShape";
import { resolveWrapperChain } from "./resolveWrapperChain";

/**
 * The host app's grid, cut down to what the shape rule reads. Types and accepts
 * are copied from `website-builder`: a row is a section and can also nest inside
 * a column, a column is a private type only a row takes, and a column accepts
 * both container-typed things (for sub-grids) and content.
 */
const DEFINITIONS: Array<ShapeComponentDefinition> = [
  {
    id: "BlockRow",
    type: ["section", "BlockContainer"],
    schema: [
      { prop: "Cells", type: "component-collection", accepts: ["BlockColumn"] },
    ],
  },
  {
    id: "BlockColumn",
    type: "BlockColumn",
    schema: [
      {
        prop: "Items",
        type: "component-collection",
        accepts: ["BlockContainer", "BlockContent", "MiniCart", "Image"],
      },
    ],
  },
  {
    id: "MiniCart",
    type: "item",
    schema: [{ prop: "Label", type: "component", accepts: ["Label"] }],
  },
  { id: "BlockHeading", type: "BlockContent", schema: [] },
  { id: "Label", type: "Label", schema: [] },
];

const getDefinition = (id: string) => DEFINITIONS.find((d) => d.id === id);

const ROOT_ACCEPTS = ["section"];
const COLUMN_ACCEPTS = ["BlockContainer", "BlockContent", "MiniCart", "Image"];
const ROW_CELLS_ACCEPTS = ["BlockColumn"];

const column = (items: Array<NoCodeComponentEntry>): NoCodeComponentEntry =>
  ({ _component: "BlockColumn", Items: items }) as NoCodeComponentEntry;

const row = (
  cells: Array<NoCodeComponentEntry>,
  own: Record<string, unknown> = {},
): NoCodeComponentEntry =>
  ({ _component: "BlockRow", ...own, Cells: cells }) as NoCodeComponentEntry;

const miniCart = { _component: "MiniCart" } as NoCodeComponentEntry;
const heading = { _component: "BlockHeading" } as NoCodeComponentEntry;

/** `templates/blocks/row-1-column.json`: a row of one, its column empty. */
const WRAPPER_TEMPLATE = {
  _component: "BlockRow",
  columns: { $res: true, xl: "1" },
  Cells: [
    {
      _component: "BlockColumn",
      _itemProps: { BlockRow: { Cells: { span: { $res: true, xl: "1" } } } },
    },
  ],
} as NoCodeComponentEntry;

const wrapperLevels = resolveWrapperChain(WRAPPER_TEMPLATE, getDefinition);

/** A single-item section template: one column, one item, real band padding. */
const miniCartNew = row([column([miniCart])], {
  columns: { $res: true, xl: "1" },
  paddingTop: { $res: true, xl: { tokenId: "48" } },
});

/** One column but three items — an arrangement, not packaging. */
const heroMinimal = row([column([heading, heading, heading])], {
  backgroundColor: { $res: true, xl: { tokenId: "red" } },
});

/** Two columns — an arrangement. */
const contentImageLeft = row([column([heading]), column([heading])], {
  columns: { $res: true, xl: "2" },
});

const nestedPackaging = row([column([row([column([miniCart])])])]);

describe("resolveWrapperChain", () => {
  it("reads the app's nesting off its own one-column row, innermost first", () => {
    expect(wrapperLevels.map((level) => level.entry._component)).toEqual([
      "BlockColumn",
      "BlockRow",
    ]);
    expect(wrapperLevels.map((level) => level.prop)).toEqual(["Items", "Cells"]);
  });
});

describe("peelPackagingWrapper", () => {
  it("takes a row and column off a single-item section", () => {
    expect(peelPackagingWrapper(miniCartNew, getDefinition)).toBe(miniCart);
  });

  it("keeps a row that holds several items", () => {
    expect(peelPackagingWrapper(heroMinimal, getDefinition)).toBe(heroMinimal);
  });

  it("keeps a row that holds several columns", () => {
    expect(peelPackagingWrapper(contentImageLeft, getDefinition)).toBe(
      contentImageLeft,
    );
  });

  it("peels every level of nested packaging", () => {
    expect(peelPackagingWrapper(nestedPackaging, getDefinition)).toBe(miniCart);
  });

  it("leaves a bare component alone", () => {
    expect(peelPackagingWrapper(miniCart, getDefinition)).toBe(miniCart);
  });
});

describe("resolveDropShape", () => {
  const resolve = (entry: NoCodeComponentEntry, accepts: Array<string>) =>
    resolveDropShape({ entry, accepts, wrapperLevels, getDefinition });

  it("keeps the authored entry at page root, band padding and all", () => {
    const shape = resolve(miniCartNew, ROOT_ACCEPTS);

    // The authored row, not a rebuilt one: a rebuilt wrapper has no padding, and
    // losing the author's 48px is the regression this rung exists to prevent.
    expect(shape).toBe(miniCartNew);
    expect(shape).toHaveProperty("paddingTop");
  });

  it("drops the wrapper when the target column takes the component itself", () => {
    expect(resolve(miniCartNew, COLUMN_ACCEPTS)).toBe(miniCart);
  });

  it("wraps in one column when the target row takes only columns", () => {
    const shape = resolve(miniCartNew, ROW_CELLS_ACCEPTS) as any;

    expect(shape._component).toBe("BlockColumn");
    expect(shape.Items).toEqual([miniCart]);
    // The authored span survives, because the wrapper keeps its own values.
    expect(shape._itemProps).toEqual(
      (WRAPPER_TEMPLATE as any).Cells[0]._itemProps,
    );
  });

  it("nests a multi-item row into a column as a sub-grid, background intact", () => {
    const shape = resolve(heroMinimal, COLUMN_ACCEPTS);

    expect(shape).toBe(heroMinimal);
    expect(shape).toHaveProperty("backgroundColor");
  });

  it("nests a multi-column row into a column, columns intact", () => {
    const shape = resolve(contentImageLeft, COLUMN_ACCEPTS) as any;

    expect(shape).toBe(contentImageLeft);
    expect(shape.Cells).toHaveLength(2);
  });

  it("leaves a multi-column row untouched at page root", () => {
    expect(resolve(contentImageLeft, ROOT_ACCEPTS)).toBe(contentImageLeft);
  });

  it("builds a row and column around a bare component for page root", () => {
    const shape = resolve(miniCart, ROOT_ACCEPTS) as any;

    expect(shape._component).toBe("BlockRow");
    expect(shape.Cells[0]._component).toBe("BlockColumn");
    expect(shape.Cells[0].Items).toEqual([miniCart]);
  });

  it("inserts a bare component into a column as it is", () => {
    expect(resolve(miniCart, COLUMN_ACCEPTS)).toBe(miniCart);
  });

  it("peels nested packaging down to the payload for a column", () => {
    expect(resolve(nestedPackaging, COLUMN_ACCEPTS)).toBe(miniCart);
  });

  it("refuses when no shape fits the slot", () => {
    expect(resolve(miniCart, ["Label"])).toBeNull();
  });

  it("refuses a slot that accepts nothing", () => {
    expect(resolve(miniCart, [])).toBeNull();
  });

  it("re-wraps nothing when the host declares no wrapper chain", () => {
    expect(
      resolveDropShape({
        entry: miniCart,
        accepts: ROOT_ACCEPTS,
        wrapperLevels: [],
        getDefinition,
      }),
    ).toBeNull();
  });
});
