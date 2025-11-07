import {
  defaultFontFamily,
  defaultFontSize,
  defaultFontWeight,
  defaultLineHeight,
  getFontFamilies,
  getFontSizes,
  getFontWeights,
  getLineHeights,
} from "@/utils/fonts";
import {
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
  Colors,
  Modal,
  Select,
  SelectItem,
  useToaster,
} from "@redsun-vn/easyblocks-design-system";
import React, { useState } from "react";
import styled from "styled-components";
import { EditorContextType } from "../EditorContext";
import { useTranslation } from "../useTranslation";

interface IFontConfiguration {
  onConfigChange?: () => Promise<void>;
  editorContext: EditorContextType;
}

interface IFontValue {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
}

interface IFont {
  id: string;
  label?: string;
  value: IFontValue;
  isDefault?: boolean;
}

const stringKeys = ["fontFamily"];

const Container = styled.div`
  background-color: #ffffff;
  max-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
`;

const FontGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const FontCard = styled.div`
  min-width: 230px;
  border: 1px solid transparent;
  padding: 4px;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${Colors.black10};
  }
`;

const FontPreviewBox = styled.div`
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.black10};
  padding: 32px;
  overflow: hidden;
`;

const FontPreviewText = styled.div<IFontValue>`
  font-size: ${(f) => f.fontSize}px;
  font-family: ${(f) => f.fontFamily};
  font-weight: ${(f) => f.fontWeight};
  line-height: ${(f) => f.lineHeight};
  color: #000;
  text-align: center;
  user-select: none;
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
`;

const FontDetails = styled.div`
  margin-top: 8px;
  background-color: white;
  font-size: 12px;
  line-height: 16px;
  color: #000;
  text-align: center;
`;

const Content = styled.div`
  /* Light scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: ${Colors.black10};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  scrollbar-width: thin;
  scrollbar-color: ${Colors.black10} #f1f1f1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 2px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr;
  gap: 12px;

  & > button {
    justify-content: flex-end;
    overflow: hidden;
    box-shadow: 0 0 0 1px ${Colors.black10};
    cursor: pointer;

    & > span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      & > div {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
`;

const PreviewTextarea = styled.textarea<IFontValue>`
  border-radius: 4px;
  width: 100%;
  height: 17vh;
  background-color: ${Colors.black10};
  resize: none;
  outline: none;
  padding: 1rem;
  font-family: ${(f) => f.fontFamily};
  font-size: ${(f) => f.fontSize}px;
  font-weight: ${(f) => f.fontWeight};
  line-height: ${(f) => f.lineHeight};
`;

const StyledSelect = styled(Select)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 0;
  cursor: pointer;
  border: 1px solid ${Colors.black10};
  border-radius: 4px;
`;

export const FontConfigurations = ({
  editorContext,
  onConfigChange,
}: IFontConfiguration) => {
  const colorTokens = editorContext.theme.colors;
  const fontTokens = editorContext.theme.fonts;
  const backend = editorContext.backend;
  const { t } = useTranslation();
  const toaster = useToaster();

  const router = new URLSearchParams(window.location.search);
  const themeId = router.get("themeId");

  const [isLoadingReset, setIsLoadingReset] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const [openEditFont, setOpenEditFont] = useState<IFont | null>(null);

  const handleOpenEditFont = (id: string, fontDetail: Omit<IFont, "id">) => {
    setOpenEditFont({
      id,
      ...fontDetail,
    });
  };

  const handleFontClose = () => {
    setOpenEditFont(null);
  };

  const onReset = async () => {
    if (themeId) {
      setIsLoadingReset(true);

      try {
        await backend.themes?.reset({ id: themeId, configs: ["fonts"] });
        toaster.success(t("theme.font.reset.success"));
      } catch (error) {
        toaster.error(t("theme.font.reset.error"));
      } finally {
        setIsLoadingReset(false);
        onConfigChange?.();
      }
    }
  };

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement> | undefined
  ) => {
    event?.preventDefault();
    if (!openEditFont) {
      return;
    }

    const canSend = openEditFont?.label?.trim() !== "";
    if (!canSend) return;

    if (themeId) {
      setIsLoadingEdit(true);

      const newFontTokens = {
        ...fontTokens,
        [openEditFont.id]: {
          value: openEditFont.value,
          isDefault: openEditFont.isDefault,
          label: openEditFont.label,
        },
      };

      const fontTokenPayloads = Object.entries(newFontTokens).map(
        ([id, value]) => ({
          id,
          ...value,
        })
      );

      const colorTokenPayloads = Object.entries(colorTokens).map(
        ([id, value]) => ({
          id,
          ...value,
        })
      );

      try {
        await backend.themes?.update({
          id: themeId,
          config: {
            fonts: fontTokenPayloads,
            colors: colorTokenPayloads,
          },
        });
        toaster.success(t("theme.font.save.success"));
      } catch (error) {
        toaster.error(t("theme.font.save.error"));
      } finally {
        setIsLoadingEdit(false);
        handleFontClose();
        onConfigChange?.();
      }
    }
  };

  const onChange = (
    id: "fontFamily" | "fontSize" | "fontWeight" | "lineHeight",
    newValue: string | number
  ) => {
    setOpenEditFont((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        value: {
          ...prev.value,
          [id]: stringKeys.includes(id) ? newValue : Number(newValue),
        },
      };
    });
  };

  return (
    <>
      <Container>
        <FontGrid>
          {Object.entries(fontTokens).map(([key, fontDetail]) => (
            <FontCard
              key={key}
              onClick={() => handleOpenEditFont(key, fontDetail)}
            >
              <FontPreviewBox>
                <FontPreviewText
                  fontSize={
                    fontDetail.value?.fontSize >= 32
                      ? 32
                      : fontDetail.value?.fontSize
                  }
                  fontFamily={fontDetail.value?.fontFamily}
                  fontWeight={fontDetail.value?.fontWeight}
                  lineHeight={fontDetail.value?.lineHeight}
                >
                  {fontDetail.label}
                </FontPreviewText>
              </FontPreviewBox>

              <FontDetails>
                {[
                  fontDetail.value?.fontFamily?.split(",")[0],
                  fontDetail.value?.fontWeight
                    ? `Font Weight: ${fontDetail.value?.fontWeight}`
                    : null,
                  fontDetail.value?.fontSize
                    ? `${fontDetail.value?.fontSize}`
                    : null,
                  fontDetail.value?.lineHeight
                    ? `${fontDetail.value?.lineHeight}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </FontDetails>
            </FontCard>
          ))}
        </FontGrid>

        <ButtonDanger
          isLoading={isLoadingReset}
          disabled={isLoadingReset}
          onClick={onReset}
        >
          {t("theme.font.reset")}
        </ButtonDanger>
      </Container>

      <Modal
        width="30vw"
        title={`${t("theme.font.edit")} ${openEditFont?.label ?? "Font"}`}
        isOpen={!!openEditFont}
        onRequestClose={() => handleFontClose()}
        mode="center-small"
        headerLine
      >
        <Content>
          <Form onSubmit={onSubmit}>
            <Row>
              <StyledSelect
                value={openEditFont?.value?.fontFamily ?? defaultFontFamily}
                onChange={(newFontFamily) => {
                  onChange("fontFamily", newFontFamily);
                }}
              >
                {getFontFamilies().map((f) => (
                  <SelectItem key={f.id} value={f.value}>
                    <div style={{ fontFamily: f.value }}>{f.label}</div>
                  </SelectItem>
                ))}
              </StyledSelect>

              <StyledSelect
                value={String(openEditFont?.value?.fontSize ?? defaultFontSize)}
                onChange={(newFontSize) => {
                  onChange("fontSize", newFontSize);
                }}
              >
                {getFontSizes(editorContext).map((f) => (
                  <SelectItem key={f.id} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </StyledSelect>

              <StyledSelect
                value={String(
                  openEditFont?.value?.fontWeight ?? defaultFontWeight
                )}
                onChange={(newFontWeight) => {
                  onChange("fontWeight", newFontWeight);
                }}
              >
                {getFontWeights().map((f) => (
                  <SelectItem key={f.id} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </StyledSelect>

              <StyledSelect
                value={String(
                  openEditFont?.value?.lineHeight ?? defaultLineHeight
                )}
                onChange={(newLineHeight) => {
                  onChange("lineHeight", newLineHeight);
                }}
              >
                {getLineHeights().map((f) => (
                  <SelectItem key={f.id} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </StyledSelect>
            </Row>

            <PreviewTextarea
              id="textPreview"
              fontFamily={openEditFont?.value?.fontFamily ?? defaultFontFamily}
              fontSize={openEditFont?.value?.fontSize ?? defaultFontSize}
              fontWeight={openEditFont?.value?.fontWeight ?? defaultFontWeight}
              lineHeight={openEditFont?.value?.lineHeight ?? defaultLineHeight}
              defaultValue="Text preview"
            />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 8,
                gap: 8,
              }}
            >
              <ButtonSecondary onClick={() => handleFontClose()}>
                {t("theme.font.cancel")}
              </ButtonSecondary>
              <ButtonPrimary
                isLoading={isLoadingEdit}
                disabled={isLoadingEdit}
                type={"submit"}
              >
                {t("theme.font.save")}
              </ButtonPrimary>
            </div>
          </Form>
        </Content>
      </Modal>
    </>
  );
};
