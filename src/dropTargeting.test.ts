import { squaredDistanceToRect } from "./EditorChildWindow";

// A block occupying x 100..200, y 50..90.
const rect = { left: 100, top: 50, width: 100, height: 40 };

describe("how far the pointer is from a block", () => {
  it("is zero anywhere inside the block, so what is under the pointer wins", () => {
    expect(squaredDistanceToRect({ x: 150, y: 70 }, rect)).toBe(0);
    expect(squaredDistanceToRect({ x: 100, y: 50 }, rect)).toBe(0);
    expect(squaredDistanceToRect({ x: 200, y: 90 }, rect)).toBe(0);
  });

  it("measures straight out from the nearest edge", () => {
    // 10px to the left of the block, vertically alongside it.
    expect(squaredDistanceToRect({ x: 90, y: 70 }, rect)).toBe(100);
    // 5px below it, horizontally alongside it.
    expect(squaredDistanceToRect({ x: 150, y: 95 }, rect)).toBe(25);
  });

  it("measures to the corner when the pointer is diagonally outside", () => {
    // 3px left and 4px above the top-left corner.
    expect(squaredDistanceToRect({ x: 97, y: 46 }, rect)).toBe(25);
  });

  it("puts the gap between two blocks with whichever one is closer", () => {
    const left = { left: 0, top: 0, width: 100, height: 40 };
    const right = { left: 140, top: 0, width: 100, height: 40 };
    // A pointer in the 40px gutter, nearer the left block.
    const pointer = { x: 115, y: 20 };

    expect(squaredDistanceToRect(pointer, left)).toBeLessThan(
      squaredDistanceToRect(pointer, right),
    );
  });
});
