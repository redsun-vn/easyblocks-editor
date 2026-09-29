import { ResizeStep } from "./resize-step-resolver";

/** `width:height`, as an aspect ratio field stores it. */
const RATIO = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/;

/** Whether a field's values are aspect ratios rather than lengths. */
export function isRatioList(choices: ReadonlyArray<{ css: string }>) {
  return choices.some((choice) => RATIO.test(choice.css.trim()));
}

/** What a length is measured against when it is not in pixels. */
export type LengthReference = {
  /** The width `%` is a share of: the block's containing width. */
  percentOf: number;
  /** The canvas viewport height `vh` is a share of. */
  viewportHeight: number;
  /** The block's width, which a height given as a ratio follows. */
  width: number;
};

/**
 * How big a CSS value draws the block along the dragged axis, or `null` for a
 * value that is not a size — `none`, `fit-content` — which a drag skips.
 *
 * `auto` on the vertical axis is the block at its content height, the least
 * it can be, so it counts as zero: dragging the bottom edge up far enough
 * gives the height back to the content.
 */
export function lengthToPixels(
  css: string,
  axis: "x" | "y",
  reference: LengthReference,
): number | null {
  const value = css.trim();

  if (axis === "y" && value === "auto") {
    return 0;
  }

  const ratio = RATIO.exec(value);

  if (ratio) {
    return axis === "y"
      ? (reference.width * Number(ratio[2])) / Number(ratio[1])
      : null;
  }

  const length = /^(-?\d+(?:\.\d+)?)(px|%|vh)?$/.exec(value);

  if (!length) {
    return null;
  }

  const amount = Number(length[1]);

  switch (length[2]) {
    case "%":
      return axis === "x" ? (amount / 100) * reference.percentOf : null;
    case "vh":
      return (amount / 100) * reference.viewportHeight;
    default:
      return amount;
  }
}

/**
 * The steps a list of CSS values gives, smallest first. Values that are not a
 * size are left out; so are widths beyond what the block can reach, which
 * would all draw the same and leave the drag nothing to tell apart. Of two
 * values that draw the same size, the first listed is kept.
 */
export function lengthSteps(
  choices: ReadonlyArray<{ key: string; css: string }>,
  axis: "x" | "y",
  reference: LengthReference,
): Array<ResizeStep> {
  const steps: Array<ResizeStep> = [];
  // Among ratios, `auto` is the picture's own ratio, not the least height.
  const ratios = isRatioList(choices);

  for (const choice of choices) {
    const size =
      ratios && choice.css.trim() === "auto"
        ? null
        : lengthToPixels(choice.css, axis, reference);

    if (
      size === null ||
      (axis === "x" && size > reference.percentOf + 1) ||
      steps.some((step) => Math.abs(step.size - size) < 0.5)
    ) {
      continue;
    }

    steps.push({ value: choice.key, size });
  }

  return steps.sort((a, b) => a.size - b.size);
}
