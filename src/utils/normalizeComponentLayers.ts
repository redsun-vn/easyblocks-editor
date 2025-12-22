import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";

export interface ILayer {
  id: string;
  component: string;
  path: string;
  children: ILayer[];
  rootParentId?: string;
}

export const normalizeComponentLayers = (
  components: NoCodeComponentEntry,
  prefix = "data",
  _rootParentId?: string
): ILayer[] => {
  if (Array.isArray(components)) {
    return components.map((component: NoCodeComponentEntry, layer) => {
      const path = `${prefix}.${layer}`;
      const rootParentId = _rootParentId || component._id;

      return {
        id: component._id,
        component: component._component,
        path,
        rootParentId,
        children: normalizeComponentLayers(component, path, rootParentId),
      };
    });
  }

  if (!Array.isArray(components) && typeof components === "object") {
    return Object.entries(components)
      .filter(
        ([_, componentValue]) =>
          Array.isArray(componentValue) && componentValue.length
      )
      .map(
        ([componentName, componentValue]: [
          componentName: string,
          componentValue: NoCodeComponentEntry
        ]) => {
          const path = `${prefix}.${componentName}`;
          const rootParentId = _rootParentId || componentValue._id;

          return normalizeComponentLayers(componentValue, path, rootParentId);
        }
      )
      .flat();
  }

  return [];
};
