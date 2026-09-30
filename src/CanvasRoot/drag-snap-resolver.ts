/**
 * Where a dragged block's outline snaps to, and the guides that say why.
 *
 * The outline is the block's own box carried by the pointer. On each axis it is
 * compared with the blocks around it by start edge, centre and end edge; the
 * nearest line within `threshold` wins and the outline moves onto it. Only that
 * one line per axis is returned — a page full of lines that happen to agree
 * tells the person nothing about which one the block is sitting on.
 *
 * Geometry only, so it is tested without a browser. Everything is in the
 * canvas's own pixels.
 */

export type SnapRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/** A guide drawn across the canvas: `x`/`y` is where it starts. */
export type SnapGuide = {
  orientation: "vertical" | "horizontal";
  x: number;
  y: number;
  length: number;
};

export type DragSnap = {
  dx: number;
  dy: number;
  guides: Array<SnapGuide>;
};

type Span = { start: number; end: number };

type AxisMatch = {
  offset: number;
  at: number;
  candidate: SnapRect;
  distance: number;
  gap: number;
};

const linesOf = ({ start, end }: Span) => [start, (start + end) / 2, end];

const spanX = (rect: SnapRect): Span => ({ start: rect.left, end: rect.right });
const spanY = (rect: SnapRect): Span => ({ start: rect.top, end: rect.bottom });

/** Empty space between two spans, 0 when they overlap. */
const gapBetween = (a: Span, b: Span) =>
  Math.max(0, b.start - a.end, a.start - b.end);

/**
 * The nearest line on one axis. Ties go to the block nearest along the other
 * axis, so the guide reaches the neighbour the eye is on rather than one far
 * down the page; after that, to the earlier candidate, so the pick is stable.
 */
function nearestOnAxis(
  moving: SnapRect,
  candidates: ReadonlyArray<SnapRect>,
  threshold: number,
  along: (rect: SnapRect) => Span,
  across: (rect: SnapRect) => Span,
): AxisMatch | null {
  let best: AxisMatch | null = null;
  const movingLines = linesOf(along(moving));

  for (const candidate of candidates) {
    const gap = gapBetween(across(moving), across(candidate));

    for (const line of linesOf(along(candidate))) {
      for (const own of movingLines) {
        const offset = line - own;
        const distance = Math.abs(offset);

        if (distance > threshold) {
          continue;
        }

        if (
          !best ||
          distance < best.distance ||
          (distance === best.distance && gap < best.gap)
        ) {
          best = { offset, at: line, candidate, distance, gap };
        }
      }
    }
  }

  return best;
}

export function resolveDragSnap(
  moving: SnapRect,
  candidates: ReadonlyArray<SnapRect>,
  threshold: number,
): DragSnap {
  const onX = nearestOnAxis(moving, candidates, threshold, spanX, spanY);
  const onY = nearestOnAxis(moving, candidates, threshold, spanY, spanX);
  const dx = onX?.offset ?? 0;
  const dy = onY?.offset ?? 0;
  const snapped: SnapRect = {
    left: moving.left + dx,
    right: moving.right + dx,
    top: moving.top + dy,
    bottom: moving.bottom + dy,
  };
  const guides: Array<SnapGuide> = [];

  // Each guide runs from the snapped outline to the block it lines up with.
  if (onX) {
    const from = Math.min(snapped.top, onX.candidate.top);
    const to = Math.max(snapped.bottom, onX.candidate.bottom);

    guides.push({ orientation: "vertical", x: onX.at, y: from, length: to - from });
  }

  if (onY) {
    const from = Math.min(snapped.left, onY.candidate.left);
    const to = Math.max(snapped.right, onY.candidate.right);

    guides.push({ orientation: "horizontal", x: from, y: onY.at, length: to - from });
  }

  return { dx, dy, guides };
}
