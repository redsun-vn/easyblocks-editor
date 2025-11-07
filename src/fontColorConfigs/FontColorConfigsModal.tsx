import { Colors, Fonts, Modal } from "@redsun-vn/easyblocks-design-system";
import React, { useState } from "react";
import styled from "styled-components";
import { useEditorContext } from "../EditorContext";
import { useTranslation } from "../useTranslation";
import { ColorConfigurations } from "./ColorConfigurations";
import { FontConfigurations } from "./FontConfigurations";

type IFontColorConfigsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange?: () => Promise<void>;
};

const ModalRoot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 200px 1fr;
  overflow: hidden;
`;

const Sidebar = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  border-right: 1px solid ${Colors.black5};
  height: 100%;
`;

const Content = styled.div`
  padding: 1rem;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
`;

const SidebarContent = styled.div`
  padding: 24px 4px;
  display: flex;
  flex-direction: column;
`;

const SidebarButton = styled.button<{ isActive: boolean }>`
  all: unset;
  height: 38px;
  ${Fonts.body}
  display: flex;
  padding-left: 16px;
  align-items: center;
  &:hover {
    background: ${Colors.black5};
  }
  background: ${({ isActive }) => (isActive ? `${Colors.black5}` : "")};
  cursor: pointer;
`;

export const FontColorConfigsModal: React.FC<IFontColorConfigsModalProps> = ({
  isOpen,
  onConfigChange,
  onClose,
}) => {
  const { t } = useTranslation();
  const sidebarContents = [
    {
      id: "typography",
      title: t("editor.sidebar.typography"),
      content: FontConfigurations,
    },
    {
      id: "color",
      title: t("editor.sidebar.color"),
      content: ColorConfigurations,
    },
  ];

  const editorContext = useEditorContext();
  const [activeSidebar, setActiveSidebar] = useState<string>(
    sidebarContents[0].id
  );

  const activeTitle = sidebarContents.find(
    (sidebarContent) => sidebarContent.id === activeSidebar
  )?.title;

  const ActiveContent = sidebarContents.find(
    (sidebarContent) => sidebarContent.id === activeSidebar
  )?.content;

  return (
    <Modal
      title={activeTitle}
      isOpen={isOpen}
      onRequestClose={onClose}
      mode="center-huge"
      headerLine={true}
    >
      <ModalRoot>
        <Sidebar>
          <SidebarContent>
            {sidebarContents.map((sidebarContent) => (
              <SidebarButton
                key={sidebarContent.id}
                onClick={() => setActiveSidebar(sidebarContent.id)}
                isActive={activeSidebar === sidebarContent.id}
              >
                {sidebarContent.title}
              </SidebarButton>
            ))}
          </SidebarContent>
        </Sidebar>

        <Content>
          {ActiveContent ? (
            <ActiveContent
              editorContext={editorContext}
              onConfigChange={onConfigChange}
            />
          ) : null}
        </Content>
      </ModalRoot>
    </Modal>
  );
};
