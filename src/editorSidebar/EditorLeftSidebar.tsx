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
  Component: null,
};

const StyledEditorLeftSidebarRoot = styled.div<{
  width?: string;
  enableScroll?: boolean;
}>`
  ${({ width = "240px" }) =>
    // max-width is what actually pins the size: it clamps a flex item's
    // automatic minimum, so a wide child can no longer stretch the panel and
    // move the canvas. No overflow clipping here — the section drawer is
    // absolutely positioned outside this box and would be cut off.
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

const StyledEditorLeftSidebarGroup = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;

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
        if (editorMode === "user") {
          return EMPTY_SIDEBAR_CONFIG;
        }

        return {
          id: "editor-global-sections",
          title: t("editor.sidebar.globalSections"),
          width: "280px",
          enableScroll: true,
          Component: <EditorGlobalSections globalSections={globalSections} />,
        };
      }

      case "layers": {
        return {
          id: "editor-layers",
          title: t("editor.sidebar.layers"),
          width: "280px",
          enableScroll: true,
          Component: <EditorLayer />,
        };
      }

      case "components": {
        return {
          id: "editor-components",
          title: t("editor.sidebar.sections.components"),
          width: "200px",
          enableScroll: false,
          Component: <EditorSections panel="components" />,
        };
      }

      case "templates": {
        return {
          id: "editor-templates",
          title: t("editor.sidebar.sections.templates"),
          width: "200px",
          enableScroll: false,
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

      <StyledEditorLeftSidebarGroup>
        {sidebarConfig.Component}
      </StyledEditorLeftSidebarGroup>
    </StyledEditorLeftSidebarRoot>
  );
};
