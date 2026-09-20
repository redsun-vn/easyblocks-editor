import {
  LocalTextReference,
  ResponsiveValue,
} from "@redsun-vn/easyblocks-core";
import {
  InternalField,
  useTextValue,
} from "@redsun-vn/easyblocks-core/_internals";
import { Input } from "@redsun-vn/easyblocks-design-system/Input";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { useEditorContext } from "../../../EditorContext";
import { parse } from "./textFormat";
import { FieldMetaWrapper } from "./wrapFieldWithMeta";

type TextFieldProps = FieldRenderProps<
  ResponsiveValue<string> | LocalTextReference
> & {
  field: InternalField & {
    placeholder?: string;
    normalize: (value: string) => string | null;
  };
};

function TextField({ input, field, noWrap }: TextFieldProps) {
  const editorContext = useEditorContext();
  const { value, onChange, ...restInputProperties } = input;

  const inputProps = useTextValue(
    value,
    onChange,
    editorContext.contextParams.locale,
    editorContext.locales,
    field.placeholder,
    field.normalize,
  );

  return (
    // A `string` prop used to be laid out beside its label, right-aligned and
    // without a border, while a `text` prop got its own line, the left edge and
    // a box. To the shop owner filling them in they are the same thing — a
    // place to type — so they now look and sit the same.
    //
    // The old row layout is what truncated the labels: "Chữ đứng trước" and
    // "Chữ đứng sau" both became "Chữ đứng..." in a 250px panel, which is two
    // different fields reading identically. The borderless input was the other
    // half of it — an empty one was hard to recognise as an input at all.
    <FieldMetaWrapper
      input={input}
      field={field}
      layout="column"
      noWrap={noWrap}
    >
      <Input
        {...restInputProperties}
        {...inputProps}
        controlSize="full-width"
        align="left"
        withBorder
      />
    </FieldMetaWrapper>
  );
}

export const TextFieldPlugin = {
  name: "text",
  Component: TextField,
  parse,
};
