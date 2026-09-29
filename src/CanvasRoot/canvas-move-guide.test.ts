import { aimAt, column } from "./alignment-guide-fixtures";
import { guideFor } from "./canvas-move-guide";

describe("guideFor", () => {
  const target = column(
    [
      { left: 100, width: 200 },
      { left: 150, width: 100 },
      { left: 100, width: 200 },
    ],
    "data.0.Cells.1",
  );

  test("from another column, every block there is a neighbour", () => {
    expect(
      guideFor(
        [target],
        aimAt(2, 190, "data.0.Cells.1"),
        "data.0.Cells.0.Items.1",
      )?.x,
    ).toBe(200);
  });

  test("within the same column, its old place is not", () => {
    const same = column(
      [
        { left: 0, width: 400 },
        { left: 150, width: 100 },
        { left: 0, width: 400 },
      ],
      "data.0.Cells.1",
    );

    // Block 1 moving down past block 2: only block 2 is left beside the gap.
    expect(
      guideFor(
        [same],
        aimAt(3, 290, "data.0.Cells.1"),
        "data.0.Cells.1.Items.1",
      ),
    ).toBeNull();
  });

  test("a drop that would not move the block draws no guide", () => {
    expect(
      guideFor(
        [target],
        aimAt(1, 90, "data.0.Cells.1"),
        "data.0.Cells.1.Items.1",
      ),
    ).toBeNull();
  });
});
