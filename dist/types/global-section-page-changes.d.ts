import type { Config, NoCodeComponentEntry, TGlobalSectionChange } from "@redsun-vn/easyblocks-core";
/**
 * The global sections whose list of pages the current page changes.
 *
 * A section records which pages show it. The page shows it exactly when one
 * of its top-level entries carries the section's id, so the only news worth
 * telling the host is a section this page has just gained or just lost. Every
 * other edit leaves the list as it was, and telling the host anyway made it
 * rebuild the whole editor config and clear the server's page cache once per
 * keystroke — once per step of a canvas drag.
 */
export declare function globalSectionPageChanges({ globalSections, pageEntries, currentDocument, }: {
    globalSections: Config["globalSections"] | null | undefined;
    pageEntries: ReadonlyArray<NoCodeComponentEntry>;
    currentDocument: string;
}): Array<TGlobalSectionChange>;
//# sourceMappingURL=global-section-page-changes.d.ts.map