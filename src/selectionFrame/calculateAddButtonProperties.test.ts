import { ADD_BUTTON_SIZE } from "./AddButton";
import { calculateAddButtonsProperties } from "./calculateAddButtonProperties";

/**
 * A button is positioned by its top-left corner, so every coordinate below is
 * the point it straddles minus half its size. Written out as numbers, these
 * expectations quietly went wrong the day the design system changed the button
 * from 22px to 18px — and the numbers gave no hint of where they came from.
 */
const HALF = Math.floor(ADD_BUTTON_SIZE / 2);

const TEST_VIEWPORT = {
  width: 1366,
  height: 768,
};

const TEST_CONTAINER_RECT = createRect({
  top: 24,
  left: 24,
  right: 324,
  bottom: 324,
  width: 300,
  height: 300,
});

describe("vertical", () => {
  test("both buttons are visible when target element is within viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 24,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 24 - HALF,
        left: 74 - HALF,
        display: "block",
      },
      after: {
        top: 224 - HALF,
        left: 74 - HALF,
        display: "block",
      },
    });
  });

  test("both buttons are visible when target element is on the edges of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 0,
          left: 24,
          height: 768,
          width: 200,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 0 - HALF,
        left: 124 - HALF,
        display: "block",
      },
      after: {
        top: 768 - HALF,
        left: 124 - HALF,
        display: "block",
      },
    });
  });

  test("before button is hidden when the start of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: -24,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: -24 - HALF,
        left: 74 - HALF,
        display: "none",
      },
      after: {
        top: 176 - HALF,
        left: 74 - HALF,
        display: "block",
      },
    });
  });

  test("after button is hidden when the end of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 720,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 720 - HALF,
        left: 74 - HALF,
        display: "block",
      },
      after: {
        top: 920 - HALF,
        left: 74 - HALF,
        display: "none",
      },
    });
  });

  test("both buttons are hidden when target element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: -224,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: -224 - HALF,
        left: 74 - HALF,
        display: "none",
      },
      after: {
        top: -24 - HALF,
        left: 74 - HALF,
        display: "none",
      },
    });
  });
});

describe("vertical within container", () => {
  test("both buttons are visible when target element is within container", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 48,
          left: 48,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 48 - HALF,
        left: 98 - HALF,
        display: "block",
      },
      after: {
        top: 248 - HALF,
        left: 98 - HALF,
        display: "block",
      },
    });
  });

  test("both buttons are visible when target element is on the edges of container", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 24,
          left: 24,
          height: 300,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 24 - HALF,
        left: 74 - HALF,
        display: "block",
      },
      after: {
        top: 324 - HALF,
        left: 74 - HALF,
        display: "block",
      },
    });
  });

  test("before button is hidden when the start of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: -140,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: -140 - HALF,
        left: 74 - HALF,
        display: "none",
      },
      after: {
        top: 60 - HALF,
        left: 74 - HALF,
        display: "block",
      },
    });
  });

  test("after button is hidden when the end of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 240,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 240 - HALF,
        left: 74 - HALF,
        display: "block",
      },
      after: {
        top: 440 - HALF,
        left: 74 - HALF,
        display: "none",
      },
    });
  });

  test("both buttons are hidden when target element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 340,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 340 - HALF,
        left: 74 - HALF,
        display: "none",
      },
      after: {
        top: 540 - HALF,
        left: 74 - HALF,
        display: "none",
      },
    });
  });
});

describe("horizontal", () => {
  test("both buttons are visible when target element is within viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 24,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 124 - HALF,
        left: 24 - HALF,
        display: "block",
      },
      after: {
        top: 124 - HALF,
        left: 124 - HALF,
        display: "block",
      },
    });
  });

  test("both buttons are visible when target element is on the edges of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 24,
          left: 0,
          height: 300,
          width: 1366,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 174 - HALF,
        left: 0 - HALF,
        display: "block",
      },
      after: {
        top: 174 - HALF,
        left: 1366 - HALF,
        display: "block",
      },
    });
  });

  test("before button is hidden when the start of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 24,
          left: -24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 124 - HALF,
        left: -24 - HALF,
        display: "none",
      },
      after: {
        top: 124 - HALF,
        left: 76 - HALF,
        display: "block",
      },
    });
  });

  test("after button is hidden when the end of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 24,
          left: 1300,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 124 - HALF,
        left: 1300 - HALF,
        display: "block",
      },
      after: {
        top: 124 - HALF,
        left: 1400 - HALF,
        display: "none",
      },
    });
  });

  test("both buttons are hidden when target element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 24,
          left: -124,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 124 - HALF,
        left: -124 - HALF,
        display: "none",
      },
      after: {
        top: 124 - HALF,
        left: -24 - HALF,
        display: "none",
      },
    });
  });
});

describe("horizontal within container", () => {
  test("both buttons are visible when target element is within container", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 48,
          left: 48,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 148 - HALF,
        left: 48 - HALF,
        display: "block",
      },
      after: {
        top: 148 - HALF,
        left: 148 - HALF,
        display: "block",
      },
    });
  });

  test("both buttons are visible when target element is on the edges of container", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 48,
          left: 24,
          height: 200,
          width: 300,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 148 - HALF,
        left: 24 - HALF,
        display: "block",
      },
      after: {
        top: 148 - HALF,
        left: 324 - HALF,
        display: "block",
      },
    });
  });

  test("before button is hidden when the start of element is outside of container", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 48,
          left: 16,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 148 - HALF,
        left: 16 - HALF,
        display: "none",
      },
      after: {
        top: 148 - HALF,
        left: 116 - HALF,
        display: "block",
      },
    });
  });

  test("after button is hidden when the end of element is outside of container", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 48,
          left: 240,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 148 - HALF,
        left: 240 - HALF,
        display: "block",
      },
      after: {
        top: 148 - HALF,
        left: 340 - HALF,
        display: "none",
      },
    });
  });

  test("both buttons are hidden when target element is outside of container", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 48,
          left: 348,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 148 - HALF,
        left: 348 - HALF,
        display: "none",
      },
      after: {
        top: 148 - HALF,
        left: 448 - HALF,
        display: "none",
      },
    });
  });
});

function createRect(rect: Partial<DOMRect>): DOMRect {
  return {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: jest.fn(),
    ...rect,
  };
}
