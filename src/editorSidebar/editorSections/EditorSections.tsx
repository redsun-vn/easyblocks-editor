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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { CANVAS_FRAME_PATH_ATTRIBUTE } from "../../EditableComponentBuilder/canvasLayers";
import { useEditorContext } from "../../EditorContext";
import { getDefaultTemplateForDefinition } from "../../templates/getTemplates";
import {
  getTemplateSources,
  type TTemplateSource,
} from "../../templates/templateSources";
import { canvasScrollTargetTop } from "../canvasScrollTarget";
import { getCategoryLabel, getLocalComponents } from "./getLocalGroups";
import { EditorSectionGroup, TSectionRow } from "./EditorSectionGroup";
import { EditorSectionSearch } from "./EditorSectionSearch";
import { EditorSectionsSkeleton } from "./EditorSectionsSkeleton";
import { matchesQuery } from "./panelSearch";
import {
  PANEL_DRAG_MIME,
  PANEL_DROP_MESSAGE,
  type PanelDropMessage,
} from "./panelDrag";
import { usePickerItemLabel } from "./pickerItemLabel";
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
// panel groups and the rows they draw.
export type TSectionTemplate = IComponentGroups[string]["templates"][number];

const TITLE_HEIGHT = 50;
// Page size for the per-category remote template fetch.
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
 *
 * Re-exported rather than declared: the picker dialog's list reads the same
 * libraries, and the two disagreeing about what a shop has is the bug this
 * shared module exists to prevent.
 */
export type { TTemplateSource } from "../../templates/templateSources";
export { getTemplateSources };

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
 * Where a section picked from the panel lands in the root collection: directly after the
 * selected section, which is where the user is looking. With nothing selected there is no
 * such position, so it goes to the end.
 *
 * `focussedField` can point deep inside a section (`data.2.Cards.0`); only the top level
 * index matters, because the panel always inserts into the root `data` collection.
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
  categoryOrder,
  t,
}: {
  panel: TSectionPanel;
  localGroups: string[];
  /** Discovered categories; absent until the discovery read has answered. */
  templateCategories?: TTemplateCategoryEntry[] | null;
  /** The order the app asked for; empty means sort by name, as before. */
  categoryOrder?: string[];
  t: (key: string) => string;
}): TSectionEntry[] {
  if (panel === "components") {
    // Sorting by name sorts the raw `group` strings, which are English. In an
    // editor speaking another language that order reads as random, so an app
    // may state the order it wants; anything it does not name follows, by name.
    const rank = (group: string) => {
      const index = (categoryOrder ?? []).indexOf(group);

      return index === -1 ? (categoryOrder ?? []).length : index;
    };

    return [...localGroups]
      .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
      .map((group) => ({
      id: `builtin:${group}`,
      label: getCategoryLabel(t, group),
      group,
      source: "builtin",
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
  options?: { categoryUuid?: string | null; limit?: number; search?: string },
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

/**
 * The panel: a search field that stays put, over a list that scrolls.
 *
 * The height is pinned rather than left to the content because the field has
 * to remain reachable however long the list below it grows.
 */
const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: calc(100vh - ${TOP_BAR_HEIGHT + TITLE_HEIGHT}px);
`;

const StyledList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 12px 16px;
`;

const StyledMessage = styled.div`
  padding: 6px;
  font-size: 12px;
  color: ${Colors.black500};
`;

export const EditorSections: React.FC<{ panel: TSectionPanel }> = ({
  panel,
}) => {
  const editorContext = useEditorContext();
  const toaster = useToaster();
  const { t } = useTranslation();
  const itemLabel = usePickerItemLabel();

  // What is typed, and what the backend has been asked for. They differ by a
  // keystroke or two on purpose — see the debounce below.
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Remote templates fetched per category row (paged), kept so scrolling back
  // up to a group does not fetch it again.
  const [remoteByEntry, setRemoteByEntry] = useState<
    Record<string, TEntryRemoteState>
  >({});
  const [loadingEntries, setLoadingEntries] = useState<Record<string, boolean>>(
    {},
  );
  // The category rows. `null` while the discovery read is still in flight,
  // which is what tells the Templates panel to show its skeleton.
  const [templateCategories, setTemplateCategories] = useState<
    TTemplateCategoryEntry[] | null
  >(null);
  // What the backend answered for the current search term, across libraries.
  const [searchResult, setSearchResult] = useState<TEntryRemoteState | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);

  // The host backend, widened with the optional template readers. An
  // intersection rather than a cast: every added member is optional, so the
  // plain contract still satisfies it and a missing implementation stays a
  // runtime-checkable `undefined` instead of a lie to the type checker.
  const templatesApi: Backend["templates"] & THostTemplateApi =
    editorContext.backend.templates;

  // Map raw API templates to the shape the rows consume.
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

  /**
   * Everything the panel can insert at the root, grouped and ready to draw.
   *
   * A component that ships presets contributes the presets — seven opener
   * layouts rather than one row called Opener — and a component with none
   * contributes the empty default built for it. That is the same arrangement
   * the add-section dialog shows, and the sidebar was listing only the
   * defaults, so an entire library of ready-made sections never appeared in it.
   */
  const localItemsByGroup = useMemo(() => {
    const accepted = new Map<string, any>();

    localComponents.forEach((component: any) => {
      if (component.visible === false) return;
      accepted.set(component.id, component);
    });

    const presets = (editorContext.configTemplates ?? []).filter((preset) =>
      accepted.has(preset.entry?._component),
    );
    const covered = new Set(presets.map((preset) => preset.entry._component));

    const items: TSectionTemplate[] = [
      ...presets.map((preset) => {
        const definition = accepted.get(preset.entry._component);

        return {
          ...(definition as object),
          ...preset,
          // The preset's own bucket when it names one, the component's
          // otherwise — a preset filed nowhere belongs with its component
          // rather than in the remainder.
          group: preset.group ?? definition?.group,
          template: preset,
        } as unknown as TSectionTemplate;
      }),
      ...[...accepted.values()]
        .filter((component) => !covered.has(component.id))
        .map(
          (component) =>
            ({
              ...component,
              group: component.group,
              template: getDefaultTemplateForDefinition(
                component,
                editorContext,
              ),
            }) as unknown as TSectionTemplate,
        ),
    ];

    const byGroup: Record<string, TSectionTemplate[]> = {};

    items.forEach((item) => {
      const group = item.group || "others";

      byGroup[group] = byGroup[group] ?? [];
      byGroup[group].push(item);
    });

    return byGroup;
  }, [localComponents, editorContext.configTemplates]);

  // The groups that actually hold something, which is what the rows are.
  const localGroups = useMemo(
    () => Object.keys(localItemsByGroup),
    [localItemsByGroup],
  );

  const entries = useMemo<TSectionEntry[]>(
    () =>
      buildSectionEntries({
        panel,
        localGroups,
        templateCategories,
        categoryOrder: editorContext.categoryOrder,
        t,
      }),
    [panel, localGroups, templateCategories, editorContext.categoryOrder, t],
  );

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

      if (options?.search) {
        query.search = options.search;
      }

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
   * One page across every library the mode may read.
   *
   * The libraries are paged in lockstep rather than one after the other: they
   * file into the same taxonomy, so a category row is their union, and asking
   * each for the same page number keeps that union growing until every library
   * is exhausted — at which point the accumulated item count reaches the summed
   * total and paging stops on its own.
   */
  const fetchPage = useCallback(
    (
      page: number,
      options: { categoryUuid?: string | null; search?: string },
    ): Promise<{ items: Template[]; total: number }> | null => {
      const requests = getTemplateSources(editorContext.mode)
        .map((source) => fetchRemotePage(source, page, options))
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

  /**
   * Brings a freshly inserted section into view.
   *
   * Found by path rather than by `_id`, because a canvas selection frame is
   * marked with its path and not every block ends up with an element carrying
   * its id. The retries stay: the section has to render before its frame is in
   * the document, and that is a frame or two away.
   */
  const scrollCanvasToComponent = useCallback((path: string) => {
    let attempts = 0;
    const maxAttempts = 20;

    const tryScroll = () => {
      const iframe = document.getElementById(
        "editor-canvas",
      ) as HTMLIFrameElement | null;
      const node = iframe?.contentDocument?.querySelector(
        `[${CANVAS_FRAME_PATH_ATTRIBUTE}="${path}"]`,
      );

      if (node && iframe?.contentWindow) {
        iframe.contentWindow.scrollTo({
          top: canvasScrollTargetTop({
            elementTop: node.getBoundingClientRect().top,
            scrollY: iframe.contentWindow.scrollY,
          }),
          behavior: "smooth",
        });
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
  // selected section. No keepId, so fresh ids are generated and a template can
  // be added multiple times.
  //
  // `indexOverride` is where a drag let go. A click carries no position of its
  // own, so it still lands after whatever is selected.
  const onAddTemplate = useCallback(
    (template: TSectionTemplate, indexOverride?: number) => {
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

      const sectionCount =
        editorContext.compiledComponentConfig?.components.data.length ?? 0;

      const insertionIndex =
        indexOverride === undefined
          ? getSectionInsertionIndex(editorContext.focussedField, sectionCount)
          : // The canvas measured the page it was drawing; clamped because that
            // measurement and this insert are two different moments.
            Math.min(Math.max(indexOverride, 0), sectionCount);

      editorContext.actions.insertItem({
        name: "data",
        index: insertionIndex,
        block: normalizedEntry,
      });

      toaster.success(t("editor.sidebar.sections.add.success"));

      // The insert went into the root collection at a known index, so that is
      // the new section's path. Reading it back out of `form.values` was the
      // roundabout way there, and the values are still the pre-insert ones at
      // this point anyway.
      scrollCanvasToComponent(`data.${insertionIndex}`);
    },
    [editorContext, scrollCanvasToComponent],
  );

  /**
   * The row being dragged, and the drop that ends the gesture.
   *
   * Held here rather than sent through the drag itself: a browser hides a
   * drag's contents until the drop, so the canvas could not read an item at
   * `dragover`, which is the moment it has to decide whether to accept one.
   * The canvas only reports where the pointer let go; which item that was is
   * the panel's own business and never leaves this frame.
   *
   * Nothing clears this when the drag ends, and that is deliberate. `dragend`
   * fires on the row the moment the drop completes, while the drop itself
   * reaches this frame as a posted message — a queued task that runs later. A
   * `dragend` that cleared the item won the race often enough that roughly
   * every other drop landed on nothing and was dropped in silence. The item is
   * cleared when a drop consumes it, and overwritten by the next drag; a value
   * left behind by an abandoned drag is read by nobody, because only a real
   * drop on the canvas sends the message that reads it.
   */
  const draggedTemplate = useRef<TSectionTemplate | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== PANEL_DROP_MESSAGE) {
        return;
      }

      const template = draggedTemplate.current;
      draggedTemplate.current = null;

      // A drop can arrive after the panel has moved on — switched list, or the
      // drag was abandoned and something else posted. Nothing to insert then.
      if (template) {
        onAddTemplate(template, (event.data as PanelDropMessage).index);
      }
    };

    window.addEventListener("message", onMessage);

    return () => window.removeEventListener("message", onMessage);
  }, [onAddTemplate]);

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

  /**
   * One page of one category row.
   *
   * Page 1 is asked for by the group itself as it comes into view, so a panel
   * of twenty categories costs one request per category the user actually
   * scrolls to rather than twenty on open.
   */
  const loadEntryPage = useCallback(
    (entry: TSectionEntry, page: number) => {
      const request = fetchPage(page, { categoryUuid: entry.categoryUuid ?? null });

      if (!request) {
        // No reader for this source: record an empty, complete page so the
        // group settles on "nothing here" instead of asking again.
        setRemoteByEntry((prev) => ({
          ...prev,
          [entry.id]: { items: [], page: 1, total: 0 },
        }));
        return;
      }

      setLoadingEntries((prev) => ({ ...prev, [entry.id]: true }));

      request
        .then((res) => {
          const items = mapRemoteItems(res.items);

          setRemoteByEntry((prev) => {
            const existing = page === 1 ? [] : (prev[entry.id]?.items ?? []);
            const merged = [...existing, ...items];

            return {
              ...prev,
              [entry.id]: {
                items: merged,
                page,
                total: res.total || merged.length,
              },
            };
          });
        })
        .catch(() => {
          // A failed read must not leave the group loading forever; an empty
          // page settles it, and the toast says why it is empty.
          setRemoteByEntry((prev) => ({
            ...prev,
            [entry.id]: prev[entry.id] ?? { items: [], page: 1, total: 0 },
          }));
          toaster.error(t("editor.sidebar.sections.load.error"));
        })
        .finally(() => {
          setLoadingEntries((prev) => ({ ...prev, [entry.id]: false }));
        });
    },
    [fetchPage, mapRemoteItems, toaster, t],
  );

  // What is typed leads what is asked for, so a five-letter word is one
  // request rather than five.
  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(query.trim()), 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Switching panels keeps the typed query out of the other list, where it
  // would silently hide most of what is there.
  useEffect(() => {
    setQuery("");
    setSearchTerm("");
  }, [panel]);

  /**
   * Searching the template library is a question for the backend.
   *
   * A shop can hold far more templates than its groups have loaded, so
   * filtering what happens to be in memory would answer "nothing found" for a
   * template that is sitting there — the quiet kind of wrong. The components
   * panel needs none of this: its items are all in memory already.
   */
  useEffect(() => {
    if (panel !== "templates" || !searchTerm) {
      setSearchResult(null);
      setIsSearching(false);
      return;
    }

    const request = fetchPage(1, { search: searchTerm });

    if (!request) {
      setSearchResult({ items: [], page: 1, total: 0 });
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    request
      .then((res) => {
        if (cancelled) return;

        const items = mapRemoteItems(res.items);
        setSearchResult({ items, page: 1, total: res.total || items.length });
      })
      .catch(() => {
        if (cancelled) return;
        setSearchResult({ items: [], page: 1, total: 0 });
        toaster.error(t("editor.sidebar.sections.load.error"));
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [panel, searchTerm, fetchPage, mapRemoteItems]);

  const labelOf = (template: TSectionTemplate) =>
    itemLabel(template.template?.id, template.label) ??
    template.template?.id ??
    "";

  /** Templates to rows, dropping the ones already listed under this group. */
  const toRows = (templates: TSectionTemplate[]): TSectionRow[] => {
    const seen = new Set<string>();
    const rows: TSectionRow[] = [];

    templates.forEach((template, index) => {
      const key = template.template?.id ?? `${template.id}-${index}`;

      if (seen.has(key)) return;
      seen.add(key);

      rows.push({
        key,
        label: labelOf(template),
        thumbnail: template.template?.thumbnail,
        onPick: () => onAddTemplate(template),
        onDragStart: (event) => {
          draggedTemplate.current = template;
          // The value is a formality — nothing reads it. Firefox refuses to
          // start a drag at all unless `setData` is called, and the type is
          // what the canvas checks for at `dragover`.
          event.dataTransfer.setData(PANEL_DRAG_MIME, key);
          event.dataTransfer.effectAllowed = "copy";
        },
      });
    });

    return rows;
  };

  // Built-in categories are derived from the form, which is still empty on the
  // first paint, so an empty components list means "not ready yet". Template
  // categories come from the discovery read, so there the skeleton runs until
  // that read answers — an empty list afterwards is genuinely "nothing here".
  const isLoadingList =
    panel === "components" ? entries.length === 0 : templateCategories === null;

  const isSearchingTemplates = panel === "templates" && searchTerm.length > 0;

  // One flat group of results replaces the taxonomy while a search is running:
  // the categories a result belongs to are not what the reader is looking for
  // at that moment, and most of them would be empty.
  const searchRows = isSearchingTemplates
    ? toRows(searchResult?.items ?? [])
    : [];

  const groups = entries.map((entry) => {
    const templates =
      entry.source === "builtin"
        ? (localItemsByGroup[entry.group ?? "others"] ?? [])
        : (remoteByEntry[entry.id]?.items ?? []);

    const rows = toRows(templates).filter((row) =>
      matchesQuery(row.label, panel === "components" ? query : ""),
    );

    const state = remoteByEntry[entry.id];

    return {
      entry,
      rows,
      isLoading: entry.source === "template" && !!loadingEntries[entry.id],
      hasMore: entry.source === "template" && !!state && state.items.length < state.total,
    };
  });

  // A query that matches nothing in any group is worth saying out loud, rather
  // than leaving a column of headings with nothing under them.
  const hasAnyRow = groups.some((group) => group.rows.length > 0);

  return (
    <StyledPanel>
      <EditorSectionSearch
        value={query}
        placeholder={t(
          panel === "components"
            ? "editor.sidebar.sections.search.components"
            : "editor.sidebar.sections.search.templates",
        )}
        clearLabel={t("editor.sidebar.sections.search.clear")}
        onChange={setQuery}
      />

      <StyledList>
        {isLoadingList && <EditorSectionsSkeleton />}

        {!isLoadingList && entries.length === 0 && (
          <StyledMessage>{t("noData")}!</StyledMessage>
        )}

        {!isLoadingList && isSearchingTemplates && (
          <EditorSectionGroup
            label={t("editor.sidebar.sections.search.results")}
            rows={searchRows}
            isLoading={isSearching}
            emptyLabel={t("editor.sidebar.sections.search.empty")}
          />
        )}

        {!isLoadingList &&
          !isSearchingTemplates &&
          groups.map(({ entry, rows, isLoading, hasMore }) => {
            // A group filtered down to nothing by a query is not a group the
            // reader asked to see; with no query it is a category that really
            // is empty, and saying so beats a heading over a blank.
            if (query && rows.length === 0 && entry.source === "builtin") {
              return null;
            }

            return (
              <EditorSectionGroup
                key={entry.id}
                label={entry.label}
                count={rows.length}
                rows={rows}
                isLoading={isLoading}
                hasMore={hasMore}
                emptyLabel={t("noData")}
                moreLabel={t("editor.sidebar.sections.more")}
                // Namespaced by panel: the two lists are read at different
                // moments and a group folded away in one is no statement about
                // a group of the same name in the other.
                storageKey={`${panel}:${entry.id}`}
                forceOpen={query.length > 0}
                onLoadMore={() =>
                  loadEntryPage(entry, (remoteByEntry[entry.id]?.page ?? 1) + 1)
                }
                onEnterView={
                  entry.source === "template"
                    ? () => {
                        if (remoteByEntry[entry.id] || loadingEntries[entry.id]) {
                          return;
                        }

                        loadEntryPage(entry, 1);
                      }
                    : undefined
                }
              />
            );
          })}

        {!isLoadingList &&
          !isSearchingTemplates &&
          query &&
          !hasAnyRow && (
            <StyledMessage>
              {t("editor.sidebar.sections.search.empty")}
            </StyledMessage>
          )}
      </StyledList>
    </StyledPanel>
  );
};
