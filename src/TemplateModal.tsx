import {
  Backend,
  NoCodeComponentEntry,
  Template,
} from "@redsun-vn/easyblocks-core";
import {
  ButtonDanger,
  ButtonGhost,
  ButtonPrimary,
} from "@redsun-vn/easyblocks-design-system/buttons";
import { FormElement } from "@redsun-vn/easyblocks-design-system/FormElement";
import { Input, InputFile } from "@redsun-vn/easyblocks-design-system/Input";
import { Modal } from "@redsun-vn/easyblocks-design-system/modals";
import { Select, SelectItem } from "@redsun-vn/easyblocks-design-system/Select";
import { useToaster } from "@redsun-vn/easyblocks-design-system/Toaster";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, { MouseEvent, useEffect, useMemo, useState } from "react";
import { useEditorContext } from "./EditorContext";
import {
  OpenTemplateModalAction,
  OpenTemplateModalActionCreate,
  TEasyblocksEditorMode,
} from "./types";
import { useTranslation } from "./useTranslation";

/** One selectable template category. */
export type TTemplateCategoryOption = {
  id: string;
  name: string;
};

/**
 * Template category access, exposed by the host app's backend on top of the
 * `Backend` contract in `easyblocks-core`.
 *
 * Both members are optional on purpose. A host that does not implement them
 * keeps the previous behaviour — no category field at all — instead of
 * presenting a required field nobody can satisfy.
 */
type TTemplateCategorySource = {
  getCategories?: () => Promise<TTemplateCategoryOption[]>;
  createCategory?: (input: {
    name: string;
  }) => Promise<TTemplateCategoryOption>;
};

/**
 * What this modal sends when saving.
 *
 * `category_uuid` is the real relation; `group` stays the human-readable label
 * and is filled from the chosen category's name rather than from typing. The
 * free-text field it replaces is what let a shop write "Layout" and land its
 * own template among the built-in Layout components.
 *
 * Declared as a named type and passed as a variable rather than inlined at the
 * call: the contract in `easyblocks-core` does not yet mention `category_uuid`,
 * and an inline object literal would be rejected for that extra member while a
 * typed variable is simply assignable to it.
 */
interface ITemplateCreateInput {
  label: string;
  group?: string;
  category_uuid?: string | null;
  thumbnail?: string;
  thumbnailLabel?: string;
  entry: NoCodeComponentEntry;
  width?: number;
  widthAuto?: boolean;
}

interface ITemplateUpdateInput {
  id: string;
  label: string;
  group?: string;
  category_uuid?: string | null;
  thumbnail?: string;
  thumbnailLabel?: string;
}

type TemplateModalProps = {
  action: OpenTemplateModalAction;
  onClose: () => void;
  backend: Backend;
  mode: TEasyblocksEditorMode;
};

export const TemplateModal: React.FC<TemplateModalProps> = (props) => {
  const [error, setError] = useState<null | string>(null);
  const mode = props.action.mode;
  const backend = props.backend;

  const editorContext = useEditorContext();
  const [isLoadingEdit, setLoadingEdit] = useState(false);
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const toaster = useToaster();
  const { t } = useTranslation();

  // Same widening trick as the sidebar: every added member is optional, so the
  // plain contract still satisfies the intersection.
  const templatesApi: Backend["templates"] & TTemplateCategorySource =
    backend.templates;
  const canListCategories = typeof templatesApi.getCategories === "function";
  const canCreateCategory = typeof templatesApi.createCategory === "function";

  const [categories, setCategories] = useState<TTemplateCategoryOption[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  // Whether the listing actually came back. A failed call must not be mistaken
  // for "this shop has no categories".
  const [didLoadCategories, setDidLoadCategories] = useState(false);
  const [categoryId, setCategoryId] = useState<string>(() =>
    props.action.mode === "edit"
      ? ((props.action.template as { category_uuid?: string | null })
          .category_uuid ?? "")
      : "",
  );
  // Inline category creation, open only while the user is typing a new name.
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const [template, setTemplate] = useState(() => {
    if (props.action.mode === "edit") {
      return props.action.template;
    } else {
      return {
        label: "",
        group: "",
        thumbnail: "",
        thumbnailLabel: "",
        entry: props.action.config,
      };
    }
  });

  const {
    label = "",
    group = "",
    thumbnail = "",
    thumbnailLabel = "",
  } = template as Template;
  const open = props.action !== undefined;

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId),
    [categories, categoryId],
  );

  /**
   * A category is mandatory — but only once there is one to pick.
   *
   * Demanding it unconditionally would lock the shop out of saving anything at
   * all on the day this ships: the table starts empty, and a listing that fails
   * or a gateway that has not deployed these routes yet would look exactly like
   * a shop with no categories. So the rule binds when the list came back with
   * entries, and the "add a category" affordance covers the empty case.
   */
  const isCategoryMissing =
    canListCategories && didLoadCategories && categories.length > 0 && !categoryId;
  const canSend = label.trim() !== "" && !isCategoryMissing;
  const ctaLabel = t("template.save.default");

  const validateUploadImage = (file: File) => {
    if (file.size > (backend.attachments?.maxSizeUpload.image ?? 0)) {
      toaster.notify(t("error.file.max-size-upload"));
      return false;
    }

    return true;
  };

  const onClearFile = () => {
    const input =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    if (input) {
      input.value = "";
    }

    setTemplate((prev) => ({
      ...prev,
      thumbnail: "",
    }));
  };

  const onUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = event.target.files?.[0];
    const userId = backend.userId;

    if (!targetFile) {
      toaster.notify(t("error.file.notFound"));
      return;
    }

    if (props.mode && !userId) {
      toaster.notify(t("error.userId.notFound"));
      return;
    }

    const isValidUploadImage = validateUploadImage(targetFile);

    setIsUploadingFile(true);

    if (!isValidUploadImage) {
      setIsUploadingFile(false);
      return;
    }

    try {
      const imageUploaded = (await backend.attachments?.create({
        userId: String(userId),
        fileUpload: targetFile,
      })) as any;
      if (imageUploaded) {
        const { url } = imageUploaded?.data ?? {};
        setTemplate((prev) => ({
          ...prev,
          thumbnail: url,
        }));
      }
    } catch (e) {
      toaster.error(t("error.file.failedToUpload"));
    } finally {
      setIsUploadingFile(false);
    }
  };

  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  // Load the selectable categories. Read-only: the list the shop is allowed to
  // see (its own plus the system ones) is decided server-side.
  useEffect(() => {
    const getCategories = templatesApi.getCategories;
    if (!getCategories) return;

    let cancelled = false;
    setIsLoadingCategories(true);

    getCategories()
      .then((items) => {
        if (cancelled) return;
        setCategories(items);
        setDidLoadCategories(true);
      })
      .catch(() => {
        if (cancelled) return;
        // Stays false on purpose: saving keeps working while the category
        // source is unreachable, instead of silently disabling the button.
        setDidLoadCategories(false);
        toaster.error(t("template.category.load.error"));
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCategories(false);
      });

    return () => {
      cancelled = true;
    };
  }, [backend]);

  const onCreateCategory = async () => {
    const createCategory = templatesApi.createCategory;
    const name = newCategoryName.trim();
    if (!createCategory || !name || isSavingCategory) return;

    setIsSavingCategory(true);

    try {
      const created = await createCategory({ name });
      setCategories((prev) => [...prev, created]);
      setDidLoadCategories(true);
      setCategoryId(created.id);
      setNewCategoryName("");
      setIsAddingCategory(false);
      toaster.success(t("template.category.create.success"));
    } catch {
      toaster.error(t("template.category.create.error"));
    } finally {
      setIsSavingCategory(false);
    }
  };

  return (
    <Modal
      title={t("template.save.title")}
      isOpen={true}
      onRequestClose={() => {
        props.onClose();
      }}
      mode={"center-small"}
      headerLine={true}
      maxHeight="470px"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();

          setError(null);

          if (!canSend) {
            return;
          }

          setLoadingEdit(true);

          // The label shown in the picker follows the chosen category; with no
          // category source the previously stored string is kept untouched.
          const nextGroup = canListCategories
            ? (selectedCategory?.name ?? group)
            : group;
          const nextCategoryId = canListCategories ? categoryId : undefined;

          if (mode === "create") {
            const createAction = props.action as OpenTemplateModalActionCreate;
            const payload: ITemplateCreateInput = {
              label,
              group: nextGroup,
              category_uuid: nextCategoryId,
              thumbnail,
              thumbnailLabel,
              entry: createAction.config,
              width: createAction.width,
              widthAuto: createAction.widthAuto,
            };

            backend.templates
              .create(payload)
              .then((newTemplate) => {
                editorContext.syncTemplates({
                  mode: "create",
                  template: {
                    id: newTemplate.id,
                    ...template,
                    group: nextGroup,
                  },
                });
                toaster.success(t("template.save.success"));
                props.onClose();
              })
              .catch(() => {
                toaster.error(t("template.save.error"));
              })
              .finally(() => {
                setLoadingEdit(false);
              });
          } else {
            const payload: ITemplateUpdateInput = {
              label,
              group: nextGroup,
              category_uuid: nextCategoryId,
              thumbnail,
              thumbnailLabel,
              id: (template as Template).id!,
            };

            backend.templates
              .update(payload)
              .then(() => {
                editorContext.syncTemplates({
                  mode: "edit",
                  template: { ...(template as Template), group: nextGroup },
                });
                toaster.success(t("template.save.success"));
                props.onClose();
              })
              .catch(() => {
                toaster.error(t("template.save.error"));
              })
              .finally(() => {
                setLoadingEdit(false);
              });
          }
        }}
      >
        {error && <div>{error}</div>}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          <FormElement name="label" label={t("template.save.name")}>
            <Input
              placeholder={t("template.save.name")}
              required={true}
              value={label}
              onChange={(e) => {
                setTemplate({
                  ...template,
                  label: e.target.value,
                });
              }}
              withBorder={true}
              controlSize="full-width"
              autoFocus
            />
          </FormElement>

          {canListCategories && (
            <FormElement name="category" label={t("template.save.category")}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  width: "100%",
                }}
              >
                <Select
                  value={categoryId}
                  onChange={setCategoryId}
                  placeholder={
                    isLoadingCategories
                      ? t("loading")
                      : t("template.save.category.placeholder")
                  }
                  style={{ width: "100%" }}
                >
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </Select>

                {!isLoadingCategories &&
                  didLoadCategories &&
                  categories.length === 0 &&
                  !isAddingCategory && (
                    <Typography variant="body">
                      {t("template.category.empty")}
                    </Typography>
                  )}

                {canCreateCategory &&
                  (isAddingCategory ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <Input
                        placeholder={t("template.category.name")}
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        // Enter inside a nested field must create the category,
                        // not submit the template form behind it.
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            onCreateCategory();
                          }
                        }}
                        withBorder={true}
                        controlSize="full-width"
                      />
                      <ButtonPrimary
                        type="button"
                        isLoading={isSavingCategory}
                        disabled={!newCategoryName.trim()}
                        onClick={(e: MouseEvent) => {
                          e.preventDefault();
                          onCreateCategory();
                        }}
                      >
                        {t("add")}
                      </ButtonPrimary>
                      <ButtonGhost
                        type="button"
                        onClick={(e: MouseEvent) => {
                          e.preventDefault();
                          setIsAddingCategory(false);
                          setNewCategoryName("");
                        }}
                      >
                        {t("cancel")}
                      </ButtonGhost>
                    </div>
                  ) : (
                    <ButtonGhost
                      type="button"
                      onClick={(e: MouseEvent) => {
                        e.preventDefault();
                        setIsAddingCategory(true);
                      }}
                    >
                      {t("template.category.create")}
                    </ButtonGhost>
                  ))}
              </div>
            </FormElement>
          )}

          <FormElement
            name="thumbnail"
            label={t("template.save.thumbnailLink")}
            position="start"
          >
            <InputFile
              src={thumbnail}
              alt={t("template.save.thumbnailLink")}
              onChange={onUploadFile}
              onClearFile={onClearFile}
              isLoading={isUploadingFile}
            />
          </FormElement>

          <FormElement
            name="thumbnailLabel"
            label={t("template.save.thumbnailLabel")}
          >
            <Input
              placeholder={t("template.save.thumbnailLabel")}
              value={thumbnailLabel}
              onChange={(e) => {
                setTemplate({
                  ...template,
                  thumbnailLabel: e.target.value,
                });
              }}
              withBorder={true}
              controlSize="full-width"
            />
          </FormElement>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
              gap: 10,
            }}
          >
            <div style={{ order: 2 }}>
              <ButtonPrimary
                type={"submit"}
                disabled={!canSend}
                isLoading={isLoadingEdit}
                style={{ opacity: !canSend ? 0.7 : 1 }}
              >
                {ctaLabel}
              </ButtonPrimary>
            </div>

            <div style={{ order: 1 }}>
              {mode === "edit" && (
                <ButtonDanger
                  onClick={(e: MouseEvent) => {
                    e.preventDefault();

                    setLoadingDelete(true);

                    backend.templates
                      .delete({ id: (template as Template).id! })
                      .then(() => {
                        editorContext.syncTemplates({
                          mode: "delete",
                          template: template as Template,
                        });
                        toaster.success(t("template.delete.success"));
                        props.onClose();
                      })
                      .catch(() => {
                        toaster.error(t("template.delete.error"));
                      })
                      .finally(() => {
                        setLoadingDelete(false);
                      });
                  }}
                  isLoading={isLoadingDelete}
                >
                  {t("template.delete.default")}
                </ButtonDanger>
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
