import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { useToaster } from "@redsun-vn/easyblocks-design-system";
import React from "react";
import { SaveAsTemplatePicker } from "./TemplatePicker";
import { useTranslation } from "./useTranslation";

export function SaveAsPicker({
  Component,
  saveAsEntry,
  setSaveAsEntry,
}: {
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
    />
  );
}
