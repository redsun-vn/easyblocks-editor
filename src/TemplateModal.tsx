import { Backend, Template } from "@redsun-vn/easyblocks-core";
import {
  ButtonDanger,
  ButtonPrimary,
  FormElement,
  Input,
  InputFile,
  Modal,
  useToaster,
} from "@redsun-vn/easyblocks-design-system";
import React, { MouseEvent, useEffect, useState } from "react";
import { useEditorContext } from "./EditorContext";
import {
  OpenTemplateModalAction,
  OpenTemplateModalActionCreate,
} from "./types";
import { useTranslation } from "./useTranslation";

type TemplateModalProps = {
  action: OpenTemplateModalAction;
  onClose: () => void;
  backend: Backend;
  isAdminMode?: boolean;
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
  const canSend = label.trim() !== "";
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

    if (props.isAdminMode && !userId) {
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

  return (
    <Modal
      title={t("template.save.title")}
      isOpen={true}
      onRequestClose={() => {
        props.onClose();
      }}
      mode={"center-small"}
      headerLine={true}
      maxHeight="430px"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();

          setError(null);

          if (!canSend) {
            return;
          }

          setLoadingEdit(true);

          if (mode === "create") {
            const createAction = props.action as OpenTemplateModalActionCreate;

            backend.templates
              .create({
                label,
                group,
                thumbnail,
                thumbnailLabel,
                entry: createAction.config,
                width: createAction.width,
                widthAuto: createAction.widthAuto,
              })
              .then((newTemplate) => {
                editorContext.syncTemplates({
                  mode: "create",
                  template: {
                    id: newTemplate.id,
                    ...template,
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
            backend.templates
              .update({
                label,
                group,
                thumbnail,
                thumbnailLabel,
                id: (template as Template).id!,
              })
              .then(() => {
                editorContext.syncTemplates({
                  mode: "edit",
                  template: template as Template,
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
              autoFocus
            />
          </FormElement>

          <FormElement name="group" label={t("template.save.group")}>
            <Input
              placeholder={t("template.save.group")}
              value={group}
              onChange={(e) => {
                setTemplate({
                  ...template,
                  group: e.target.value,
                });
              }}
              withBorder={true}
              autoFocus
            />
          </FormElement>

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
              autoFocus
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
