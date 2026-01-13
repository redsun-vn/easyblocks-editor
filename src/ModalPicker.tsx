import { dotNotationGet } from "@/utils";
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
import React, { FC } from "react";
import { useEditorContext } from "./EditorContext";
import { TemplatePicker, TemplatesDictionary } from "./TemplatePicker";
import { OpenComponentPickerConfig } from "./types";
import { unrollAcceptsFieldIntoComponents } from "./unrollAcceptsFieldIntoComponents";

type ModalProps = {
  config: OpenComponentPickerConfig;
  onClose: (config?: NoCodeComponentEntry) => void;
  pickers?: Record<string, TemplatePicker>;
};

export const ModalPicker: FC<ModalProps> = ({ config, onClose, pickers }) => {
  const editorContext = useEditorContext();
  const { form } = editorContext;

  const split = config.path.split("."); // TODO: right now only for collections
  const parentPath = split.slice(0, split.length - 1).join(".");
  const fieldName = split[split.length - 1];

  const parentData: NoCodeComponentEntry = dotNotationGet(
    form.values,
    parentPath
  );
  const schemaProp = findComponentDefinition(
    parentData,
    editorContext
  )!.schema.find((x) => x.prop === fieldName) as ComponentSchemaProp;

  const componentTypes = config.componentTypes ?? schemaProp.accepts;
  const localComponents = unrollAcceptsFieldIntoComponents(
    componentTypes,
    editorContext
  );

  let templatesDictionary: TemplatesDictionary | undefined = undefined;

  if (editorContext.templates) {
    templatesDictionary = {};

    localComponents.forEach((localComponent) => {
      templatesDictionary![localComponent.id] = {
        component: localComponent,
        templates: [],
      };

      editorContext.templates!.items!.forEach((remoteTemplate) => {
        if (localComponent.id === remoteTemplate.entry._component) {
          templatesDictionary![localComponent.id].templates.push(
            remoteTemplate
          );
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
            editorContext
          ),
          editorContext
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

  const onSearchGroup = (search: string) => {
    editorContext.syncTemplateQuery?.({ filters: "", search });
  };

  const onFilters = (filters: string) => {
    editorContext.syncTemplateQuery?.({ filters, search: "" });
  };

  // const onLoadMore = () => {
  //   editorContext.syncTemplateQuery?.({
  //     page: (editorContext.templateQuery?.page ?? 0) + 1,
  //   });
  //   editorContext.syncTemplates({ getAllMode: "append" });
  // };

  return pickers?.[picker] ? (
    pickers[picker]({
      isOpen: true,
      onClose: onModalClose,
      isFetching: editorContext.isFetchingTemplates,
      onSearchGroup,
      onFilters,
      // onLoadMore,
      templates: templatesDictionary,
      templateCount: editorContext.templates?.count,
      mode: picker,
    })
  ) : (
    <div>Unknown picker: {picker}</div>
  );
};
