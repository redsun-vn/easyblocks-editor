import { toArray } from "@/utils/array/toArray";
import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import { Colors, Fonts } from "@redsun-vn/easyblocks-design-system";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, { useContext, useMemo } from "react";
import { styled } from "styled-components";
import { useEditorContext } from "../../EditorContext";
import { Form } from "../../form";
import { useTranslation } from "../../useTranslation";
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

const SelectFrameIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="60">
      <path
        fill="#000624"
        fillRule="evenodd"
        d="M89.5 50a2.503 2.503 0 0 1-2.5-2.5c0-1.379 1.122-2.5 2.5-2.5s2.5 1.121 2.5 2.5-1.122 2.5-2.5 2.5Zm-30.25-9.87a.501.501 0 0 0-.836.388l.23 6.482H33.95A3.486 3.486 0 0 0 31 44.051V25.949A3.486 3.486 0 0 0 33.95 23h52.1A3.486 3.486 0 0 0 89 25.949v18.102A3.486 3.486 0 0 0 86.05 47H66.798l-7.549-6.87ZM30.5 50a2.503 2.503 0 0 1-2.5-2.5c0-1.379 1.122-2.5 2.5-2.5s2.5 1.121 2.5 2.5-1.122 2.5-2.5 2.5ZM28 22.5c0-1.379 1.122-2.5 2.5-2.5s2.5 1.121 2.5 2.5-1.122 2.5-2.5 2.5a2.503 2.503 0 0 1-2.5-2.5ZM89.5 20c1.378 0 2.5 1.121 2.5 2.5S90.878 25 89.5 25a2.503 2.503 0 0 1-2.5-2.5c0-1.379 1.122-2.5 2.5-2.5Zm.5 24.051V25.949c1.692-.245 3-1.691 3-3.449 0-1.93-1.57-3.5-3.5-3.5-1.759 0-3.204 1.309-3.45 3h-52.1c-.246-1.691-1.69-3-3.45-3-1.93 0-3.5 1.57-3.5 3.5 0 1.758 1.308 3.204 3 3.449v18.102c-1.692.245-3 1.691-3 3.449 0 1.93 1.57 3.5 3.5 3.5 1.76 0 3.204-1.309 3.45-3h24.728l.364 10.209a.499.499 0 0 0 .888.297l3.446-4.264 2.531 5.468a.505.505 0 0 0 .454.29.513.513 0 0 0 .21-.046l2.22-1.027a.5.5 0 0 0 .242-.664L66.5 52.791l5.49.119c.213-.014.397-.121.474-.314a.499.499 0 0 0-.128-.556L67.897 48H86.05c.246 1.691 1.691 3 3.45 3 1.93 0 3.5-1.57 3.5-3.5 0-1.758-1.308-3.204-3-3.449Z"
      />
    </svg>
  );
};

const EmptyField = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        padding: 16,
        paddingTop: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
      }}
    >
      <SelectFrameIcon />
      <Typography style={{ whiteSpace: "initial", textAlign: "center" }}>
        {t("editor.sidebar.emptyField")}
      </Typography>
    </div>
  );
};

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
  const { t } = useTranslation();

  if (!shouldFieldBeDisplayed(field)) {
    return null;
  }

  const fieldComponent = FIELD_COMPONENTS.find(
    (component) => component.name === (field.component as string),
  );

  const { onChange, getValue } = createFieldController({
    field,
    editorContext,
    format: field.format ?? fieldComponent?.format,
    parse: field.parse ?? fieldComponent?.parse,
  });

  const fieldParsed = useMemo(() => {
    let fieldResult = field;

    if (typeof field.label === "string") {
      field.label = t(field.label);
    }

    return fieldResult;
  }, [field]);

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
        field={fieldParsed}
        noWrap={noWrap}
        isLabelHidden={isLabelHidden}
      />
    );
  }

  if (typeof field.component !== "string" && field.component !== null) {
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
  isEmptyField?: boolean;
}

const HorizontalLine = styled.div`
  height: 1px;
  margin-top: -1px;
  background-color: ${Colors.black10};
`;

export function FieldsBuilder({
  form,
  fields,
  isEmptyField = false,
}: FieldsBuilderProps) {
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

      {isEmptyField ? <EmptyField /> : null}

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
      {!isEmptyField ? horizontalLine : null}
    </FieldsGroup>
  );
}

function generateFieldKey(
  field: InternalField,
  breakpointIndex: string | undefined,
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
  overflow: unset;
`;
