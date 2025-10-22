import React from "react";
import { css, styled } from "styled-components";
import { useTooltip } from "../tinacms/fields/plugins/useTooltip";
import { ICON_BUTTON_SIZE, IconButton } from "../tinacms/styles";
import {
  AFTER_ADD_BUTTON_DISPLAY,
  AFTER_ADD_BUTTON_LEFT,
  AFTER_ADD_BUTTON_TOP,
  BEFORE_ADD_BUTTON_DISPLAY,
  BEFORE_ADD_BUTTON_LEFT,
  BEFORE_ADD_BUTTON_TOP,
} from "./cssVariables";
import {
  Tooltip,
  TooltipArrow,
  TooltipBody,
} from "../tinacms/fields/plugins/Tooltip";
import { useTranslation } from "../useTranslation";

interface AddButtonProps {
  position: "before" | "after";
  index?: number;
  offset?: number | { x: number; y: number };
  onClick?: () => void;
}

function AddButton({ position, index, offset, onClick }: AddButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const addBlockButtonRef = React.useRef<HTMLButtonElement>(null);
  const {
    isOpen: isOpenTooltip,
    tooltipProps,
    triggerProps,
    arrowProps,
  } = useTooltip();
  const { t } = useTranslation();

  const handleOpenBlockMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    // Custom add action
    if (onClick) {
      onClick();
      return;
    }
  };

  React.useEffect(() => {
    const inactivateBlockMenu = () => setIsOpen(false);
    document.addEventListener("mouseup", inactivateBlockMenu, false);
    return () => document.removeEventListener("mouseup", inactivateBlockMenu);
  }, []);

  return (
    <AddButtonWrapper
      index={index}
      offset={offset}
      position={position}
      isOpen={isOpen}
      {...triggerProps}
    >
      {isOpenTooltip && (
        <Tooltip {...tooltipProps}>
          <TooltipArrow {...arrowProps} />
          <TooltipBody>{t("tooltip.add.section.blocks")}</TooltipBody>
        </Tooltip>
      )}
      <AddIconButton
        ref={addBlockButtonRef}
        onClick={handleOpenBlockMenu}
        isOpen={isOpen}
        primary
        small
      >
        <svg
          strokeWidth="3"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 23 23"
          fill="none"
        >
          <line x1="11.5" y1="4" x2="11.5" y2="19" stroke="currentColor" />
          <line x1="4" y1="11.5" x2="19" y2="11.5" stroke="currentColor" />
        </svg>
      </AddIconButton>
    </AddButtonWrapper>
  );
}

export { ICON_BUTTON_SIZE as ADD_BUTTON_SIZE, AddButton };

interface AddMenuProps {
  isOpen?: boolean;
  active?: boolean;
  openTop?: boolean;
}

const AddIconButton = styled(IconButton)<AddMenuProps>`
  display: flex;
  align-items: center;

  &:focus {
    outline: none !important;
  }

  ${(props) =>
    props.isOpen &&
    css`
      pointer-events: none;
    `};
`;

interface AddButtonWrapperProps {
  index?: number;
  offset?: number | { x: number; y: number };
  position: "before" | "after";
  isOpen: boolean;
}

const AddButtonWrapper = styled.div<AddButtonWrapperProps>`
  position: absolute;

  top: var(
    ${({ position }) =>
      position === "before" ? BEFORE_ADD_BUTTON_TOP : AFTER_ADD_BUTTON_TOP}
  );
  left: var(
    ${({ position }) =>
      position === "before" ? BEFORE_ADD_BUTTON_LEFT : AFTER_ADD_BUTTON_LEFT}
  );

  display: var(
    ${({ position }) =>
      position === "before"
        ? BEFORE_ADD_BUTTON_DISPLAY
        : AFTER_ADD_BUTTON_DISPLAY},
    none
  );

  pointer-events: all;

  &:hover {
    transform: scale(1.2);
    transition: transform 0.1s ease-in-out;
  }
`;
