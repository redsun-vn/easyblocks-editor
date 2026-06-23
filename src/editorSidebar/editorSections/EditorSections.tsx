import {
  ComponentDefinitionShared,
  ComponentSchemaProp,
  Template,
} from "@redsun-vn/easyblocks-core";
import {
  findComponentDefinition,
  findComponentDefinitionById,
  normalize,
} from "@redsun-vn/easyblocks-core/_internals";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useEditorContext } from "../../EditorContext";
import { unrollAcceptsFieldIntoComponents } from "../../unrollAcceptsFieldIntoComponents";
import { getDefaultTemplateForDefinition } from "../../templates/getTemplates";
import { EditorSectionDrawer } from "./drawer/EditorSectionDrawer";
import { EditorSectionGroup } from "./EditorSectionGroup";
import { TOP_BAR_HEIGHT } from "../../EditorTopBar";
import { useToaster } from "@redsun-vn/easyblocks-design-system/Toaster";
import { useTranslation } from "../../useTranslation";

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
// Page size for the per-group remote template fetch (infinite scroll).
const TEMPLATES_LIMIT = 30;

// Accumulated remote templates for a group plus its paging cursor.
type TGroupRemoteState = {
  items: TSectionTemplate[];
  page: number;
  total: number;
};

const StyledEditorSectionGroup = styled.div`
  padding-left: 12px;
  padding-right: 12px;
  overflow-y: auto;
  max-height: calc(
    100vh - ${TOP_BAR_HEIGHT + TITLE_HEIGHT + PADDING_TOP_HEIGHT}px
  );
`;

export const EditorSections: React.FC = () => {
  const editorContext = useEditorContext();
  const toaster = useToaster();
  const { t } = useTranslation();
  const [hoveredSection, setHoveredSection] = useState<string>("");
  // Drawer is closed until the user hovers a section; click-outside closes it.
  const [isOpen, setIsOpen] = useState(false);
  const sectionListRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  // Remote groups loaded from the count API; loading flag for that call.
  const [remoteGroups, setRemoteGroups] = useState<string[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  // Remote templates fetched per group (paged), cached so a re-hover doesn't
  // refetch. `isFetching` = first page; `isLoadingMore` = subsequent pages.
  const [remoteByGroup, setRemoteByGroup] = useState<
    Record<string, TGroupRemoteState>
  >({});
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
  const localComponents = useMemo(() => {
    const schemaProp = findComponentDefinition(
      editorContext.form.values,
      editorContext,
    )?.schema.find((x) => x.prop === "data") as ComponentSchemaProp;

    return unrollAcceptsFieldIntoComponents(schemaProp?.accepts, editorContext);
  }, [editorContext.form.values, editorContext.definitions]);

  // Local groups: the .group values of the accepted components.
  const localGroups = useMemo(() => {
    const groups = new Set<string>();
    localComponents.forEach((component: any) => {
      if (component.visible === false) return;
      groups.add(component.group || "others");
    });

    return [...groups];
  }, [localComponents]);

  // Local-definition templates for the hovered group (default "Empty X"
  // templates built from the accepted components). Available synchronously.
  const localTemplates = useMemo<TSectionTemplate[]>(() => {
    if (!hoveredSection) return [];

    return localComponents
      .filter(
        (component: any) =>
          component.visible !== false &&
          (component.group || "others") === hoveredSection,
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
  }, [hoveredSection, localComponents]);

  // Remote groups from the templates `count` API (keys are group names).
  // Count-only call (items ignored).
  useEffect(() => {
    let cancelled = false;
    setIsLoadingGroups(true);

    editorContext.backend.templates
      .getAll({ limit: 1 })
      .then((res) => {
        if (cancelled) return;

        const count = res.count ?? {};
        setRemoteGroups(
          Object.keys(count).filter(
            (group) => (count[group]?.matchedCount ?? 0) > 0,
          ),
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoadingGroups(false);
      });

    return () => {
      cancelled = true;
    };
  }, [editorContext.backend]);

  // Left list = local groups merged with remote groups, deduped and sorted.
  const sectionGroups = useMemo(
    () => [...new Set([...localGroups, ...remoteGroups])].sort(),
    [localGroups, remoteGroups],
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

  // Insert the picked template into the root "data" collection (appended at
  // the end). No keepId, so fresh ids are generated and a template can be
  // added multiple times. Used by the drawer cards only.
  const onAddTemplate = useCallback(
    (template: TSectionTemplate) => {
      const entry = template.template?.entry;
      if (!entry) {
        toaster.error(t("editor.sidebar.blocksAndSections.add.error"));
        return;
      }

      // Raw API entries aren't normalized; normalize the picked entry before insert.
      const normalizedEntry = normalize(
        { ...entry, _itemProps: {} },
        editorContext,
      );

      editorContext.actions.insertItem({
        name: "data",
        index:
          editorContext.compiledComponentConfig?.components.data.length ?? 0,
        block: normalizedEntry,
      });

      toaster.success(t("editor.sidebar.blocksAndSections.add.success"));

      // The new section is appended at the end; scroll the canvas to it.
      const data = (editorContext.form.values?.data ?? []) as Array<{
        _id?: string;
      }>;
      const newId = data[data.length - 1]?._id;
      if (newId) scrollCanvasToComponent(newId);
    },
    [editorContext, scrollCanvasToComponent],
  );

  useEffect(() => {
    if (sectionGroups.length) {
      setHoveredSection(sectionGroups[0]);
    }
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

  // Fetch the hovered group's first page of remote templates (server-side
  // group filter). Cached per group so re-hovering is instant.
  useEffect(() => {
    if (!hoveredSection || remoteByGroup[hoveredSection]) return;

    const group = hoveredSection;
    let cancelled = false;
    setIsFetching(true);

    editorContext.backend.templates
      .getAll({
        filters: `group.keyword:eq:${group}`,
        page: 1,
        limit: TEMPLATES_LIMIT,
      })
      .then((res) => {
        if (cancelled) return;

        const items = mapRemoteItems(res.items ?? []);
        const total = res.count?.[group]?.matchedCount ?? items.length;
        setRemoteByGroup((prev) => ({
          ...prev,
          [group]: { items, page: 1, total },
        }));
      })
      .finally(() => {
        if (!cancelled) setIsFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hoveredSection]);

  // Whether the hovered group has more remote templates to load (remote only;
  // local templates aren't paginated).
  const hasMore = useMemo(() => {
    const state = remoteByGroup[hoveredSection];
    return !!state && state.items.length < state.total;
  }, [remoteByGroup, hoveredSection]);

  // Load the next page of remote templates for the hovered group (infinite
  // scroll). Appends to the existing items.
  const onLoadMore = useCallback(() => {
    const group = hoveredSection;
    const state = remoteByGroup[group];
    if (!group || !state || isFetching || isLoadingMore) return;
    if (state.items.length >= state.total) return;

    const nextPage = state.page + 1;
    setIsLoadingMore(true);

    editorContext.backend.templates
      .getAll({
        filters: `group.keyword:eq:${group}`,
        page: nextPage,
        limit: TEMPLATES_LIMIT,
      })
      .then((res) => {
        const more = mapRemoteItems(res.items ?? []);
        setRemoteByGroup((prev) => {
          const existing = prev[group]?.items ?? [];
          const total =
            res.count?.[group]?.matchedCount ?? prev[group]?.total ?? 0;
          return {
            ...prev,
            [group]: { items: [...existing, ...more], page: nextPage, total },
          };
        });
      })
      .finally(() => setIsLoadingMore(false));
  }, [
    hoveredSection,
    remoteByGroup,
    isFetching,
    isLoadingMore,
    mapRemoteItems,
    editorContext,
  ]);

  // Drawer = local-definition templates merged with remote ones, deduped by
  // template id. Local shows immediately; remote appends when fetched.
  const drawerTemplates = useMemo(() => {
    const seen = new Set<string>();
    const result: TSectionTemplate[] = [];

    [
      ...localTemplates,
      ...(remoteByGroup[hoveredSection]?.items ?? []),
    ].forEach((template) => {
      const id = template.template?.id ?? template.id;
      if (id && !seen.has(id)) {
        seen.add(id);
        result.push(template);
      }
    });

    return result;
  }, [localTemplates, remoteByGroup, hoveredSection]);

  return (
    <>
      <StyledEditorSectionGroup ref={sectionListRef}>
        <EditorSectionGroup
          isFetchingRemoteGroup={isLoadingGroups && sectionGroups.length === 0}
          sectionGroups={sectionGroups}
          hoveredSection={hoveredSection}
          onHoverSection={handleHoverSection}
        />
      </StyledEditorSectionGroup>
      {isOpen && hoveredSection ? (
        <EditorSectionDrawer
          templates={drawerTemplates}
          isFetching={isFetching && drawerTemplates.length === 0}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          onAddTemplate={onAddTemplate}
          containerRef={drawerRef}
        />
      ) : null}
    </>
  );
};
