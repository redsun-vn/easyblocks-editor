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
// Discovery only asks whether a category holds anything at all, never what, so
// it requests the smallest page the endpoint will answer with.
const CATEGORY_PROBE_LIMIT = 1;
// Translation key for the row collecting templates filed under no category.
const UNCATEGORIZED_LABEL_KEY = "others";

/** Shape both remote template endpoints answer with. */
type TTemplateListResult = {
  items?: Template[];
  count?: Record<string, { matchedCount: number; total: number }>;
};

/** One entry of the template taxonomy, as the host's backend returns it. */
type TTemplateCategoryOption = { id: string; name: string };

/**
 * The two template readers the host app's backend adds on top of the `Backend`
 * contract. Both optional, because `easyblocks-core` does not declare them: a
 * host that implements neither shows an empty Templates panel instead of
 * breaking.
 *
 * `getAllPublic` reads the system library. System templates have no `shop_id`,
 * and every shop-side query is pinned to a shop id down in Elasticsearch, so
 * they can never come back through `templates.getAll`; showing them needs a
 * genuinely different endpoint, not a filter applied to the shop result.
 *
 * `getCategories` reads the template taxonomy — the same list the save dialog
 * files a template under, which is what the panel's rows are built from.
 */
type THostTemplateApi = {
  getAllPublic?: (query: TemplateQueryType) => Promise<TTemplateListResult>;
  getCategories?: () => Promise<TTemplateCategoryOption[]>;
};

/** Which list a section row draws from: local definitions, or the store. */
type TSectionSource = "builtin" | "template";

/**
 * A remote template library. Both feed the same category rows; which of them a
 * mode may read is `getTemplateSources`.
 */
export type TTemplateSource = "shop" | "public";

/**
 * A category row of the Templates panel.
 *
 * `uuid` is null on the one row that is not a category at all: the remainder
 * holding every template filed under none.
 */
export type TTemplateCategoryEntry = {
  uuid: string | null;
  name: string | null;
};

export type TSectionEntry = {
  /** Stable key for the selection and for the per-entry template cache. */
  id: string;
  /** Already localized. */
  label: string;
  /** Raw `.group` value of a built-in category. Component rows only. */
  group?: string;
  /**
   * Template category to filter by. Template rows only, and absent on the
   * uncategorized row, which filters on "no category" instead.
   */
  categoryUuid?: string;
  source: TSectionSource;
  kind: TSectionItemKind;
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
 * The template libraries a mode may read.
 *
 * Admin edits the system library directly, so its own shop path already holds
 * exactly those templates and a second public read would be a duplicate.
 */
export function getTemplateSources(
  mode: TEasyblocksEditorMode,
): TTemplateSource[] {
  return mode === "user" ? ["public", "shop"] : ["shop"];
}

/** Categories A→Z, uncategorized last because it is the remainder, not a name. */
function sortTemplateCategories(
  categories: TTemplateCategoryEntry[],
): TTemplateCategoryEntry[] {
  return [...categories].sort((a, b) => {
    if (a.uuid === null) return b.uuid === null ? 0 : 1;
    if (b.uuid === null) return -1;
    return (a.name ?? "").localeCompare(b.name ?? "", "vi");
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
 * The Templates panel lists the template taxonomy — the very categories the
 * save dialog files a template under — rather than the free-text `group`
 * column it used to read. `group` is whatever anybody once typed, so it grew
 * near-duplicates ("product" beside "Product") that are not categories at all.
 * The rows carry no library heading: which library a template came from is not
 * how the user looks for one, and both libraries file into the same taxonomy,
 * so a category holds whatever the caller is allowed to see under that name.
 */
export function buildSectionEntries({
  panel,
  localGroups,
  templateCategories,
  t,
}: {
  panel: TSectionPanel;
  localGroups: string[];
  /** Discovered categories; absent until the discovery read has answered. */
  templateCategories?: TTemplateCategoryEntry[] | null;
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

  return sortTemplateCategories(templateCategories ?? []).map<TSectionEntry>(
    (category) => ({
      id: `category:${category.uuid ?? UNCATEGORIZED_LABEL_KEY}`,
      // A category name is data somebody typed, so it is shown verbatim. The
      // remainder row is this editor's own construct, so it is localized.
      label:
        category.uuid === null
          ? getCategoryLabel(t, UNCATEGORIZED_LABEL_KEY)
          : (category.name ?? ""),
      categoryUuid: category.uuid ?? undefined,
      source: "template",
      kind: "template",
    }),
  );
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
  source: TTemplateSource,
  page: number,
  /** `categoryUuid: null` asks for the templates filed under no category. */
  options?: { categoryUuid?: string | null; limit?: number },
) => Promise<TTemplateListResult> | null;

/**
 * Whether one category holds at least one template the caller may see.
 *
 * Asked of every library at once and answered by the smallest page the list
 * route will serve, because only the existence of a row matters here. A
 * category the caller cannot fill is left out rather than shown as a row whose
 * drawer opens empty.
 */
async function categoryHasTemplates(
  fetchPage: TFetchRemotePage,
  sources: TTemplateSource[],
  categoryUuid: string | null,
): Promise<{ hasTemplates: boolean; failed: boolean }> {
  // Never rejects: discovery waits on all of these at once, so one library
  // throwing — even synchronously, before its promise exists — must not strand
  // the panel behind a skeleton that has nothing left to resolve it.
  const results = await Promise.all(
    sources.map(async (source) => {
      try {
        const request = fetchPage(source, 1, {
          categoryUuid,
          limit: CATEGORY_PROBE_LIMIT,
        });

        // No reader for this source on this host: it contributes nothing,
        // which is not a failure and must not raise an error toast.
        if (!request) return { found: false, failed: false };

        return { found: ((await request).items ?? []).length > 0, failed: false };
      } catch {
        return { found: false, failed: true };
      }
    }),
  );

  return {
    hasTemplates: results.some((result) => result.found),
    failed: results.some((result) => result.failed),
  };
}

/**
 * The category rows the Templates panel shows.
 *
 * The taxonomy comes from the host backend, which is the same list the save
 * dialog offers, so a row exists for a category exactly when somebody could
 * have filed a template under it. The uncategorized remainder is appended
 * because it is not part of the taxonomy but still has to be reachable —
 * without it every template saved before the taxonomy existed would be
 * invisible.
 */
async function discoverTemplateCategories(
  fetchPage: TFetchRemotePage,
  listCategories: (() => Promise<TTemplateCategoryOption[]>) | undefined,
  sources: TTemplateSource[],
): Promise<{ categories: TTemplateCategoryEntry[]; failed: boolean }> {
  let taxonomy: TTemplateCategoryOption[] = [];
  let failed = false;

  if (listCategories) {
    try {
      taxonomy = await listCategories();
    } catch {
      failed = true;
    }
  }

  const candidates: TTemplateCategoryEntry[] = [
    ...taxonomy.map(({ id, name }) => ({ uuid: id, name })),
    { uuid: null, name: null },
  ];

  const probed = await Promise.all(
    candidates.map(async (candidate) => ({
      candidate,
      ...(await categoryHasTemplates(fetchPage, sources, candidate.uuid)),
    })),
  );

  return {
    categories: probed
      .filter((result) => result.hasTemplates)
      .map((result) => result.candidate),
    failed: failed || probed.some((result) => result.failed),
  };
}

const StyledEditorSectionGroup = styled.div`
  padding-left: 12px;
  padding-right: 12px;
  overflow-y: auto;
  max-height: calc(
    100vh - ${TOP_BAR_HEIGHT + TITLE_HEIGHT + PADDING_TOP_HEIGHT}px
  );
`;

export const EditorSections: React.FC<{ panel: TSectionPanel }> = ({
  panel,
}) => {
  const editorContext = useEditorContext();
  const toaster = useToaster();
  const { t } = useTranslation();
  const [selectedSection, setSelectedSection] = useState<string>("");
  // Drawer is closed until a row is clicked.
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
  // The category rows. `null` while the discovery read is still in flight,
  // which is what tells the Templates panel to show its skeleton.
  const [templateCategories, setTemplateCategories] = useState<
    TTemplateCategoryEntry[] | null
  >(null);

  // The host backend, widened with the optional template readers. An
  // intersection rather than a cast: every added member is optional, so the
  // plain contract still satisfies it and a missing implementation stays a
  // runtime-checkable `undefined` instead of a lie to the type checker.
  const templatesApi: Backend["templates"] & THostTemplateApi =
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
        localGroups,
        templateCategories,
        t,
      }),
    [panel, localGroups, templateCategories, t],
  );

  const entriesById = useMemo(() => {
    const map: Record<string, TSectionEntry> = {};
    entries.forEach((entry) => {
      map[entry.id] = entry;
    });
    return map;
  }, [entries]);

  const selectedEntry = entriesById[selectedSection];

  // Local-definition templates for the hovered built-in category (the default
  // "Empty X" templates built from the accepted components). Synchronous.
  const localTemplates = useMemo<TSectionTemplate[]>(() => {
    if (!selectedEntry || selectedEntry.source !== "builtin") return [];

    return localComponents
      .filter(
        (component: any) =>
          component.visible !== false &&
          (component.group || "others") === selectedEntry.group,
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
  }, [selectedEntry, localComponents]);

  /**
   * One page of one remote library. Returns null when the library is not
   * reachable, which is how a host without the public reader ends up with an
   * empty system section rather than an error.
   *
   * `categoryUuid` narrows the page to one category; `null` asks for the
   * templates filed under none, which the list route expresses as "the column
   * does not exist" rather than as a value to match.
   */
  const fetchRemotePage = useCallback<TFetchRemotePage>(
    (source, page, options) => {
      const query: TemplateQueryType = {
        page,
        limit: options?.limit ?? TEMPLATES_LIMIT,
      };

      if (options?.categoryUuid) {
        query.filters = `category_uuid:eq:${options.categoryUuid}`;
      } else if (options?.categoryUuid === null) {
        query.filters = "category_uuid:isnull";
      }

      if (source === "shop") {
        return templatesApi.getAll(query);
      }

      return templatesApi.getAllPublic?.(query) ?? null;
    },
    [templatesApi],
  );

  /**
   * One page of a category row, across every library the mode may read.
   *
   * The libraries are paged in lockstep rather than one after the other: they
   * file into the same taxonomy, so a category row is their union, and asking
   * each for the same page number keeps that union growing until every library
   * is exhausted — at which point the accumulated item count reaches the summed
   * total and paging stops on its own.
   */
  const fetchCategoryPage = useCallback(
    (
      entry: TSectionEntry,
      page: number,
    ): Promise<{ items: Template[]; total: number }> | null => {
      const requests = getTemplateSources(editorContext.mode)
        .map((source) =>
          fetchRemotePage(source, page, {
            categoryUuid: entry.categoryUuid ?? null,
          }),
        )
        .filter((request): request is Promise<TTemplateListResult> => !!request);

      if (requests.length === 0) return null;

      return Promise.all(requests).then((results) => ({
        items: results.flatMap((result) => result.items ?? []),
        total: results.reduce(
          (sum, result) => sum + sumMatchedCount(result.count),
          0,
        ),
      }));
    },
    [editorContext.mode, fetchRemotePage],
  );

  // Held in a ref so the discovery effect below can depend on the panel and the
  // mode alone. The host rebuilds its backend object freely, and a fetcher in
  // the dependency array would restart the discovery read on every such render.
  const fetchRemotePageRef = useRef<TFetchRemotePage>(fetchRemotePage);
  fetchRemotePageRef.current = fetchRemotePage;

  // Same reason: the taxonomy reader is a member of that same rebuilt object.
  const listCategoriesRef = useRef(templatesApi.getCategories);
  listCategoriesRef.current = templatesApi.getCategories;

  // The mode whose categories are already in state, so toggling between the
  // two panels does not discover them again.
  const discoveredForModeRef = useRef<TEasyblocksEditorMode | null>(null);

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

  // The category rows, discovered once per mode. Deliberately not once per
  // panel: both panels are the same mounted component, so re-running this when
  // the user toggles back to Templates would throw away rows that are still
  // valid and put the skeleton back while they are fetched again. A failed
  // discovery clears the marker, so the next visit does retry.
  useEffect(() => {
    if (panel !== "templates") return;
    if (discoveredForModeRef.current === editorContext.mode) return;
    discoveredForModeRef.current = editorContext.mode;

    let cancelled = false;
    let settled = false;
    setTemplateCategories(null);

    discoverTemplateCategories(
      fetchRemotePageRef.current,
      listCategoriesRef.current,
      getTemplateSources(editorContext.mode),
    ).then(({ categories, failed }) => {
      if (cancelled) return;
      settled = true;

      // One message however many reads failed: the user can only retry the
      // panel as a whole, so a toast per read would just repeat itself.
      setTemplateCategories(categories);
      if (failed) {
        discoveredForModeRef.current = null;
        toaster.error(t("editor.sidebar.sections.load.error"));
      }
    });

    return () => {
      cancelled = true;
      // Dropped before it could fill the state, so the marker must go back too
      // — otherwise the next visit would trust rows that were never stored and
      // sit on the skeleton forever.
      if (!settled) discoveredForModeRef.current = null;
    };
  }, [panel, editorContext.mode]);

  // Preselect this panel's first entry so the drawer has something to show.
  // Re-runs when the entries arrive, and also when a panel switch leaves the
  // selection pointing at a row this panel does not have.
  useEffect(() => {
    if (entries.some((entry) => entry.id === selectedSection)) return;

    const first = entries[0]?.id;
    if (first) setSelectedSection(first);
  }, [entries, selectedSection]);

  /**
   * Clicking a row opens its drawer; clicking the open row closes it again.
   *
   * Opening on hover made the drawer appear whenever the pointer crossed the
   * list on its way somewhere else, and each of those opened a category the
   * user had not asked for and fetched its first page. It also had no matching
   * way out — the drawer stayed until something was clicked — and closing on
   * mouse-leave instead would have pulled it away mid-drag, exactly when the
   * pointer must travel from a card to the canvas.
   */
  const handleSelectSection = useCallback(
    (id: string) => {
      setIsOpen((wasOpen) => !(wasOpen && id === selectedSection));
      setSelectedSection(id);
    },
    [selectedSection],
  );

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
    if (!selectedEntry || selectedEntry.source === "builtin") return;
    if (remoteByEntry[selectedEntry.id]) return;

    const entryId = selectedEntry.id;
    const request = fetchCategoryPage(selectedEntry, 1);

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

        const items = mapRemoteItems(res.items);
        setRemoteByEntry((prev) => ({
          ...prev,
          [entryId]: { items, page: 1, total: res.total || items.length },
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
  }, [selectedEntry, fetchCategoryPage]);

  // Whether the hovered entry has more remote templates to load (remote only;
  // local templates aren't paginated).
  const hasMore = useMemo(() => {
    const state = remoteByEntry[selectedSection];
    return !!state && state.items.length < state.total;
  }, [remoteByEntry, selectedSection]);

  // Load the next page of remote templates for the hovered entry (infinite
  // scroll). Appends to the existing items.
  const onLoadMore = useCallback(() => {
    const entry = selectedEntry;
    const state = entry ? remoteByEntry[entry.id] : undefined;
    if (!entry || !state || isFetching || isLoadingMore) return;
    if (entry.source === "builtin") return;
    if (state.items.length >= state.total) return;

    const nextPage = state.page + 1;
    const request = fetchCategoryPage(entry, nextPage);
    if (!request) return;

    setIsLoadingMore(true);

    request
      .then((res) => {
        const more = mapRemoteItems(res.items);
        setRemoteByEntry((prev) => {
          const existing = prev[entry.id]?.items ?? [];
          return {
            ...prev,
            [entry.id]: {
              items: [...existing, ...more],
              page: nextPage,
              total: res.total || prev[entry.id]?.total || 0,
            },
          };
        });
      })
      .catch(() => {
        toaster.error(t("editor.sidebar.sections.load.error"));
      })
      .finally(() => setIsLoadingMore(false));
  }, [
    selectedEntry,
    remoteByEntry,
    isFetching,
    isLoadingMore,
    mapRemoteItems,
    fetchCategoryPage,
  ]);

  // Drawer content for the hovered entry: built-in entries show the local
  // "Empty X" templates, template entries show what their source returned.
  // The two are never combined — that is the separation this phase is about.
  const drawerTemplates = useMemo(() => {
    if (!selectedEntry) return [];

    const source =
      selectedEntry.source === "builtin"
        ? localTemplates
        : (remoteByEntry[selectedEntry.id]?.items ?? []);

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
  }, [selectedEntry, localTemplates, remoteByEntry]);

  const drawerTitle = selectedEntry?.label;

  // Built-in categories are derived from the form, which is still empty on the
  // first paint, so an empty components list means "not ready yet". Template
  // categories come from the discovery read, so there the skeleton runs until
  // that read answers — an empty list afterwards is genuinely "nothing here".
  const isLoadingList =
    panel === "components"
      ? entries.length === 0
      : templateCategories === null;

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
          entries.map((entry) => (
            <EditorSectionItem
              key={entry.id}
              id={entry.id}
              name={entry.label}
              selected={selectedSection === entry.id}
              onSelectSection={handleSelectSection}
            />
          ))}
      </StyledEditorSectionGroup>
      {isOpen && selectedEntry ? (
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
