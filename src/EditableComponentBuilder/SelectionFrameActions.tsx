import {
  ContextParams,
  NoCodeComponentEntry,
} from "@redsun-vn/easyblocks-core";
import {
  ButtonGhost,
  ButtonPrimary,
  ButtonSecondary,
  Colors,
  Icons,
  Input,
  Modal,
  useToaster,
} from "@redsun-vn/easyblocks-design-system";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { EditorContextType, useEditorContext } from "../EditorContext";
import { globalSectionGroups } from "../editorGlobalSections/EditorGlobalSections";
import { IMenu, Menu } from "../menu/Menu";
import {
  BEFORE_ADD_BUTTON_DISPLAY,
  BEFORE_ADD_BUTTON_LEFT,
  BEFORE_ADD_BUTTON_TOP,
} from "../selectionFrame/cssVariables";
import { ActionsType } from "../types";
import { getTranslation } from "../useTranslation";
import { uniqueId } from "../utils";
import { dotNotationGet } from "../utils/object/dotNotationGet";

interface ISelectionFrameActionsProps {
  focussedField: string[];
  actions: ActionsType;
  translationFiles: { [key: string]: any };
  contextParams: ContextParams;
}

const SelectionFrameActionsContainer = styled.div`
  position: absolute;
  top: calc(var(${BEFORE_ADD_BUTTON_TOP}) - 42px);
  left: var(${BEFORE_ADD_BUTTON_LEFT});
  border-radius: 4px;
  box-shadow: var(--tina-shadow-big);
  display: var(${BEFORE_ADD_BUTTON_DISPLAY}, none);
  padding: 5px 10px;
  width: max-content;
  background: ${Colors.white};
  pointer-events: all;
`;

const SelectionFrameActionsGroupButtons = styled.div`
  display: flex;
  gap: 2px;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 14px;
  gap: 12px;
`;

const StyledMenu = styled.div`
  display: var(${BEFORE_ADD_BUTTON_DISPLAY}, none);
`;

const SelectionMoreActions = ({ t }: { t: (key: string) => any }) => {
  const editorContext = useEditorContext();
  const router = new URLSearchParams(window.location.search);
  const currentDocument = router.get("document") ?? "";
  const toaster = useToaster();
  const [openConfirmGlobalSection, setOpenConfirmGlobalSection] = useState<{
    groupName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentEntry: NoCodeComponentEntry = dotNotationGet(
    editorContext.form.values,
    editorContext.focussedField[editorContext.focussedField.length - 1],
  );

  const isAddedToPage = Object.values(editorContext?.globalSections ?? {}).some(
    (globalSections) => Object.keys(globalSections).includes(currentEntry._id),
  );

  const onRemoveGlobalSection = () => {
    const currentSection = Object.entries(
      editorContext?.globalSections ?? {},
    ).find(([_, groupValue]) =>
      Object.keys(groupValue).includes(currentEntry._id),
    );

    const groupName = currentSection?.[0];

    if (groupName) {
      setIsLoading(true);
      editorContext
        .onGlobalSectionChange?.({
          mode: "update",
          pages: currentSection?.[1][currentEntry._id].pages.filter(
            (page) => page !== currentDocument,
          ),
          label: currentSection?.[1][currentEntry._id].label,
          groupName,
          entry: currentEntry,
        })
        .then(() => {
          toaster.success(
            t("editor.sidebar.globalSections.removeGlobal.success"),
          );
          editorContext.actions.replaceItems(
            [
              editorContext.focussedField[
                editorContext.focussedField.length - 1
              ],
            ],
            {
              ...currentEntry,
              _id: uniqueId(),
            },
          );
        })
        .catch((reason) => {
          toaster.error(reason);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const menus: IMenu[] = [
    {
      id: "set-global",
      label: t("editor.sidebar.globalSections.setGlobal"),
      children: globalSectionGroups.map((globalSectionGroup) => ({
        id: globalSectionGroup.id,
        label: globalSectionGroup.name,
        onClick: () =>
          setOpenConfirmGlobalSection({
            groupName: globalSectionGroup.name,
          }),
      })),
      isHidden: isAddedToPage,
    },
    {
      id: "remove-global",
      label: t("editor.sidebar.globalSections.removeGlobal"),
      isLoading,
      isHidden: !isAddedToPage,
      onClick: onRemoveGlobalSection,
    },
  ];

  const onClose = () => {
    if (!isLoading) {
      setOpenConfirmGlobalSection(null);
    }
  };

  const onConfirmChange = () => {
    if (!inputRef?.current?.value) {
      toaster.error(t("editor.sidebar.globalSections.setGlobal.validName"));
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    editorContext
      .onGlobalSectionChange?.({
        mode: "update",
        groupName: openConfirmGlobalSection?.groupName ?? "",
        label: inputRef?.current?.value,
        entry: currentEntry,
      })
      .then(() => {
        setIsLoading(false);
        toaster.success(t("editor.sidebar.globalSections.setGlobal.success"));
        onClose();
      })
      .catch((reason) => {
        setIsLoading(false);
        toaster.error(reason);
      });
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      onConfirmChange();
    }
  };

  useEffect(() => {
    if (openConfirmGlobalSection?.groupName) {
      queueMicrotask(() => {
        inputRef.current?.focus();
      });
    }
  }, [openConfirmGlobalSection]);

  return (
    <>
      <StyledMenu>
        <Menu menus={menus} styles={{ top: "40px", left: "80%" }} />
      </StyledMenu>
      <Modal
        title={t("editor.sidebar.globalSections.setGlobal.enterName")}
        isOpen={!!openConfirmGlobalSection}
        onRequestClose={onClose}
        mode="fit"
        height="auto"
        endAdornment={
          <StyledButtonGroup>
            <ButtonSecondary onClick={onClose}>{t("cancel")}</ButtonSecondary>
            <ButtonPrimary
              isLoading={isLoading}
              disabled={isLoading}
              onClick={onConfirmChange}
            >
              {t("template.save.default")}
            </ButtonPrimary>
          </StyledButtonGroup>
        }
      >
        <Input
          ref={inputRef}
          withBorder
          style={{ width: 300 }}
          onKeyDown={onEnter}
        />
      </Modal>
    </>
  );
};

export const SelectionFrameActions = ({
  focussedField,
  actions,
  translationFiles,
  contextParams,
}: ISelectionFrameActionsProps) => {
  const { t } = getTranslation({
    translationFiles,
    contextParams,
  } as EditorContextType);
  const [showMore, setShowMore] = useState(false);

  return (
    <SelectionFrameActionsContainer onClick={(e) => e.stopPropagation()}>
      <SelectionFrameActionsGroupButtons>
        <ButtonGhost
          icon={Icons.Duplicate}
          hideLabel
          onClick={() => actions.duplicateItems(focussedField)}
        >
          {t("duplicate")}
        </ButtonGhost>
        <ButtonGhost
          icon={Icons.Trash}
          hideLabel
          onClick={() => actions.removeItems(focussedField)}
        >
          {t("delete")}
        </ButtonGhost>
        <ButtonGhost
          icon={Icons.ArrowUp}
          hideLabel
          onClick={() => actions.moveItems(focussedField, "top")}
        >
          {t("up")}
        </ButtonGhost>
        <ButtonGhost
          icon={Icons.ArrowDown}
          hideLabel
          onClick={() => actions.moveItems(focussedField, "bottom")}
        >
          {t("down")}
        </ButtonGhost>

        <ButtonGhost
          icon={Icons.ThreeDotsHorizontal}
          showTooltip={false}
          hideLabel
          onClick={() => setShowMore((prev) => !prev)}
        />
      </SelectionFrameActionsGroupButtons>

      {showMore ? <SelectionMoreActions t={t} /> : null}
    </SelectionFrameActionsContainer>
  );
};
