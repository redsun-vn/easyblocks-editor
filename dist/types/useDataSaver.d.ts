import { EditorContextType } from "@/EditorContext";
import { Document } from "@redsun-vn/easyblocks-core";
/**
 * useDataSaver works in a realm of SINGLE CONFIG.
 * @param initialDocument
 * Data saver will use this document as a starting point. It can be `null` if there is no document yet.
 * Data saver will perform first save when any local change is detected.
 */
export declare function useDataSaver(initialDocument: Document | null, editorContext: EditorContextType): {
    isSaving: boolean;
    isDirty: () => boolean;
    saveNow: () => Promise<void>;
};
//# sourceMappingURL=useDataSaver.d.ts.map