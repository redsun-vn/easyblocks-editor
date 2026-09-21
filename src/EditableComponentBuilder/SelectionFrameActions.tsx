import { EditorContextType, useEditorContext } from "@/EditorContext";
import { shiftPath } from "@/editorActions";
import { IMenu, Menu } from "@/menu/Menu";
import { destinationResolver } from "@/paste/destinationResolver";
import { pasteManager } from "@/paste/manager";
import {
  SELECTION_ACTIONS_DISPLAY,
  SELECTION_ACTIONS_LEFT,
  SELECTION_ACTIONS_TOP,
} from "@/selectionFrame/cssVariables";
import { ActionsType, TEasyblocksEditorMode } from "@/types";
import { getTranslation } from "@/useTranslation";
import { dotNotationGet } from "@/utils/object/dotNotationGet";
import { getComponentLabel } from "@/utils/selection/canvasSelectionPaths";
import { uniqueId } from "@/utils/uniqueId";
import {
  ContextParams,
  NoCodeComponentEntry,
  globalSectionGroups,
} from "@redsun-vn/easyblocks-core";
import {
  duplicateConfig,
  parsePath,
} from "@redsun-vn/easyblocks-core/_internals";
import { Colors } from "@redsun-vn/easyblocks-design-system";
import {
  ButtonGhost,
  ButtonPrimary,
  ButtonSecondary,
} from "@redsun-vn/easyblocks-design-system/buttons";
import { Icons } from "@redsun-vn/easyblocks-design-system/icons";
import { Input } from "@redsun-vn/easyblocks-design-system/Input";
import { Modal } from "@redsun-vn/easyblocks-design-system/modals";
import { useToaster } from "@redsun-vn/easyblocks-design-system/Toaster";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

export interface MovePlan {
  /** Where the source block sits once the copy has been inserted. */
  sourceToRemove: string;
  /** Where the inserted block sits once the source has been removed. */
  pathToFocus: string;
}

/**
 * Moving a block is an insert followed by a remove, and each of those shifts the indices of
 * everything after it in the same collection. Replaying those shifts is what makes the block
 * that gets removed the original one rather than a neighbour that slid into its place.
 *
 * The insert happens first on purpose: if no collection in the chosen section accepts the
 * block the document is simply left alone, whereas removing first would destroy it.
 */
export function planMoveAfterInsert(
  sourcePath: string,
  insertedPath: string,
): MovePlan {
  const sourceToRemove = shiftPath(sourcePath, insertedPath, "downward");

  return {
    sourceToRemove,
    pathToFocus: shiftPath(insertedPath, sourceToRemove, "upward"),
  };
}

interface ISelectionFrameActionsProps {
  focussedField: string[];
  actions: ActionsType;
  translationFiles: { [key: string]: any };
  contextParams: ContextParams;
  editorMode: TEasyblocksEditorMode;
}

/**
 * Hangs off the block's top-left corner, from its own position.
 *
 * It used to read the add button's, which is the middle of the block's top
 * edge. That is right for a 24px circle and wrong for a bar six buttons wide:
 * the bar hung from the middle and covered the content above the middle, which
 * is the part of the page the author was most likely reading. The corner is
 * where a bar like this belongs, and `calculateActionsPosition` keeps it inside
 * the canvas and flips it when there is no room above.
 */
const SelectionFrameActionsContainer = styled.div`
  position: absolute;
  top: var(${SELECTION_ACTIONS_TOP});
  left: var(${SELECTION_ACTIONS_LEFT});
  border-radius: 4px;
  box-shadow: var(--tina-shadow-big);
  display: var(${SELECTION_ACTIONS_DISPLAY}, none);
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
  display: var(${SELECTION_ACTIONS_DISPLAY}, none);
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
    (globalSections) =>
      Object.keys(globalSections?.entities ?? {}).includes(currentEntry._id),
  );

  const onRemoveGlobalSection = () => {
    const currentSection = Object.entries(
      editorContext?.globalSections ?? {},
    ).find(([_, groupValue]) =>
      Object.keys(groupValue?.entities ?? {}).includes(currentEntry._id),
    );

    const groupName = currentSection?.[0];

    if (groupName) {
      setIsLoading(true);
      editorContext
        .onGlobalSectionChange?.({
          mode: "update",
          pages: currentSection?.[1].entities[currentEntry._id].pages.filter(
            (page) => page !== currentDocument,
          ),
          label: currentSection?.[1].entities[currentEntry._id].label,
          groupName,
          entry: currentEntry,
        })
        .then(() => {
          toaster.success(
            `${t("editor.sidebar.globalSections.removeGlobal.success")} ${t("saveBeforeExit")}`,
            { duration: 5000 },
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

  const onConfirmSetGlobalSection = () => {
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
        toaster.success(
          `${t("editor.sidebar.globalSections.setGlobal.success")} ${t("saveBeforeExit")}`,
          { duration: 5000 },
        );
        onClose();
      })
      .catch((reason) => {
        setIsLoading(false);
        toaster.error(reason);
      });
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault();
      e.stopPropagation();
      onConfirmSetGlobalSection();
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
              onClick={onConfirmSetGlobalSection}
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
  editorMode,
}: ISelectionFrameActionsProps) => {
  const { t } = getTranslation({
    translationFiles,
    contextParams,
  } as EditorContextType);
  const [showMore, setShowMore] = useState(false);
  const [showMoveTo, setShowMoveTo] = useState(false);
  const editorContext = useEditorContext();
  const toaster = useToaster();

  // Moving carries one block: the block is inserted into the chosen section and removed from
  // where it was, and a multi-selection has no single source path to remove. Several blocks
  // are still moved together with cut and paste.
  const sourcePath =
    focussedField.length === 1 ? focussedField[0] : undefined;

  const moveTo = (destinationPath: string) => {
    setShowMoveTo(false);

    if (!sourcePath) {
      return;
    }

    const sourceEntry: NoCodeComponentEntry | undefined = dotNotationGet(
      editorContext.form.values,
      sourcePath,
    );

    if (!sourceEntry) {
      return;
    }

    const block = duplicateConfig(sourceEntry, editorContext);
    let wasRejected = false;

    editorContext.actions.runChange(() => {
      const insertedPath = pasteManager()(
        destinationResolver({
          form: editorContext.form,
          context: editorContext,
        })(destinationPath),
      )(block);

      if (!insertedPath) {
        // Nothing in the chosen section accepts this block, so the document is untouched.
        wasRejected = true;
        return [sourcePath];
      }

      const { sourceToRemove, pathToFocus } = planMoveAfterInsert(
        sourcePath,
        insertedPath,
      );

      editorContext.actions.removeItems([sourceToRemove]);

      return [pathToFocus];
    });

    if (wasRejected) {
      toaster.error(t("editor.canvas.action.moveTo.rejected"));
    }
  };

  // Every other top level section is offered as a destination. The section the block is
  // already in, and any section inside the block itself, are not destinations.
  const moveDestinations: IMenu[] = useMemo(() => {
    if (!sourcePath) {
      return [];
    }

    const sections = (editorContext.form.values?.data ??
      []) as Array<NoCodeComponentEntry>;

    return sections
      .map((_, index) => `data.${index}`)
      .filter(
        (destinationPath) =>
          destinationPath !== sourcePath &&
          !destinationPath.startsWith(`${sourcePath}.`) &&
          !sourcePath.startsWith(`${destinationPath}.`),
      )
      .map((destinationPath, _, all) => ({
        id: destinationPath,
        // Sections repeat, so the position disambiguates two blocks with the same name.
        label: `${all.indexOf(destinationPath) + 1}. ${getComponentLabel(
          parsePath(destinationPath, editorContext.form).templateId,
          editorContext,
          t,
        )}`,
        onClick: () => moveTo(destinationPath),
      }));
  }, [sourcePath, editorContext.form.values, t]);

  return (
    <SelectionFrameActionsContainer onClick={(e) => e.stopPropagation()}>
      <SelectionFrameActionsGroupButtons>
        {/*
          No "select parent" here. The breadcrumb under the canvas does the same
          job and does it better: it is a button per ancestor rather than one
          step at a time, it says where each step lands, it is always on screen,
          and it covers nothing. Two controls for one job, one of them worse,
          is a button's worth of bar for nothing.
        */}
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
          {t("editor.canvas.action.moveUp")}
        </ButtonGhost>
        <ButtonGhost
          icon={Icons.ArrowDown}
          hideLabel
          onClick={() => actions.moveItems(focussedField, "bottom")}
        >
          {t("editor.canvas.action.moveDown")}
        </ButtonGhost>
        {moveDestinations.length > 0 && (
          <ButtonGhost
            // Not the drag grip, although it used to wear its icon: this opens a
            // list of destinations. The grip lives on the block frame, and two
            // controls that look alike is how people ended up dragging this one.
            icon={Icons.ArrowRight}
            hideLabel
            onClick={() => setShowMoveTo((prev) => !prev)}
          >
            {t("editor.canvas.action.moveTo")}
          </ButtonGhost>
        )}

        {editorMode !== "admin-template" && (
          <ButtonGhost
            icon={Icons.ThreeDotsHorizontal}
            showTooltip={false}
            hideLabel
            onClick={() => setShowMore((prev) => !prev)}
          />
        )}
      </SelectionFrameActionsGroupButtons>

      {showMoveTo && moveDestinations.length > 0 ? (
        <StyledMenu>
          <Menu menus={moveDestinations} styles={{ top: "40px", left: "0%" }} />
        </StyledMenu>
      ) : null}

      {editorMode !== "admin-template" && showMore ? (
        <SelectionMoreActions t={t} />
      ) : null}
    </SelectionFrameActionsContainer>
  );
};
