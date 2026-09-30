import type {
  Config,
  NoCodeComponentEntry,
  TGlobalSectionChange,
} from "@redsun-vn/easyblocks-core";

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
export function globalSectionPageChanges({
  globalSections,
  pageEntries,
  currentDocument,
}: {
  globalSections: Config["globalSections"] | null | undefined;
  pageEntries: ReadonlyArray<NoCodeComponentEntry>;
  currentDocument: string;
}): Array<TGlobalSectionChange> {
  const changes: Array<TGlobalSectionChange> = [];

  for (const groupName in globalSections ?? {}) {
    const entities = globalSections![groupName].entities;

    for (const globalSectionEntryId in entities) {
      const sectionValue = entities[globalSectionEntryId];
      const isOnPage = pageEntries.some(
        (entryData) => entryData._id === globalSectionEntryId,
      );
      const isListed = sectionValue.pages.includes(currentDocument);

      if (isOnPage === isListed) {
        continue;
      }

      changes.push({
        label: sectionValue.label,
        mode: "update",
        groupName,
        entry: sectionValue.entry ?? {
          _id: globalSectionEntryId,
          _component: "",
        },
        pages: isOnPage
          ? [...sectionValue.pages, currentDocument]
          : sectionValue.pages.filter((page) => page !== currentDocument),
      });
    }
  }

  return changes;
}
