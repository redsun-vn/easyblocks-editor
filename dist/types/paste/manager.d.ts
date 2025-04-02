import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { Destination } from "./destinationResolver";
declare function pasteManager(): (destinations: Destination[]) => (item: NoCodeComponentEntry) => string | null;
export type PasteCommand = ReturnType<typeof pasteManager>;
export { pasteManager };
//# sourceMappingURL=manager.d.ts.map