import React, { useState } from "react";
import { EditorContextType } from "../EditorContext";
import { useTranslation } from "../useTranslation";
import { ButtonDanger, ButtonPrimary, ButtonSecondary, FormElement, Modal, Select, SelectItem, useToaster } from "@redsun-vn/easyblocks-design-system";
import styled from "styled-components";
import { getFontFamilies, getFontSizes, getFontWeights, getLineHeights } from "@/utils/fonts";

interface IFontConfiguration {
  onConfigChange?: () => Promise<void>;
  editorContext: EditorContextType;
}

interface IFontValue {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
}

interface IFont {
  id: string;
  label: string;
  value: IFontValue;
}

export const FontConfigurations = ({ editorContext, onConfigChange }: IFontConfiguration) => {
  const fontTokens = editorContext.theme.fonts;
  const backend = editorContext.backend;
  const { t } = useTranslation();
  const toaster = useToaster();

  const router = new URLSearchParams(window.location.search);
  const themeId = router.get("themeId");

  const [isLoadingReset, setIsLoadingReset] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const [openEditFont, setOpenEditFont] = useState(false);

  const [font, setFont] = useState<IFont>({
    id: "",
    label: "",
    value: {
      fontFamily: "",
      fontSize: "",
      fontWeight: "",
      lineHeight: "",
    },
  });

  const { id, label, value } = font;

  const canSend = label.trim() !== "";

  const handleOpenEditFont = (id: string, f: any) => {
    setFont({
      id,
      label: f.label || "",
      value: {
        fontFamily: f.value?.fontFamily || "",
        fontSize: String(f.value.fontSize ?? ""),
        fontWeight: String(f.value.fontWeight ?? ""),
        lineHeight: String(f.value.lineHeight ?? ""),
      },
    });
    setOpenEditFont(true);
  };

  const handleFontClose = () => {
    setOpenEditFont(false);
    setFont({
      id: "",
      label: "",
      value: {
        fontFamily: "",
        fontSize: "",
        fontWeight: "",
        lineHeight: "",
      },
    });
  };

  const onReset = async () => {
    if (themeId) {
      setIsLoadingReset(true);

      try {
        await backend.themes?.reset({ id: themeId, configs: ["fonts"] });
        toaster.success(t("theme.font.reset.success"));
      }
      catch (error) {
        toaster.error(t("theme.font.reset.error"));
      }
      finally {
        setIsLoadingReset(false);
        onConfigChange?.();
      }
    }
  }

  const onSubmit = async () => {
    if (!canSend) return;

    if (themeId) {
      setIsLoadingEdit(true);
      const existingFonts = Object.entries(fontTokens).map(([key, f]) => ({
        id: key,
        label: f.label,
        value: f.value,
        isDefault: f.isDefault
      }));

      const updatedFonts = existingFonts.map(f =>
        f.id === id
          ? {
            id,
            label,
            value: {
              ...value,
              fontSize: value.fontSize ?? Number(value.fontSize),
              fontWeight: value.fontWeight ?? Number(value.fontWeight),
              lineHeight: value.lineHeight ?? Number(value.lineHeight),
            },
            isDefault: f.isDefault
          }
          : f
      );

      try {
        await backend.themes?.update({
          id: themeId,
          config: {
            fonts: updatedFonts
          }
        })
        toaster.success(t("theme.font.save.success"));
      }
      catch (error) {
        toaster.error(t("theme.font.save.error"));
      }
      finally {
        setIsLoadingEdit(false);
        onConfigChange?.();
        handleFontClose();
      }
    }
  }

  const Container = styled.div`
    padding: 6px;
    background-color: #ffffff;
    max-height: 100vh;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  const FontGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 24px;
  `;

  const FontCard = styled.div`
    border: 1px solid transparent;
    padding: 4px;
    cursor: pointer;
    transition: border-color 0.2s ease;

    &:hover {
      border-color: #e5e5e5;
    }
  `;

  const FontPreviewBox = styled.div`
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e5e5e5;
    padding: 32px;
    overflow: hidden;
  `;

  const FontPreviewText = styled.div<{ fontSize: string; fontFamily: string; fontWeight: string; lineHeight: string }>`
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
  padding: 1rem 0.5rem;

  /* Light scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
      background: #e5e5e5;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }

    scrollbar-width: thin;
    scrollbar-color: #e5e5e5 #f1f1f1;
  `;

  const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 2px;
  `;

  const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  `;

  const PreviewTextarea = styled.textarea<{ fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string; }>`
    border-radius: 0.5rem;
    width: 100%;
    height: 17vh;
    background-color: #e5e5e5;
    resize: none;
    outline: none;
    padding: 1rem;
    font-family: ${(f) => f.fontFamily};
    font-size: ${(f) => f.fontSize}px;
    font-weight: ${(f) => f.fontWeight};
    line-height: ${(f) => f.lineHeight};
  `;

  const StyledLabel = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    font-weight: 400;
    color: #000;
  `;

  const StyledSelect = styled.select`
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    color: #111827;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &:hover {
      border-color: #9ca3af;
    }
  `;

  const FormField = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
  `;

  return (
    <>
      <Container>
        <FontGrid>
          {Object.entries(fontTokens).map(([key, f]) => (
            <FontCard key={key} onClick={() => handleOpenEditFont(key, f)}>
              <FontPreviewBox>
                <FontPreviewText
                  fontSize={f.value.fontSize}
                  fontFamily={f.value.fontFamily}
                  fontWeight={f.value.fontWeight}
                  lineHeight={f.value.lineHeight}
                >
                  {f.label}
                </FontPreviewText>
              </FontPreviewBox>

              <FontDetails>
                {[
                  f.value.fontFamily?.split(",")[0],
                  f.value.fontWeight ? `Font Weight: ${f.value.fontWeight}` : null,
                  f.value.fontSize ? `${f.value.fontSize}` : null,
                  f.value.lineHeight ? `${f.value.lineHeight}` : null,
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
        width="40vw"
        title={`${t("theme.font.edit")} ${label ?? "Font"}`}
        isOpen={openEditFont}
        onRequestClose={() => handleFontClose()}
        mode="center-small"
        headerLine
      >
        <Content>
          <Form onSubmit={onSubmit}>
            <Row>
              <FormField>
                <StyledLabel htmlFor="fontFamily">{t("theme.font.family")}</StyledLabel>
                <StyledSelect
                  id="fontFamily"
                  name="fontFamily"
                  value={value.fontFamily}
                  onChange={(e) => {
                    setFont({
                      ...font,
                      value: {
                        ...value,
                        fontFamily: e.target.value
                      }
                    });
                  }}
                >
                  {getFontFamilies().map((f) => (
                    <option key={f.id} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </StyledSelect>
              </FormField>

              <FormField>
                <StyledLabel htmlFor="fontSize">{t("theme.font.size")}</StyledLabel>
                <StyledSelect
                  id="fontSize"
                  name="fontSize"
                  value={value.fontSize}
                  onChange={(e) => {
                    setFont({
                      ...font,
                      value: {
                        ...value,
                        fontSize: e.target.value
                      }
                    });
                  }}
                >
                  {getFontSizes(editorContext).map((f) => (
                    <option key={f.id} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </StyledSelect>
              </FormField>

              <FormField>
                <StyledLabel htmlFor="fontWeight">{t("theme.font.weight")}</StyledLabel>
                <StyledSelect
                  id="fontWeight"
                  name="fontWeight"
                  value={value.fontWeight}
                  onChange={(e) => {
                    setFont({
                      ...font,
                      value: {
                        ...value,
                        fontWeight: e.target.value
                      }
                    });
                  }}
                >
                  {getFontWeights().map((f) => (
                    <option key={f.id} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </StyledSelect>
              </FormField>

              <FormField>
                <StyledLabel htmlFor="lineHeight">{t("theme.font.lineHeight")}</StyledLabel>
                <StyledSelect
                  id="lineHeight"
                  name="lineHeight"
                  value={value.lineHeight}
                  onChange={(e) => {
                    setFont({
                      ...font,
                      value: {
                        ...value,
                        lineHeight: e.target.value
                      }
                    });
                  }}
                >
                  {getLineHeights().map((f) => (
                    <option key={f.id} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </StyledSelect>
              </FormField>
            </Row>

            <PreviewTextarea
              id="textPreview"
              fontFamily={value.fontFamily}
              fontSize={value.fontSize}
              fontWeight={value.fontWeight}
              lineHeight={value.lineHeight}
              defaultValue="Text preview" />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 8,
                gap: 8,
              }}
            >
              <ButtonSecondary
                onClick={() => handleFontClose()}
              >
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
