import { deepClone } from "@/utils/deepClone";
import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";

/**
 * Outputs comparable config that is FULL COPY of config
 */
function getConfigSnapshot(config: NoCodeComponentEntry): NoCodeComponentEntry {
  const strippedConfig = deepClone(config);

  if (!strippedConfig?.data) {
    strippedConfig.data = [];
  }

  return strippedConfig;
}
export { getConfigSnapshot };
