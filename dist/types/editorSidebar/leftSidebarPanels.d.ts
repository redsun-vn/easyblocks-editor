import { TEasyblocksEditorMode, TLeftSidebar } from "../types";
/**
 * Whether a mode may open one of the left-hand panels.
 *
 * Only the template editor is restricted, and the restriction is a rule about
 * the product rather than about the screen. Somebody working there is building
 * a template to sell, so they get the components it is assembled from — and not
 * the template library, which is the shelf their finished work will be listed
 * on rather than a supply of parts. Global sections are withheld for the same
 * reason: a template is not a site, so it has no site-wide header or footer.
 *
 * Read by the rail buttons and again by the panel they open. Two call sites for
 * one rule, which is why the rule is here and not written out at either of them.
 */
export declare function isLeftSidebarPanelAllowed(mode: TEasyblocksEditorMode, panel: TLeftSidebar): boolean;
//# sourceMappingURL=leftSidebarPanels.d.ts.map