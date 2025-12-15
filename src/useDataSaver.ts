import { deepClone, deepCompare, sleep } from "@/utils";
import { Document, NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { useToaster } from "@redsun-vn/easyblocks-design-system";
import { useEffect, useRef, useState } from "react";
import { EditorContextType } from "./EditorContext";
import { getTranslation } from "./useTranslation";
import { getConfigSnapshot } from "./utils/config/getConfigSnapshot";
import { addLocalizedFlag } from "./utils/locales/addLocalizedFlag";
import { removeLocalizedFlag } from "./utils/locales/removeLocalizedFlag";

/**
 * useDataSaver works in a realm of SINGLE CONFIG.
 * @param initialDocument
 * Data saver will use this document as a starting point. It can be `null` if there is no document yet.
 * Data saver will perform first save when any local change is detected.
 */
export function useDataSaver(
  initialDocument: Document | null,
  editorContext: EditorContextType
) {
  const remoteDocument = useRef<Document | null>(initialDocument);
  const toaster = useToaster();
  const [isSaving, setIsSaving] = useState(false);
  const { t } = getTranslation(editorContext);

  /**
   * This state variable is going to be used ONLY for comparison with local config in case of missing document.
   * It's not going to change at any time during the lifecycle of this hook.
   */
  const [initialConfigInCaseOfMissingDocument] = useState<NoCodeComponentEntry>(
    deepClone(editorContext.form.values)
  );
  const onTickRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const isConfigTheSame = () => {
    const localConfig = editorContext.form.values;
    const localConfigSnapshot = getConfigSnapshot(localConfig);

    const previousConfig = remoteDocument.current
      ? remoteDocument.current.entry
      : initialConfigInCaseOfMissingDocument;
    const previousConfigSnapshot = getConfigSnapshot(previousConfig);

    return deepCompare(localConfigSnapshot, previousConfigSnapshot);
  };

  const onTick = async ({ mode }: { mode: "auto" | "force" }) => {
    // Playground mode is a special case, we don't want to save anything
    if (editorContext.readOnly) {
      return;
    }

    if (mode === "force") {
      setIsSaving(true);
    }

    const localConfig = editorContext.form.values;
    const localConfigSnapshot = getConfigSnapshot(localConfig);

    const configToSaveWithLocalisedFlag = addLocalizedFlag(
      localConfigSnapshot,
      editorContext
    );

    async function runSaveCallback() {
      await editorContext.save(remoteDocument.current!);
    }

    // New document
    if (remoteDocument.current === null) {
      console.debug("New document");

      // There must be at least one change in order to create a new document, we're not storing empty temporary documents
      if (isConfigTheSame()) {
        console.debug("no change -> bye");
        setIsSaving(false);
        return;
      }

      console.debug("change detected! -> create");

      const newDocument = await editorContext.backend.documents.create({
        entry: configToSaveWithLocalisedFlag,
      });

      remoteDocument.current = {
        ...newDocument,
        // @ts-ignore
        config: {
          config: configToSaveWithLocalisedFlag,
        },
      };

      await runSaveCallback();
      setIsSaving(false);
    }
    // Document update
    else {
      console.debug("Existing document");

      try {
        const latestDocument = await editorContext.backend.documents.get({
          id: remoteDocument.current.id,
        });
        const latestRemoteDocumentVersion = latestDocument.version ?? -1;

        const isNewerDocumentVersionAvailable =
          remoteDocument.current.version < latestRemoteDocumentVersion;

        // Newer version of document is available
        if (isNewerDocumentVersionAvailable) {
          console.debug("new remote version detected, updating");

          if (!latestDocument) {
            throw new Error("unexpected error");
          }

          const latestConfig = removeLocalizedFlag(
            latestDocument.entry,
            editorContext
          );

          editorContext.actions.runChange(() => {
            editorContext.form.change("", latestConfig);
            return [];
          });

          remoteDocument.current = latestDocument;

          // Notify when local config was modified
          if (!isConfigTheSame()) {
            console.debug("there were local changes -> notify");

            editorContext.actions.notify(
              "Remote changes detected, local changes have been overwritten."
            );
          }

          return;
        }
        // No remote change occurred
        else {
          if (isConfigTheSame()) {
            console.debug("no local changes -> bye");

            if (mode === "force") {
              toaster.success(t("topBar.noLocalChange"));
            }
            // Let's do nothing, no remote and local change
          } else {
            console.debug("updating the document", remoteDocument.current.id);

            const updatedDocument =
              await editorContext.backend.documents.update({
                id: remoteDocument.current.id,
                entry: configToSaveWithLocalisedFlag,
                version: remoteDocument.current.version,
              });

            if (updatedDocument?.id) {
              toaster.success(t("topBar.saved"));
            } else {
              toaster.error(t("topBar.save.error"));
            }

            remoteDocument.current.entry = localConfigSnapshot;
            remoteDocument.current.version = updatedDocument.version;

            await runSaveCallback();
          }
        }
      } catch (error) {
        toaster.error(t("topBar.save.error"));
      } finally {
        setIsSaving(false);
      }
    }
  };

  // We're keeping this in ref, because of setInterval keeping initial closure
  onTickRef.current = () => onTick({ mode: "auto" });

  const inProgress = useRef<boolean>(false);
  const wasSaveNowCalled = useRef<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // We ignore ticks when previous requests are in progress
      if (inProgress.current || wasSaveNowCalled.current) {
        return;
      }

      inProgress.current = true;
      onTickRef.current().finally(() => {
        inProgress.current = false;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handler = async <T>(event: {
      source: any;
      data: { id: string; type: string; payload?: T };
    }) => {
      const { id, type } = event.data;

      if (type === "@easyblocks/content-saved-status") {
        event.source.postMessage(
          {
            id,
            type: "@easyblocks/content-saved-status",
            payload: { isSavedDocument: isConfigTheSame() },
          },
          "*"
        );
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return {
    isSaving,
    saveNow: async () => {
      wasSaveNowCalled.current = true;

      // Wait until inProgress is false
      while (true) {
        if (inProgress.current) {
          console.debug("waiting...");
          await sleep(500);
        } else {
          break;
        }
      }

      console.debug("Last save!");
      await onTick({ mode: "force" });
    },
  };
}
