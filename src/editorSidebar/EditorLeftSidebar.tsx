import { IThemeConfig } from "@redsun-vn/easyblocks-core";
import { Colors } from "@redsun-vn/easyblocks-design-system";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, { useMemo } from "react";
import styled from "styled-components";
import { TEasyblocksEditorMode, TLeftSidebar } from "../types";
import { useTranslation } from "../useTranslation";
import { EditorGlobalSections } from "./editorGlobalSections/EditorGlobalSections";
import { EditorLayer } from "./editorLayer/EditorLayer";
import { EditorSections } from "./editorSections/EditorSections";

interface TEditorLeftSidebar {
  showLeftSidebar: TLeftSidebar | null;
  globalSections: IThemeConfig["globalSections"];
  sidebarNodeRef?: React.MutableRefObject<HTMLDivElement | null>;
  editorMode: TEasyblocksEditorMode;
}

const EMPTY_SIDEBAR_CONFIG = {
  id: "no-config",
  title: "",
  enableScroll: true,
  width: "280px",
  padded: true,
  Component: null,
};

const StyledEditorLeftSidebarRoot = styled.div<{
  width?: string;
  enableScroll?: boolean;
}>`
  ${({ width = "240px" }) =>
    // max-width is what actually pins the size: it clamps a flex item's
    // automatic minimum, so a wide child can no longer stretch the panel and
    // move the canvas.
    `flex: 0 0 ${width}; width: ${width}; min-width: 0; max-width: ${width};`}
  position: relative;
  background: ${Colors.white};
  border-left: 1px solid ${Colors.black100};
  border-right: 1px solid ${Colors.black100};
  box-sizing: border-box;
  ${({ enableScroll = true }) => (enableScroll ? `overflow-y: auto;` : "")}

  > * {
    box-sizing: border-box;
  }
`;

const StyledEditorLeftSidebarTitle = styled(Typography)`
  line-height: 14px;
  font-weight: 700;
  padding: 17px 12px;
`;

const HorizontalLine = styled.div`
  height: 1px;
  margin-top: -1px;
  background-color: ${Colors.black10};
`;

/**
 * The body under a panel's title.
 *
 * Padded for the panels whose content starts with text. The section panels ask
 * for none: their search field is the first thing under the title and has to
 * sit against it, and the list below it owns its own scrolling.
 */
const StyledEditorLeftSidebarGroup = styled.div<{ padded?: boolean }>`
  ${({ padded = true }) =>
    padded ? "padding-top: 20px; padding-bottom: 20px;" : ""}
  min-height: 0;

  > div {
    min-height: 0;
  }
`;

export const EditorLeftSidebar = ({
  showLeftSidebar,
  globalSections,
  sidebarNodeRef,
  editorMode,
}: TEditorLeftSidebar) => {
  const { t } = useTranslation();

  const sidebarConfig = useMemo(() => {
    switch (showLeftSidebar) {
      case "global-sections": {
        // A shop owner reaches this panel too now. The rail button that opens
        // it is no longer hidden from them, so returning an empty panel here
        // would be a button that opens nothing.
        return {
          id: "editor-global-sections",
          title: t("editor.sidebar.globalSections"),
          width: "280px",
          enableScroll: true,
          padded: true,
          Component: <EditorGlobalSections globalSections={globalSections} />,
        };
      }

      case "layers": {
        return {
          id: "editor-layers",
          title: t("editor.sidebar.layers"),
          width: "280px",
          enableScroll: true,
          padded: true,
          Component: <EditorLayer />,
        };
      }

      // 280px rather than 200: a row now carries a thumbnail beside its name,
      // and at 200 the name it is there to identify was cut after two words.
      case "components": {
        return {
          id: "editor-components",
          title: t("editor.sidebar.sections.components"),
          width: "280px",
          enableScroll: false,
          padded: false,
          Component: <EditorSections panel="components" />,
        };
      }

      case "templates": {
        return {
          id: "editor-templates",
          title: t("editor.sidebar.sections.templates"),
          width: "280px",
          enableScroll: false,
          padded: false,
          Component: <EditorSections panel="templates" />,
        };
      }

      default: {
        return EMPTY_SIDEBAR_CONFIG;
      }
    }
  }, [showLeftSidebar, globalSections, editorMode]);

  return (
    <StyledEditorLeftSidebarRoot
      id={sidebarConfig.id}
      width={sidebarConfig.width}
      enableScroll={sidebarConfig.enableScroll}
      ref={sidebarNodeRef}
    >
      <StyledEditorLeftSidebarTitle>
        {sidebarConfig.title}
      </StyledEditorLeftSidebarTitle>

      <HorizontalLine />

      <StyledEditorLeftSidebarGroup padded={sidebarConfig.padded}>
        {sidebarConfig.Component}
      </StyledEditorLeftSidebarGroup>
    </StyledEditorLeftSidebarRoot>
  );
};
