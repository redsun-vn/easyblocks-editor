import {
  globalSectionGroups,
  NoCodeComponentEntry,
} from "@redsun-vn/easyblocks-core";
import { Colors } from "@redsun-vn/easyblocks-design-system";
import { AccordionGroup } from "@redsun-vn/easyblocks-design-system/AccordionGroup";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "@redsun-vn/easyblocks-design-system/buttons";
import { Input } from "@redsun-vn/easyblocks-design-system/Input";
import { Modal } from "@redsun-vn/easyblocks-design-system/modals";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { EditorContextType, useEditorContext } from "../../EditorContext";
import { useTranslation } from "../../useTranslation";
import { EditorGlobalSectionItem } from "./EditorGlobalSectionItem";

const HorizontalLine = styled.div`
  height: 1px;
  margin-top: -1px;
  background-color: ${Colors.black10};
`;

const StyledEditorGlobalSectionsDescription = styled(Typography)`
  padding-bottom: 20px;
  padding-left: 12px;
  padding-right: 12px;
`;

const StyledEditorGlobalSectionGroup = styled(Typography)`
  padding: 10px 0px;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 14px;
  gap: 12px;
`;

export const EditorGlobalSections = ({
  globalSections,
}: Pick<EditorContextType, "globalSections">) => {
  const { t } = useTranslation();
  const editorContext = useEditorContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<{
    entryId: string;
    sectionName: string;
    groupName: string;
  } | null>(null);

  const [openEditSection, setOpenEditSection] = useState<{
    label: string;
    entry: NoCodeComponentEntry;
    groupName: string;
  } | null>(null);

  const onCloseConfirm = () => {
    if (!isLoading) {
      setOpenDeleteConfirm(null);
    }
  };

  const onCloseEditSection = () => {
    if (!isLoading) {
      setOpenEditSection(null);
    }
  };

  const onConfirmDeleteSection = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    editorContext
      .onGlobalSectionChange?.({
        mode: "delete",
        groupName: openDeleteConfirm?.groupName ?? "",
        entry: {
          _id: openDeleteConfirm?.entryId ?? "",
          _component: "",
        },
      })
      .then(() => {
        setIsLoading(false);
        onCloseConfirm();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onEditSection = () => {
    if (isLoading || !inputRef?.current?.value) {
      return;
    }

    setIsLoading(true);
    editorContext
      .onGlobalSectionChange?.({
        mode: "update",
        ...openEditSection,
        groupName: openEditSection?.groupName ?? "",
        label: inputRef.current.value,
      })
      .then(() => {
        setIsLoading(false);
        onCloseEditSection();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault();
      e.stopPropagation();
      onEditSection();
    }
  };

  useEffect(() => {
    if (openEditSection?.groupName) {
      queueMicrotask(() => {
        inputRef.current?.focus();
      });
    }
  }, [openEditSection]);

  return (
    <>
      <StyledEditorGlobalSectionsDescription>
        {t("editor.sidebar.globalSections.description")}
      </StyledEditorGlobalSectionsDescription>

      <HorizontalLine />

      <StyledEditorGlobalSectionGroup>
        {globalSectionGroups.map((globalSectionGroup) => {
          const globalSectionGroupItem =
            globalSections?.[globalSectionGroup.name];

          return (
            <AccordionGroup
              key={globalSectionGroup.id}
              id={globalSectionGroup.id}
              title={globalSectionGroup.name}
              subTitle={` (${Object.keys(globalSectionGroupItem?.orders ?? {}).length})`}
            >
              {globalSectionGroupItem?.orders?.map((entryId) => {
                const entryValue = globalSectionGroupItem.entities[entryId];
                return (
                  <EditorGlobalSectionItem
                    group={globalSectionGroup}
                    groupItem={{
                      id: entryId,
                      entry: entryValue.entry!,
                      component: entryValue?.entry?._component ?? "",
                      label: entryValue.label,
                      pages: entryValue.pages,
                    }}
                    setOpenDeleteConfirm={setOpenDeleteConfirm}
                    setOpenEditSection={setOpenEditSection}
                  />
                );
              })}

              {/* Modal confirm delete */}
              <Modal
                title={`${t("delete")} (${openDeleteConfirm?.sectionName})`}
                isOpen={openDeleteConfirm !== null}
                onRequestClose={onCloseConfirm}
                mode="fit"
                height="auto"
                endAdornment={
                  <StyledButtonGroup>
                    <ButtonSecondary onClick={onCloseConfirm}>
                      {t("cancel")}
                    </ButtonSecondary>
                    <ButtonPrimary
                      isLoading={isLoading}
                      disabled={isLoading}
                      onClick={onConfirmDeleteSection}
                    >
                      {t("template.delete.default")}
                    </ButtonPrimary>
                  </StyledButtonGroup>
                }
              >
                <Typography variant={"body"} component="label">
                  {t("editor.sidebar.globalSections.delete.confirm")}
                </Typography>
              </Modal>

              {/* Modal rename section */}
              <Modal
                title={t("rename")}
                isOpen={openEditSection !== null}
                onRequestClose={onCloseEditSection}
                mode="fit"
                height="auto"
                endAdornment={
                  <StyledButtonGroup>
                    <ButtonSecondary onClick={onCloseEditSection}>
                      {t("cancel")}
                    </ButtonSecondary>
                    <ButtonPrimary
                      isLoading={isLoading}
                      disabled={isLoading}
                      onClick={onEditSection}
                    >
                      {t("rename")}
                    </ButtonPrimary>
                  </StyledButtonGroup>
                }
              >
                <Input
                  defaultValue={openEditSection?.label}
                  ref={inputRef}
                  withBorder
                  style={{ width: 300 }}
                  onKeyDown={onEnter}
                />
              </Modal>
            </AccordionGroup>
          );
        })}
      </StyledEditorGlobalSectionGroup>
    </>
  );
};
