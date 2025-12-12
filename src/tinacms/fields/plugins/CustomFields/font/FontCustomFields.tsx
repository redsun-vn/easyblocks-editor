import {
  defaultFontFamily,
  defaultFontSize,
  defaultFontWeight,
  defaultLineHeight,
  getFontFamilies,
  getFontSizes,
  getFontWeights,
  getLineHeights,
  TokenValue,
} from "@redsun-vn/easyblocks-core";
import { Fonts } from "@redsun-vn/easyblocks-design-system";
import React, { useMemo } from "react";
import styled from "styled-components";
import { useEditorContext } from "../../../../../EditorContext";
import { useTranslation } from "../../../../../useTranslation";
import { TokenFieldProps } from "../../TokenField/TokenFieldPlugin";
import { Tooltip, TooltipArrow, TooltipBody } from "../../Tooltip";
import { useTooltip } from "../../useTooltip";
import { FontCustomFieldInput } from "./FontCustomFieldInput";

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

const FieldLabel = styled.label`
  all: unset;
  ${Fonts.body};
  color: #000;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: default;
`;

const FontCustomFieldsStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 6px;
`;

export const FontCustomField = ({
  customField,
  onChange,
}: {
  type?: "select" | "text";
  options?: { id: string; value: string; label: string }[];
  customField: ICustomField;
  onChange: (key: string, value: string | number, type: string) => void;
  [key: string]: any;
}) => {
  const { isOpen, tooltipProps, triggerProps, arrowProps } = useTooltip();

  return (
    <div
      key={customField.key}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <FieldLabel {...triggerProps}>
        <span
          style={{
            lineHeight: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {customField.label}
        </span>
        {isOpen && (
          <Tooltip {...tooltipProps}>
            <TooltipArrow {...arrowProps} />
            <TooltipBody>{customField.label}</TooltipBody>
          </Tooltip>
        )}
      </FieldLabel>

      <FontCustomFieldInput
        inputType={customField.inputType}
        options={customField.options}
        customField={customField}
        onChange={onChange}
      />
    </div>
  );
};

export const FontCustomFields = ({ input, field }: IFontCustomInputElement) => {
  const { t } = useTranslation();
  const editorContext = useEditorContext();
  const normalizeCustomValue = field.normalizeCustomValue || ((x: string) => x);
  const customFields: ICustomField[] = useMemo(
    () => [
      {
        key: "fontFamily",
        label: t("definition.schema.label.fontFamily"),
        options: getFontFamilies(),
        type: "string",
        inputType: "select",
        defaultValue: defaultFontFamily,
      },
      {
        key: "fontSize",
        label: t("definition.schema.label.fontSize"),
        type: "number",
        options: getFontSizes(editorContext),
        inputType: "select",
        defaultValue: defaultFontSize,
      },
      {
        key: "fontWeight",
        label: t("definition.schema.label.fontWeight"),
        type: "number",
        options: getFontWeights(),
        inputType: "select",
        defaultValue: defaultFontWeight,
      },
      {
        key: "lineHeight",
        label: t("definition.schema.label.lineHeight"),
        type: "number",
        options: getLineHeights(),
        inputType: "select",
        defaultValue: defaultLineHeight,
      },
    ],
    []
  );

  const defaultInputValue = customFields.reduce<
    Record<string, string | number>
  >((prev, curr) => {
    prev[curr.key] = curr.defaultValue ?? (curr.type === "number" ? 0 : "");
    return prev;
  }, {});

  const inputValue = useMemo(
    () =>
      input.value?.value ||
      input.value?.[editorContext.breakpointIndex]?.value ||
      defaultInputValue,
    [input]
  );

  const onChange = (key: string, value: string | number, type: string) => {
    const newInputValue = {
      ...inputValue,
      [key]: type === "number" ? Number(value) : value.toString(),
    };

    input.onChange({
      value: normalizeCustomValue(newInputValue),
      widgetId: undefined,
    });
  };

  return (
    <FontCustomFieldsStyle>
      {customFields.map((customField) => {
        const customFieldValue = inputValue[customField.key];

        return (
          <FontCustomField
            key={customField.key}
            customField={{
              ...customField,
              value: customFieldValue,
            }}
            onChange={onChange}
          />
        );
      })}
    </FontCustomFieldsStyle>
  );
};
