import { LocalValue } from "@redsun-vn/easyblocks-core";
import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { EditorContextType, useEditorContext } from "../../../EditorContext";
import { MissingWidget } from "./MissingWidget";
import { FieldMetaWrapper } from "./wrapFieldWithMeta";

type InlineTypesResult = Record<
  string,
  Extract<EditorContextType["types"][string], { type: "inline" }>
>;

function useInlineTypes(): InlineTypesResult {
  const editorContext = useEditorContext();

  const tokenTypes = Object.fromEntries(
    Object.entries(editorContext.types).filter<
      [string, InlineTypesResult[string]]
    >(
      (
        typeDefinitionEntry
      ): typeDefinitionEntry is [string, InlineTypesResult[string]] => {
        return typeDefinitionEntry[1].type === "inline";
      }
    )
  );

  return tokenTypes;
}

const LocalFieldPlugin = {
  name: "local",
  Component: function LocalField(
    props: FieldRenderProps<LocalValue<any>> & { field: InternalField }
  ) {
    const inlineTypes = useInlineTypes();

    // Read before rendering, because it decides how the field is laid out and
    // the layout belongs to the wrapper, not to the widget inside it.
    const wantsFullWidth =
      inlineTypes[props.field.schemaProp.type]?.widget.fullWidth === true;

    return (
      <FieldMetaWrapper {...props} layout={wantsFullWidth ? "column" : "row"}>
        <LocalFieldWidget {...props} />
      </FieldMetaWrapper>
    );
  },
};

function LocalFieldWidget({
  field,
  input,
}: FieldRenderProps<LocalValue<any>> & {
  field: InternalField;
}) {
  const inlineTypes = useInlineTypes();
  const inlineTypeDefinition = inlineTypes[field.schemaProp.type];
  const WidgetComponent = inlineTypeDefinition?.widget.component;

  if (!WidgetComponent) {
    return <MissingWidget type={field.schemaProp.type} />;
  }

  return (
    <WidgetComponent
      value={input.value.value}
      onChange={(value) => {
        input.onChange({
          value,
          widgetId: input.value.widgetId,
        });
      }}
      params={
        "params" in field.schemaProp ? field.schemaProp.params : undefined
      }
    />
  );
}

export { LocalFieldPlugin };
