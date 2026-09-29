import {
  isPointerNearSelection,
  NO_POINTER,
  PointerLocation,
  withPointerAt,
} from "./pointerPresence";

/** Replays a run of reports in the order they would arrive. */
function report(...reports: Array<[PointerLocation, boolean]>) {
  return reports.reduce(
    (presence, [where, isOver]) => withPointerAt(presence, where, isOver),
    NO_POINTER
  );
}

describe("pointerPresence", () => {
  it("starts with the pointer nowhere near", () => {
    expect(isPointerNearSelection(NO_POINTER)).toBe(false);
  });

  it("counts the pointer on the block", () => {
    expect(isPointerNearSelection(report(["block", true]))).toBe(true);
  });

  it("counts the pointer on the selection's own controls", () => {
    // The action bar and the add buttons, which the block cannot see: they are
    // in the editor window and it is in the canvas iframe.
    expect(isPointerNearSelection(report(["controls", true]))).toBe(true);
  });

  it("holds while the block's news of the departure arrives late", () => {
    // The order a move from the block onto the action bar actually produces.
    // Read as one flag, the second report undoes the first and the bar fades
    // out from under a pointer that is resting on it.
    const presence = report(["controls", true], ["block", false]);

    expect(isPointerNearSelection(presence)).toBe(true);
  });

  it("holds while the controls' news of the departure arrives late", () => {
    // The same move in reverse: off the bar and back onto the block.
    const presence = report(["block", true], ["controls", false]);

    expect(isPointerNearSelection(presence)).toBe(true);
  });

  it("lets go once neither says the pointer is there", () => {
    const presence = report(
      ["controls", true],
      ["block", false],
      ["controls", false]
    );

    expect(isPointerNearSelection(presence)).toBe(false);
  });

  it("leaves the presence it was not told about alone", () => {
    const presence = report(["block", true], ["controls", true]);

    expect(withPointerAt(presence, "controls", false)).toEqual({
      block: true,
      controls: false,
      formatting: false,
    });
  });

  it("keeps the bar while a formatting control is in use", () => {
    // An open dropdown takes the pointer off both the block and the bar.
    expect(
      isPointerNearSelection(
        report(
          ["controls", true],
          ["formatting", true],
          ["controls", false],
          ["block", false]
        )
      )
    ).toBe(true);
  });

  it("lets the bar go once the formatting control is done with", () => {
    expect(
      isPointerNearSelection(
        report(["formatting", true], ["formatting", false])
      )
    ).toBe(false);
  });
});
