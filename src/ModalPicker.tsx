import { dotNotationGet } from "@/utils/object/dotNotationGet";
import {
  ComponentSchemaProp,
  NoCodeComponentEntry,
  Template,
} from "@redsun-vn/easyblocks-core";
import {
  duplicateConfig,
  findComponentDefinition,
  normalize,
} from "@redsun-vn/easyblocks-core/_internals";
import React, { FC, useState } from "react";
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

    localComponents.forEach((localComponent) => {
      templatesDictionary![localComponent.id] = {
        component: localComponent,
        templates: [],
      };

      editorContext.templates!.items!.forEach((remoteTemplate) => {
        if (localComponent.id === remoteTemplate.entry._component) {
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
    if (template) {
      close(normalize(template.entry, editorContext));
    } else {
      onClose();
    }
  };

  const queryLimit = 50;

  const onSearchGroup = (search: string) => {
    setLoadMode("replace");
    editorContext.syncTemplateQuery?.({ filters: "", search: search.trim() });
  };

  const onFilters = (filters: string) => {
    setLoadMode("replace");
    editorContext.syncTemplateQuery?.({
      filters: filters.trim(),
      search: "",
      page: 1,
      limit: filters ? queryLimit : 100,
      mode: "replace",
    });
  };

  const onLoadMore = (page: number, groupId: string) => {
    setLoadMode("append");
    const templateItems = editorContext.templates?.items ?? [];
    const templateCount = editorContext.templates?.count;

    const totalAvailable = templateCount?.[groupId.trim()]?.total ?? 0;
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
