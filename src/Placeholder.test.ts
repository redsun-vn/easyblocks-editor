import { canDropIntoPlaceholder } from "./Placeholder";

/**
 * The `accepts` list a mixed container offers, and the single type that
 * `getComponentMainType` collapses it to. `button` wins that priority order,
 * which is why every non-button entry below is refused without the opt-in.
 */
const MIXED_ACCEPTS = ["item", "button", "BannerCard"];
const COLLAPSED_TYPE = "button";

/** Id of the block being dragged. No `accepts` list below names it. */
const DRAGGED_ID = "SomeBlock";

describe("an empty slot that did not opt in", () => {
  it("takes the block whose type is the collapsed one", () => {
    expect(
      canDropIntoPlaceholder({
        draggedId: DRAGGED_ID,
        draggedTypes: ["button"],
        type: COLLAPSED_TYPE,
      }),
    ).toBe(true);
  });

  it("refuses a block the slot's own accepts list names", () => {
    expect(
      canDropIntoPlaceholder({
        draggedId: DRAGGED_ID,
        draggedTypes: ["item"],
        type: COLLAPSED_TYPE,
      }),
    ).toBe(false);
  });

  it("takes a block carrying several types when one of them is the collapsed one", () => {
    expect(
      canDropIntoPlaceholder({
        draggedId: DRAGGED_ID,
        draggedTypes: ["item", "button"],
        type: COLLAPSED_TYPE,
      }),
    ).toBe(true);
  });

  it("refuses a block whose types the slot never names", () => {
    expect(
      canDropIntoPlaceholder({
        draggedId: DRAGGED_ID,
        draggedTypes: ["section"],
        type: "item",
      }),
    ).toBe(false);
  });
});

describe("an empty slot that opted in", () => {
  it("takes every type its accepts list names, not only the collapsed one", () => {
    for (const draggedType of MIXED_ACCEPTS) {
      expect(
        canDropIntoPlaceholder({
          draggedId: DRAGGED_ID,
          draggedTypes: [draggedType],
          type: COLLAPSED_TYPE,
          accepts: MIXED_ACCEPTS,
        }),
      ).toBe(true);
    }
  });

  it("still refuses a type its accepts list leaves out", () => {
    expect(
      canDropIntoPlaceholder({
        draggedId: DRAGGED_ID,
        draggedTypes: ["section"],
        type: COLLAPSED_TYPE,
        accepts: MIXED_ACCEPTS,
      }),
    ).toBe(false);
  });

  it("takes a block carrying several types when any one of them is accepted", () => {
    expect(
      canDropIntoPlaceholder({
        draggedId: DRAGGED_ID,
        draggedTypes: ["action", "form-action", "item"],
        type: COLLAPSED_TYPE,
        accepts: MIXED_ACCEPTS,
      }),
    ).toBe(true);
  });

  it("refuses everything when the accepts list is empty", () => {
    expect(
      canDropIntoPlaceholder({
        draggedId: DRAGGED_ID,
        draggedTypes: ["item"],
        type: COLLAPSED_TYPE,
        accepts: [],
      }),
    ).toBe(false);
  });
});

describe("an accepts list naming a component id, not a type", () => {
  /** What a slot writes when it wants named components rather than a whole type. */
  const ID_ACCEPTS = ["BlockHeading", "BlockParagraph"];

  it("takes a block its accepts list names by id", () => {
    expect(
      canDropIntoPlaceholder({
        draggedId: "BlockHeading",
        draggedTypes: ["BlockContent"],
        type: COLLAPSED_TYPE,
        accepts: ID_ACCEPTS,
      }),
    ).toBe(true);
  });

  it("refuses a block of the same type that the list does not name", () => {
    expect(
      canDropIntoPlaceholder({
        draggedId: "BlockGallery",
        draggedTypes: ["BlockContent"],
        type: COLLAPSED_TYPE,
        accepts: ID_ACCEPTS,
      }),
    ).toBe(false);
  });
});
