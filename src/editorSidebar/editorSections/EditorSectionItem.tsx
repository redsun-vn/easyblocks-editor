import { Colors } from "@redsun-vn/easyblocks-design-system";
import { Icons } from "@redsun-vn/easyblocks-design-system/icons";
import React from "react";
import styled from "styled-components";
import { useTooltip } from "../../tinacms/fields/plugins/useTooltip";
import {
  Tooltip,
  TooltipArrow,
  TooltipBody,
} from "../../tinacms/fields/plugins/Tooltip";

/** What an entry in the section list stands for, which also picks its icon. */
export type TSectionItemKind = "builtin" | "template";

/**
 * Template glyph: a framed page with a header band, drawn locally rather than
 * taken from the design system.
 *
 * The design system has no "template" icon, and adding one there would not help
 * here: this package resolves `@redsun-vn/easyblocks-design-system` from an
 * installed git build, so a new export only becomes visible after that package
 * is published — which the release rules for this change forbid. The three
 * existing candidates are all taken: `Master` is a four-diamond cluster that
 * reads as "component", while `Duplicate` and `LayerGroup` already mean
 * "duplicate this block" and "select the parent block" on the block toolbar.
 */
const TemplateIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x="2.5"
      y="2.5"
      width="11"
      height="11"
      rx="1.5"
      stroke="currentColor"
    />
    <path d="M2.5 6.5H13.5" stroke="currentColor" />
    <path d="M6.5 6.5V13.5" stroke="currentColor" />
  </svg>
);

const StyledRow = styled.div<{ hovered: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 174px;
  cursor: pointer;
  border-radius: 2px;
  padding: 4px;
  ${({ hovered }) => `${hovered ? `background: ${Colors.black10};` : ""}`}
`;

// Fixed box so labels line up whichever icon a row carries.
const StyledIcon = styled.span`
  flex: 0 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${Colors.black40};
`;

const StyledEditorSectionName = styled.div`
  font-size: var(--tina-font-size-0);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const EditorSectionItem = ({
  id,
  name,
  kind = "builtin",
  hovered,
  onHoverSection,
}: {
  id: string;
  hovered: boolean;
  name: string;
  /**
   * Built-in components get `+`, templates get the template glyph. Defaults to
   * the built-in icon so an older caller that predates the split still renders.
   */
  kind?: TSectionItemKind;
  onHoverSection: (id: string) => void;
}) => {
  const { isOpen, tooltipProps, triggerProps, arrowProps } = useTooltip();

  return (
    <>
      <StyledRow
        id={id}
        hovered={hovered}
        onMouseEnter={() => onHoverSection(id)}
        {...triggerProps}
      >
        <StyledIcon>
          {kind === "builtin" ? <Icons.Add size={16} /> : <TemplateIcon />}
        </StyledIcon>
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
