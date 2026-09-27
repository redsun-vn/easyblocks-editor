import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";

/**
 * The parts of a component definition the shape rule reads.
 *
 * Narrower than `InternalComponentDefinition` on purpose: a real definition
 * satisfies this structurally, and a test can write one in four lines instead of
 * building a compilation context.
 */
export type ShapeComponentDefinition = {
  id: string;
  type?: string | string[];
  schema: Array<{
    prop: string;
    type: string;
    accepts?: string[];
    panelDropTarget?: boolean;
  }>;
};

/** Looks a definition up by the id an entry carries in `_component`. */
export type GetShapeDefinition = (
  componentId: string,
) => ShapeComponentDefinition | undefined;

export type CollectionSlot = {
  prop: string;
  accepts: string[];
  /** Whether the slot opted in to receiving drops from a sidebar panel. */
  panelDropTarget: boolean;
};

export function isEntry(value: unknown): value is NoCodeComponentEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as NoCodeComponentEntry)._component === "string"
  );
}

/** Every `component-collection` prop a definition declares. */
export function getCollectionSlots(
  definition: ShapeComponentDefinition,
): Array<CollectionSlot> {
  return definition.schema
    .filter((prop) => prop.type === "component-collection")
    .map((prop) => ({
      prop: prop.prop,
      accepts: prop.accepts ?? [],
      panelDropTarget: prop.panelDropTarget === true,
    }));
}

/**
 * The single collection slot of a component, when it has exactly one.
 *
 * "Exactly one" is what makes the caller's reasoning safe. A component with two
 * collections has no unambiguous "inside", so neither peeling nor wrapping can
 * say which one it meant, and both refuse rather than guess.
 */
export function getSoleCollectionSlot(
  entry: NoCodeComponentEntry,
  getDefinition: GetShapeDefinition,
): CollectionSlot | null {
  const definition = getDefinition(entry._component);

  if (!definition) {
    return null;
  }

  const slots = getCollectionSlots(definition);

  return slots.length === 1 ? slots[0] : null;
}

/**
 * The one child sitting in a component's one collection slot.
 *
 * `null` when the component has no single slot, when the slot is empty, or when
 * it holds more than one child — each of those means the component is not a
 * wrapper around a single thing.
 */
export function getSoleCollectionChild(
  entry: NoCodeComponentEntry,
  getDefinition: GetShapeDefinition,
): { slot: CollectionSlot; child: NoCodeComponentEntry } | null {
  const slot = getSoleCollectionSlot(entry, getDefinition);

  if (!slot) {
    return null;
  }

  const children = (entry as Record<string, unknown>)[slot.prop];

  if (!Array.isArray(children) || children.length !== 1 || !isEntry(children[0])) {
    return null;
  }

  return { slot, child: children[0] };
}
