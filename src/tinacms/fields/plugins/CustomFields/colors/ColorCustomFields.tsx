import { TokenValue } from "@redsun-vn/easyblocks-core";
import { Input, InputColor } from "@redsun-vn/easyblocks-design-system";
import React, { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useEditorContext } from "../../../../../EditorContext";
import { TokenFieldProps } from "../../TokenField/TokenFieldPlugin";

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
  gap: 10px;
`;

const InputStyle = styled(InputColor)`
  width: 100%;
  height: 100%;
`;

const InputStyleWrapper = styled.div`
  width: 100px;
  height: 20px;
`;

export const ColorCustomFields = ({ input }: IFontCustomInputElement) => {
  const editorContext = useEditorContext();
  const inputColorRef = useRef<HTMLInputElement | null>(null);

  const currentValue = useMemo(
    () =>
      input.value?.value || input.value?.[editorContext.breakpointIndex]?.value,
    [input]
  );
  let changeColorId: NodeJS.Timeout;

  const onChange = (color: string) => {
    clearTimeout(changeColorId);

    changeColorId = setTimeout(() => {
      input.onChange({
        value: color,
        widgetId: undefined,
      });
    }, 300);
  };

  useEffect(() => {
    if (inputColorRef.current && inputColorRef.current.value) {
      inputColorRef.current.value = currentValue;
    }
  }, [currentValue]);

  return (
    <ColorCustomFieldsStyle>
      <ColorCustomFieldsWrapper>
        <Input
          ref={inputColorRef}
          defaultValue={currentValue}
          onChange={(event) => onChange(event.target.value)}
        />

        <InputStyleWrapper>
          <InputStyle value={currentValue} onChange={onChange} />
        </InputStyleWrapper>
      </ColorCustomFieldsWrapper>
    </ColorCustomFieldsStyle>
  );
};
