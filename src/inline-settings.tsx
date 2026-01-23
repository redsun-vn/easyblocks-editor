import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import React, { MouseEvent } from "react";
import { styled } from "styled-components";
import { useEditorContext } from "./EditorContext";
import { SidebarFooter } from "./SidebarFooter";
import { SaveAsTemplatePicker } from "./TemplatePicker";
import { FieldsBuilder } from "./tinacms/form-builder";
import { StyleReset } from "./tinacms/styles";

interface InlineSettingsProps {
  fields: InternalField[];
  SaveAsPicker?: SaveAsTemplatePicker;
}

export function InlineSettings({ fields, SaveAsPicker }: InlineSettingsProps) {
  const hasNoExtraFields = !(fields && fields.length);

  if (hasNoExtraFields) {
    return null;
  }

  return (
    <StyleReset
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
      }}
      style={{ height: "100%" }}
    >
      {/* IMPORTANT: This stop propagation fixes issues with toggle unclicking */}
      <SettingsContent fields={fields} SaveAsPicker={SaveAsPicker} />
    </StyleReset>
  );
}
interface SettingsContentProps {
  title?: string;
  fields: InternalField[];
  SaveAsPicker?: SaveAsTemplatePicker;
}

function SettingsContent({ fields, SaveAsPicker }: SettingsContentProps) {
  const { form, focussedField } = useEditorContext();

  return (
    <FormBody id={"sidebar-panels-root"}>
      <Wrapper>
        <FieldsBuilder
          form={form}
          fields={fields}
          isEmptyField={!focussedField.length}
        />
        <SidebarFooter paths={focussedField} SaveAsPicker={SaveAsPicker} />
      </Wrapper>
    </FormBody>
  );
}

const FormBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-top: 1px solid var(--tina-color-grey-2);
  background-color: white;
`;

const Wrapper = styled.div`
  display: block;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;
