import { dotNotationGet } from "@/utils/object/dotNotationGet";
import {
  ComponentSchemaProp,
  NoCodeComponentEntry,
  Template,
  TemplateQueryType,
} from "@redsun-vn/easyblocks-core";
import {
  duplicateConfig,
  findComponentDefinition,
  normalize,
} from "@redsun-vn/easyblocks-core/_internals";
import React, { FC, useState } from "react";
import {
  coreOf,
  resolveShapeForSlot,
  resolveWrapperLevels,
} from "./dropShape/editorShapeAdapters";
import { useEditorContext } from "./EditorContext";
import { TemplatePicker, TemplatesDictionary } from "./TemplatePicker";
import { OpenComponentPickerConfig, TEasyblocksEditorMode } from "./types";
import { unrollAcceptsFieldIntoComponents } from "./unrollAcceptsFieldIntoComponents";

type ModalProps = {
  config: OpenComponentPickerConfig;
  onClose: (config?: NoCodeComponentEntry) => void;
  pickers?: Record<string, TemplatePicker>;
  editorMode: TEasyblocksEditorMode;
};

export const ModalPicker: FC<ModalProps> = ({
  config,
  onClose,
  pickers,
  editorMode,
}) => {
  const editorContext = useEditorContext();
  const { form } = editorContext;
  const [loadMode, setLoadMode] = useState<"replace" | "append">("replace");

  const split = config.path.split("."); // TODO: right now only for collections
  const parentPath = split.slice(0, split.length - 1).join(".");
  const fieldName = split[split.length - 1];

  const parentData: NoCodeComponentEntry = dotNotationGet(
    form.values,
    parentPath,
  );
  const schemaProp = findComponentDefinition(
    parentData,
    editorContext,
  )!.schema.find((x) => x.prop === fieldName) as ComponentSchemaProp;

  const componentTypes = config.componentTypes ?? schemaProp.accepts;
  const localComponents = unrollAcceptsFieldIntoComponents(
    componentTypes,
    editorContext,
  );

  let templatesDictionary: TemplatesDictionary | undefined = undefined;
  let templatesDictionaryCount:
    | Record<
        string,
        {
          matchedCount: number;
          total: number;
        }
      >
    | undefined = editorContext.templates?.count;

  if (editorContext.templates) {
    templatesDictionary = {};

    /*
     * Each template's payload, worked out once.
     *
     * The grouping below is a component-by-template loop, so computing this
     * inside it would peel the same template once per component on the list —
     * tens of thousands of walks for a shop with a full library, every time the
     * dialog renders. The answer does not depend on which component is being
     * asked about, so it is hoisted out.
     */
    const coreComponentOf = new Map<string, string>();
    const coreComponentId = (template: Template) => {
      const cached = coreComponentOf.get(template.id);

      if (cached !== undefined) {
        return cached;
      }

      const resolved = coreOf(template.entry, editorContext)._component;
      coreComponentOf.set(template.id, resolved);

      return resolved;
    };

    localComponents.forEach((localComponent) => {
      templatesDictionary![localComponent.id] = {
        component: localComponent,
        templates: [],
      };

      editorContext.templates!.items!.forEach((remoteTemplate) => {
        /*
         * Filed under what the template actually offers, not under the wrapper
         * it happens to be stored in. A mini cart shipped as a row around a
         * column around a mini cart belonged to the row's group, so a column
         * offering mini carts did not list it and the author had to recognise it
         * among the rows. Measured before changing it: of 210 templates 21 are
         * packaging like this, and only 2 of those become visible to containers
         * that predate the rule.
         */
        if (localComponent.id === coreComponentId(remoteTemplate)) {
          // For local components are visible & remote templates
          if (
            (!remoteTemplate.isUserDefined &&
              localComponent.visible !== false) ||
            remoteTemplate.isUserDefined
          ) {
            templatesDictionary![localComponent.id].templates.push(
              remoteTemplate,
            );
          } else {
            if (!templatesDictionaryCount) {
              templatesDictionaryCount = {};
            }

            if (!templatesDictionaryCount[localComponent.id]) {
              templatesDictionaryCount[localComponent.id] = {
                matchedCount: 0,
                total: 0,
              };
            }

            const { matchedCount = 0, total = 0 } =
              templatesDictionaryCount[localComponent.id] ?? {};
            templatesDictionaryCount[localComponent.id].matchedCount =
              matchedCount <= 0 ? 0 : matchedCount - 1;

            templatesDictionaryCount[localComponent.id].total =
              total <= 0 ? 0 : total - 1;
          }
        }
      });

      if (templatesDictionary![localComponent.id].templates.length === 0) {
        delete templatesDictionary![localComponent.id];
      }
    });
  }

  const picker = schemaProp.picker ?? "compact";

  const close = (config: NoCodeComponentEntry) => {
    const _itemProps = {
      [parentData._component]: {
        [fieldName]: {},
      },
    };

    const newComponent = fieldName.startsWith("$")
      ? config
      : duplicateConfig(
          normalize(
            {
              ...config,
              _itemProps,
            },
            editorContext,
          ),
          editorContext,
        );

    onClose(newComponent);
  };

  const onModalClose = (template?: Template) => {
    if (!template) {
      onClose();
      return;
    }

    /*
     * The same rule the canvas applies to a drop: the slot decides the shape.
     * Picking a mini cart inside a column that already accepts one puts the mini
     * cart there, with no row and column around it, while picking it at the page
     * root keeps the band the template was authored as.
     */
    const shaped = resolveShapeForSlot({
      entry: normalize(template.entry, editorContext),
      accepts: componentTypes,
      wrapperLevels: resolveWrapperLevels({
        templates: editorContext.configTemplates,
        dropWrapperTemplateId: editorContext.dropWrapperTemplateId,
        context: editorContext,
      }),
      context: editorContext,
    });

    // Nothing fits: leave the slot alone rather than write a child it cannot
    // hold, because the insert that follows performs no check of its own.
    if (!shaped) {
      onClose();
      return;
    }

    close(shaped);
  };

  const queryLimit = 50;

  const onSearchGroup = (search: string) => {
    setLoadMode("replace");
    editorContext.syncTemplateQuery?.({ filters: "", search: search.trim() });
  };

  const onFilters = (filters: string) => {
    setLoadMode("replace");

    const query: TemplateQueryType = {
      filters: filters.trim(),
      search: "",
      page: 1,
      mode: "replace",
    };

    if (filters) {
      query.limit = queryLimit;
    }

    editorContext.syncTemplateQuery?.(query);
  };

  const onLoadMore = (page: number, groupId: string) => {
    setLoadMode("append");
    const templateItems = editorContext.templates?.items ?? [];
    const templateCount = editorContext.templates?.count;

    const totalAvailable = templateCount?.[groupId.trim()]?.matchedCount ?? 0;
    if (!totalAvailable) return;

    const templateItemFilterLength = templateItems
      ? Object.values(templateItems).filter(
          (item) => item.group === groupId.trim(),
        ).length
      : 0;

    const hasNextPage =
      !!templateCount &&
      totalAvailable > 0 &&
      templateItemFilterLength < totalAvailable;

    if (!hasNextPage) return;
    editorContext.syncTemplateQuery?.({
      page,
      limit: queryLimit,
      mode: "append",
    });
  };

  return pickers?.[picker] ? (
    pickers[picker]({
      loadMode,
      isOpen: true,
      onClose: onModalClose,
      isFetching: editorContext.isFetchingTemplates,
      onSearchGroup,
      onFilters,
      onLoadMore,
      templates: templatesDictionary,
      templateCount: templatesDictionaryCount,
      mode: picker,
      editorMode,
    })
  ) : (
    <div>Unknown picker: {picker}</div>
  );
};
