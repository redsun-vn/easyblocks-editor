import { useEditorContext } from "@/EditorContext";
import { FieldBuilder } from "@/tinacms/form-builder";
import { useTranslation } from "@/useTranslation";
import { toArray } from "@/utils/array/toArray";
import { translatePanelLabel } from "@/utils/panelTranslation";
import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import { Colors } from "@redsun-vn/easyblocks-design-system";
import React from "react";
import styled from "styled-components";

const QuickFormatGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

/**
 * One panel field, shrunk to its control.
 *
 * The panel lays a field out for a 250px column: 16px of padding either side,
 * and the control pushed to the far end of the row from its label. On a bar
 * with no label and no column that turned into wide gaps with a control
 * floating at the right of each. Here the field is exactly as wide as its
 * control, starting where it starts. Scoped to the bar, so the panel keeps its
 * own layout.
 */
const QuickFormatControl = styled.div`
  flex: none;
  width: max-content;
  max-width: 100%;
  white-space: nowrap;

  /* The field's frame, and the box its control sits in. */
  & > div {
    padding: 0;
    gap: 0;
  }

  & > div > div {
    flex-grow: 0;
    justify-content: flex-start;
    width: auto;
  }
`;

/**
 * Splits the bar into its groups: how the block looks, what can be done with
 * it, and deleting it. Full height and dark enough to read against the white
 * bar — the first one was too faint to tell the groups apart.
 */
export const BarDivider = styled.div`
  flex: none;
  align-self: stretch;
  width: 1px;
  margin: 0 6px;
  background: ${Colors.black20};
`;

/**
 * The formatting controls on the selection's bar.
 *
 * Each one is the properties panel's own field, drawn without its label, so it
 * reads and writes exactly what the panel does: the breakpoint being edited, the
 * current language, a rich text selection sent to the canvas, a block's own
 * `change` rules. The label moves into the tooltip.
 */
export function SelectionFrameQuickFormat({
  fields,
  onInUseChange,
}: {
  fields: ReadonlyArray<InternalField>;
  /**
   * Whether one of the controls has focus. A dropdown's list is in a portal,
   * but React carries its focus events up through here all the same, so an
   * open list counts as in use.
   */
  onInUseChange: (isInUse: boolean) => void;
}) {
  const { form } = useEditorContext();
  const { t } = useTranslation();

  return (
    <QuickFormatGroup
      onFocus={() => onInUseChange(true)}
      onBlur={() => onInUseChange(false)}
    >
      {fields.map((field) => (
        <QuickFormatControl
          // By path: a block can show a child's field of the same name beside
          // its own, and the two must not share a control's state.
          key={toArray(field.name).join(",")}
          title={
            typeof field.label === "string"
              ? translatePanelLabel(field.label, t)
              : undefined
          }
        >
          <FieldBuilder form={form} field={field} isLabelHidden />
        </QuickFormatControl>
      ))}
    </QuickFormatGroup>
  );
}
