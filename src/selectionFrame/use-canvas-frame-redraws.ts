import { useEffect, useState } from "react";
import { findCanvasFrame } from "./canvas-resize-geometry";

/**
 * A count that goes up whenever the selected block's frame or anything drawn
 * directly in it changes size on the canvas.
 *
 * A picture narrowing inside its frame after a write sends no position
 * message — the frame itself did not move — so the handles would sit on the
 * old edge until something else happened. Watching the canvas's own resize
 * observer answers exactly when the page has redrawn, however long that took.
 * `refreshKey` re-attaches it after a write, when the canvas may have drawn
 * the block's content afresh.
 */
export function useCanvasFrameRedraws(path: string, refreshKey: unknown) {
  const [redraws, setRedraws] = useState(0);

  useEffect(() => {
    const found = findCanvasFrame(path);
    const Observer = (
      found?.view as
        (Window & { ResizeObserver?: typeof ResizeObserver }) | undefined
    )?.ResizeObserver;

    if (!found || !Observer) {
      return;
    }

    const observer = new Observer(() => setRedraws((count) => count + 1));
    observer.observe(found.frame);
    Array.from(found.frame.children).forEach((child) =>
      observer.observe(child),
    );

    return () => observer.disconnect();
  }, [path, refreshKey]);

  return redraws;
}
