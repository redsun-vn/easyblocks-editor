import {
  getBrightnessColor,
  ThemeTokenValue,
  validateColor,
} from "@redsun-vn/easyblocks-core";
import {
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
  ColorPicker,
  Colors,
  Fonts,
  Icons,
  Input,
  Modal,
  Typography,
} from "@redsun-vn/easyblocks-design-system";
import { useToaster } from "@redsun-vn/easyblocks-design-system/Toaster";
import React, { useState } from "react";
import styled from "styled-components";
import { EditorContextType } from "../EditorContext";
import { useTranslation } from "../useTranslation";

interface IColorConfiguration {
  onConfigChange?: () => Promise<void>;
  editorContext: EditorContextType;
}

const ColorConfigurationsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledColorWrapper = styled.div``;

const StyledColorCardWrapper = styled.div`
  max-width: 500px;
  width: 100%;
  display: flex;
  overflow: hidden;
  border: 1px solid ${Colors.black100};
  border-radius: 4px;
`;

const StyledColorContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledColorCard = styled.div<{ background: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  background: ${({ background }) => background};

  & > div {
    display: none;
    color: ${({ background }) => getBrightnessColor(background)};
  }

  &:hover {
    cursor: pointer;

    & > div {
      display: block;
    }
  }
`;

const StyledInputWrapper = styled.div`
  margin-top: 10px;
`;

const StyledInputColor = styled(Input)`
  box-shadow: 0 0 0 1px ${Colors.black10};
  width: 100% !important;
  border-radius: 2px;

  &:focus {
    outline: none;
  }
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 14px;
  gap: 12px;
`;

const StyleColorTitle = styled.div`
  color: ${Colors.black40};
  text-transform: uppercase;
  margin-bottom: 10px;
  ${Fonts.bodyLarge}
  font-size: 14px;
  font-weight: 500;
`;

const StyleColorError = styled.div`
  position: absolute;
  color: ${Colors.red};
  margin-top: 10px;
  ${Fonts.body}
  font-size: 11px;
`;

export const ColorCard = ({
  themeOption,
  openModal,
}: {
  themeOption: {
    [key: string]: ThemeTokenValue<string>;
  };
  openModal: () => void;
}) => {
  const backgroundColor = Object.keys(themeOption)[0];
  return (
    <StyledColorCard
      background={themeOption[backgroundColor].value}
      onClick={openModal}
    >
      <Icons.Pencil size={18} />
    </StyledColorCard>
  );
};

export const ColorConfigurations = ({
  editorContext,
  onConfigChange,
}: IColorConfiguration) => {
  const colorTokens = editorContext.theme.colors;
  const fontTokens = editorContext.theme.fonts;

  const backend = editorContext.backend;
  let changeColorDetail: NodeJS.Timeout;

  const router = new URLSearchParams(window.location.search);
  const themeId = router.get("themeId");
  const { t } = useTranslation();
  const toaster = useToaster();

  const [openEditColor, setOpenEditColor] = useState<
    | ({
        id: string;
      } & ThemeTokenValue<string>)
    | null
  >(null);
  const [isLoadingReset, setIsLoadingReset] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [openConfirmReset, setOpenConfirmReset] = useState(false);
  const [colorInputError, setColorInputError] = useState("");

  const themeOptions1 = Object.entries(colorTokens).filter(([id]) =>
    id.startsWith("theme_1"),
  );
  const themeOptions2 = Object.entries(colorTokens).filter(([id]) =>
    id.startsWith("theme_2"),
  );
  const themeOptions3 = Object.entries(colorTokens).filter(([id]) =>
    id.startsWith("theme_3"),
  );
  const themeOptions4 = Object.entries(colorTokens).filter(([id]) =>
    id.startsWith("theme_4"),
  );
  const themeOptions5 = Object.entries(colorTokens).filter(([id]) =>
    id.startsWith("theme_5"),
  );

  const themeBackgroundAndTextOptions = {
    id: "theme-background-and-text",
    title: t("theme.background-and-text"),
    options: [themeOptions1],
  };

  const themeActionColorsOptions = {
    id: "theme-action-colors",
    title: t("theme.action-colors"),
    options: [themeOptions2],
  };

  const themeMoreColorsOptions = {
    id: "theme-more-colors",
    title: t("theme.more-colors"),
    options: [themeOptions3, themeOptions4, themeOptions5],
  };

  const themeOptions = [
    themeBackgroundAndTextOptions,
    themeActionColorsOptions,
    themeMoreColorsOptions,
  ];

  const onCloseConfirmReset = () => {
    setOpenConfirmReset(false);
  };

  const closeEditColor = () => {
    setOpenEditColor(null);
  };

  const onReset = async () => {
    if (themeId) {
      setIsLoadingReset(true);
      try {
        await backend.themes?.reset({ id: themeId, configs: ["colors"] });
        toaster.success(t("theme.colors.reset.success"));
      } catch (error) {
        toaster.error(t("theme.colors.reset.fail"));
      } finally {
        setIsLoadingReset(false);
        setOpenConfirmReset(false);
        onConfigChange?.();
      }
    }
  };

  const setColor = (newColor: string) => {
    setOpenEditColor((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        value: newColor,
      };
    });
  };

  const onChangeColor = (newColor: string) => {
    clearTimeout(changeColorDetail);

    changeColorDetail = setTimeout(() => {
      if (typeof newColor === "string" && !validateColor(newColor)) {
        setColorInputError(t("theme.colors.input.error"));
      } else {
        setColorInputError("");
      }
      setColor(newColor);
    }, 100);
  };

  const onSaveEditColor = async () => {
    if (themeId && openEditColor?.value && !colorInputError) {
      setIsLoadingEdit(true);
      const newColorTokens = {
        ...colorTokens,
        [openEditColor?.id]: {
          value: openEditColor.value.trim(),
          isDefault: openEditColor.isDefault,
          label: openEditColor.label?.trim(),
        },
      };

      const fontTokenPayloads = Object.entries(fontTokens).map(
        ([id, value]) => ({
          id,
          ...value,
        }),
      );

      const colorTokenPayloads = Object.entries(newColorTokens).map(
        ([id, value]) => ({
          id,
          ...value,
        }),
      );

      try {
        await backend.themes?.update({
          id: themeId,
          config: {
            fonts: fontTokenPayloads,
            colors: colorTokenPayloads,
          },
        });
        toaster.success(t("topBar.saved"));
      } catch (error) {
        toaster.error(t("topBar.save.error"));
      } finally {
        setIsLoadingEdit(false);
        closeEditColor();
        onConfigChange?.();
      }
    }
  };

  const onEnterChangeColor = (event: React.KeyboardEvent) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      event.stopPropagation();
      onSaveEditColor();
    }
  };

  return (
    <ColorConfigurationsContainer>
      {themeOptions.map((themeOption) => (
        <StyledColorWrapper key={themeOption.id}>
          <StyleColorTitle>{themeOption.title}</StyleColorTitle>

          <StyledColorContentWrapper>
            {themeOption.options.map((themeOptionItems) => {
              return (
                <StyledColorCardWrapper>
                  {themeOptionItems.map(([colorId, colorDetail]) => (
                    <ColorCard
                      key={colorId}
                      themeOption={{ [colorId]: colorDetail }}
                      openModal={() =>
                        setOpenEditColor({ id: colorId, ...colorDetail })
                      }
                    />
                  ))}
                </StyledColorCardWrapper>
              );
            })}
          </StyledColorContentWrapper>
        </StyledColorWrapper>
      ))}

      {openEditColor ? (
        <Modal
          title={t("theme.colors.edit")}
          isOpen={!!openEditColor}
          mode="fit"
          onRequestClose={closeEditColor}
          maxHeight="auto"
          endAdornment={
            <StyledButtonGroup>
              <ButtonSecondary onClick={closeEditColor}>
                {t("cancel")}
              </ButtonSecondary>
              <ButtonPrimary
                isLoading={isLoadingEdit}
                disabled={isLoadingEdit || !!colorInputError}
                onClick={onSaveEditColor}
              >
                {t("template.save.default")}
              </ButtonPrimary>
            </StyledButtonGroup>
          }
        >
          <ColorPicker value={openEditColor?.value} onChange={onChangeColor} />

          <StyledInputWrapper>
            <StyledInputColor
              defaultValue={openEditColor?.value}
              value={openEditColor?.value}
              onChange={(e) => {
                const newColor = e.target.value;
                if (typeof newColor === "string" && !validateColor(newColor)) {
                  setColorInputError(t("theme.colors.input.error"));
                } else {
                  setColorInputError("");
                }
                setColor(newColor);
              }}
              onKeyDown={onEnterChangeColor}
            />
            {colorInputError ? (
              <StyleColorError>{colorInputError}</StyleColorError>
            ) : null}
          </StyledInputWrapper>
        </Modal>
      ) : null}

      <ButtonDanger
        style={{ width: "fit-content" }}
        onClick={() => setOpenConfirmReset(true)}
      >
        {t("theme.colors.reset")}
      </ButtonDanger>

      {/* Modal confirm reset colors */}
      <Modal
        title={t("theme.colors.reset")}
        isOpen={openConfirmReset}
        onRequestClose={onCloseConfirmReset}
        mode="fit"
        height="auto"
        endAdornment={
          <StyledButtonGroup>
            <ButtonSecondary onClick={onCloseConfirmReset}>
              {t("cancel")}
            </ButtonSecondary>
            <ButtonDanger
              isLoading={isLoadingReset}
              disabled={isLoadingReset}
              onClick={onReset}
            >
              {t("theme.colors.reset")}
            </ButtonDanger>
          </StyledButtonGroup>
        }
      >
        <Typography variant={"body"} component="label">
          {t("theme.colors.reset.confirm")}
        </Typography>
      </Modal>
    </ColorConfigurationsContainer>
  );
};
