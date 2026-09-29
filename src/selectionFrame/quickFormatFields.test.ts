import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import { pickQuickFormatFields } from "./quickFormatFields";

const field = (
  prop: string,
  type: string,
  extra: Partial<InternalField> = {},
): InternalField =>
  ({
    prop,
    name: `data.0.${prop}`,
    component: type,
    schemaProp: { prop, type },
    ...extra,
  }) as unknown as InternalField;

const props = (fields: Array<InternalField>) =>
  fields.map((f) => f.schemaProp.prop);

describe("pickQuickFormatFields", () => {
  it("offers a heading's font, colour, alignment and level, in bar order", () => {
    const heading = [
      field("text", "text"),
      field("level", "select"),
      field("align", "select"),
      field("font", "font"),
      field("color", "color"),
      field("marginBottom", "space"),
    ];

    expect(props(pickQuickFormatFields(heading))).toEqual([
      "font",
      "color",
      "level",
      "align",
    ]);
  });

  it("offers a rich text selection's font, colour and italic", () => {
    const richTextPart = [
      field("value", "string", { hidden: true }),
      field("font", "font"),
      field("color", "color"),
      field("fontStyle", "select"),
      field("TextWrapper", "component"),
    ];

    expect(props(pickQuickFormatFields(richTextPart))).toEqual([
      "font",
      "color",
      "fontStyle",
    ]);
  });

  it("leaves spacing, shadows, hover colours and switches in the panel", () => {
    const button = [
      field("hasBackground", "boolean"),
      field("gap", "space"),
      field("boxShadow", "boxShadow"),
      field("textColorHover", "color"),
      field("sortBy", "select"),
    ];

    expect(pickQuickFormatFields(button)).toEqual([]);
  });

  it("skips a prop that only shares a name with a formatting prop", () => {
    // An icon's `size` is a spacing token, not a choice of a few sizes.
    expect(pickQuickFormatFields([field("size", "space")])).toEqual([]);
  });

  it("skips a field the panel hides for this block", () => {
    const button = [
      field("backgroundColor", "color", { hidden: true }),
      field("color", "color"),
    ];

    expect(props(pickQuickFormatFields(button))).toEqual(["color"]);
  });
});
