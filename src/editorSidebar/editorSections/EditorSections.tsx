import {
  Backend,
  ComponentDefinitionShared,
  Template,
  TemplateQueryType,
} from "@redsun-vn/easyblocks-core";
import {
  findComponentDefinitionById,
  normalize,
} from "@redsun-vn/easyblocks-core/_internals";
import { Colors } from "@redsun-vn/easyblocks-design-system";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useEditorContext } from "../../EditorContext";
import { getDefaultTemplateForDefinition } from "../../templates/getTemplates";
import {
  getCategoryLabel,
  getLocalComponents,
  getLocalGroups,
} from "./getLocalGroups";
import { EditorSectionDrawer } from "./drawer/EditorSectionDrawer";
import { EditorSectionItem, TSectionItemKind } from "./EditorSectionItem";
import { EditorSectionsSkeleton } from "./EditorSectionsSkeleton";
import { TOP_BAR_HEIGHT } from "../../EditorTopBar";
import { useToaster } from "@redsun-vn/easyblocks-design-system/Toaster";
import { useTranslation } from "../../useTranslation";
import { TEasyblocksEditorMode } from "../../types";

export interface IComponentGroups {
  [key: string]: {
    templates: (ComponentDefinitionShared & {
      group?: string;
      template: Template;
    })[];
    count: { matchedCount: number; total: number };
  };
}

// A single section template (flattened, group layer removed). Shared by the
// left list, the drawer gallery and the drawer card.
export type TSectionTemplate = IComponentGroups[string]["templates"][number];

const TITLE_HEIGHT = 50;
const PADDING_TOP_HEIGHT = 20;
// Page size for the per-entry remote template fetch (infinite scroll).
const TEMPLATES_LIMIT = 30;
// Category discovery only reads the group buckets, never the items, so it asks
// for the smallest page the endpoint will answer with.
const CATEGORY_DISCOVERY_LIMIT = 1;
// The bucket a template with no category falls into, exactly as the group count
// map keys it. The host's list route translates it back to "no group".
const UNCATEGORIZED_GROUP = "others";

/** Shape both remote template endpoints answer with. */
type TTemplateListResult = {
  items?: Template[];
  count?: Record<string, { matchedCount: number; total: number }>;
};

/**
 * The public template path, exposed by the host app's backend on top of the
 * `Backend` contract.
 *
 * System templates have no `shop_id`, and every shop-side query is pinned to a
 * shop id down in Elasticsearch, so they can never come back through
 * `templates.getAll`. Showing them needs a genuinely different endpoint — the
 * public one, which only ever returns what an admin switched on — not a filter
 * applied to the shop result.
 *
 * Optional because the contract in `easyblocks-core` does not carry it: a host
 * that does not implement it simply has no system section, instead of breaking.
 */
type TPublicTemplateSource = {
  getAllPublic?: (query: TemplateQueryType) => Promise<TTemplateListResult>;
};

/** Where an entry in the section list reads its templates from. */
type TSectionSource = "builtin" | "shop" | "public";

/**
 * A remote template library. `builtin` is derived from the local component
 * definitions and never appears here.
 */
export type TTemplateSource = Exclude<TSectionSource, "builtin">;

/** The categories each template library turned out to contain. */
export type TTemplateCategories = Partial<Record<TTemplateSource, string[]>>;

export type TSectionEntry = {
  /** Stable key for hover state and for the per-entry template cache. */
  id: string;
  /** Already localized; the raw category string is kept in `group`. */
  label: string;
  /** Raw `.group` value: a built-in category, or a template category name. */
  group?: string;
  source: TSectionSource;
  kind: TSectionItemKind;
  /**
   * Heading the row sits under. Only template rows carry one: the Templates
   * panel groups its categories by the library they came from, while the
   * Components panel is a single flat list with no heading at all.
   */
  sourceLabel?: string;
};

/**
 * Which of the two panels this instance is. Built-in components and saved
 * templates each own a rail button and a panel, so one instance only ever
 * builds and renders one of the two lists.
 */
export type TSectionPanel = "components" | "templates";

// Accumulated remote templates for one entry plus its paging cursor.
type TEntryRemoteState = {
  items: TSectionTemplate[];
  page: number;
  total: number;
};

/**
 * Where a section picked from the drawer lands in the root collection: directly after the
 * selected section, which is where the user is looking. With nothing selected there is no
 * such position, so it goes to the end.
 *
 * `focussedField` can point deep inside a section (`data.2.Cards.0`); only the top level
 * index matters, because the drawer always inserts into the root `data` collection.
 */
export function getSectionInsertionIndex(
  focussedField: Array<string>,
  sectionCount: number,
): number {
  const rootSectionIndex = focussedField[focussedField.length - 1]?.match(
    /^data\.(\d+)/,
  )?.[1];

  if (rootSectionIndex === undefined) {
    return sectionCount;
  }

  return Math.min(Number(rootSectionIndex) + 1, sectionCount);
}

/**
 * The template libraries a mode may read, in the order the panel lists them.
 *
 * Admin edits the system library directly, so its own shop path already holds
 * exactly those templates and a second public read would be a duplicate.
 */
export function getTemplateSources(
  mode: TEasyblocksEditorMode,
): Array<{ source: TTemplateSource; labelKey: string }> {
  if (mode === "user") {
    return [
      {
        source: "public",
        labelKey: "editor.sidebar.sections.templates.system",
      },
      { source: "shop", labelKey: "editor.sidebar.sections.templates.shop" },
    ];
  }

  return [
    { source: "shop", labelKey: "editor.sidebar.sections.templates.system" },
  ];
}

/**
 * Row label for a template category.
 *
 * A category name is data somebody typed, so it is shown verbatim — unlike a
 * built-in component group, which is one of a fixed set the translation file
 * knows by name. The single exception is the uncategorized bucket: that key is
 * this editor's own sentinel rather than a name anybody chose, so it takes the
 * localized "others" label.
 */
function getTemplateCategoryLabel(
  t: (key: string) => string,
  group: string,
): string {
  return group === UNCATEGORIZED_GROUP
    ? getCategoryLabel(t, UNCATEGORIZED_GROUP)
    : group;
}

/** Categories A→Z, uncategorized last because it is the remainder, not a name. */
function sortTemplateCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    if (a === b) return 0;
    if (a === UNCATEGORIZED_GROUP) return 1;
    if (b === UNCATEGORIZED_GROUP) return -1;
    return a.localeCompare(b, "vi");
  });
}

/**
 * The entries of one panel, and only that panel.
 *
 * The two kinds are built from separate sources and never merged, which is the
 * whole point: the previous `[...new Set([...localGroups, ...remoteGroups])]`
 * put a shop's own group called "Layout" into the same row as the built-in
 * Layout category, so a saved template looked like a stock component.
 *
 * A template library is expanded into one row per category it actually
 * contains, mirroring how the Components panel lists its built-in categories.
 * The collision the split was made to prevent is held off by `sourceLabel`
 * instead: category rows sit under a heading naming their library, so a shop
 * category called "Layout" reads as the shop's, never as the built-in one, and
 * the two libraries may each carry a category of the same name without the
 * panel showing two rows that look identical.
 *
 * A library with no categories contributes nothing — no heading, no row —
 * because `categoriesBySource` only ever lists buckets that matched something.
 */
export function buildSectionEntries({
  panel,
  mode,
  localGroups,
  categoriesBySource,
  t,
}: {
  panel: TSectionPanel;
  mode: TEasyblocksEditorMode;
  localGroups: string[];
  /** Discovered per library; absent until the discovery read has answered. */
  categoriesBySource?: TTemplateCategories | null;
  t: (key: string) => string;
}): TSectionEntry[] {
  if (panel === "components") {
    return [...localGroups].sort().map((group) => ({
      id: `builtin:${group}`,
      label: getCategoryLabel(t, group),
      group,
      source: "builtin",
      kind: "builtin",
    }));
  }

  return getTemplateSources(mode).flatMap(({ source, labelKey }) => {
    const categories = sortTemplateCategories(
      categoriesBySource?.[source] ?? [],
    );

    if (categories.length === 0) return [];

    const sourceLabel = t(labelKey);

    return categories.map<TSectionEntry>((group) => ({
      id: `${source}:${group}`,
      label: getTemplateCategoryLabel(t, group),
      group,
      source,
      kind: "template",
      sourceLabel,
    }));
  });
}

/** Total matched documents across every group bucket of a count response. */
function sumMatchedCount(count: TTemplateListResult["count"]): number {
  return Object.values(count ?? {}).reduce(
    (sum, bucket) => sum + (bucket?.matchedCount ?? 0),
    0,
  );
}

/**
 * Reads one page of one template source. Returns null when the source has no
 * reader on this host, which is how a missing implementation ends up as an
 * empty library instead of an error.
 */
type TFetchRemotePage = (
  source: TSectionSource,
  page: number,
  options?: { group?: string; limit?: number },
) => Promise<TTemplateListResult> | null;

/**
 * The categories one template library actually contains.
 *
 * No extra endpoint is involved: every list response already carries the group
 * bucket map the host builds for its counters, and those buckets are keyed by
 * the template's `group` — the very category name the save dialog writes. Only
 * `matchedCount` is consulted, because `total` counts the whole index while
 * `matchedCount` counts what the caller's own scope matched, so an empty
 * category never produces a row the drawer cannot fill.
 */
async function readSourceCategories(
  fetchPage: TFetchRemotePage,
  source: TTemplateSource,
): Promise<{ source: TTemplateSource; categories: string[]; failed: boolean }> {
  // Never rejects: the panel waits on all of these at once, so one library
  // throwing — even synchronously, before its promise exists — must not strand
  // the others behind a skeleton that has nothing left to resolve it.
  try {
    const request = fetchPage(source, 1, { limit: CATEGORY_DISCOVERY_LIMIT });

    // No reader for this source on this host: it contributes no rows, which is
    // not a failure and must not raise an error toast.
    if (!request) return { source, categories: [], failed: false };

    const count = (await request).count ?? {};
    const categories = Object.keys(count).filter(
      (group) => (count[group]?.matchedCount ?? 0) > 0,
    );

    return { source, categories, failed: false };
  } catch {
    return { source, categories: [], failed: true };
  }
}

const StyledEditorSectionGroup = styled.div`
  padding-left: 12px;
  padding-right: 12px;
  overflow-y: auto;
  max-height: calc(
    100vh - ${TOP_BAR_HEIGHT + TITLE_HEIGHT + PADDING_TOP_HEIGHT}px
  );
`;

// Names the library a run of category rows belongs to. Muted and uppercase so
// it reads as a heading rather than as one more clickable row; the panel is
// only 200px wide, so the source is said once here instead of being prefixed
// onto every row, where it would push the category names into an ellipsis.
const StyledSourceHeading = styled.div`
  font-size: var(--tina-font-size-0);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${Colors.black40};
  padding: 4px;
  margin-top: 12px;

  &:first-child {
    margin-top: 0;
  }
`;

export const EditorSections: React.FC<{ panel: TSectionPanel }> = ({
  panel,
}) => {
  const editorContext = useEditorContext();
  const toaster = useToaster();
  const { t } = useTranslation();
  const [hoveredSection, setHoveredSection] = useState<string>("");
  // Drawer is closed until the user hovers a section; click-outside closes it.
  const [isOpen, setIsOpen] = useState(false);
  const sectionListRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  // Remote templates fetched per entry (paged), cached so a re-hover doesn't
  // refetch. `isFetching` = first page; `isLoadingMore` = subsequent pages.
  const [remoteByEntry, setRemoteByEntry] = useState<
    Record<string, TEntryRemoteState>
  >({});
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Categories per template library. `null` while the discovery read is still
  // in flight, which is what tells the Templates panel to show its skeleton.
  const [categoriesBySource, setCategoriesBySource] =
    useState<TTemplateCategories | null>(null);

  // The host backend, widened with the optional public-template reader. An
  // intersection rather than a cast: every added member is optional, so the
  // plain contract still satisfies it and a missing implementation stays a
  // runtime-checkable `undefined` instead of a lie to the type checker.
  const templatesApi: Backend["templates"] & TPublicTemplateSource =
    editorContext.backend.templates;

  // Map raw API templates to the shape the drawer/card consume.
  const mapRemoteItems = useCallback(
    (items: Template[]) =>
      items.map((tpl) => {
        const definition = findComponentDefinitionById(
          tpl.entry._component,
          editorContext,
        );

        return {
          ...(definition as object),
          ...tpl,
          group: tpl.group,
          template: tpl,
        } as unknown as TSectionTemplate;
      }),
    [editorContext],
  );

  // Local components: the components the root "data" field accepts. Sync.
  const localComponents = useMemo(
    () => getLocalComponents(editorContext),
    [editorContext.form.values, editorContext.definitions],
  );

  // Local groups: the .group values of the accepted components.
  const localGroups = useMemo(
    () => getLocalGroups(localComponents),
    [localComponents],
  );

  const entries = useMemo<TSectionEntry[]>(
    () =>
      buildSectionEntries({
        panel,
        mode: editorContext.mode,
        localGroups,
        categoriesBySource,
        t,
      }),
    [panel, localGroups, editorContext.mode, categoriesBySource, t],
  );

  const entriesById = useMemo(() => {
    const map: Record<string, TSectionEntry> = {};
    entries.forEach((entry) => {
      map[entry.id] = entry;
    });
    return map;
  }, [entries]);

  const hoveredEntry = entriesById[hoveredSection];

  // Local-definition templates for the hovered built-in category (the default
  // "Empty X" templates built from the accepted components). Synchronous.
  const localTemplates = useMemo<TSectionTemplate[]>(() => {
    if (!hoveredEntry || hoveredEntry.source !== "builtin") return [];

    return localComponents
      .filter(
        (component: any) =>
          component.visible !== false &&
          (component.group || "others") === hoveredEntry.group,
      )
      .map((component: any) => {
        const template = getDefaultTemplateForDefinition(
          component,
          editorContext,
        );

        return {
          ...component,
          group: component.group,
          template,
        } as unknown as TSectionTemplate;
      });
  }, [hoveredEntry, localComponents]);

  /**
   * One page of a remote source. Returns null when the source is not reachable,
   * which is how a host without the public reader ends up with an empty system
   * section rather than an error.
   *
   * `group` narrows the page to one category. It is sent on `group.keyword`
   * rather than `group` because that is the exact-match field the host's list
   * route accepts, and the uncategorized sentinel travels as-is: the host
   * translates it back into "no group" on its way to the index.
   */
  const fetchRemotePage = useCallback<TFetchRemotePage>(
    (source, page, options) => {
      const query: TemplateQueryType = {
        page,
        limit: options?.limit ?? TEMPLATES_LIMIT,
      };

      if (options?.group) {
        query.filters = `group.keyword:eq:${options.group}`;
      }

      if (source === "shop") {
        return templatesApi.getAll(query);
      }

      if (source === "public") {
        return templatesApi.getAllPublic?.(query) ?? null;
      }

      return null;
    },
    [templatesApi],
  );

  // Held in a ref so the discovery effect below can depend on the panel and the
  // mode alone. The host rebuilds its backend object freely, and a fetcher in
  // the dependency array would restart the discovery read on every such render.
  const fetchRemotePageRef = useRef<TFetchRemotePage>(fetchRemotePage);
  fetchRemotePageRef.current = fetchRemotePage;

  // Smoothly scroll the editor canvas to a component by its config id. The
  // canvas renders asynchronously after insert, so poll briefly for the node.
  const scrollCanvasToComponent = useCallback((id: string) => {
    let attempts = 0;
    const maxAttempts = 20;

    const tryScroll = () => {
      const iframe = document.getElementById(
        "editor-canvas",
      ) as HTMLIFrameElement | null;
      const node = iframe?.contentDocument?.getElementById(id);

      if (node && iframe?.contentWindow) {
        const top =
          node.getBoundingClientRect().top + iframe.contentWindow.scrollY;
        iframe.contentWindow.scrollTo({ top, behavior: "smooth" });
        return;
      }

      if (attempts < maxAttempts) {
        attempts += 1;
        setTimeout(tryScroll, 50);
      }
    };

    tryScroll();
  }, []);

  // Insert the picked template into the root "data" collection, right after the
  // selected section. No keepId, so fresh ids are generated and a template can be
  // added multiple times. Used by the drawer cards only.
  const onAddTemplate = useCallback(
    (template: TSectionTemplate) => {
      const entry = template.template?.entry;
      if (!entry) {
        toaster.error(t("editor.sidebar.sections.add.error"));
        return;
      }

      // Raw API entries aren't normalized; normalize the picked entry before insert.
      const normalizedEntry = normalize(
        { ...entry, _itemProps: {} },
        editorContext,
      );

      const insertionIndex = getSectionInsertionIndex(
        editorContext.focussedField,
        editorContext.compiledComponentConfig?.components.data.length ?? 0,
      );

      editorContext.actions.insertItem({
        name: "data",
        index: insertionIndex,
        block: normalizedEntry,
      });

      toaster.success(t("editor.sidebar.sections.add.success"));

      // Scroll the canvas to wherever the new section landed.
      const data = (editorContext.form.values?.data ?? []) as Array<{
        _id?: string;
      }>;
      const newId = data[insertionIndex]?._id;
      if (newId) scrollCanvasToComponent(newId);
    },
    [editorContext, scrollCanvasToComponent],
  );

  // Which categories each template library holds. One read per library, issued
  // once per panel and mode; the per-category pages come later, on hover.
  useEffect(() => {
    if (panel !== "templates") return;

    let cancelled = false;
    setCategoriesBySource(null);

    Promise.all(
      getTemplateSources(editorContext.mode).map(({ source }) =>
        readSourceCategories(fetchRemotePageRef.current, source),
      ),
    ).then((results) => {
      if (cancelled) return;

      const next: TTemplateCategories = {};
      results.forEach(({ source, categories }) => {
        next[source] = categories;
      });

      // One message however many libraries failed: the user can only retry the
      // panel as a whole, so a toast per library would just repeat itself.
      setCategoriesBySource(next);
      if (results.some(({ failed }) => failed)) {
        toaster.error(t("editor.sidebar.sections.load.error"));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [panel, editorContext.mode]);

  // Preselect this panel's first entry so the drawer has something to show.
  // Re-runs when the entries arrive, and also when a panel switch leaves the
  // selection pointing at a row this panel does not have.
  useEffect(() => {
    if (entries.some((entry) => entry.id === hoveredSection)) return;

    const first = entries[0]?.id;
    if (first) setHoveredSection(first);
  }, [entries, hoveredSection]);

  // Hovering a section selects it and opens the drawer.
  const handleHoverSection = useCallback((id: string) => {
    setHoveredSection(id);
    setIsOpen(true);
  }, []);

  // Close the drawer when clicking outside both the section list and the drawer.
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideList = sectionListRef.current?.contains(target);
      const insideDrawer = drawerRef.current?.contains(target);
      if (!insideList && !insideDrawer) {
        setIsOpen(false);
      }
    };

    // Clicks inside the editor canvas (an iframe) don't bubble to the parent
    // document, so listen inside it too. Any canvas click closes the drawer.
    const closeOnIframeClick = () => setIsOpen(false);
    const canvasIframe = document.getElementById(
      "editor-canvas",
    ) as HTMLIFrameElement | null;
    const canvasDoc = canvasIframe?.contentDocument;

    document.addEventListener("mousedown", handleClickOutside);
    canvasDoc?.addEventListener("mousedown", closeOnIframeClick, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      canvasDoc?.removeEventListener("mousedown", closeOnIframeClick, true);
    };
  }, [isOpen]);

  // First page for the hovered template entry. Cached per entry so re-hovering
  // is instant; built-in entries never reach here.
  useEffect(() => {
    if (!hoveredEntry || hoveredEntry.source === "builtin") return;
    if (remoteByEntry[hoveredEntry.id]) return;

    const entryId = hoveredEntry.id;
    const request = fetchRemotePage(hoveredEntry.source, 1, {
      group: hoveredEntry.group,
    });

    if (!request) {
      // No reader for this source: record an empty, complete page so the
      // drawer settles on "no data" instead of retrying on every hover.
      setRemoteByEntry((prev) => ({
        ...prev,
        [entryId]: { items: [], page: 1, total: 0 },
      }));
      return;
    }

    let cancelled = false;
    setIsFetching(true);

    request
      .then((res) => {
        if (cancelled) return;

        const items = mapRemoteItems(res.items ?? []);
        setRemoteByEntry((prev) => ({
          ...prev,
          [entryId]: {
            items,
            page: 1,
            total: sumMatchedCount(res.count) || items.length,
          },
        }));
      })
      .catch(() => {
        if (cancelled) return;
        // A failed listing must not leave the drawer spinning forever.
        setRemoteByEntry((prev) => ({
          ...prev,
          [entryId]: { items: [], page: 1, total: 0 },
        }));
        toaster.error(t("editor.sidebar.sections.load.error"));
      })
      .finally(() => {
        if (!cancelled) setIsFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hoveredEntry, fetchRemotePage]);

  // Whether the hovered entry has more remote templates to load (remote only;
  // local templates aren't paginated).
  const hasMore = useMemo(() => {
    const state = remoteByEntry[hoveredSection];
    return !!state && state.items.length < state.total;
  }, [remoteByEntry, hoveredSection]);

  // Load the next page of remote templates for the hovered entry (infinite
  // scroll). Appends to the existing items.
  const onLoadMore = useCallback(() => {
    const entry = hoveredEntry;
    const state = entry ? remoteByEntry[entry.id] : undefined;
    if (!entry || !state || isFetching || isLoadingMore) return;
    if (entry.source === "builtin") return;
    if (state.items.length >= state.total) return;

    const nextPage = state.page + 1;
    const request = fetchRemotePage(entry.source, nextPage, {
      group: entry.group,
    });
    if (!request) return;

    setIsLoadingMore(true);

    request
      .then((res) => {
        const more = mapRemoteItems(res.items ?? []);
        setRemoteByEntry((prev) => {
          const existing = prev[entry.id]?.items ?? [];
          return {
            ...prev,
            [entry.id]: {
              items: [...existing, ...more],
              page: nextPage,
              total: sumMatchedCount(res.count) || prev[entry.id]?.total || 0,
            },
          };
        });
      })
      .catch(() => {
        toaster.error(t("editor.sidebar.sections.load.error"));
      })
      .finally(() => setIsLoadingMore(false));
  }, [
    hoveredEntry,
    remoteByEntry,
    isFetching,
    isLoadingMore,
    mapRemoteItems,
    fetchRemotePage,
  ]);

  // Drawer content for the hovered entry: built-in entries show the local
  // "Empty X" templates, template entries show what their source returned.
  // The two are never combined — that is the separation this phase is about.
  const drawerTemplates = useMemo(() => {
    if (!hoveredEntry) return [];

    const source =
      hoveredEntry.source === "builtin"
        ? localTemplates
        : (remoteByEntry[hoveredEntry.id]?.items ?? []);

    const seen = new Set<string>();
    const result: TSectionTemplate[] = [];

    source.forEach((template) => {
      const id = template.template?.id ?? template.id;
      if (id && !seen.has(id)) {
        seen.add(id);
        result.push(template);
      }
    });

    return result;
  }, [hoveredEntry, localTemplates, remoteByEntry]);

  // The drawer names the library as well as the category. Two libraries may
  // each hold a category of the same name, and the drawer is where the user
  // actually picks, so "which library is this?" has to be answerable there too.
  const drawerTitle = hoveredEntry?.sourceLabel
    ? `${hoveredEntry.sourceLabel} · ${hoveredEntry.label}`
    : hoveredEntry?.label;

  // Built-in categories are derived from the form, which is still empty on the
  // first paint, so an empty components list means "not ready yet". Template
  // categories come from the discovery read, so there the skeleton runs until
  // that read answers — an empty list afterwards is genuinely "nothing here".
  const isLoadingList =
    panel === "components"
      ? entries.length === 0
      : categoriesBySource === null;

  return (
    <>
      <StyledEditorSectionGroup ref={sectionListRef}>
        {isLoadingList && <EditorSectionsSkeleton />}

        {!isLoadingList && entries.length === 0 && (
          <Typography variant="body" style={{ paddingLeft: 4 }}>
            {t("noData")}!
          </Typography>
        )}

        {!isLoadingList &&
          entries.map((entry, index) => {
            // A heading opens each run of rows belonging to a new library.
            const startsLibrary =
              !!entry.sourceLabel &&
              entry.source !== entries[index - 1]?.source;

            return (
              <React.Fragment key={entry.id}>
                {startsLibrary && (
                  <StyledSourceHeading>{entry.sourceLabel}</StyledSourceHeading>
                )}
                <EditorSectionItem
                  id={entry.id}
                  name={entry.label}
                  kind={entry.kind}
                  hovered={hoveredSection === entry.id}
                  onHoverSection={handleHoverSection}
                />
              </React.Fragment>
            );
          })}
      </StyledEditorSectionGroup>
      {isOpen && hoveredEntry ? (
        <EditorSectionDrawer
          templates={drawerTemplates}
          isFetching={isFetching && drawerTemplates.length === 0}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          onAddTemplate={onAddTemplate}
          containerRef={drawerRef}
          title={drawerTitle}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
};
