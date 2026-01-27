import { toArray } from "@/utils";
import {
  ComponentSchemaProp,
  Field,
  NoCodeComponentEntry,
} from "@redsun-vn/easyblocks-core";
import {
  findComponentDefinitionById,
  parsePath,
} from "@redsun-vn/easyblocks-core/_internals";
import {
  ButtonGhost,
  Colors,
  Icons,
  Typography,
} from "@redsun-vn/easyblocks-design-system";
import React, { useContext } from "react";
import type { FieldRenderProps } from "react-final-form";
import styled from "styled-components";
import { useEditorContext } from "../../../EditorContext";
import { isMixedFieldValue } from "../components/isMixedFieldValue";
import { PanelContext } from "./BlockFieldPlugin";
import { useTranslation } from "../../../useTranslation";

interface IdentityFieldProps extends FieldRenderProps<
  NoCodeComponentEntry,
  HTMLElement
> {
  field: Field;
}

const HorizontalLine = styled.div`
  height: 1px;
  margin-top: -1px;
  background-color: ${Colors.black10};
`;

const IdentityFieldWrapper = styled.div`
  display: flex;
  gap: 8px;
  min-height: 28px;
  padding: 10px;
  background: ${Colors.white};
`;

const IdentityFieldContainer = styled.div`
  position: sticky;
  top: 0px;
  z-index: var(--tina-z-index-2);
`;

function IdentityField({ input, field }: IdentityFieldProps) {
  const editorContext = useEditorContext();
  const panelContext = useContext(PanelContext);
  const { t } = useTranslation();

  const isMixed = isMixedFieldValue(input.value);
  const config = isMixed ? null : input.value;

  if (config == null) {
    return null;
  }

  const componentDefinition = findComponentDefinitionById(
    config._component,
    editorContext,
  );

  const configPaths = toArray(field.name);
  const { parent } = parsePath(configPaths[0], editorContext.form);
  const isWithinNestedPanel = panelContext !== undefined;

  const parentComponentDefinition = parent
    ? findComponentDefinitionById(parent.templateId, editorContext)
    : undefined;
  const parentSchemaProp = parentComponentDefinition?.schema.find(
    (schemaProp) => schemaProp.prop === parent!.fieldName,
  );

  const isNonRemovable =
    (componentDefinition?.id.startsWith("@easyblocks/rich-text") &&
      componentDefinition.id !== "@easyblocks/rich-text") ||
    (parentSchemaProp
      ? parentSchemaProp.type === "component" &&
        (parentSchemaProp as ComponentSchemaProp).required
      : true);

  const isNonChangable =
    componentDefinition?.id === "@easyblocks/rich-text-part" ||
    componentDefinition?.id === editorContext.rootComponent.id;

  function handleChangeComponentType() {
    if (isNonChangable) {
      return;
    }

    if (!parent) {
      return;
    }

    const componentPickerPath = parent.path + "." + parent.fieldName;

    editorContext.actions
      .openComponentPicker({ path: componentPickerPath })
      .then((selectedConfig) => {
        if (!selectedConfig) {
          return;
        }

        editorContext.actions.replaceItems(configPaths, selectedConfig);
      });
  }

  function handleRemove() {
    if (isNonRemovable) {
      return;
    }

    editorContext.actions.removeItems(configPaths);
  }

  const titleContent = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
      }}
    >
      <Typography
        style={{
          lineHeight: "14px",
          fontWeight: "700",
        }}
      >
        {componentDefinition?.label ?? componentDefinition?.id}
      </Typography>
      {!isNonChangable && <Icons.ChevronDown size={16} />}
    </div>
  );

  return (
    <IdentityFieldContainer>
      <IdentityFieldWrapper>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: "1 0",
          }}
        >
          {isWithinNestedPanel && (
            <ButtonGhost
              icon={Icons.ChevronLeft}
              onClick={() => {
                panelContext.onClose();
              }}
              style={{
                marginRight: "auto",
              }}
            />
          )}

          {isNonChangable && (
            <div style={{ padding: "7px 6px" }}>{titleContent}</div>
          )}
          {!isNonChangable && (
            <ButtonGhost
              showTooltip={false}
              onClick={handleChangeComponentType}
            >
              {titleContent}
            </ButtonGhost>
          )}

          <ButtonGhost
            aria-label={t("delete")}
            icon={Icons.Remove}
            hideLabel
            showTooltip={false}
            onClick={handleRemove}
            style={{
              marginLeft: "auto",
              opacity: isNonRemovable ? 0 : 1,
              pointerEvents: isNonRemovable ? "none" : "auto",
            }}
          >
            {t("delete")}
          </ButtonGhost>
        </div>
      </IdentityFieldWrapper>
      <HorizontalLine />
    </IdentityFieldContainer>
  );
}

const IdentityFieldPlugin = {
  name: "identity",
  Component: IdentityField,
};

export { IdentityFieldPlugin };
