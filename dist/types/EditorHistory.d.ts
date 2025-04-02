import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
export interface HistoryEntry {
    focussedField: Array<string>;
    config: NoCodeComponentEntry;
}
declare class EditorHistory {
    private values;
    private currentIndex;
    constructor();
    push(value: HistoryEntry): void;
    replace(value: HistoryEntry): void;
    replaceAt(oldValue: HistoryEntry, newValue: HistoryEntry): void;
    forward(): HistoryEntry | null;
    back(): HistoryEntry | null;
    getEntries(): Array<HistoryEntry>;
    private canGoForward;
    private canGoBack;
}
export { EditorHistory };
//# sourceMappingURL=EditorHistory.d.ts.map