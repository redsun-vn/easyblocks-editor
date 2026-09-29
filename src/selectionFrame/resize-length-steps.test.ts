import { lengthSteps, lengthToPixels } from "./resize-length-steps";

describe("lengthToPixels", () => {
  const reference = { percentOf: 800, viewportHeight: 900, width: 400 };

  test("pixels, shares of the width and of the screen height", () => {
    expect(lengthToPixels("480px", "x", reference)).toBe(480);
    expect(lengthToPixels("50%", "x", reference)).toBe(400);
    expect(lengthToPixels("75vh", "y", reference)).toBe(675);
  });

  test("a ratio is a height that follows the width", () => {
    expect(lengthToPixels("4:3", "y", reference)).toBe(300);
    expect(lengthToPixels("16:9", "y", reference)).toBe(225);
  });

  test("auto on the vertical axis is the content height, the least", () => {
    expect(lengthToPixels("auto", "y", reference)).toBe(0);
  });

  test("words that are not sizes are skipped", () => {
    expect(lengthToPixels("none", "x", reference)).toBeNull();
    expect(lengthToPixels("fit-content", "x", reference)).toBeNull();
    expect(lengthToPixels("auto", "x", reference)).toBeNull();
  });
});

describe("lengthSteps", () => {
  const reference = { percentOf: 600, viewportHeight: 800, width: 300 };

  test("orders by size and drops widths the block cannot reach", () => {
    const steps = lengthSteps(
      ["none", "640px", "50%", "256px", "100%"].map((css) => ({
        key: css,
        css,
      })),
      "x",
      reference,
    );

    expect(steps).toEqual([
      { value: "256px", size: 256 },
      { value: "50%", size: 300 },
      { value: "100%", size: 600 },
    ]);
  });

  test("two values drawing the same size keep the first listed", () => {
    const steps = lengthSteps(
      [
        { key: "a", css: "300px" },
        { key: "b", css: "50%" },
      ],
      "x",
      reference,
    );

    expect(steps.map((step) => step.value)).toEqual(["a"]);
  });

  test("row heights: content height, then shares of the screen", () => {
    const steps = lengthSteps(
      ["auto", "50vh", "75vh", "100vh"].map((css) => ({ key: css, css })),
      "y",
      reference,
    );

    expect(steps.map((step) => [step.value, step.size])).toEqual([
      ["auto", 0],
      ["50vh", 400],
      ["75vh", 600],
      ["100vh", 800],
    ]);
  });
});

describe("lengthSteps for ratios", () => {
  test("auto among ratios is the picture's own ratio, not a height", () => {
    const steps = lengthSteps(
      ["1:1", "4:3", "16:9", "auto"].map((css) => ({ key: css, css })),
      "y",
      { percentOf: 400, viewportHeight: 800, width: 400 },
    );

    expect(steps.map((step) => step.value)).toEqual(["16:9", "4:3", "1:1"]);
  });
});
