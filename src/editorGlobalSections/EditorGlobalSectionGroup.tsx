import { IThemeConfig, NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import { Colors } from "@redsun-vn/easyblocks-design-system";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "@redsun-vn/easyblocks-design-system/buttons";
import { Icons } from "@redsun-vn/easyblocks-design-system/icons";
import { Input } from "@redsun-vn/easyblocks-design-system/Input";
import { Modal } from "@redsun-vn/easyblocks-design-system/modals";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useEditorContext } from "../EditorContext";
import { useTranslation } from "../useTranslation";
import { EditorGlobalSectionGroupItem } from "./EditorGlobalSectionGroupItem";

const HorizontalLine = styled.div`
  height: 1px;
  margin-top: -1px;
  background-color: ${Colors.black10};
  margin: 4px 10px;
`;

const StyledWrapperChevronIcon = styled(Typography)<{ isOpen: boolean }>`
  transition: transform 0.2s ease;
  ${({ isOpen }) => `transform: rotate(${isOpen ? 180 : 0}deg);`}
`;

const StyledEditorGlobalSectionGroups = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  min-width: 100%;
  cursor: pointer;
  padding: 6px 10px;
  gap: 2px;
`;

const StyledEditorGlobalSectionsLabel = styled(Typography)`
  display: block;
  font-weight: 700;
  max-width: 240px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 14px;
  gap: 12px;
`;

export const EditorGlobalSectionGroup = ({
  globalSectionGroup,
  openedSectionGroups,
  onClickGlobalSectionGroup,
}: {
  openedSectionGroups: string[];
  globalSectionGroup: {
    group: {
      id: string;
      name: string;
    };
    groupItem: NonNullable<IThemeConfig["globalSections"]>[string];
  };
  onClickGlobalSectionGroup: (groupId: string) => void;
}) => {
  const editorContext = useEditorContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();
  const isExpandedGroups = openedSectionGroups.includes(
    globalSectionGroup.group.id,
  );
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
      <StyledEditorGlobalSectionGroups
        id={globalSectionGroup.group.id}
        onClick={() => onClickGlobalSectionGroup(globalSectionGroup.group.id)}
      >
        {/* Section groups */}
        <StyledEditorGlobalSectionsLabel variant="body" component="label">
          {globalSectionGroup.group.name}
          {` (${Object.keys(globalSectionGroup.groupItem?.orders ?? {}).length})`}
        </StyledEditorGlobalSectionsLabel>
        <StyledWrapperChevronIcon isOpen={isExpandedGroups}>
          <Icons.ChevronDown size={22} />
        </StyledWrapperChevronIcon>
      </StyledEditorGlobalSectionGroups>

      {/* Section items */}
      {isExpandedGroups
        ? globalSectionGroup.groupItem?.orders?.map((entryId) => {
            const entryValue = globalSectionGroup.groupItem.entities[entryId];
            return (
              <EditorGlobalSectionGroupItem
                group={globalSectionGroup.group}
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
          })
        : null}

      {isExpandedGroups && globalSectionGroup.groupItem?.orders?.length ? (
        <HorizontalLine />
      ) : null}

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
    </>
  );
};
