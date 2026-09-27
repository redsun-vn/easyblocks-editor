import {
  NoCodeComponentEntry,
  NoCodeComponentDefinition,
} from "@redsun-vn/easyblocks-core";
import * as internals from "@redsun-vn/easyblocks-core/_internals";
import { uniqueId } from "@/utils/uniqueId";
import { Form } from "../form";
import { insertCommand } from "./insert";
import * as reconcile from "./reconcile";

const createForm = (
  initialValues: Record<string, any> = { data: [] }
): Form => {
  const form = new Form({
    id: "test",
    label: "Test",
    onSubmit: () => { },
    initialValues,
  });

  Object.keys(form.mutators).forEach((key) => {
    jest.spyOn(form.mutators, key);
  });

  return form;
};

const createConfigComponent = (
  init: Partial<NoCodeComponentEntry> = {}
): NoCodeComponentEntry => ({
  _id: uniqueId(),
  _component: "",
  ...init,
});

const createComponentDefinition = (
  init: Partial<NoCodeComponentDefinition> = {}
): NoCodeComponentDefinition => ({
  id: "",
  schema: [],
  ...init,
});

describe("insert", () => {
  it.each`
    name                      | index   | schema                                                            | expectedResult
    ${"path.0.chldren"}       | ${0}    | ${{ accepts: ["$item"], type: "component-collection", prop: "" }} | ${"path.0.chldren.0"}
    ${"data.0.stack.0.items"} | ${1337} | ${{ accepts: ["$item"], type: "component", prop: "" }}            | ${"data.0.stack.0.items.1337"}
  `(
    "Should return path ($expectedResult) to inserted item",
    ({ name, index, expectedResult, schema }) => {
      const form = createForm();

      const item = createConfigComponent({
        _id: "1",
        _itemProps: { prop1: "" },
      });

      const reconciledItem = createConfigComponent({
        _id: "2",
        _itemProps: { prop2: "" },
      });

      const duplicatedItem = createConfigComponent({
        _id: "3",
        _itemProps: { prop2: "" },
      });

      jest.spyOn(internals, "findComponentDefinition").mockImplementation(
        jest.fn().mockReturnValue({
          tags: [],
          id: "$item",
        })
      );

      jest
        .spyOn(internals, "duplicateConfig")
        .mockImplementation(jest.fn().mockReturnValue(duplicatedItem));

      jest
        .spyOn(reconcile, "reconcile")
        .mockReturnValue(jest.fn().mockReturnValue(reconciledItem));

      const insert = insertCommand({
        context: {} as any,
        form: form,
        schema,
        templateId: "",
      });

      const result = insert(name, index, item);

      expect(result).toEqual(expectedResult);
      expect(form.mutators.insert).toHaveBeenCalledTimes(1);
      expect(form.mutators.insert).toHaveBeenCalledWith(
        name,
        index,
        duplicatedItem
      );
    }
  );

  it("Should return null when item definition cannot be found", () => {
    const form = createForm();

    jest
      .spyOn(internals, "findComponentDefinition")
      .mockImplementation(jest.fn().mockReturnValue(undefined));

    jest
      .spyOn(internals, "duplicateConfig")
      .mockReturnValue({ _component: "xxx" });

    const mockReconcile = jest.fn();
    jest.spyOn(reconcile, "reconcile").mockReturnValue(mockReconcile);

    const insert = insertCommand({
      context: {} as any,
      form: form,
      schema: {
        prop: "",
        type: "component-collection",
        accepts: ["$item"],
      },
      templateId: "",
    });

    const result = insert("name", 1, createConfigComponent());

    expect(result).toEqual(null);
    expect(form.mutators.insert).not.toHaveBeenCalled();
    expect(mockReconcile).not.toHaveBeenCalled();
  });

  it.each`
    schema
    ${{ accepts: ["TAG_2"], type: "component", prop: "" }}
    ${{ accepts: ["ID_2"], type: "component-collection", prop: "" }}
    ${{ accepts: ["TAG_3"], type: "component", prop: "", required: true }}
  `("Should return null when items does not match the schema", ({ schema }) => {
    const item = createConfigComponent();

    const form = createForm();

    jest
      .spyOn(internals, "findComponentDefinition")
      .mockImplementation(jest.fn().mockReturnValue(undefined));

    jest.spyOn(internals, "duplicateConfig").mockReturnValue(item);

    const mockReconcile = jest.fn();
    jest.spyOn(reconcile, "reconcile").mockReturnValue(mockReconcile);

    const insert = insertCommand({
      context: {} as any,
      form: form,
      schema,
      templateId: "",
    });

    const result = insert("name", 1, item);

    expect(result).toEqual(null);
    expect(form.mutators.insert).not.toHaveBeenCalled();
    expect(mockReconcile).not.toHaveBeenCalled();
  });
});

describe("insert into a slot that opted into shaping", () => {
  afterEach(() => jest.restoreAllMocks());

  const ROW = { id: "Row", type: ["section"], schema: [{ prop: "Cells", type: "component-collection", accepts: ["Col"] }] };
  const COL = { id: "Col", type: "Col", schema: [{ prop: "Items", type: "component-collection", accepts: ["Leaf"] }] };
  const LEAF = { id: "Leaf", type: "Leaf", schema: [] };
  const DEFS: Record<string, any> = { Row: ROW, Col: COL, Leaf: LEAF };

  /** A row around a column around one leaf: packaging, not an arrangement. */
  const packaged = {
    _id: "row",
    _component: "Row",
    Cells: [{ _id: "col", _component: "Col", Items: [{ _id: "leaf", _component: "Leaf" }] }],
  } as any;

  const mockDefinitions = () => {
    jest
      .spyOn(internals, "findComponentDefinition")
      .mockImplementation(((config: any) => DEFS[config?._component]) as any);
    jest
      .spyOn(internals, "findComponentDefinitionById")
      .mockImplementation(((id: any) => DEFS[id]) as any);
    jest
      .spyOn(internals, "duplicateConfig")
      .mockImplementation(((config: any) => config) as any);
    jest.spyOn(reconcile, "reconcile").mockReturnValue(((c: any) => c) as any);
  };

  it("drops the packaging when the slot takes the payload directly", () => {
    mockDefinitions();
    const form = createForm({ items: [] });

    const insert = insertCommand({
      context: {} as any,
      form,
      schema: {
        prop: "Items",
        type: "component-collection",
        accepts: ["Leaf"],
        panelDropTarget: true,
      } as any,
      templateId: "",
    });

    expect(insert("items", 0, packaged)).toBe("items.0");
    expect(form.mutators.insert).toHaveBeenCalledWith(
      "items",
      0,
      expect.objectContaining({ _component: "Leaf" }),
    );
  });

  it("refuses, rather than reshaping, when the slot never opted in", () => {
    mockDefinitions();
    const form = createForm({ items: [] });

    const insert = insertCommand({
      context: {} as any,
      form,
      schema: {
        prop: "Items",
        type: "component-collection",
        accepts: ["Leaf"],
      } as any,
      templateId: "",
    });

    // The old expression, unchanged: a Row is not a Leaf, so nothing lands.
    expect(insert("items", 0, packaged)).toBeNull();
    expect(form.mutators.insert).not.toHaveBeenCalled();
  });
});
