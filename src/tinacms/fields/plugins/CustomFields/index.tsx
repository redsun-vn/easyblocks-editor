import React from "react";
import { InputFieldType } from "../wrapFieldWithMeta";
import { useTokenTypes } from "../../../../utils/hooks/useTokenTypes";
import { FontCustomFields } from "./font/FontCustomFields";

export const CustomField = <
  ExtraFieldProps extends Record<string, unknown> = Record<string, unknown>,
  InputProps extends Record<string, unknown> = Record<string, unknown>
>({
  field,
  input,
}: Pick<InputFieldType<ExtraFieldProps, InputProps>, "field" | "input">) => {
  const tokenTypes = useTokenTypes();
  const tokenTypeDefinition = tokenTypes[field.schemaProp.type];

  switch (tokenTypeDefinition.token) {
    case "fonts": {
      return <FontCustomFields field={field} input={input} />;
    }

    default: {
      return null;
    }
  }
};
