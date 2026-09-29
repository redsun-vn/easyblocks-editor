import type {
  PanelDropSlot,
  SlotChildRect,
} from "../editorSidebar/editorSections/panelDropSlots";

/** A slot the way the canvas measures one: its bounds are its children's union. */
export function slotOf(
  parentPath: string,
  prop: string,
  children: Array<SlotChildRect>,
): PanelDropSlot {
  const bounds =
    children.length === 0
      ? { top: 0, bottom: 0, left: 0, right: 0 }
      : {
          top: Math.min(...children.map((child) => child.top)),
          bottom: Math.max(...children.map((child) => child.bottom)),
          left: Math.min(...children.map((child) => child.left)),
          right: Math.max(...children.map((child) => child.right)),
        };

  return { parentPath, prop, bounds, children };
}

/** A column of blocks stacked 100px apart, each placed by `left` and `width`. */
export function column(
  blocks: Array<{ left: number; width: number }>,
  parentPath = "data.0.Cells.0",
): PanelDropSlot {
  return slotOf(
    parentPath,
    "Items",
    blocks.map((block, index) => ({
      index,
      top: index * 100,
      bottom: index * 100 + 80,
      left: block.left,
      right: block.left + block.width,
    })),
  );
}

/** A drop into a vertical collection just before `index`. */
export function aimAt(index: number, y: number, parentPath = "data.0.Cells.0") {
  return {
    parentPath,
    prop: "Items",
    index,
    length: 3,
    line: { axis: "vertical" as const, x: 0, y, length: 400 },
  };
}
