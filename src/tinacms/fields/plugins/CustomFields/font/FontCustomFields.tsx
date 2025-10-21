import { TokenValue } from "@redsun-vn/easyblocks-core";
import { Fonts } from "@redsun-vn/easyblocks-design-system";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useEditorContext } from "../../../../../EditorContext";
import { useTranslation } from "../../../../../useTranslation";
import { getFonts } from "../../../../../utils/fonts";
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
        options: getFonts(),
        type: "string",
        inputType: "select",
        defaultValue: "Roboto, sans-serif",
      },
      {
        key: "fontSize",
        label: t("definition.schema.label.fontSize"),
        type: "number",
        options: Object.values(editorContext.theme.space)
          .filter(
            (s) =>
              typeof s.value === "string" && s.value.match(/\d+(\.\d+)?px\b/)
          )
          .map((s) => ({
            id: parseFloat(s.value as string).toString(),
            value: parseFloat(s.value as string).toString(),
            label: s.label ?? "",
          })),
        inputType: "select",
        defaultValue: 16,
      },
      {
        key: "fontWeight",
        label: t("definition.schema.label.fontWeight"),
        type: "number",
        options: [
          { id: "100", value: "100", label: "Thin (100)" },
          { id: "200", value: "200", label: "Extra Light (200)" },
          { id: "300", value: "300", label: "Light (300)" },
          { id: "400", value: "400", label: "Normal (400)" },
          { id: "500", value: "500", label: "Medium (500)" },
          { id: "600", value: "600", label: "Semi Bold (600)" },
          { id: "700", value: "700", label: "Bold (700)" },
          { id: "800", value: "800", label: "Extra Bold (800)" },
          { id: "900", value: "900", label: "Black (900)" },
        ],
        inputType: "select",
        defaultValue: 400,
      },
      {
        key: "lineHeight",
        label: t("definition.schema.label.lineHeight"),
        type: "number",
        options: [
          { id: "1", value: "1", label: "1" },
          { id: "1.1", value: "1.1", label: "1.1" },
          { id: "1.2", value: "1.2", label: "1.2" },
          { id: "1.3", value: "1.3", label: "1.3" },
          { id: "1.4", value: "1.4", label: "1.4" },
          { id: "1.4258", value: "1.4258", label: "1.4258" },
          { id: "1.5", value: "1.5", label: "1.5" },
          { id: "1.7", value: "1.7", label: "1.7" },
          { id: "1.8", value: "1.8", label: "1.8" },
          { id: "2", value: "2", label: "2" },
        ],
        inputType: "select",
        defaultValue: 1.4,
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

  const [inputValue, setInputValue] = useState<Record<string, string | number>>(
    input.value?.value ||
      input.value?.[editorContext.breakpointIndex]?.value ||
      defaultInputValue
  );

  const onChange = (key: string, value: string | number, type: string) => {
    const newInputValue = {
      ...inputValue,
      [key]: type === "number" ? Number(value) : value.toString(),
    };
    setInputValue(newInputValue);

    console.log(field);

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
