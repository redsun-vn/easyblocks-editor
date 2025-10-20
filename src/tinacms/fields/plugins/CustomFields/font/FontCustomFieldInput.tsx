import { Input, Select, SelectItem } from "@redsun-vn/easyblocks-design-system";
import React from "react";
import { CUSTOM_OPTION_VALUE } from "../../../components/constants";
import { ICustomField } from "./FontCustomFields";

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
            if (selectedValue !== CUSTOM_OPTION_VALUE) {
              onChange(customField.key, selectedValue, customField.type);
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
          {/* <>
            <SelectSeparator />
            <SelectItem value={CUSTOM_OPTION_VALUE}>Custom</SelectItem>
          </> */}
        </Select>
      );
    }

    default: {
      break;
    }
  }
};
