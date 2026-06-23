import { Colors } from "@redsun-vn/easyblocks-design-system";
import React from "react";
import styled from "styled-components";
import { useTooltip } from "../../tinacms/fields/plugins/useTooltip";
import {
  Tooltip,
  TooltipArrow,
  TooltipBody,
} from "../../tinacms/fields/plugins/Tooltip";

const StyledEditorSectionName = styled.div<{ hovered: boolean }>`
  font-size: var(--tina-font-size-0);
  display: block;
  max-width: 240px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  border-radius: 2px;
  padding: 4px;
  ${({ hovered }) => `${hovered ? `background: ${Colors.black10};` : ""}`}
`;

export const EditorSectionItem = ({
  id,
  name,
  hovered,
  onHoverSection,
}: {
  id: string;
  hovered: boolean;
  name: string;
  onHoverSection: (id: string) => void;
}) => {
  const { isOpen, tooltipProps, triggerProps, arrowProps } = useTooltip();

  return (
    <>
      <StyledEditorSectionName
        id={id}
        hovered={hovered}
        onMouseEnter={() => onHoverSection(id)}
        {...triggerProps}
      >
        {name}
      </StyledEditorSectionName>

      {isOpen && (
        <Tooltip {...tooltipProps}>
          <TooltipArrow {...arrowProps} />
          <TooltipBody>{name}</TooltipBody>
        </Tooltip>
      )}
    </>
  );
};
