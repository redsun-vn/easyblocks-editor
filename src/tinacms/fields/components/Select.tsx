import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import {
  Select,
  SelectItem,
  SelectSeparator,
} from "@redsun-vn/easyblocks-design-system/Select";
import React from "react";
import { FieldMixedValue } from "../../../types";
import { useTranslation } from "../../../useTranslation";
import { translatePanelLabel } from "../../../utils/panelTranslation";
import { FieldRenderProps } from "../../form-builder";
import { MIXED_VALUE } from "./constants";
import { isMixedFieldValue } from "./isMixedFieldValue";

type Option =
  | {
      value: string;
      label: string;
    }
  | {
      isDivider: true;
    };

interface SelectFieldProps extends InternalField {
  options: (Option | string)[];
}

export interface SelectFieldComponentProps extends FieldRenderProps<
  string | FieldMixedValue
> {
  name: Array<string> | string;
  field: SelectFieldProps;
  disabled?: boolean;
  options?: (Option | string)[];
}

export const SelectFieldComponent: React.FC<SelectFieldComponentProps> = ({
  input,
  field,
  options,
}) => {
  const { value, onChange } = input;
  const { t } = useTranslation();
  const isMixedValue = isMixedFieldValue(value);

  const selectOptions = options || field.options;
  const normalizedSelectOptions = selectOptions.map((option) =>
    toProps(option, t),
  );

  if (isMixedValue) {
    normalizedSelectOptions.unshift(
      {
        label: "Mixed",
        value: MIXED_VALUE,
      },
      {
        isDivider: true,
      },
    );
  }

  const inputValue = isMixedValue ? MIXED_VALUE : value;

  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <Select value={inputValue} onChange={handleChange}>
      {normalizedSelectOptions.map(toComponent)}
    </Select>
  );
};

/**
 * An option carries its own words, and those words go on screen.
 *
 * A definition may write the option out (`{ value: 'left', label: 'Left' }`) or
 * leave it as a bare string, in which case the raw value is what the shop owner
 * reads — `stretch`, `center`, `video`. Either way it went straight to the
 * dropdown untranslated, so a Vietnamese panel offered English choices under
 * Vietnamese labels. They go through the same resolver as a field label.
 */
function toProps(option: Option | string, t: (key: string) => string): Option {
  if (typeof option === "object") {
    return "isDivider" in option
      ? option
      : { ...option, label: translatePanelLabel(option.label, t) };
  }

  return { value: option, label: translatePanelLabel(option, t) };
}

function toComponent(option: Option) {
  if ("isDivider" in option) {
    return <SelectSeparator key="divider" />;
  }

  return (
    <SelectItem
      key={option.value}
      value={option.value}
      isDisabled={option.value === MIXED_VALUE}
    >
      {option.label}
    </SelectItem>
  );
}
