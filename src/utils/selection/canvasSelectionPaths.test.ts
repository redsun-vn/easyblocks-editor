import type { EditorContextType } from "../../EditorContext";
import {
  getParentFocusedFields,
  getSelectableAncestorPaths,
  getSelectionBreadcrumb,
} from "./canvasSelectionPaths";

type TestEntry = {
  _component: string;
  _id: string;
  [slot: string]: unknown;
};

const SECTION = "data.0";
const STACK = "data.0.Content.0";
const TEXT = "data.0.Content.0.Items.0";
const CARD = "data.0.Content.0.Items.1";
const CARD_BACKGROUND = "data.0.Content.0.Items.1.Background.0";
const CARD_BACKGROUND_TEXT = "data.0.Content.0.Items.1.Background.0.Items.0";
const CARD_TEXT = "data.0.Content.0.Items.1.Items.0";
const LOCALIZED_SECTION = "data.1";
const LOCALIZED_TEXT = "data.1.Items.en.0";

const page: TestEntry = {
  _component: "Page",
  _id: "page",
  data: [
    {
      _component: "Section",
      _id: "section",
      Content: [
        {
          _component: "Stack",
          _id: "stack",
          Items: [
            { _component: "$richText", _id: "text" },
            {
              _component: "Card",
              _id: "card",
              Background: [
                {
                  _component: "Stack",
                  _id: "cardBackground",
                  Items: [{ _component: "$richText", _id: "cardBackgroundText" }],
                },
              ],
              Items: [{ _component: "$richText", _id: "cardText" }],
            },
          ],
        },
      ],
    },
    {
      _component: "LocalizedSection",
      _id: "localizedSection",
      Items: { en: [{ _component: "$richText", _id: "localizedText" }] },
    },
  ],
};

const definitions = {
  components: [
    {
      id: "Page",
      schema: [
        { prop: "data", type: "component-collection", accepts: ["section"] },
      ],
    },
    {
      id: "Section",
      label: "Section",
      schema: [{ prop: "Content", type: "component", accepts: ["item"] }],
    },
    {
      id: "Stack",
      label: "Stack",
      schema: [
        { prop: "Items", type: "component-collection", accepts: ["item"] },
      ],
    },
    {
      id: "Card",
      label: "Card",
      schema: [
        {
          prop: "Background",
          type: "component",
          accepts: ["item"],
          noInline: true,
        },
        { prop: "Items", type: "component-collection", accepts: ["item"] },
      ],
    },
    {
      id: "LocalizedSection",
      label: "Localized section",
      schema: [
        {
          prop: "Items",
          type: "component-collection-localised",
          accepts: ["item"],
        },
      ],
    },
    { id: "$richText", schema: [] },
  ],
};

/** Compiled tree the canvas renders from; slots mirror the config entry. */
function compile(
  entry: TestEntry,
  notSelectableIds: Array<string>,
): Record<string, unknown> {
  const components: Record<string, unknown> = {};

  Object.entries(entry).forEach(([slot, value]) => {
    // A localised collection compiles to the entries of the current locale.
    const children = Array.isArray(value)
      ? value
      : (value as { en?: Array<TestEntry> } | undefined)?.en;

    if (Array.isArray(children)) {
      components[slot] = children.map((child) =>
        compile(child, notSelectableIds),
      );
    }
  });

  return {
    _component: entry._component,
    _id: entry._id,
    __editing: notSelectableIds.includes(entry._id) ? { noInline: true } : {},
    components,
  };
}

function createEditorContext(
  notSelectableIds: Array<string> = [],
): EditorContextType {
  return {
    form: { values: page },
    definitions,
    compiledComponentConfig: compile(page, notSelectableIds),
  } as unknown as EditorContextType;
}

const translate = (key: string) => `t:${key}`;

describe("getSelectableAncestorPaths", () => {
  test("lists framed ancestors nearest first", () => {
    expect(getSelectableAncestorPaths(CARD_TEXT, createEditorContext())).toEqual(
      [CARD, STACK, SECTION],
    );
  });

  test("has no ancestors for a top-level section because the page root has no frame", () => {
    expect(getSelectableAncestorPaths(SECTION, createEditorContext())).toEqual(
      [],
    );
  });

  test("skips an ancestor rendered in a noInline slot", () => {
    expect(
      getSelectableAncestorPaths(CARD_BACKGROUND_TEXT, createEditorContext()),
    ).not.toContain(CARD_BACKGROUND);
    expect(
      getSelectableAncestorPaths(CARD_BACKGROUND_TEXT, createEditorContext()),
    ).toEqual([CARD, STACK, SECTION]);
  });

  test("skips an ancestor that is not selectable", () => {
    expect(
      getSelectableAncestorPaths(TEXT, createEditorContext(["stack"])),
    ).toEqual([SECTION]);
  });

  test("starts from the rich text component when one of its text parts is selected", () => {
    expect(
      getSelectableAncestorPaths(
        `${TEXT}.elements.en.0.elements.0.elements.0`,
        createEditorContext(),
      ),
    ).toEqual([TEXT, STACK, SECTION]);
  });

  test("resolves ancestors through a localised collection", () => {
    expect(
      getSelectableAncestorPaths(LOCALIZED_TEXT, createEditorContext()),
    ).toEqual([LOCALIZED_SECTION]);
  });

  test("has no ancestors for a path that no longer points at a component", () => {
    expect(
      getSelectableAncestorPaths(`${STACK}.Items.7`, createEditorContext()),
    ).toEqual([]);
  });
});

describe("getParentFocusedFields", () => {
  test("moves every focused item to its nearest framed parent, once per parent", () => {
    expect(
      getParentFocusedFields([TEXT, CARD], createEditorContext()),
    ).toEqual([STACK]);
  });

  test("clears the focus when a top-level section is focused", () => {
    expect(getParentFocusedFields([SECTION], createEditorContext())).toEqual(
      [],
    );
  });
});

describe("getSelectionBreadcrumb", () => {
  test("lists framed ancestors outermost first, then the selection, with translated labels", () => {
    expect(
      getSelectionBreadcrumb(CARD, createEditorContext(), translate),
    ).toEqual([
      { path: SECTION, label: "t:Section" },
      { path: STACK, label: "t:Stack" },
      { path: CARD, label: "t:Card" },
    ]);
  });

  test("labels a component without a definition label by its id", () => {
    expect(
      getSelectionBreadcrumb(TEXT, createEditorContext(), translate).at(-1),
    ).toEqual({ path: TEXT, label: "t:$richText" });
  });

  test("is empty for a path that no longer points at a component", () => {
    expect(
      getSelectionBreadcrumb(`${STACK}.Items.7`, createEditorContext(), translate),
    ).toEqual([]);
  });
});
