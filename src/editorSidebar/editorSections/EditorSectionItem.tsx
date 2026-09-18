import { Colors } from "@redsun-vn/easyblocks-design-system";
import React from "react";
import styled from "styled-components";
import { useTooltip } from "../../tinacms/fields/plugins/useTooltip";
import {
  Tooltip,
  TooltipArrow,
  TooltipBody,
} from "../../tinacms/fields/plugins/Tooltip";

/** What an entry in the section list stands for. */
export type TSectionItemKind = "builtin" | "template";

const StyledRow = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  max-width: 174px;
  cursor: pointer;
  border-radius: 2px;
  padding: 4px;
  ${({ selected }) => `${selected ? `background: ${Colors.black10};` : ""}`}
`;

const StyledEditorSectionName = styled.div`
  font-size: var(--tina-font-size-0);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

/**
 * One category row of a sidebar panel.
 *
 * Rows carry no icon: which of the two lists this is — components or templates
 * — is already said by the rail button that opened the panel and by the panel
 * title above, so a glyph on every row would repeat it once per line and eat
 * width the category names need.
 */
export const EditorSectionItem = ({
  id,
  name,
  selected,
  onSelectSection,
}: {
  id: string;
  selected: boolean;
  name: string;
  onSelectSection: (id: string) => void;
}) => {
  const { isOpen, tooltipProps, triggerProps, arrowProps } = useTooltip();

  return (
    <>
      <StyledRow
        id={id}
        selected={selected}
        onClick={() => onSelectSection(id)}
        {...triggerProps}
      >
        <StyledEditorSectionName>{name}</StyledEditorSectionName>
      </StyledRow>

      {isOpen && (
        <Tooltip {...tooltipProps}>
          <TooltipArrow {...arrowProps} />
          <TooltipBody>{name}</TooltipBody>
        </Tooltip>
      )}
    </>
  );
};
