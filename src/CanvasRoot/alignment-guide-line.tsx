import React from "react";
import type { AlignmentGuide } from "./alignment-guide-resolver";
// The insertion line's purple: one drag, one colour for everything it draws.
import { ACCENT } from "./usePanelDropTarget";

/**
 * The alignment guide on the canvas: dashed and thinner than the insertion
 * line, so the solid line still reads as "it lands here" and this one as "and
 * lines up with this".
 */
export function AlignmentGuideLine({ guide }: { guide: AlignmentGuide }) {
  const isUpright = guide.axis === "horizontal";

  return (
    <div
      style={{
        position: "fixed",
        top: guide.y,
        left: guide.x,
        width: isUpright ? 0 : guide.length,
        height: isUpright ? guide.length : 0,
        [isUpright ? "borderLeft" : "borderTop"]: `1px dashed ${ACCENT}`,
        boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.6)",
        pointerEvents: "none",
        zIndex: 2147483000,
      }}
    />
  );
}
