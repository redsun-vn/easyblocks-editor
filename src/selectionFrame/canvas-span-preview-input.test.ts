import { readSpanPreviewInput } from "./canvas-span-preview-input";

const spanOf = (value: unknown) => ({
  _itemProps: { BlockRow: { Cells: { span: value } } },
});

/** A page after auto: one row whose values vary by breakpoint. */
const configAfterAuto = {
  data: [
    {
      columns: { $res: true, xl: "3", md: "2" },
      twelveColumnGrid: false,
      Cells: [
        spanOf({ $res: true, xl: "auto", md: "2" }),
        spanOf({ $res: true, xl: "6", md: "auto" }),
        spanOf("auto"),
      ],
    },
  ],
};

const read = (path: string, breakpointIndex = "xl") =>
  readSpanPreviewInput({
    fieldName: `${path}._itemProps.BlockRow.Cells.span`,
    path,
    configAfterAuto,
    breakpointIndex,
  });

describe("readSpanPreviewInput", () => {
  test("reads the parent and every sibling at the breakpoint being edited", () => {
    expect(read("data.0.Cells.1")).toEqual({
      parent: {
        columns: "3",
        twelveColumnGrid: false,
        Cells: configAfterAuto.data[0].Cells,
      },
      values: ["auto", "6", "auto"],
      index: 1,
      collectionPath: "data.0.Cells",
    });
  });

  test("another breakpoint reads its own values", () => {
    const input = read("data.0.Cells.0", "md");

    expect(input?.parent.columns).toBe("2");
    expect(input?.values).toEqual(["2", "auto", "auto"]);
    expect(input?.index).toBe(0);
  });

  test("a field not stored under the item has nothing to read", () => {
    expect(
      readSpanPreviewInput({
        fieldName: "data.0.columns",
        path: "data.0.Cells.1",
        configAfterAuto,
        breakpointIndex: "xl",
      }),
    ).toBeNull();
  });

  test("a path that is not an item of a collection has nothing to read", () => {
    expect(read("data")).toBeNull();
  });

  test("an item past the end of its collection has nothing to read", () => {
    expect(read("data.0.Cells.3")).toBeNull();
  });

  test("a localised collection, kept per locale, has nothing to read", () => {
    expect(
      readSpanPreviewInput({
        fieldName: "data.0.Cells.0._itemProps.BlockRow.Cells.span",
        path: "data.0.Cells.0",
        configAfterAuto: { data: [{ Cells: { en: [spanOf("6")] } }] },
        breakpointIndex: "xl",
      }),
    ).toBeNull();
  });
});
