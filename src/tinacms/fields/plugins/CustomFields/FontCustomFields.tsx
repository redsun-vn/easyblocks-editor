import { TokenValue } from "@redsun-vn/easyblocks-core";
import {
  Fonts,
  Input,
  Select,
  SelectItem,
} from "@redsun-vn/easyblocks-design-system";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "../../../../useTranslation";
import { getFonts } from "../../../../utils/fonts";
import { TokenFieldProps } from "../TokenField/TokenFieldPlugin";
import { Tooltip, TooltipArrow, TooltipBody } from "../Tooltip";
import { useTooltip } from "../useTooltip";
import { useEditorContext } from "../../../../EditorContext";

interface IFontCustomInputElement
  extends Omit<TokenFieldProps<TokenValue>, "meta"> {
  customValueTextFieldRef?: React.MutableRefObject<HTMLInputElement | null>;
}

interface ICustomField {
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
        <Select
          value={String(customField.value ?? customField.defaultValue)}
          onChange={(selectedValue) => {
            onChange(
              customField.key,
              customField.type === "number"
                ? Number(selectedValue)
                : selectedValue,
              "select"
            );
          }}
        >
          {options.map((o) => {
            return (
              <SelectItem key={o.id} value={o.value}>
                <div style={{ fontFamily: o.value }}>{o.label}</div>
              </SelectItem>
            );
          })}
        </Select>
      );
    }

    default: {
      break;
    }
  }
};

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

export const FontCustomFields = ({ input }: IFontCustomInputElement) => {
  const { t } = useTranslation();
  const editorContext = useEditorContext();
  const customFields: ICustomField[] = useMemo(
    () => [
      {
        key: "fontFamily",
        label: t("definition.schema.label.fontFamily"),
        options: getFonts(),
        type: "string" as const,
        inputType: "select",
        defaultValue: "Roboto",
      },
      {
        key: "fontSize",
        label: t("definition.schema.label.fontSize"),
        type: "number" as const,
        inputType: "text",
        defaultValue: 16,
      },
      {
        key: "fontWeight",
        label: t("definition.schema.label.fontWeight"),
        type: "number" as const,
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
        defaultValue: 600,
      },
      {
        key: "lineHeight",
        label: t("definition.schema.label.lineHeight"),
        type: "number" as const,
        inputType: "text",
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
  };

  useEffect(() => {
    input.onChange({
      value: inputValue,
    });
  }, [inputValue]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
    </div>
  );
};
