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

/** Shape both remote template endpoints answer with. */
type TTemplateListResult = {
  items?: Template[];
  count?: Record<string, { matchedCount: number; total: number }>;
};

/**
 * The public template path, exposed by the host app's backend on top of the
 * `Backend` contract.
 *
 * REDSUN templates have no `shop_id`, and every shop-side query is pinned to a
 * shop id down in Elasticsearch, so they can never come back through
 * `templates.getAll`. Showing them needs a genuinely different endpoint — the
 * public one, which only ever returns what an admin switched on — not a filter
 * applied to the shop result.
 *
 * Optional because the contract in `easyblocks-core` does not carry it: a host
 * that does not implement it simply has no REDSUN section, instead of breaking.
 */
type TPublicTemplateSource = {
  getAllPublic?: (query: TemplateQueryType) => Promise<TTemplateListResult>;
};

/** Where an entry in the section list reads its templates from. */
type TSectionSource = "builtin" | "shop" | "public";

export type TSectionEntry = {
  /** Stable key for hover state and for the per-entry template cache. */
  id: string;
  /** Already localized; the raw category string is kept in `group`. */
  label: string;
  /** Raw `.group` value, only set for built-in categories. */
  group?: string;
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
 * The entries of one panel, and only that panel.
 *
 * The two kinds are built from separate sources and never merged, which is the
 * whole point: the previous `[...new Set([...localGroups, ...remoteGroups])]`
 * put a shop's own group called "Layout" into the same row as the built-in
 * Layout category, so a saved template looked like a stock component.
 *
 * Each template source stays a single entry instead of being expanded into its
 * group names. A shop that saved templates under "Layout" would otherwise
 * reintroduce the collision one level down, with the same word appearing in
 * both panels. The group string survives as a per-template label in the picker.
 */
export function buildSectionEntries({
  panel,
  mode,
  localGroups,
  t,
}: {
  panel: TSectionPanel;
  mode: TEasyblocksEditorMode;
  localGroups: string[];
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

  // Admin edits the REDSUN library directly, so its own path already holds
  // exactly those templates and a second public read would be a duplicate.
  if (mode === "user") {
    return [
      {
        id: "public:redsun",
        label: t("editor.sidebar.sections.templates.redsun"),
        source: "public",
        kind: "template",
      },
      {
        id: "shop:own",
        label: t("editor.sidebar.sections.templates.shop"),
        source: "shop",
        kind: "template",
      },
    ];
  }

  return [
    {
      id: "shop:own",
      label: t("editor.sidebar.sections.templates.redsun"),
      source: "shop",
      kind: "template",
    },
  ];
}

/** Total matched documents across every group bucket of a count response. */
function sumMatchedCount(count: TTemplateListResult["count"]): number {
  return Object.values(count ?? {}).reduce(
    (sum, bucket) => sum + (bucket?.matchedCount ?? 0),
    0,
  );
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
        t,
      }),
    [panel, localGroups, editorContext.mode, t],
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
   * which is how a host without the public reader ends up with an empty REDSUN
   * section rather than an error.
   */
  const fetchRemotePage = useCallback(
    (source: TSectionSource, page: number): Promise<TTemplateListResult> | null => {
      const query: TemplateQueryType = { page, limit: TEMPLATES_LIMIT };

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

  // Preselect this panel's first entry so the drawer has something to show.
  useEffect(() => {
    const first = entries[0]?.id;
    if (first) setHoveredSection(first);
  }, []);

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
    const request = fetchRemotePage(hoveredEntry.source, 1);

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
    const request = fetchRemotePage(entry.source, nextPage);
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

  // Built-in categories are derived from the form, which is still empty on the
  // first paint, so an empty components list means "not ready yet". The
  // template list is static, so an empty one is genuinely "nothing here".
  const isLoadingList = panel === "components" && entries.length === 0;

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
              kind={entry.kind}
              hovered={hoveredSection === entry.id}
              onHoverSection={handleHoverSection}
            />
          ))}
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
          title={hoveredEntry.label}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
};
