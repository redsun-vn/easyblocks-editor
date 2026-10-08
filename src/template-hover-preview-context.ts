import type { InternalTemplate, Template } from "@redsun-vn/easyblocks-core";
import { createContext, useContext } from "react";

/**
 * Shows what a library item looks like once it is on the page, while the
 * pointer rests on it.
 *
 * The editor only says *when*: a row in the components or templates panel,
 * or a card in the host's picker dialog, calls `show` on hover and `hide` when
 * the pointer leaves or the item is clicked or dragged. Drawing the preview is
 * the host's job, because only the host can render its own components with its
 * own theme and data. Without a provider nothing happens and the lists behave
 * as they always have.
 */
export type TemplateHoverPreview = {
  /** `label` is the name the list shows for the item, captioned under the preview. */
  show: (
    template: Template | InternalTemplate,
    anchor: DOMRect,
    label?: string,
  ) => void;
  hide: () => void;
};

export const TemplateHoverPreviewContext =
  createContext<TemplateHoverPreview | null>(null);

export const useTemplateHoverPreview = () =>
  useContext(TemplateHoverPreviewContext);
