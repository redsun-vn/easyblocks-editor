import { dotNotationGet } from "@/utils/object/dotNotationGet";
import {
  CompiledShopstoryComponentConfig,
  EditingInfoBase,
} from "@redsun-vn/easyblocks-core";
import {
  findComponentDefinitionById,
  isSchemaPropCollection,
  parsePath,
  SelectionFramePositionChangedEvent,
} from "@redsun-vn/easyblocks-core/_internals";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { SelectionFrameActions } from "../EditableComponentBuilder/SelectionFrameActions";
import { EditorContextType, useEditorContext } from "../EditorContext";
import { pathToCompiledPath } from "../pathToCompiledPath";
import { TEasyblocksEditorMode } from "../types";
import {
  isConfigPathRichTextPart,
  RICH_TEXT_PART_CONFIG_PATH_REGEXP,
} from "../utils/isConfigPathRichTextPart";
import { AddButton } from "./AddButton";
import { FrameWrapper, Wrapper } from "./SelectionFrame.styles";
import { calculateActionsPosition } from "./calculateActionsPosition";
import { calculateAddButtonsProperties } from "./calculateAddButtonProperties";
import {
  AFTER_ADD_BUTTON_DISPLAY,
  AFTER_ADD_BUTTON_LEFT,
  AFTER_ADD_BUTTON_TOP,
  BEFORE_ADD_BUTTON_DISPLAY,
  BEFORE_ADD_BUTTON_LEFT,
  BEFORE_ADD_BUTTON_TOP,
  SELECTION_ACTIONS_DISPLAY,
  SELECTION_ACTIONS_LEFT,
  SELECTION_ACTIONS_TOP,
} from "./cssVariables";
import { isSelectionPointerChanged } from "./selectionPointer";

/**
 * How long the bar waits after the pointer leaves before it fades.
 *
 * The bar sits a few pixels above the block, so reaching it means crossing a
 * gap where the pointer is over neither. Without a grace period that crossing
 * reads as "gone" and takes the bar away mid-travel, which is the whole reason
 * a timer was the wrong mechanism in the first place.
 */
const REVEAL_GRACE_MS = 260;

type SelectionFrameProps = {
  width: number;
  height: number;
  transform: string;
  editorMode: TEasyblocksEditorMode;
};

function SelectionFrame({
  width,
  height,
  transform,
  editorMode,
}: SelectionFrameProps) {
  const editorContext = useEditorContext();
  const {
    focussedField,
    form,
    actions,
    translationFiles = {},
    contextParams,
  } = editorContext;

  const compiledFocusedField =
    focussedField.length === 1
      ? pathToCompiledPath(focussedField[0], editorContext)
      : undefined;

  const compiledComponentConfig: CompiledShopstoryComponentConfig =
    compiledFocusedField
      ? dotNotationGet(
          editorContext.compiledComponentConfig,
          compiledFocusedField,
        )
      : undefined;

  const { direction = "vertical" } = compiledComponentConfig?.__editing ?? {};

  const isAddingEnabled = isAddingEnabledForSelectedFields(
    focussedField,
    editorContext,
  );

  /**
   * Whether the bar is on show.
   *
   * It follows the pointer rather than a clock: on while the pointer is over
   * the selected block or over the bar itself, off shortly after it leaves
   * both. Always-on cost the canvas a bar's worth of chrome for the whole time
   * somebody was working in the properties panel, which is most of the time.
   */
  const [isRevealed, setIsRevealed] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>();

  const revealActions = useCallback((isPointerNear: boolean) => {
    clearTimeout(fadeTimer.current);

    if (isPointerNear) {
      setIsRevealed(true);
      return;
    }

    fadeTimer.current = setTimeout(
      () => setIsRevealed(false),
      REVEAL_GRACE_MS,
    );
  }, []);

  useLayoutEffect(() => {
    if (focussedField.length === 0) {
      hideAddButtons();
      setIsRevealed(false);
    }
  }, [focussedField]);

  useLayoutEffect(() => () => clearTimeout(fadeTimer.current), []);

  useLayoutEffect(() => {
    // Two kinds of message arrive on this channel now, so the parameter is the
    // wide one and each branch narrows it for itself. Typed as one of them, the
    // other narrows to `never`.
    function handleSelectionFrameMessages(event: MessageEvent) {
      if (isSelectionPointerChanged(event.data)) {
        revealActions(event.data.payload.isPointerOver);
        return;
      }

      if (!isAddingEnabled) {
        hideAddButtons();
        return;
      }

      const data = event.data as SelectionFramePositionChangedEvent["data"];

      if (data.type === "@easyblocks-editor/selection-frame-position-changed") {
        const viewport = { width, height };

        updateAddButtons(
          direction,
          data.payload.target,
          viewport,
          data.payload.container,
        );

        updateSelectionActions(
          data.payload.target,
          viewport,
          data.payload.container,
        );
      }
    }

    window.addEventListener("message", handleSelectionFrameMessages);

    return () => {
      window.removeEventListener("message", handleSelectionFrameMessages);
    };
  }, [direction, height, isAddingEnabled, revealActions, width]);

  async function handleAddButtonClick(which: "before" | "after") {
    let path = focussedField.length === 1 ? focussedField[0] : undefined;

    if (!path) {
      return;
    }

    if (isConfigPathRichTextPart(path)) {
      path = path.replace(RICH_TEXT_PART_CONFIG_PATH_REGEXP, "");
    }

    const { parent, index } = parsePath(path, form);

    if (!parent || index === undefined) {
      return;
    }

    const definition = findComponentDefinitionById(
      parent.templateId,
      editorContext,
    );

    const schemaProp = definition?.schema.find(
      (schemaProp) => schemaProp.prop === parent.fieldName,
    );

    if (!schemaProp) {
      return;
    }

    const parentPath =
      parent.path + (parent.path === "" ? "" : ".") + parent.fieldName;

    const config = await actions.openComponentPicker({ path: parentPath });

    if (config) {
      actions.insertItem({
        name:
          schemaProp.type === "component-collection-localised"
            ? `${parentPath}.${editorContext.contextParams.locale}`
            : parentPath,
        index: which === "before" ? index : index + 1,
        block: config,
      });
    }
  }

  return (
    <Wrapper>
      <FrameWrapper width={width} height={height} transform={transform}>
        <AddButton
          position="before"
          onClick={() => handleAddButtonClick("before")}
        />
        <AddButton
          position="after"
          onClick={() => handleAddButtonClick("after")}
        />
        {isAddingEnabled ? (
          <SelectionFrameActions
            actions={actions}
            focussedField={focussedField}
            translationFiles={translationFiles}
            contextParams={contextParams}
            editorMode={editorMode}
            isRevealed={isRevealed}
            onPointerNear={revealActions}
          />
        ) : null}
      </FrameWrapper>
    </Wrapper>
  );
}

export { SelectionFrame };

function updateAddButtons(
  direction: Required<EditingInfoBase>["direction"],
  targetElementRect: DOMRect,
  viewport: {
    width: number;
    height: number;
  },
  containerElementRect?: DOMRect,
) {
  const { after, before } = calculateAddButtonsProperties(
    direction,
    targetElementRect,
    viewport,
    containerElementRect,
  );

  setCssVariable(BEFORE_ADD_BUTTON_TOP, before.top + "px");
  setCssVariable(BEFORE_ADD_BUTTON_LEFT, before.left + "px");
  setCssVariable(AFTER_ADD_BUTTON_TOP, after.top + "px");
  setCssVariable(AFTER_ADD_BUTTON_LEFT, after.left + "px");
  setCssVariable(BEFORE_ADD_BUTTON_DISPLAY, before.display);
  setCssVariable(AFTER_ADD_BUTTON_DISPLAY, after.display);
}

function updateSelectionActions(
  targetElementRect: DOMRect,
  viewport: {
    width: number;
    height: number;
  },
  containerElementRect?: DOMRect,
) {
  const { top, left, display } = calculateActionsPosition(
    targetElementRect,
    viewport,
    containerElementRect,
  );

  setCssVariable(SELECTION_ACTIONS_TOP, top + "px");
  setCssVariable(SELECTION_ACTIONS_LEFT, left + "px");
  setCssVariable(SELECTION_ACTIONS_DISPLAY, display);
}

function hideAddButtons() {
  setCssVariable(BEFORE_ADD_BUTTON_DISPLAY, "none");
  setCssVariable(AFTER_ADD_BUTTON_DISPLAY, "none");
  // The bar has its own switch now, so hiding the add buttons no longer hides
  // it by accident — it has to be told.
  setCssVariable(SELECTION_ACTIONS_DISPLAY, "none");
}

function setCssVariable(name: string, value: number | string) {
  document.documentElement.style.setProperty(name, value.toString());
}

function isAddingEnabledForSelectedFields(
  focusedFields: Array<string>,
  editorContext: EditorContextType,
) {
  if (focusedFields.length === 0) {
    return false;
  } else if (focusedFields.length === 1) {
    if (isConfigPathRichTextPart(focusedFields[0])) {
      return false;
    }

    const { parent } = parsePath(focusedFields[0], editorContext.form);

    if (!parent) return false;

    const parentDefinition = findComponentDefinitionById(
      parent.templateId,
      editorContext,
    );

    const schemaProp = parentDefinition?.schema.find(
      (schemaProp) => schemaProp.prop === parent.fieldName,
    );

    if (!schemaProp) return false;

    return isSchemaPropCollection(schemaProp);
  } else {
    return false;
  }
}
