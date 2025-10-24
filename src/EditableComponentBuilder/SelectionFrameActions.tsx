import { ContextParams } from "@redsun-vn/easyblocks-core";
import {
  ButtonGhost,
  Colors,
  Icons,
} from "@redsun-vn/easyblocks-design-system";
import throttle from "lodash/throttle";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { EditorContextType } from "../EditorContext";
import { ActionsType } from "../types";
import { getTranslation } from "../useTranslation";

interface ISelectionFrameActionsProps {
  focussedField: string[];
  actions: ActionsType;
  translationFiles: { [key: string]: any };
  contextParams: ContextParams;
}

interface ISelectionFrameActionsContainer {
  positionX: "left" | "right";
  positionY: "top" | "bottom";
}

const SelectionFrameActionsContainer = styled.div<ISelectionFrameActionsContainer>`
  position: absolute;
  top: ${({ positionY }) => (positionY === "top" ? "-44px" : "unset")};
  bottom: ${({ positionY }) => (positionY === "bottom" ? "-44px" : "unset")};
  right: ${({ positionX }) => (positionX === "right" ? "0px" : "unset")};
  left: ${({ positionX }) => (positionX === "left" ? "0px" : "unset")};
  gap: 2px;
  border-radius: 4px;
  box-shadow: var(--tina-shadow-big);
  display: flex;
  padding: 6px 12px;
  width: max-content;
  background: ${Colors.white};
  z-index: 1;
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
  const [currentPlacement, setCurrentPlacement] =
    useState<ISelectionFrameActionsContainer>({
      positionX: "right",
      positionY: "top",
    });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function calculatePosition() {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();

      // Calculate position top bottom
      if (rect.top < 0 && currentPlacement.positionY === "top") {
        setCurrentPlacement((prev) => ({ ...prev, positionY: "bottom" }));
      } else if (
        rect.bottom > window.innerHeight &&
        currentPlacement.positionY === "bottom"
      ) {
        setCurrentPlacement((prev) => ({ ...prev, positionY: "top" }));
      }

      // Calculate position left right
      if (rect.left < 0 && currentPlacement.positionX === "right") {
        setCurrentPlacement((prev) => ({ ...prev, positionX: "left" }));
      } else if (
        rect.right > window.innerWidth &&
        currentPlacement.positionX === "left"
      ) {
        setCurrentPlacement((prev) => ({ ...prev, positionX: "right" }));
      }
    }

    const throttled = throttle(calculatePosition, 100);

    calculatePosition();

    window.addEventListener("scroll", throttled);
    window.addEventListener("resize", throttled);

    return () => {
      window.removeEventListener("scroll", throttled);
      window.removeEventListener("resize", throttled);
    };
  }, [currentPlacement, focussedField]);

  return (
    <SelectionFrameActionsContainer {...currentPlacement} ref={triggerRef}>
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
    </SelectionFrameActionsContainer>
  );
};
