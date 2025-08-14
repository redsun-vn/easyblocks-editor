import { Document } from "@redsun-vn/easyblocks-core";
import { EditorContextType } from "./EditorContext";
export interface IDataSaverStatus {
    type: "error" | "notify" | "success" | "pending";
    message: string;
}
/**
 * useDataSaver works in a realm of SINGLE CONFIG.
 * @param initialDocument
 * Data saver will use this document as a starting point. It can be `null` if there is no document yet.
 * Data saver will perform first save when any local change is detected.
 */
export declare function useDataSaver(initialDocument: Document | null, editorContext: EditorContextType): {
    saveNow: () => Promise<void>;
    dataSaverStatus: IDataSaverStatus;
};
//# sourceMappingURL=useDataSaver.d.ts.map