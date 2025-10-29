import { ContextParams } from "@redsun-vn/easyblocks-core";
import {
  ButtonGhost,
  Colors,
  Icons,
} from "@redsun-vn/easyblocks-design-system";
import React from "react";
import styled from "styled-components";
import { EditorContextType } from "../EditorContext";
import {
  BEFORE_ADD_BUTTON_DISPLAY,
  BEFORE_ADD_BUTTON_LEFT,
  BEFORE_ADD_BUTTON_TOP,
} from "../selectionFrame/cssVariables";
import { ActionsType } from "../types";
import { getTranslation } from "../useTranslation";

interface ISelectionFrameActionsProps {
  focussedField: string[];
  actions: ActionsType;
  translationFiles: { [key: string]: any };
  contextParams: ContextParams;
}

const SelectionFrameActionsContainer = styled.div`
  position: absolute;
  top: calc(var(${BEFORE_ADD_BUTTON_TOP}) - 50px);
  left: var(${BEFORE_ADD_BUTTON_LEFT});
  border-radius: 4px;
  box-shadow: var(--tina-shadow-big);
  display: var(${BEFORE_ADD_BUTTON_DISPLAY}, none);
  padding: 5px 10px;
  width: max-content;
  background: ${Colors.white};
  pointer-events: all;
`;

const SelectionFrameActionsGroupButtons = styled.div`
  display: flex;
  gap: 2px;
`;

export const SelectionFrameActions = ({
  focussedField,
  actions,
  translationFiles,
  contextParams,
}: ISelectionFrameActionsProps) => {
  const { t } = getTranslation({
    translationFiles,
    contextParams,
  } as EditorContextType);

  return (
    <SelectionFrameActionsContainer onClick={(e) => e.stopPropagation()}>
      <SelectionFrameActionsGroupButtons>
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
          {t("up")}
        </ButtonGhost>
        <ButtonGhost
          icon={Icons.ArrowDown}
          hideLabel
          onClick={() => actions.moveItems(focussedField, "bottom")}
        >
          {t("down")}
        </ButtonGhost>
      </SelectionFrameActionsGroupButtons>
    </SelectionFrameActionsContainer>
  );
};
