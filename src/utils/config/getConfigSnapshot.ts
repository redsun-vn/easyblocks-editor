import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { deepClone } from "@/utils";

/**
 * Outputs comparable config that is FULL COPY of config
 */
function getConfigSnapshot(config: NoCodeComponentEntry): NoCodeComponentEntry {
  const strippedConfig = deepClone(config);
  return strippedConfig;
}
export { getConfigSnapshot };
