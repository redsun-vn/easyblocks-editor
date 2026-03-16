import {
  Input,
  Select,
  SelectItem,
  SelectSeparator,
} from "@redsun-vn/easyblocks-design-system";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CUSTOM_OPTION_VALUE } from "../../../components/constants";
import { ICustomField } from "./FontCustomFields";

const Root = styled.div<{ isCustom: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  ${({ isCustom }) => isCustom && { width: "100%" }}
`;

export const FontCustomFieldInput = ({
  inputType = "text",
  options = [],
  customField,
  onChange,
}: {
  inputType?: "select" | "text";
  options?: { id: string; value: string; label: string }[];
  customField: ICustomField;
  onChange: (key: string, value: string | number, type: string) => void;
}) => {
  const customValueTextFieldRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>(
    customField?.value?.toString() ?? "",
  );
  const isCustomValue = options.every(
    (option) => String(option.value) !== String(inputValue),
  );
  const [isShowCustomValue, setIsShowCustomValue] = useState(isCustomValue);

  const shouldShowCustomValueInput =
    (isCustomValue || isShowCustomValue) && customField.allowCustom;

  useEffect(() => {
    setIsShowCustomValue(
      options.every(
        (option) => String(option.value) !== String(customField.value),
      ),
    );

    setInputValue(customField.value?.toString() ?? "");
  }, [customField.value]);

  const customInputElement = shouldShowCustomValueInput ? (
    <div style={{ width: "100%", textAlign: "end" }}>
      <div style={{ height: 4 }} />
      <Input
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
        }}
        onBlur={() => {
          onChange(customField.key, inputValue, customField.type);
        }}
        ref={customValueTextFieldRef}
        style={{ width: "100%" }}
        align={"right"}
      />
    </div>
  ) : null;

  switch (inputType) {
    case "text": {
      return (
        <Input
          value={customField.value ?? customField.defaultValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(customField.key, e.target.value, customField.type);
          }}
          align={"right"}
        />
      );
    }

    case "select": {
      return (
        <Root isCustom={isCustomValue}>
          <Select
            value={
              isCustomValue || isShowCustomValue
                ? CUSTOM_OPTION_VALUE
                : String(customField.value ?? customField.defaultValue)
            }
            onChange={(selectedValue) => {
              if (selectedValue !== CUSTOM_OPTION_VALUE) {
                onChange(customField.key, selectedValue, customField.type);
                setInputValue(selectedValue);
              } else {
                setIsShowCustomValue(true);
              }
            }}
          >
            {options.map((o) => {
              return (
                <SelectItem key={o.id} value={o.value}>
                  <div style={{ fontFamily: o.value }}>{o.label}</div>
                </SelectItem>
              );
            })}

            {customField?.allowCustom && (
              <>
                <SelectSeparator />
                <SelectItem value={CUSTOM_OPTION_VALUE}>Custom</SelectItem>
              </>
            )}
          </Select>
          {customInputElement}
        </Root>
      );
    }

    default: {
      break;
    }
  }
};
