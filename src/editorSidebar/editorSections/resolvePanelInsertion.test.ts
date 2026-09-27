import * as internals from "@redsun-vn/easyblocks-core/_internals";
import { resolvePanelInsertion } from "./resolvePanelInsertion";

/**
 * A row around a column around one leaf. Packaging, so the shape rule would
 * unwrap it wherever the target takes the leaf directly.
 */
const packaged = {
  _id: "row",
  _component: "Row",
  Cells: [
    { _id: "col", _component: "Col", Items: [{ _id: "leaf", _component: "Leaf" }] },
  ],
} as any;

const LEAF = { id: "Leaf", type: "Leaf", schema: [] };
const COL = {
  id: "Col",
  type: "Col",
  schema: [{ prop: "Items", type: "component-collection", accepts: ["Leaf"] }],
};
const ROW = {
  id: "Row",
  type: ["Leaf"],
  schema: [{ prop: "Cells", type: "component-collection", accepts: ["Col"] }],
};

/** A container holding one collection, whose opt-in the test varies. */
const hostContext = (panelDropTarget: boolean) => {
  const host = {
    id: "Host",
    type: "Host",
    schema: [
      {
        prop: "Items",
        type: "component-collection",
        accepts: ["Leaf"],
        ...(panelDropTarget ? { panelDropTarget: true } : {}),
      },
    ],
  };

  const definitions: Record<string, any> = { Host: host, Row: ROW, Col: COL, Leaf: LEAF };

  jest
    .spyOn(internals, "findComponentDefinition")
    .mockImplementation(((config: any) => definitions[config?._component]) as any);
  jest
    .spyOn(internals, "findComponentDefinitionById")
    .mockImplementation(((id: any) => definitions[id]) as any);

  return {
    form: { values: { _component: "Host", Items: [] } },
    definitions: { components: Object.values(definitions) },
    configTemplates: [],
    dropWrapperTemplateId: undefined,
  };
};

const target = { parentPath: "", prop: "Items", index: 0 };

describe("resolvePanelInsertion", () => {
  afterEach(() => jest.restoreAllMocks());

  it("unwraps packaging for a slot that opted in", () => {
    const insertion = resolvePanelInsertion({
      entry: packaged,
      target,
      editorContext: hostContext(true),
    });

    expect(insertion).toMatchObject({ name: "Items", index: 0 });
    expect(insertion!.block._component).toBe("Leaf");
  });

  it("leaves the entry exactly as authored for a slot that did not", () => {
    const insertion = resolvePanelInsertion({
      entry: packaged,
      target,
      editorContext: hostContext(false),
    });

    // The guarantee for a document built before any of this: the drop lands
    // byte for byte as it always did, wrapper and all, even though the rule
    // could have unwrapped it into a slot that takes the payload.
    expect(insertion!.block).toBe(packaged);
  });
});
