import type { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { EditorHistory, HistoryEntry } from "./EditorHistory";
interface UseEditorHistoryParameters {
    onChange: (editorHistoryChange: EditorHistoryChange) => void;
}
interface EditorHistoryChange {
    config?: NoCodeComponentEntry;
    focusedField: Array<string>;
    type: "undo" | "redo";
}
declare function useEditorHistory({ onChange }: UseEditorHistoryParameters): {
    push: (entry: HistoryEntry) => void;
    redo: () => void;
    undo: () => void;
    editorHistoryInstance: EditorHistory;
};
export { useEditorHistory };
//# sourceMappingURL=useEditorHistory.d.ts.map