import type { ResizeChoice } from "./canvas-resize-fields";
import type { ResizeGeometry } from "./canvas-resize-geometry";
import type { pendingSwitch } from "./canvas-resize-parent-switch";
import type { SpanPreview } from "./canvas-span-preview";

export type ResizeEdge = "left" | "right" | "bottom";

/** What the chip beside the dragged edge says while a drag is on. */
export type ResizeReading = { edge: ResizeEdge; label: string };

export type Drag = {
  edge: ResizeEdge;
  pointerId: number;
  startPointer: number;
  /** Canvas pixels per screen pixel: the canvas is drawn scaled by the zoom. */
  scale: number;
  geometry: ResizeGeometry;
  choices: Map<string, ResizeChoice>;
  /** The value the block had when the drag began. */
  startValue: string;
  lastValue: string;
  hasWritten: boolean;
  /** A parent switch still to turn on before the first write, if any. */
  pending: ReturnType<typeof pendingSwitch>;
  /** What Esc puts back: the field, or the whole parent when its switch is in play. */
  restorePath: string;
  originalRawValue: unknown;
  /** The drawing a span drag shows instead of writing; `null` writes every step. */
  preview: SpanPreview | null;
};
