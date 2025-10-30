import { dotNotationGet } from "@/utils";
import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import {
  findComponentDefinition,
  stripRichTextPartSelection,
} from "@redsun-vn/easyblocks-core/_internals";
import {
  ButtonPrimary,
  ButtonSecondary,
  Colors,
  Fonts,
  useToaster,
} from "@redsun-vn/easyblocks-design-system";
import * as React from "react";
import { styled } from "styled-components";
import { useEditorContext } from "./EditorContext";
import { pathToCompiledPath } from "./pathToCompiledPath";
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
  display: flex;
  padding: 12px 16px;
  gap: 16px;
  ${Fonts.body}
  color: ${Colors.black40};
`;

export function SidebarFooter(props: { paths: string[] }) {
  const editorContext = useEditorContext();
  const toaster = useToaster();
  const { t } = useTranslation();
  const { form, isAdminMode } = editorContext;

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
    compiledPath
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

  return (
    <SidebarFooterContainer>
      <HorizontalLine />
      <IdWrapper>
        {/* <div>Id: {value._id}</div> */}
        {/* <br /> */}

        {showSaveAsTemplate && (
          <ButtonSecondary
            onClick={() => {
              editorContext.actions.openTemplateModal({
                mode: "create",
                config: value,
                width,
                widthAuto,
              });
            }}
          >
            {t("template.save")}
          </ButtonSecondary>
        )}

        {isAdminMode && (
          <div>
            <div>
              <ButtonPrimary
                onClick={async () => {
                  try {
                    await copyToClipboard(JSON.stringify(value));
                    toaster.success(t("template.entry.copy.success"));
                  } catch (error) {
                    toaster.error(t("template.entry.copy.error"));
                  }
                }}
              >
                {t("template.entry.copy")}
              </ButtonPrimary>
            </div>
            {value._master && (
              <div style={{ paddingTop: 16 }}>Master: {value._master}</div>
            )}
          </div>
        )}
      </IdWrapper>
    </SidebarFooterContainer>
  );
}
