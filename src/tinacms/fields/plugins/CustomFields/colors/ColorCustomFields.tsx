import { TokenValue } from "@redsun-vn/easyblocks-core";
import { Colors, Input } from "@redsun-vn/easyblocks-design-system";
import React, { useMemo } from "react";
import styled from "styled-components";
import { useEditorContext } from "../../../../../EditorContext";
import { TokenFieldProps } from "../../TokenField/TokenFieldPlugin";
import { Tooltip, TooltipArrow, TooltipBody } from "../../Tooltip";
import { useTooltip } from "../../useTooltip";

interface IFontCustomInputElement
  extends Omit<TokenFieldProps<TokenValue>, "meta"> {
  customValueTextFieldRef?: React.MutableRefObject<HTMLInputElement | null>;
}

export interface ICustomField {
  key: string;
  label: string;
  options?: { id: string; value: string; label: string }[];
  type: "string" | "number";
  inputType: "select" | "text";
  value?: string | number;
  defaultValue?: string | number;
}

const ColorCustomFieldsStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 6px;
`;

const ColorCustomFieldsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const InputStyle = styled(Input)`
  width: 100px;
  box-shadow: 0 0 0 1px ${Colors.black10};
  &:hover {
    box-shadow: 0 0 0 1px ${Colors.black20};
  }
  border-radius: 2px;
  cursor: pointer;
  outline: none;
`;

export const ColorCustomFields = ({ input }: IFontCustomInputElement) => {
  const editorContext = useEditorContext();
  const { isOpen, tooltipProps, triggerProps, arrowProps } = useTooltip();

  const currentValue = useMemo(
    () =>
      input.value?.value || input.value?.[editorContext.breakpointIndex]?.value,
    [input]
  );
  let changeColorId: NodeJS.Timeout;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(changeColorId);
    const color = event.target.value;

    changeColorId = setTimeout(() => {
      input.onChange({
        value: color,
        widgetId: undefined,
      });
    }, 300);
  };

  return (
    <ColorCustomFieldsStyle>
      <ColorCustomFieldsWrapper>
        <InputStyle
          type="color"
          defaultValue={currentValue}
          onChange={onChange}
          {...triggerProps}
        />

        {isOpen && (
          <Tooltip {...tooltipProps}>
            <TooltipArrow {...arrowProps} />
            <TooltipBody>{currentValue}</TooltipBody>
          </Tooltip>
        )}
      </ColorCustomFieldsWrapper>
    </ColorCustomFieldsStyle>
  );
};
