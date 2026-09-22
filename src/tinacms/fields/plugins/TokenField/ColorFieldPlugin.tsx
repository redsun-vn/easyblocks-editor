import {
  TokenValue as CoreTokenValue,
  NonNullish,
  TokenTypeWidgetComponentProps,
} from "@redsun-vn/easyblocks-core";
import { Colors, Fonts } from "@redsun-vn/easyblocks-design-system";
import { ChevronDownIcon } from "@redsun-vn/easyblocks-design-system/radix-ui/ReactIcons";
import {
  RadixSelectContent,
  RadixSelectItem,
  RadixSelectItemText,
  RadixSelectPortal,
  RadixSelectRoot,
  RadixSelectTrigger,
  RadixSelectValue,
  RadixSelectViewport,
} from "@redsun-vn/easyblocks-design-system/radix-ui/ReactSelect";
import {
  Select,
  selectTriggerStyles,
  SelectSeparator,
} from "@redsun-vn/easyblocks-design-system/Select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@redsun-vn/easyblocks-design-system/Tooltip";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, { ComponentType, Fragment, ReactNode, useEffect } from "react";
import { FieldInputProps } from "react-final-form";
import styled from "styled-components";
import { EditorTokenTypeDefinition } from "../../../../EditorContext";
import { FieldMixedValue } from "../../../../types";
import { useTranslation } from "../../../../useTranslation";
import { CUSTOM_OPTION_VALUE, MIXED_VALUE } from "../../components/constants";
import { isMixedFieldValue } from "../../components/isMixedFieldValue";
import { CustomField } from "../CustomFields";
import { TokenField } from "./TokenFieldPlugin";

interface IColorFieldPluginProps {
  type: "list" | "grid";
  tokenTypeDefinition: EditorTokenTypeDefinition;
  shouldShowCustomValueInput: boolean;
  inputValue: unknown;
  setInputValue: React.Dispatch<unknown>;
  input: FieldInputProps<CoreTokenValue | FieldMixedValue, HTMLSelectElement>;
  selectValue: string;
  onSelectChange: (selectedValue: string) => void;
  field: TokenField<NonNullish>;
  SelectColorTokenItem: React.ForwardRefExoticComponent<
    {
      children: ReactNode;
      previewColor?: string;
      value: string;
      isDisabled?: boolean;
    } & React.RefAttributes<HTMLDivElement>
  >;
  options: {
    id: string;
    label: string;
  }[];
}

/**
 * The colour swatch that opens the palette.
 *
 * Borrows the select trigger's looks rather than restating them. It used to
 * carry its own copy, and the copy was missing the resting outline the rest of
 * the panel has — a white swatch on a white panel with nothing around it.
 */
const Trigger = styled(RadixSelectTrigger)`
  ${selectTriggerStyles}
`;

const Content = styled(RadixSelectContent)`
  overflow: hidden;
  background-color: white;
  border-radius: 2px;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 12px #0000001a;
  padding: 4px 0;
  width: 250px;
`;

const Viewport = styled(RadixSelectViewport)<{ shape: "circle" | "rectangle" }>`
  display: grid;
  grid-template-columns: ${({ shape }) =>
    `repeat(${shape === "circle" ? "8" : "5"}, ${shape === "circle" ? "30px" : "46px"})`};
  padding: ${({ shape }) => (shape === "circle" ? "2px" : "2px 8px")};
  max-height: 200px;
  overflow: auto;
  justify-items: center;
  justify-content: center;
`;

const Item = styled(RadixSelectItem)<{ shape: "circle" | "rectangle" }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  transform: scale(1.2);
  width: 8px;
  height: 8px;
  outline: none;
  margin: 10px;

  &[data-highlighted] {
    background-color: #f2f2f2;
  }

  &[data-state="checked"] {
    cursor: pointer;
    transform: scale(1.4);
    ${({ shape }) =>
      shape === "circle"
        ? "box-shadow: 0 0 1px 2px #fff, 0 0 0 4px #7e8796;"
        : ""};
    ${({ shape }) => (shape === "circle" ? "border-radius: 100%" : "")};
    z-index: 1;
  }

  @media (hover: hover) {
    &:hover {
      background-color: transparent;
      border: none;
      cursor: pointer;
      transform: scale(1.4);
      z-index: 2;
    }
  }
`;

const ItemText = styled(RadixSelectItemText)`
  @media (hover: hover) {
    &:hover {
      border: none;
      background-color: transparent;
    }
  }
`;

const SelectTitle = styled.div`
  padding: 8px 8px 2px 8px;
  ${Fonts.body};
  font-size: 14px;
`;

const transparentImage =
  'url(\'data:image/svg+xml,<svg width="100" height="50" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="checker" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="%23ccc" /><rect x="2" y="2" width="2" height="2" fill="%23ccc" /></pattern></defs><rect width="100" height="50" fill="url(%23checker)" /></svg>\')';

export const ColorOptions = ({
  field,
  options,
  shape = "circle",
}: Pick<IColorFieldPluginProps, "field" | "options"> & {
  shape?: "circle" | "rectangle";
}) => {
  return options.map((option) => {
    const color =
      (field.tokens[option.id]?.value as unknown as string | undefined) ??
      option.id;

    const colorStyled =
      color === "transparent"
        ? { backgroundImage: transparentImage }
        : { background: color };

    return (
      <Item key={option.id} value={option.id} shape={shape}>
        <ItemText>
          <Tooltip>
            <TooltipTrigger>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: shape === "circle" ? 6 : 0,
                }}
              >
                {shape === "circle" ? (
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      ...colorStyled,
                      border: `1px solid ${Colors.black100}`,
                      borderRadius: "100%",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: 40,
                      height: 16,
                      background: color,
                      ...colorStyled,
                      border: `1px solid ${Colors.black100}`,
                    }}
                  />
                )}
              </span>
            </TooltipTrigger>

            <TooltipContent>
              <Typography color="white">{color}</Typography>
            </TooltipContent>
          </Tooltip>
        </ItemText>
      </Item>
    );
  });
};

/**
 * The custom colour a field is holding, or nothing.
 *
 * The field's value is not always an object. A config written by hand rather
 * than by the engine — the column a row appends when its count goes up is the
 * measured case — has no entry for the prop at all, and the field is handed
 * `null`. Reading `.value` straight off it threw during render, which is not a
 * blank swatch but the whole properties panel gone, from clicking a block.
 *
 * A value that is mixed across a multiple selection is not a colour either, and
 * is the same answer here.
 */
function readCustomColor(
  value: CoreTokenValue | FieldMixedValue | null | undefined,
): string | undefined {
  if (!value || isMixedFieldValue(value)) {
    return undefined;
  }

  return value.value as string | undefined;
}

export const ColorFieldPlugin = ({
  type = "list",
  tokenTypeDefinition,
  shouldShowCustomValueInput,
  inputValue,
  setInputValue,
  input,
  selectValue,
  onSelectChange,
  field,
  SelectColorTokenItem,
  options,
}: IColorFieldPluginProps) => {
  const { t } = useTranslation();

  const CustomInputWidgetComponent = tokenTypeDefinition?.widget?.component as
    | ComponentType<TokenTypeWidgetComponentProps<string>>
    | undefined;

  const previewColor =
    selectValue === CUSTOM_OPTION_VALUE
      ? readCustomColor(input.value)
      : undefined;

  const customInputElement = shouldShowCustomValueInput ? (
    <div style={{ width: "100%", textAlign: "end" }}>
      <div style={{ height: 4 }} />
      {CustomInputWidgetComponent ? (
        <CustomInputWidgetComponent
          value={inputValue as string}
          onChange={(value) => {
            input.onChange({
              value,
              widgetId: tokenTypeDefinition.widget?.id,
            });
          }}
          params={
            "params" in field.schemaProp ? field.schemaProp.params : undefined
          }
        />
      ) : (
        <CustomField input={input} field={field} />
      )}
    </div>
  ) : null;

  const themeOptions = options.filter((o) => o.id.startsWith("theme_"));
  const myColorOptions = options.filter((o) => !o.id.startsWith("theme_"));

  useEffect(() => {
    const value = readCustomColor(input.value);
    if (value) {
      setInputValue(value);
    }
  }, [input]);

  if (type === "grid") {
    return (
      <Fragment>
        <RadixSelectRoot value={selectValue} onValueChange={onSelectChange}>
          <Trigger>
            <RadixSelectValue placeholder="Select item" />
            <ChevronDownIcon color={Colors.black40} />
          </Trigger>

          <RadixSelectPortal>
            <Content>
              <SelectTitle>{t("theme.colors")}</SelectTitle>
              <Viewport shape="rectangle">
                <ColorOptions
                  options={themeOptions}
                  field={field}
                  shape="rectangle"
                />
              </Viewport>
              <SelectTitle>{t("theme.myColors")}</SelectTitle>
              <Viewport shape="circle">
                <ColorOptions options={myColorOptions} field={field} />
              </Viewport>
              {field?.allowCustom && (
                <>
                  <SelectSeparator />
                  <SelectColorTokenItem
                    value={CUSTOM_OPTION_VALUE}
                    previewColor={previewColor}
                  >
                    Custom
                  </SelectColorTokenItem>
                </>
              )}
            </Content>
          </RadixSelectPortal>
        </RadixSelectRoot>
        {customInputElement}
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Select value={selectValue} onChange={onSelectChange}>
        {isMixedFieldValue(input.value) && (
          <>
            <SelectColorTokenItem value={MIXED_VALUE} isDisabled>
              Mixed
            </SelectColorTokenItem>
            <SelectSeparator />
          </>
        )}
        {
          <Fragment>
            {options.map((o) => {
              return (
                <SelectColorTokenItem
                  key={o.id}
                  value={o.id}
                  // Color tokens are always strings
                  previewColor={
                    (field.tokens[o.id]?.value as unknown as
                      | string
                      | undefined) ?? o.id
                  }
                >
                  {o.label}
                </SelectColorTokenItem>
              );
            })}
            {field?.allowCustom && (
              <>
                <SelectSeparator />
                <SelectColorTokenItem
                  value={CUSTOM_OPTION_VALUE}
                  previewColor={
                    selectValue === CUSTOM_OPTION_VALUE
                      ? readCustomColor(input.value)
                      : undefined
                  }
                >
                  Custom
                </SelectColorTokenItem>
              </>
            )}
          </Fragment>
        }
      </Select>
      {customInputElement}
    </Fragment>
  );
};
