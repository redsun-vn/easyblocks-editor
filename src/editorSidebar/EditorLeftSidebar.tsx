import { IThemeConfig } from "@redsun-vn/easyblocks-core";
import { Colors } from "@redsun-vn/easyblocks-design-system";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, { useMemo } from "react";
import styled from "styled-components";
import { TLeftSidebar } from "../types";
import { useTranslation } from "../useTranslation";
import { EditorGlobalSections } from "./editorGlobalSections/EditorGlobalSections";
import { EditorLayer } from "./editorLayer/EditorLayer";
import { EditorSections } from "./editorSections/EditorSections";

interface TEditorLeftSidebar {
  showLeftSidebar: TLeftSidebar | null;
  globalSections: IThemeConfig["globalSections"];
  sidebarNodeRef?: React.MutableRefObject<HTMLDivElement | null>;
}

const StyledEditorLeftSidebarRoot = styled.div<{
  width?: string;
  enableScroll?: boolean;
}>`
  ${({ width = "240px" }) => `flex: 0 0 ${width};`}
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
}: TEditorLeftSidebar) => {
  const { t } = useTranslation();

  const sidebarConfig = useMemo(() => {
    switch (showLeftSidebar) {
      case "global-sections": {
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

      case "sections": {
        return {
          id: "editor-sections",
          title: t("editor.sidebar.blocksAndSections"),
          width: "200px",
          enableScroll: false,
          Component: <EditorSections />,
        };
      }

      default: {
        return {
          id: "no-config",
          title: "",
          enableScroll: true,
          width: "280px",
          Component: null,
        };
      }
    }
  }, [showLeftSidebar]);

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
