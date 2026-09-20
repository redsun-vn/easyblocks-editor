import { deepClone } from "@/utils/deepClone";
import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";

/**
 * Outputs comparable config that is FULL COPY of config
 */
function getConfigSnapshot(config: NoCodeComponentEntry): NoCodeComponentEntry {
  // A document that arrives without an entry used to reach `deepClone`, where
  // `JSON.parse(JSON.stringify(undefined))` throws and takes the editor down
  // with it. An empty snapshot instead reads as "different from the form", so
  // the next tick saves rather than killing the page the author is working on.
  if (config === null || config === undefined) {
    return {} as NoCodeComponentEntry;
  }

  const strippedConfig = deepClone(config);

  if (!strippedConfig?.data) {
    strippedConfig.data = [];
  }

  return strippedConfig;
}
export { getConfigSnapshot };
