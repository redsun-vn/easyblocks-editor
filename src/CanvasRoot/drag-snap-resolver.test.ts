import { resolveDragSnap, type SnapRect } from "./drag-snap-resolver";

const box = (left: number, top: number, width: number, height: number): SnapRect => ({
  left,
  top,
  right: left + width,
  bottom: top + height,
});

describe("resolveDragSnap", () => {
  test("nothing within reach: no move, no guide", () => {
    expect(resolveDragSnap(box(0, 0, 100, 50), [box(300, 300, 100, 50)], 6)).toEqual({
      dx: 0,
      dy: 0,
      guides: [],
    });
  });

  test("a left edge within reach snaps onto the neighbour's left edge", () => {
    const snap = resolveDragSnap(box(104, 200, 100, 50), [box(100, 0, 300, 80)], 6);

    expect(snap.dx).toBe(-4);
    expect(snap.guides).toEqual([
      { orientation: "vertical", x: 100, y: 0, length: 250 },
    ]);
  });

  test("centre lines up with centre", () => {
    // Moving centre x = 247, neighbour centre x = 250.
    const snap = resolveDragSnap(box(197, 300, 100, 40), [box(150, 0, 200, 40)], 6);

    expect(snap.dx).toBe(3);
    expect(snap.guides[0]).toMatchObject({ orientation: "vertical", x: 250 });
  });

  test("one guide per axis, the nearest line wins", () => {
    const snap = resolveDragSnap(
      box(102, 105, 100, 50),
      [box(100, 400, 50, 50), box(101, 600, 50, 50), box(500, 100, 50, 50)],
      6,
    );

    expect(snap.dx).toBe(-1);
    expect(snap.dy).toBe(-5);
    expect(snap.guides.map((guide) => guide.orientation)).toEqual([
      "vertical",
      "horizontal",
    ]);
    // Horizontal guide from the snapped outline to the block on the right.
    expect(snap.guides[1]).toEqual({ orientation: "horizontal", x: 101, y: 100, length: 449 });
  });

  test("a tie goes to the neighbour nearer along the other axis", () => {
    const snap = resolveDragSnap(
      box(103, 500, 100, 50),
      [box(100, 0, 50, 50), box(100, 420, 50, 50)],
      6,
    );

    expect(snap.guides[0]).toEqual({ orientation: "vertical", x: 100, y: 420, length: 130 });
  });

  test("exactly on the threshold still snaps; past it does not", () => {
    // Nearest pair is the moving left edge against the neighbour's right (110).
    expect(resolveDragSnap(box(116, 900, 10, 10), [box(100, 0, 10, 10)], 6).dx).toBe(-6);
    expect(resolveDragSnap(box(117, 900, 10, 10), [box(100, 0, 10, 10)], 6).dx).toBe(0);
  });
});
