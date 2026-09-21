/**
 * Which sidebar groups this viewer has folded away.
 *
 * Groups open by default, so only the closed ones are worth storing: a first
 * visit, a cleared browser, a blocked storage — all of them fall through to
 * the whole library on show, which is the state somebody who has never used
 * the panel needs. What is stored is the exception the reader chose.
 *
 * It lives in `localStorage` because it is a convenience for one person at one
 * browser: nothing here belongs to the shop, and a teammate opening the same
 * theme should not inherit somebody else's folded panel.
 */

const STORAGE_KEY = "easyblocks.editor.sidebar.collapsedGroups";

/**
 * The stored keys, or none.
 *
 * Every access is guarded. `localStorage` is absent while rendering on a
 * server, throws outright in a private window or when site data is blocked,
 * and can hold anything at all once a hand has been in it — none of which is
 * a reason for the panel to stop working.
 */
const read = (): string[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;

    return Array.isArray(parsed)
      ? parsed.filter((key): key is string => typeof key === "string")
      : [];
  } catch {
    return [];
  }
};

/** Whether the viewer has folded this group away. */
export const isGroupCollapsed = (key: string): boolean => read().includes(key);

/** Folds a group away, or opens it again, for this browser. */
export const setGroupCollapsed = (key: string, collapsed: boolean): void => {
  if (typeof window === "undefined") {
    return;
  }

  const next = new Set(read());

  if (collapsed) {
    next.add(key);
  } else {
    next.delete(key);
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    // Storage is full or blocked. The panel still folds for this session; it
    // just will not remember, which is better than refusing the click.
  }
};
