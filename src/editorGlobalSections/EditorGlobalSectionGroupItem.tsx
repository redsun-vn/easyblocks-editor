import { NoCodeComponentEntry } from "@redsun-vn/easyblocks-core";
import {
  Colors,
  Icons,
  Loader,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Typography,
  useToaster,
} from "@redsun-vn/easyblocks-design-system";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Menu } from "../menu/Menu";
import { useTranslation } from "../useTranslation";
import { useEditorContext } from "../EditorContext";

const StyledEditorGlobalSectionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
  height: 38px;
`;

const StyledWrapperMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StyledWrapperCheckIcon = styled.div`
  cursor: pointer;
`;

const StyledWrapperThreeDotsIcon = styled.div`
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
  }
`;

const StyledWrapperMenuDialog = styled.div`
  position: absolute;
  top: 20px;
  right: 0px;
  z-index: 1;
`;

const StyledWrapperAddToPage = styled(Typography)<{ disabled: boolean }>`
  font-weight: 500;
  cursor: pointer;
  color: ${Colors.blue60};

  ${({ disabled }) =>
    disabled
      ? `
    cursor: not-allowed;
    user-select: none;
    opacity: 0.7;
    `
      : `
      &:hover {
        color: ${Colors.blue50};
      }`}
`;

const StyledWrapperLabel = styled.div`
  width: 140px;
`;

const StyledLabel = styled(Typography)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const EditorGlobalSectionGroupItem = ({
  group,
  groupItem,
  setOpenConfirm,
  setOpenEditSection,
}: {
  group: {
    id: string;
    name: string;
  };
  groupItem: {
    id: string;
    component: string;
    label: string;
    pages: string[];
    entry?: NoCodeComponentEntry;
  };
  setOpenConfirm: React.Dispatch<
    React.SetStateAction<{
      entryId: string;
      groupName: string;
    } | null>
  >;
  setOpenEditSection: React.Dispatch<
    React.SetStateAction<{
      label: string;
      entry: NoCodeComponentEntry;
      groupName: string;
    } | null>
  >;
}) => {
  const editorContext = useEditorContext();
  const router = new URLSearchParams(window.location.search);
  const currentDocument = router.get("document") ?? "";
  const { t } = useTranslation();
  const toaster = useToaster();
  const menuRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState<{ entryId: string } | null>(null);
  const [isLoadingAddToPage, setIsLoadingAddToPage] = useState(false);

  const isAddedToPage = groupItem.pages.includes(currentDocument);

  const onOpenMenu = (entryId: string) => {
    setOpenMenu({ entryId });
  };

  const onCloseMenu = () => {
    setOpenMenu(null);
  };

  const onAddToPage = () => {
    const targetEntry = groupItem.entry;

    if (targetEntry && Object.keys(targetEntry).length && !isLoadingAddToPage) {
      let index = 0;

      switch (group.name) {
        case "Headers": {
          index = 0;
          break;
        }

        case "Footers": {
          index =
            (editorContext.compiledComponentConfig?.components.data.length ??
              0) + 1;
          break;
        }

        default:
          break;
      }

      editorContext.actions.insertItem({
        index,
        block: targetEntry,
        name: "data",
        keepId: true,
      });

      setIsLoadingAddToPage(true);

      editorContext
        .onGlobalSectionChange?.({
          mode: "update",
          pages: [...new Set([...groupItem.pages, currentDocument])],
          groupName: group.name,
          entry: targetEntry,
        })
        .then(() => {
          toaster.success(t("topBar.saved"));
        })
        .catch((reason) => {
          toaster.error(reason);
        })
        .finally(() => {
          setIsLoadingAddToPage(false);
        });
    }
  };

  useEffect(() => {
    const modalContainer = document.getElementById("modalContainer");

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !modalContainer?.contains(event.target as Node) &&
        openMenu?.entryId
      ) {
        onCloseMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  return (
    <StyledEditorGlobalSectionItem>
      <Tooltip>
        <TooltipTrigger>
          <StyledWrapperLabel>
            <StyledLabel>{groupItem.label}</StyledLabel>
          </StyledWrapperLabel>
        </TooltipTrigger>

        <TooltipContent>
          <Typography color="white">{groupItem.label}</Typography>
        </TooltipContent>
      </Tooltip>

      <StyledWrapperMenu ref={menuRef}>
        {isAddedToPage ? (
          <StyledWrapperCheckIcon>
            <Icons.Check size={16} />
          </StyledWrapperCheckIcon>
        ) : (
          <StyledWrapperAddToPage
            disabled={!groupItem.entry}
            onClick={onAddToPage}
          >
            {isLoadingAddToPage ? (
              <Loader />
            ) : (
              t("editor.sidebar.globalSections.addToPage")
            )}
          </StyledWrapperAddToPage>
        )}

        <StyledWrapperThreeDotsIcon onClick={() => onOpenMenu(groupItem.id)}>
          <Icons.ThreeDotsHorizontal size={16} />
        </StyledWrapperThreeDotsIcon>

        {openMenu && openMenu.entryId === groupItem.id ? (
          <StyledWrapperMenuDialog>
            <Menu
              menus={[
                {
                  id: `delete-section-${groupItem.id}`,
                  label: t("delete"),
                  onClick: () => {
                    setOpenConfirm({
                      entryId: groupItem.id,
                      groupName: group.name,
                    });
                  },
                },
                {
                  id: `rename-section-${groupItem.id}`,
                  label: t("rename"),
                  onClick: () => {
                    setOpenEditSection({
                      label: groupItem.label,
                      entry: {
                        _id: groupItem.id,
                        _component: groupItem.component,
                      },
                      groupName: group.name,
                    });
                  },
                },
              ]}
            />
          </StyledWrapperMenuDialog>
        ) : null}
      </StyledWrapperMenu>
    </StyledEditorGlobalSectionItem>
  );
};
