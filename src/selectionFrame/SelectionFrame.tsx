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
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { buildTinaFieldsForSelection } from "../buildTinaFields";
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
import {
  isPointerNearSelection,
  NO_POINTER,
  PointerLocation,
  withPointerAt,
} from "./pointerPresence";
import { pickCanvasResizeFields } from "./canvas-resize-fields";
import { pickQuickFormatFields } from "./quickFormatFields";
import { ResizeHandles } from "./resize-handles";
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
   * Words picked inside a rich text block. One frame is drawn for them — the
   * block's — however many runs of text the selection spans.
   */
  const isRichTextSelection =
    focussedField.length > 0 && focussedField.every(isConfigPathRichTextPart);

  /**
   * The panel's formatting fields for what is selected, offered on the bar too.
   *
   * Only for a selection with one frame to hang the bar from. Several blocks
   * picked at once each draw their own, and a bar that jumped between them
   * would be worse than the panel it is standing in for.
   */
  const selectionFields = useMemo(
    () =>
      focussedField.length === 1 || isRichTextSelection
        ? buildTinaFieldsForSelection(focussedField, editorContext)
        : [],
    // The fields follow the compiled config: a field the panel shows or hides
    // depending on another value (a button's background colour) must do the
    // same here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [focussedField, isRichTextSelection, editorContext.compiledComponentConfig],
  );

  const quickFormatFields = useMemo(
    () => pickQuickFormatFields(selectionFields),
    [selectionFields],
  );

  /** The fields the block's side and bottom handles set, when it has them. */
  const [widthResizeField, heightResizeField] = useMemo(() => {
    const resizeFields = isRichTextSelection
      ? []
      : pickCanvasResizeFields(selectionFields);

    return [
      resizeFields.find(({ option }) => option.axis === "x"),
      resizeFields.find(({ option }) => option.axis === "y"),
    ];
  }, [selectionFields, isRichTextSelection]);

  /**
   * The bar is shown for a block that can be duplicated and moved, and for any
   * single selection with something to format — a rich text selection, or a
   * block fixed in place, which has formatting but no neighbours to swap with.
   */
  const isBarShown = isAddingEnabled || quickFormatFields.length > 0;
  const barRef = useRef<HTMLDivElement>(null);

  /**
   * Whether the bar is on show.
   *
   * It follows the pointer rather than a clock: on while the pointer is over
   * the selected block or over the controls the selection puts on the canvas,
   * off shortly after it leaves them all. Always-on cost the canvas a bar's
   * worth of chrome for the whole time somebody was working in the properties
   * panel, which is most of the time.
   */
  const [isRevealed, setIsRevealed] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>();

  /** The two sources of "the pointer is near", each keeping its own answer. */
  const pointerPresence = useRef(NO_POINTER);

  const revealActions = useCallback(
    (where: PointerLocation, isPointerNear: boolean) => {
      pointerPresence.current = withPointerAt(
        pointerPresence.current,
        where,
        isPointerNear,
      );

      clearTimeout(fadeTimer.current);

      if (isPointerNearSelection(pointerPresence.current)) {
        setIsRevealed(true);
        return;
      }

      fadeTimer.current = setTimeout(
        () => setIsRevealed(false),
        REVEAL_GRACE_MS,
      );
    },
    [],
  );

  useLayoutEffect(() => {
    if (focussedField.length === 0) {
      hideAddButtons();
      hideSelectionActions();
      clearTimeout(fadeTimer.current);
      pointerPresence.current = NO_POINTER;
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
        revealActions("block", event.data.payload.isPointerOver);
        return;
      }

      if (!isAddingEnabled) {
        hideAddButtons();
      }

      if (!isBarShown) {
        hideSelectionActions();
        return;
      }

      const data = event.data as SelectionFramePositionChangedEvent["data"];

      if (data.type === "@easyblocks-editor/selection-frame-position-changed") {
        const viewport = { width, height };

        if (isAddingEnabled) {
          updateAddButtons(
            direction,
            data.payload.target,
            viewport,
            data.payload.container,
          );
        }

        updateSelectionActions(
          data.payload.target,
          viewport,
          data.payload.container,
          barRef.current,
        );
      }
    }

    window.addEventListener("message", handleSelectionFrameMessages);

    return () => {
      window.removeEventListener("message", handleSelectionFrameMessages);
    };
  }, [direction, height, isAddingEnabled, isBarShown, revealActions, width]);

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
      <FrameWrapper
        width={width}
        height={height}
        transform={transform}
        /*
          Every control the selection puts on the canvas lives in here, so one
          pair of handlers answers for all of them. `over`/`out` rather than
          `enter`/`leave` because only these bubble: the wrapper itself is
          transparent to the pointer and each control switches pointer events
          back on for itself. Moving between two of them fires `out` and then
          `over` in the same breath, and the grace period is what keeps that
          from reading as a departure.

          The add buttons used to be outside this reckoning, which made them
          the fastest way to lose the bar: they sit on the block's own edges,
          right where the pointer passes on its way to the bar.
        */
        onPointerOver={() => revealActions("controls", true)}
        onPointerOut={() => revealActions("controls", false)}
      >
        <AddButton
          position="before"
          isRevealed={isRevealed}
          onClick={() => handleAddButtonClick("before")}
        />
        <AddButton
          position="after"
          isRevealed={isRevealed}
          onClick={() => handleAddButtonClick("after")}
        />
        {widthResizeField || heightResizeField ? (
          <ResizeHandles
            // A fresh drag state for every block picked.
            key={focussedField[0]}
            widthField={widthResizeField}
            heightField={heightResizeField}
            path={focussedField[0]}
            addButtonsOn={
              isAddingEnabled
                ? direction === "horizontal"
                  ? "sides"
                  : "ends"
                : undefined
            }
          />
        ) : null}
        {isBarShown ? (
          <SelectionFrameActions
            actions={actions}
            focussedField={focussedField}
            translationFiles={translationFiles}
            contextParams={contextParams}
            editorMode={editorMode}
            isRevealed={isRevealed}
            quickFormatFields={quickFormatFields}
            hasStructuralActions={isAddingEnabled}
            barRef={barRef}
            onFormattingInUseChange={(isInUse) =>
              revealActions("formatting", isInUse)
            }
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
  bar?: HTMLElement | null,
) {
  function place() {
    const { top, left, display } = calculateActionsPosition(
      targetElementRect,
      viewport,
      containerElementRect,
      bar ? { width: bar.offsetWidth, height: bar.offsetHeight } : undefined,
    );

    setCssVariable(SELECTION_ACTIONS_TOP, top + "px");
    setCssVariable(SELECTION_ACTIONS_LEFT, left + "px");
    setCssVariable(SELECTION_ACTIONS_DISPLAY, display);
  }

  const wasHidden = !bar || bar.offsetWidth === 0;

  place();

  // A bar that was just switched on had no size to measure, and was placed as
  // if it were the structural buttons alone. Now it is shown it has one, and a
  // bar wider than that would hang off the canvas until the next scroll.
  if (wasHidden && bar && bar.offsetWidth > 0) {
    place();
  }
}

function hideAddButtons() {
  setCssVariable(BEFORE_ADD_BUTTON_DISPLAY, "none");
  setCssVariable(AFTER_ADD_BUTTON_DISPLAY, "none");
}

/**
 * The bar has its own switch, apart from the add buttons': a rich text
 * selection has no add buttons and still has a bar to show.
 */
function hideSelectionActions() {
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
