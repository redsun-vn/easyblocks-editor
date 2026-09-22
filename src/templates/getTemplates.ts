import { uniqueId } from "@/utils/uniqueId";
import {
  InternalTemplate,
  NoCodeComponentEntry,
  Template,
  TemplateQueryType,
  UserDefinedTemplate,
  buildRichTextNoCodeEntry,
  getDefaultLocale,
} from "@redsun-vn/easyblocks-core";
import {
  InternalComponentDefinition,
  findComponentDefinitionById,
  normalize,
} from "@redsun-vn/easyblocks-core/_internals";
import { EditorContextType } from "../EditorContext";
import { configMap } from "../utils/config/configMap";
import { getTemplateSources } from "./templateSources";

/** What a remote template read answers with; both endpoints share the shape. */
type TRemoteTemplates = {
  items?: UserDefinedTemplate[];
  count?: Record<string, { matchedCount: number; total: number }>;
};

/**
 * Every remote library this mode may read, as one list.
 *
 * The shop read alone is what the picker dialog used to have, and it is not
 * everything a shop can see: a system template carries no `shop_id`, so the
 * shop query cannot return it at all. A shop whose only visible template came
 * from the system library therefore found the dialog's template library empty
 * while the left panel — which has always read both — showed its category.
 *
 * Deduplicated by id because an admin's shop read already returns the system
 * rows, and a template listed twice is a template somebody has to look at twice.
 */
async function readRemoteTemplates(
  editorContext: EditorContextType,
  query?: TemplateQueryType,
): Promise<Required<TRemoteTemplates>> {
  const api = editorContext.backend.templates as typeof editorContext.backend.templates & {
    getAllPublic?: (query?: TemplateQueryType) => Promise<TRemoteTemplates>;
  };

  const reads = await Promise.all(
    getTemplateSources(editorContext.mode).map<Promise<TRemoteTemplates>>(
      (source) =>
        source === "shop"
          ? api.getAll(query)
          : // A host that implements no public reader has no system library,
            // which is an empty one rather than an error.
            (api.getAllPublic?.(query) ?? Promise.resolve({})),
    ),
  );

  const byId = new Map<string, UserDefinedTemplate>();
  const count: Required<TRemoteTemplates>["count"] = {};

  reads.forEach((read) => {
    (read.items ?? []).forEach((item) => {
      if (!byId.has(item.id)) {
        byId.set(item.id, item);
      }
    });

    Object.entries(read.count ?? {}).forEach(([bucket, bucketCount]) => {
      const running = count[bucket] ?? { matchedCount: 0, total: 0 };

      count[bucket] = {
        matchedCount: running.matchedCount + (bucketCount?.matchedCount ?? 0),
        total: running.total + (bucketCount?.total ?? 0),
      };
    });
  });

  return { items: [...byId.values()], count };
}

export function getDefaultTemplateForDefinition(
  def: InternalComponentDefinition,
  editorContext: EditorContextType,
): InternalTemplate {
  // Text has different way of building a default config
  const config: NoCodeComponentEntry =
    def.id === "@easyblocks/rich-text"
      ? buildRichTextNoCodeEntry({
          color: getDefaultTokenId(editorContext.theme.colors),
          font: getDefaultTokenId(editorContext.theme.fonts),
        })
      : {
          _component: def.id,
          _id: uniqueId(),
        };

  return {
    id: `${def.id}_default`,
    label: def.label ?? def.id,
    entry: config,
    isUserDefined: false,
    group: def.group,
    // A definition draws its own picture and names it. Leaving those behind
    // here is why the picker showed a grey box with the component's name in it:
    // the card falls back to a text placeholder when it finds no thumbnail, and
    // the thumbnail was on the definition the template was built from.
    thumbnail: def.thumbnail,
    thumbnailLabel: def.thumbnailLabel,
  };
}

function getDefaultTokenId(tokens: EditorContextType["theme"][string]) {
  return Object.entries(tokens).find(([, value]) => value.isDefault)?.[0];
}

export async function getTemplates(
  editorContext: EditorContextType,
  configTemplates: InternalTemplate[] = [],
  query?: TemplateQueryType,
): Promise<{
  items: NonNullable<EditorContextType["templates"]>["items"];
  count: NonNullable<EditorContextType["templates"]>["count"];
}> {
  const remoteUserDefinedTemplates = !editorContext.disableCustomTemplates
    ? await readRemoteTemplates(editorContext, query)
    : { items: [], count: {} };

  const templates = getTemplatesInternal(
    editorContext,
    configTemplates,
    remoteUserDefinedTemplates.items,
  );

  const textSearch = query?.filters
    ?.split("@")
    .find((filter) => filter.includes("label:like:"))
    ?.split("label:like:")[1];

  const templatesFound = textSearch
    ? templates.filter((template) =>
        template.label?.toLowerCase().includes(textSearch.toLowerCase()),
      )
    : templates;

  return {
    items: templatesFound,
    count: remoteUserDefinedTemplates.count,
  };
}

function getNecessaryDefaultTemplates(
  components: InternalComponentDefinition[],
  templates: Template[],
  editorContext: EditorContextType,
) {
  const result: InternalTemplate[] = [];

  components.forEach((component) => {
    const componentTemplates = templates.filter(
      (template) => template.entry._component === component.id,
    );
    if (componentTemplates.length === 0) {
      result.push(getDefaultTemplateForDefinition(component, editorContext));
    }
  });

  return result;
}

function normalizeTextLocales(
  config: NoCodeComponentEntry,
  editorContext: EditorContextType,
) {
  return configMap(config, editorContext, ({ value, schemaProp }) => {
    if (schemaProp.type === "text") {
      const firstDefinedValue = Object.values(value.value).filter(
        (x) => x !== null && x !== undefined,
      )[0];

      return {
        ...value,
        value: {
          [getDefaultLocale(editorContext.locales).code]: firstDefinedValue,
        },
      };
    } else if (schemaProp.type === "component-collection-localised") {
      const firstDefinedValue = Object.values(value).filter(
        (x) => x !== null && x !== undefined,
      )[0];

      return {
        [getDefaultLocale(editorContext.locales).code]: firstDefinedValue,
      };
    }

    return value;
  });
}

function getTemplatesInternal(
  editorContext: EditorContextType,
  configTemplates: InternalTemplate[],
  remoteUserDefinedTemplates: UserDefinedTemplate[],
): Template[] {
  // If a component doesn't have a template, here's one added
  const allBuiltinTemplates = [
    ...configTemplates,
    ...getNecessaryDefaultTemplates(
      editorContext.definitions.components,
      configTemplates,
      editorContext,
    ),
  ];

  const allUserTemplates = [
    ...remoteUserDefinedTemplates,
    ...allBuiltinTemplates,
  ];

  const result = allUserTemplates
    .filter((template) => {
      const definition = findComponentDefinitionById(
        template.entry._component,
        editorContext,
      );

      if (!definition || definition.hideTemplates) {
        return false;
      }

      return true;
    })
    .map((template) => {
      const newTemplate: Template = {
        ...template,
        entry: normalizeTextLocales(
          normalize({ ...template.entry, _itemProps: {} }, editorContext),
          editorContext,
        ),
      };

      return newTemplate;
    });

  return result;
}
