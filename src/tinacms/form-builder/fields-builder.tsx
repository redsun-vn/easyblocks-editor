import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import { Colors, Fonts, Typography } from "@redsun-vn/easyblocks-design-system";
import { toArray } from "@/utils";
import React, { useContext } from "react";
import styled, { css } from "styled-components";
import { useEditorContext } from "../../EditorContext";
import { Form } from "../../form";
import {
  BlockFieldPlugin,
  ExternalFieldPlugin,
  FieldMetaWrapper,
  IdentityFieldPlugin,
  NumberFieldPlugin,
  RadioGroupFieldPlugin,
  ResponsiveFieldPlugin,
  SVGPickerFieldPlugin,
  SelectFieldPlugin,
  SliderFieldPlugin,
  TextFieldPlugin,
  ToggleFieldPlugin,
  TokenFieldPlugin,
} from "../fields";
import { PanelContext } from "../fields/plugins/BlockFieldPlugin";
import { LocalFieldPlugin } from "../fields/plugins/LocalFIeld";
import { PositionFieldPlugin } from "../fields/plugins/PositionFieldPlugin";
import { FieldPlugin } from "./field-plugin";
import { createFieldController } from "./utils/createFieldController";

export interface FieldBuilderProps {
  form: Form;
  field: InternalField;
  noWrap?: boolean;
  isLabelHidden?: boolean;
}

function shouldFieldBeDisplayed(field: InternalField): boolean {
  if (field.component === null) return false;

  if (Array.isArray(field.name)) {
    return true;
  }

  if (field.hidden) {
    return false;
  }

  return true;
}

const FIELD_COMPONENTS: Array<FieldPlugin> = [
  TextFieldPlugin,
  NumberFieldPlugin,
  ToggleFieldPlugin,
  SelectFieldPlugin,
  RadioGroupFieldPlugin,
  PositionFieldPlugin,
  BlockFieldPlugin,
  SliderFieldPlugin,
  SVGPickerFieldPlugin,
  ResponsiveFieldPlugin,
  ExternalFieldPlugin,
  TokenFieldPlugin,
  IdentityFieldPlugin,
  LocalFieldPlugin,
];

export function FieldBuilder({
  form,
  field,
  noWrap,
  isLabelHidden,
}: FieldBuilderProps) {
  const editorContext = useEditorContext();

  if (!shouldFieldBeDisplayed(field)) {
    return null;
  }

  const fieldComponent = FIELD_COMPONENTS.find(
    (component) => component.name === (field.component as string)
  );

  const { onChange, getValue } = createFieldController({
    field,
    editorContext,
    format: field.format ?? fieldComponent?.format,
    parse: field.parse ?? fieldComponent?.parse,
  });

  if (fieldComponent) {
    return (
      <fieldComponent.Component
        // Let's talk about this code
        // This branch of code is created to display single input and label that handles multiple inputs under the hood
        // To make this work, we had to skip usage of `Field` from `Final Form` because it requires a single field object with single name
        // Moreover, since we don't use `Field` anymore we have to pretend that it still exists to make fields works as it was there.
        // In the future, this code should become a part of new component (ex. FieldWrapper)
        // and new controller should be introduced (ex. fieldWrapperController) to have single source of truth about behaviour of responsive field.
        input={{
          value: getValue(),
          onChange,
        }}
        // MetaFieldWrapper accesses `error` property of this object, it's needed to prevent runtime error
        meta={{}}
        tinaForm={form}
        form={form.finalForm}
        field={field}
        noWrap={noWrap}
        isLabelHidden={isLabelHidden}
      />
    );
  }

  if (typeof field.component !== "string" && field.component !== null) {
    console.log("not a string");

    return (
      <field.component
        input={{
          value: getValue(),
          onChange,
        }}
        meta={{}}
        tinaForm={form}
        form={form.finalForm}
        field={field}
        noWrap={noWrap}
        isLabelHidden={isLabelHidden}
      />
    );
  }

  return (
    <FieldMetaWrapper
      input={{
        value: getValue(),
        onChange,
      }}
      field={field}
      layout="column"
    >
      <Typography>Unrecognized field type</Typography>
    </FieldMetaWrapper>
  );
}

export interface FieldsBuilderProps {
  form: Form;
  fields: InternalField[];
}

const HorizontalLine = styled.div`
  height: 1px;
  margin-top: -1px;
  background-color: ${Colors.black10};
`;

export function FieldsBuilder({ form, fields }: FieldsBuilderProps) {
  const editorContext = useEditorContext();
  const panelContext = useContext(PanelContext);
  const grouped: Record<string, Array<InternalField>> = {};
  const ungrouped: Array<InternalField> = [];

  fields.forEach((field) => {
    if (!shouldFieldBeDisplayed(field)) {
      return;
    }

    if (field.group) {
      grouped[field.group] = grouped[field.group] || [];
      grouped[field.group].push(field);
    } else {
      if (field.component === "identity") {
        return;
      }

      ungrouped.push(field);
    }
  });

  const horizontalLine = <HorizontalLine />;

  const identityField = fields.find((field) => field.component === "identity");

  const breakpointIndex = panelContext
    ? editorContext.breakpointIndex
    : undefined;

  return (
    <FieldsGroup>
      {identityField !== undefined && (
        <React.Fragment>
          <FieldBuilder field={identityField} form={form} />
          {horizontalLine}
        </React.Fragment>
      )}
      {Object.keys(grouped).map((groupName) => (
        <div key={groupName}>
          <FieldsGroupLabel>{groupName}</FieldsGroupLabel>
          {grouped[groupName].map((field, index, fields) => (
            <FieldWrapper
              key={generateFieldKey(field, breakpointIndex)}
              isLast={index === fields.length - 1}
            >
              <FieldBuilder
                field={field}
                form={form}
                isLabelHidden={field.schemaProp.isLabelHidden}
              />
            </FieldWrapper>
          ))}
          {horizontalLine}
        </div>
      ))}
      {ungrouped.map((field, index, fields) => (
        <FieldWrapper
          key={generateFieldKey(field, breakpointIndex)}
          isLast={index === fields.length - 1}
        >
          <FieldBuilder
            field={field}
            form={form}
            isLabelHidden={field.schemaProp.isLabelHidden}
          />
        </FieldWrapper>
      ))}
      {horizontalLine}
    </FieldsGroup>
  );
}

function generateFieldKey(
  field: InternalField,
  breakpointIndex: string | undefined
) {
  const key = `${toArray(field.name).join("_")}_${field.schemaProp.type}${
    breakpointIndex ? `_${breakpointIndex}` : ""
  }`;
  return key;
}

const FieldWrapper = styled.div<{ isLast: boolean }>`
  margin-bottom: ${(props) => (props.isLast ? "8px" : 0)};
`;

const FieldsGroupLabel = styled.div`
  display: flex;
  align-items: center;

  padding: 20px 16px 10px 16px;

  ${Fonts.label};
  color: #000;
`;

const FieldsGroup = styled.div`
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: auto !important;
`;
