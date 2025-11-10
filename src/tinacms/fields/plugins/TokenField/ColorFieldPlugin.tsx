import {
  TokenValue as CoreTokenValue,
  NonNullish,
  TokenTypeWidgetComponentProps,
} from "@redsun-vn/easyblocks-core";
import {
  ChevronDownIcon,
  Colors,
  Fonts,
  RadixSelectContent,
  RadixSelectItem,
  RadixSelectItemText,
  RadixSelectPortal,
  RadixSelectRoot,
  RadixSelectTrigger,
  RadixSelectValue,
  RadixSelectViewport,
  Select,
  SelectSeparator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Typography,
} from "@redsun-vn/easyblocks-design-system";
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

const Trigger = styled(RadixSelectTrigger)`
  all: unset;

  display: flex;
  align-items: center;

  ${Fonts.body};
  display: flex;
  gap: 4px;
  max-width: 100%;

  box-sizing: border-box;
  height: 28px;
  padding: 0 2px 0 6px;
  border-radius: 2px;

  @media (hover: hover) {
    &:hover {
      box-shadow: 0 0 0 1px ${Colors.black10};
    }
  }
`;

const Content = styled(RadixSelectContent)`
  overflow: hidden;
  background-color: white;
  border-radius: 2px;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 12px #0000001a;
  padding: 4px 0;
`;

const Viewport = styled(RadixSelectViewport)<{ shape: "circle" | "rectangle" }>`
  display: grid;
  grid-template-columns: repeat(5, 30px);
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="16"
                    viewBox="0 0 15 16"
                    fill="none"
                  >
                    <defs>
                      <pattern
                        id="checker"
                        width="4"
                        height="4"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect width="2" height="2" fill="#e5e7eb" />
                        <rect x="2" y="2" width="2" height="2" fill="#e5e7eb" />
                      </pattern>
                    </defs>

                    {color === "transparent" ? (
                      <circle cx="7.5" cy="8" r="6.5" fill="url(#checker)" />
                    ) : (
                      <circle
                        cx="7.5"
                        cy="8"
                        r="6.5"
                        fill={color}
                        stroke={Colors.black100}
                      />
                    )}
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="16"
                    viewBox="0 0 30 18"
                    fill="none"
                  >
                    <rect
                      x="1"
                      y="4"
                      width="28"
                      height="13"
                      fill={color}
                      stroke={Colors.black100}
                    />
                  </svg>
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
      ? ((input.value as Exclude<(typeof input)["value"], FieldMixedValue>)
          .value as string)
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
    const value = (
      input.value as Exclude<(typeof input)["value"], FieldMixedValue>
    ).value;
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
                      ? ((
                          input.value as Exclude<
                            (typeof input)["value"],
                            FieldMixedValue
                          >
                        ).value as string)
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
