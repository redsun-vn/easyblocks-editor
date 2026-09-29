import { useEffect } from "react";

function canvasWindow(): Window | null {
  const iframe = document.getElementById(
    "editor-canvas",
  ) as HTMLIFrameElement | null;
  return iframe?.contentWindow ?? null;
}

/**
 * Esc cancels a drag, heard in the canvas as well as in the editor: focus
 * stays in the canvas after a block is picked by clicking it, and the canvas's
 * own Esc would otherwise select the parent and take the handle away mid-drag.
 */
export function useEscapeWhileDragging(
  isDragging: boolean,
  cancel: () => void,
) {
  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        event.preventDefault();
        cancel();
      }
    };

    const windows = [window, canvasWindow()].filter(
      (candidate): candidate is Window => candidate !== null,
    );

    windows.forEach((view) =>
      view.addEventListener("keydown", onKeyDown, true),
    );

    return () =>
      windows.forEach((view) =>
        view.removeEventListener("keydown", onKeyDown, true),
      );
  }, [isDragging, cancel]);
}
