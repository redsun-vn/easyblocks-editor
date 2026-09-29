import { useCallback, useState } from "react";

const STORAGE_KEY = "easyblocks-editor:show-outlines";

/**
 * Remembered for the tab, not for good: outlines are a way to find your
 * bearings on a page, and a fresh tab should show the page as it will look.
 * Storage can be missing or throw (private windows, blocked site data), and
 * then the toggle simply starts off.
 */
function readStored(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeStored(value: boolean) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Not remembering is harmless; the toggle still works for this page.
  }
}

/** Whether every block's boundary is drawn on the canvas, and the switch for it. */
export function useShowOutlinesPreference() {
  const [showOutlines, setShowOutlines] = useState(readStored);

  const toggleShowOutlines = useCallback(() => {
    setShowOutlines((previous) => {
      writeStored(!previous);
      return !previous;
    });
  }, []);

  return { showOutlines, toggleShowOutlines };
}
