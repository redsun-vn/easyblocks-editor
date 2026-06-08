import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { useToaster } from "@redsun-vn/easyblocks-design-system/Toaster";
import React from "react";
import { SaveAsTemplatePicker } from "./TemplatePicker";
import { TEasyblocksEditorMode } from "./types";
import { useTranslation } from "./useTranslation";

export function SaveAsPicker({
  mode,
  Component,
  saveAsEntry,
  setSaveAsEntry,
}: {
  mode: TEasyblocksEditorMode;
  Component: SaveAsTemplatePicker;
  saveAsEntry: NoCodeComponentEntry | null;
  setSaveAsEntry: React.Dispatch<
    React.SetStateAction<NoCodeComponentEntry | null>
  >;
}) {
  const toaster = useToaster();
  const { t } = useTranslation();

  return (
    <Component
      isOpen={!!saveAsEntry}
      saveAsEntry={saveAsEntry}
      onClose={() => setSaveAsEntry(null)}
      onSuccess={() => toaster.success(t("template.entry.saveAs.success"))}
      onError={() => toaster.error(t("template.entry.saveAs.error"))}
      editorMode={mode}
    />
  );
}
