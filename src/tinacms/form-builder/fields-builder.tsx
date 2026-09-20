import { toArray } from "@/utils/array/toArray";
import { TTabSchemaProp } from "@redsun-vn/easyblocks-core";
import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import { Colors, Fonts } from "@redsun-vn/easyblocks-design-system";
import { Icons } from "@redsun-vn/easyblocks-design-system/icons";
import { Input } from "@redsun-vn/easyblocks-design-system/Input";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, { useContext, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";
import { useEditorContext } from "../../EditorContext";
import { Form } from "../../form";
import { useTranslation } from "../../useTranslation";
import {
  translatePanelGroup,
  translatePanelLabel,
} from "../../utils/panelTranslation";
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
      field.label = translatePanelLabel(field.label, t);
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

/** Diacritics-insensitive so "mau" finds "Màu". */
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const SearchBar = styled.div`
  position: relative;
  padding: 8px 12px;
  border-bottom: 1px solid ${Colors.black10};

  /* Room for the clear button, so a long query never runs underneath it. Scoped to this
     one search bar rather than to the shared control, which every sidebar field uses. */
  input {
    padding-right: 26px;
  }
`;

const SearchClearButton = styled.button`
  all: unset;
  box-sizing: border-box;
  position: absolute;
  top: 8px;
  bottom: 8px;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  border-radius: 4px;
  cursor: pointer;
  color: ${Colors.black40};

  &:hover {
    color: ${Colors.black700};
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${Colors.blue60};
  }
`;

const tabs: Array<{ id: TTabSchemaProp; label: string }> = [
  { id: "styles", label: "Styles" },
  { id: "data", label: "Data" },
  { id: "animation", label: "Animation" },
];

// Underline-style tab bar (flat text buttons sitting on a baseline track).
const TabsBar = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${Colors.black10};
`;

// Active tab: faint Colors.black5 underline + bold/dark text so it stays
// distinguishable even though the underline color is subtle.
const TabButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  margin-bottom: -1px;
  border: none;
  border-bottom: 2px solid
    ${(p) => (p.$active ? Colors.black500 : "transparent")};
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: ${(p) => (p.$active ? "600" : "400")};
  color: ${(p) => (p.$active ? "black" : Colors.black40)};
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: black;
  }
`;

const NoData = styled(Typography)`
  padding: 20px 16px;
`;

export interface FieldsBuilderProps {
  form: Form;
  fields: InternalField[];
  isEmptyField?: boolean;
  /** Opt-in: only the properties sidebar shows the search box. */
  showSearch?: boolean;
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
  showSearch = false,
}: FieldsBuilderProps) {
  const { t } = useTranslation();
  const editorContext = useEditorContext();
  const panelContext = useContext(PanelContext);
  const [activeTab, setActiveTab] = useState<TTabSchemaProp>("styles");
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const hasTabs = fields.some(
    (f) => f.component !== "identity" && f.component !== null,
  );

  const isSearching = showSearch && normalize(query).length > 0;

  const matchesQuery = (field: InternalField) => {
    const needle = normalize(query);
    const label =
      typeof field.label === "string"
        ? normalize(translatePanelLabel(field.label, t))
        : "";
    // Through the same resolver the heading uses. `t(field.group)` looked up the
    // English sentence as if it were a key, so searching matched words that were
    // never on screen and missed the ones that were.
    const group = field.group
      ? normalize(translatePanelGroup(field.group, t))
      : "";

    return label.includes(needle) || group.includes(needle);
  };

  // While searching, ignore the tab split: a property the user is looking for
  // often sits on a tab other than the open one, and finding nothing there
  // would read as "this property does not exist".
  const visibleFields = isSearching
    ? fields.filter(matchesQuery)
    : hasTabs
      ? fields.filter((f) => {
          const fieldTab: TTabSchemaProp = f.schemaProp?.tab ?? "styles";
          return fieldTab === activeTab;
        })
      : fields;

  const grouped: Record<string, Array<InternalField>> = {};
  const ungrouped: Array<InternalField> = [];

  visibleFields.forEach((field) => {
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

      {showSearch && !isEmptyField && (
        <SearchBar>
          <Input
            ref={searchInputRef}
            controlSize="full-width"
            value={query}
            placeholder={t("editor.properties.search")}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query !== "" && (
            <SearchClearButton
              type="button"
              aria-label={t("editor.properties.search.clear")}
              onClick={() => {
                setQuery("");
                // Clearing is a step in the search, not the end of it, so the caret
                // stays where the user was typing.
                searchInputRef.current?.focus();
              }}
            >
              <Icons.Close size={14} />
            </SearchClearButton>
          )}
        </SearchBar>
      )}

      {hasTabs && !isEmptyField && !isSearching && (
        <TabsBar>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabsBar>
      )}

      {isEmptyField ? <EmptyField /> : null}

      {isSearching && visibleFields.length === 0 && (
        <NoData>{t("editor.properties.noResults")}</NoData>
      )}

      {Object.keys(grouped).map((groupName) => (
        <div key={groupName}>
          <FieldsGroupLabel>
            {translatePanelGroup(groupName, t)}
          </FieldsGroupLabel>
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

      {!Object.keys(grouped).length && !ungrouped.length && !isEmptyField ? (
        <NoData variant="body">{t("noData")}!</NoData>
      ) : (
        <></>
      )}
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
