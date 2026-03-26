import { globalSectionGroups } from "@redsun-vn/easyblocks-core";
import { Colors } from "@redsun-vn/easyblocks-design-system";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, { useState } from "react";
import styled from "styled-components";
import { EditorContextType } from "../EditorContext";
import { useTranslation } from "../useTranslation";
import { EditorGlobalSectionGroup } from "./EditorGlobalSectionGroup";

const HorizontalLine = styled.div`
  height: 1px;
  margin-top: -1px;
  background-color: ${Colors.black10};
`;

const StyledEditorGlobalSectionsRoot = styled.div`
  overflow-x: hidden;
  height: 100%;
`;

const StyledEditorGlobalSections = styled.div`
  height: 100%;
  overflow-x: auto;
  padding-top: 0px;
  padding-bottom: 16px;
`;

const StyledEditorGlobalSectionsTitle = styled(Typography)`
  line-height: 14px;
  font-weight: 700;
  padding: 17px 12px;
`;

const StyledEditorGlobalSectionsDescription = styled(Typography)`
  padding: 20px 12px;
`;

const StyledEditorGlobalSectionGroup = styled(Typography)`
  padding: 10px 0px;
`;

export const EditorGlobalSections = ({
  globalSections,
}: Pick<EditorContextType, "globalSections">) => {
  const { t } = useTranslation();
  const [openedSectionGroups, setOpenedSectionGroups] = useState<string[]>(
    globalSectionGroups.map((group) => group.id),
  );

  const onClickGlobalSectionGroup = (sectionId: string) => {
    setOpenedSectionGroups((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter((s) => s !== sectionId);
      }

      return [...prev, sectionId];
    });
  };

  return (
    <StyledEditorGlobalSectionsRoot>
      <StyledEditorGlobalSectionsTitle>
        {t("editor.sidebar.globalSections")}
      </StyledEditorGlobalSectionsTitle>

      <HorizontalLine />

      <StyledEditorGlobalSections>
        <StyledEditorGlobalSectionsDescription>
          {t("editor.sidebar.globalSections.description")}
        </StyledEditorGlobalSectionsDescription>

        <HorizontalLine />

        <StyledEditorGlobalSectionGroup>
          {globalSectionGroups.map((globalSectionGroup) => (
            <EditorGlobalSectionGroup
              key={globalSectionGroup.id}
              openedSectionGroups={openedSectionGroups}
              globalSectionGroup={{
                group: globalSectionGroup,
                groupItem: globalSections?.[globalSectionGroup.name] ?? {
                  orders: [],
                  entities: {},
                },
              }}
              onClickGlobalSectionGroup={() =>
                onClickGlobalSectionGroup(globalSectionGroup.id)
              }
            />
          ))}
        </StyledEditorGlobalSectionGroup>
      </StyledEditorGlobalSections>
    </StyledEditorGlobalSectionsRoot>
  );
};
