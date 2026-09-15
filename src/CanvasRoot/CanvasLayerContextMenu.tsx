import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  CanvasLayer,
  getCanvasLayers,
} from "../EditableComponentBuilder/canvasLayers";
import type { EditorContextType } from "../EditorContext";
import { getTranslation } from "../useTranslation";
import {
  itemStyles,
  menuStyles,
  titleStyles,
} from "./canvasLayerContextMenuStyles";

type OpenedMenu = {
  x: number;
  y: number;
  layers: Array<CanvasLayer>;
};

const VIEWPORT_MARGIN = 8;

function clampToViewport(start: number, size: number, viewportSize: number) {
  return Math.max(
    VIEWPORT_MARGIN,
    Math.min(start, viewportSize - size - VIEWPORT_MARGIN),
  );
}

/**
 * Right-click menu listing every selection frame under the pointer, topmost first, so
 * layers covered by their children or by overlapping elements stay selectable from the
 * canvas.
 */
function CanvasLayerContextMenu({
  editorContext,
}: {
  editorContext: EditorContextType;
}) {
  const [openedMenu, setOpenedMenu] = useState<OpenedMenu | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = getTranslation(editorContext);

  function close() {
    setOpenedMenu(null);
    setHoveredPath(null);
  }

  useEffect(() => {
    function handleContextMenu(event: MouseEvent) {
      const target = event.target as Element | null;

      if (menuRef.current?.contains(target)) {
        return;
      }

      // Text editing keeps the native menu (copy, paste, spellcheck).
      if (target?.closest?.('input, textarea, [contenteditable="true"]')) {
        return;
      }

      const layers = getCanvasLayers(
        document.elementsFromPoint(event.clientX, event.clientY),
      );

      if (layers.length === 0) {
        return;
      }

      event.preventDefault();
      setOpenedMenu({ x: event.clientX, y: event.clientY, layers });
    }

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    if (!openedMenu) {
      return;
    }

    function closeWhenOutsideMenu(event: Event) {
      if (!menuRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    // Any key closes the menu: its layers were read from the DOM when it opened, and
    // editing shortcuts (delete, move) change them. Escape must not also select the parent.
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
      }

      close();
    }

    window.addEventListener("pointerdown", closeWhenOutsideMenu, true);
    window.addEventListener("scroll", closeWhenOutsideMenu, true);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("resize", close);
    window.addEventListener("blur", close);

    return () => {
      window.removeEventListener("pointerdown", closeWhenOutsideMenu, true);
      window.removeEventListener("scroll", closeWhenOutsideMenu, true);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("blur", close);
    };
  }, [openedMenu]);

  // Keep the whole menu inside the canvas viewport, measured before paint.
  useLayoutEffect(() => {
    const menuElement = menuRef.current;

    if (!openedMenu || !menuElement) {
      return;
    }

    const { width, height } = menuElement.getBoundingClientRect();

    menuElement.style.left = `${clampToViewport(openedMenu.x, width, window.innerWidth)}px`;
    menuElement.style.top = `${clampToViewport(openedMenu.y, height, window.innerHeight)}px`;
  }, [openedMenu]);

  if (!openedMenu) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={t("selectLayer")}
      style={menuStyles}
      // The canvas root clears the selection on click.
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div style={titleStyles}>{t("selectLayer")}</div>
      {openedMenu.layers.map((layer) => (
        <button
          key={layer.path}
          type="button"
          role="menuitem"
          style={{
            ...itemStyles,
            background:
              hoveredPath === layer.path
                ? "var(--tina-color-grey-2)"
                : "transparent",
            fontWeight: editorContext.focussedField.includes(layer.path)
              ? 600
              : 400,
          }}
          onMouseEnter={() => setHoveredPath(layer.path)}
          onMouseLeave={() => setHoveredPath(null)}
          onClick={() => {
            editorContext.setFocussedField(layer.path);
            close();
          }}
        >
          {layer.label}
        </button>
      ))}
    </div>
  );
}

export { CanvasLayerContextMenu };
