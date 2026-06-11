import { dotNotationGet } from "@/utils/object/dotNotationGet";
import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import {
  findComponentDefinition,
  stripRichTextPartSelection,
} from "@redsun-vn/easyblocks-core/_internals";
import { Colors, Fonts } from "@redsun-vn/easyblocks-design-system";
import { ButtonSecondary } from "@redsun-vn/easyblocks-design-system/buttons";
import { Icons } from "@redsun-vn/easyblocks-design-system/icons";
import { useToaster } from "@redsun-vn/easyblocks-design-system/Toaster";
import * as React from "react";
import { useState } from "react";
import { styled } from "styled-components";
import { useEditorContext } from "./EditorContext";
import { pathToCompiledPath } from "./pathToCompiledPath";
import { SaveAsPicker } from "./SaveAsPicker";
import { SaveAsTemplatePicker } from "./TemplatePicker";
import { useTranslation } from "./useTranslation";
import { copyToClipboard } from "./utils/copyToClipboard";

const SidebarFooterContainer = styled.div`
  position: sticky;
  bottom: 0;
  background: ${Colors.white};
`;

const HorizontalLine = styled.div`
  height: 1px;
  margin-top: -1px;
  background-color: ${Colors.black10};
`;

const IdWrapper = styled.div`
  padding: 12px 16px;
  gap: 16px;
  ${Fonts.body}
  color: ${Colors.black40};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: 8px;
`;

const StyledButtonCopyTemplate = styled(ButtonSecondary)`
  min-width: auto !important;
  & svg {
    width: 14px !important;
    height: 14px !important;
  }
`;

export function SidebarFooter(props: {
  paths: string[];
  SaveAsPicker?: SaveAsTemplatePicker;
}) {
  const editorContext = useEditorContext();
  const toaster = useToaster();
  const { t } = useTranslation();
  const { form, mode } = editorContext;
  const [saveAsEntry, setSaveAsEntry] = useState<NoCodeComponentEntry | null>(
    null,
  );

  if (props.paths.length === 0) {
    return null;
  }

  const path = stripRichTextPartSelection(props.paths[0]);
  const value: NoCodeComponentEntry = dotNotationGet(form.values, path);

  if (!value) {
    return null;
  }

  const compiledPath = pathToCompiledPath(path, editorContext);
  const compiledValue = dotNotationGet(
    editorContext.compiledComponentConfig,
    compiledPath,
  );

  const widthInfo = compiledValue.__editing?.widthInfo;
  const width = widthInfo?.width?.xl;
  const widthAuto = widthInfo?.auto?.xl;

  const definition = findComponentDefinition(value, editorContext);
  const isSaveable = !!definition?.allowSave;

  const showSaveAsTemplate =
    isSaveable &&
    !editorContext.readOnly &&
    !editorContext.disableCustomTemplates;

  const onCopy = async (value: NoCodeComponentEntry | string) => {
    try {
      if (typeof value === "string") {
        await copyToClipboard(value);
      } else {
        await copyToClipboard(JSON.stringify(value));
      }
      toaster.success(t("template.entry.copy.success"));
    } catch (error) {
      toaster.error(t("template.entry.copy.error"));
    }
  };

  return (
    <SidebarFooterContainer>
      <HorizontalLine />
      <IdWrapper>
        {showSaveAsTemplate ? (
          <ButtonWrapper>
            {showSaveAsTemplate && (
              // {showSaveAsTemplate && mode !== "admin" && (
              <>
                <ButtonSecondary
                  icon={Icons.Save1}
                  hideLabel
                  onClick={() => {
                    editorContext.actions.openTemplateModal({
                      mode: "create",
                      config: value,
                      width,
                      widthAuto,
                    });
                  }}
                  style={{ minWidth: "auto" }}
                >
                  {t("template.save")}
                </ButtonSecondary>
                <ButtonSecondary
                  style={{ minWidth: "auto" }}
                  icon={Icons.SaveAs}
                  hideLabel
                  onClick={() => setSaveAsEntry(value)}
                >
                  {t("template.saveAs")}
                </ButtonSecondary>
              </>
            )}
            {mode !== "user" && (
              <>
                <StyledButtonCopyTemplate
                  icon={Icons.Copy}
                  hideLabel
                  onClick={() => onCopy(value)}
                >
                  {t("template.entry.copy")}
                </StyledButtonCopyTemplate>
                {value._master && (
                  <div style={{ paddingTop: 16 }}>Master: {value._master}</div>
                )}
              </>
            )}
            <ButtonSecondary
              icon={Icons.Id}
              hideLabel
              onClick={() => onCopy(value._id)}
              style={{ minWidth: "auto" }}
            >
              {t("template.id.copy")}
            </ButtonSecondary>
          </ButtonWrapper>
        ) : null}
      </IdWrapper>

      {props.SaveAsPicker ? (
        <SaveAsPicker
          saveAsEntry={saveAsEntry}
          setSaveAsEntry={setSaveAsEntry}
          Component={props.SaveAsPicker}
          mode={mode}
        />
      ) : null}
    </SidebarFooterContainer>
  );
}
