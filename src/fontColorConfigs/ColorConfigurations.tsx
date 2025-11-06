import { ThemeTokenValue } from "@redsun-vn/easyblocks-core";
import {
  ButtonPrimary,
  ButtonSecondary,
  Colors,
  HexAlphaColorPicker,
  Icons,
  Input,
  Modal,
  useToaster,
} from "@redsun-vn/easyblocks-design-system";
import React, { useState } from "react";
import styled from "styled-components";
import { EditorContextType } from "../EditorContext";
import { useTranslation } from "../useTranslation";
import { getIconColor } from "../utils/colors";

interface IColorConfiguration {
  onConfigChange?: () => Promise<void>;
  editorContext: EditorContextType;
}

const ColorConfigurationsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledColorCardWrapper = styled.div`
  max-width: 250px;
  width: 100%;
  display: flex;
  overflow: hidden;
  border: 1px solid ${Colors.black100};
  border-radius: 4px;
`;

const StyledColorCard = styled.div<{ background: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 50px;
  width: 100%;
  height: 50px;
  background: ${({ background }) => background};

  & > div {
    display: none;
    color: ${({ background }) => getIconColor(background)};
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
  width: 100%;
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

  const themeOptions1 = Object.entries(colorTokens).filter(([id]) =>
    id.startsWith("theme_1")
  );
  const themeOptions2 = Object.entries(colorTokens).filter(([id]) =>
    id.startsWith("theme_2")
  );
  const themeOptions3 = Object.entries(colorTokens).filter(([id]) =>
    id.startsWith("theme_3")
  );
  const themeOptions4 = Object.entries(colorTokens).filter(([id]) =>
    id.startsWith("theme_4")
  );
  const themeOptions5 = Object.entries(colorTokens).filter(([id]) =>
    id.startsWith("theme_5")
  );

  const themeOptions = [
    themeOptions1,
    themeOptions2,
    themeOptions3,
    themeOptions4,
    themeOptions5,
  ];

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
        onConfigChange?.();
      }
    }
  };

  const setColor = (newColor: string) => {
    setOpenEditColor((prev) => {
      if (!prev) return prev;
      return {
        id: prev.id,
        value: newColor,
        isDefault: prev.isDefault,
        label: prev.label,
      };
    });
  };

  const onChangeColor = (newColor: string) => {
    clearTimeout(changeColorDetail);

    changeColorDetail = setTimeout(() => {
      setColor(newColor);
    }, 300);
  };

  const onSaveEditColor = async () => {
    if (themeId && openEditColor) {
      setIsLoadingEdit(true);
      const newColorTokens = {
        ...colorTokens,
        [openEditColor?.id]: {
          value: openEditColor.value,
          isDefault: openEditColor.isDefault,
          label: openEditColor.label,
        },
      };

      const fontTokenPayloads = Object.entries(fontTokens).map(
        ([id, value]) => ({
          id,
          ...value,
        })
      );

      const colorTokenPayloads = Object.entries(newColorTokens).map(
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
      onSaveEditColor();
    }
  };

  return (
    <ColorConfigurationsContainer>
      {themeOptions.map((themeOption) => {
        return (
          <StyledColorCardWrapper>
            {themeOption.map(([colorId, colorDetail]) => (
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

      {openEditColor ? (
        <Modal
          title={t("theme.colors.edit")}
          isOpen={!!openEditColor}
          mode="center-small"
          onRequestClose={closeEditColor}
          maxHeight="400px"
        >
          <HexAlphaColorPicker
            style={{ width: "100%", padding: 4 }}
            color={openEditColor?.value}
            onChange={onChangeColor}
            onKeyDown={onEnterChangeColor}
          />

          <StyledInputWrapper>
            <StyledInputColor
              defaultValue={openEditColor?.value}
              value={openEditColor?.value}
              onChange={(e) => setColor(e.target.value)}
              onKeyDown={onEnterChangeColor}
            />
          </StyledInputWrapper>

          <StyledButtonGroup>
            <ButtonSecondary onClick={closeEditColor}>
              {t("cancel")}
            </ButtonSecondary>
            <ButtonPrimary
              isLoading={isLoadingEdit}
              disabled={isLoadingEdit}
              onClick={onSaveEditColor}
            >
              {t("template.save.default")}
            </ButtonPrimary>
          </StyledButtonGroup>
        </Modal>
      ) : null}

      <ButtonPrimary
        isLoading={isLoadingReset}
        disabled={isLoadingReset}
        style={{ width: "fit-content" }}
        onClick={onReset}
      >
        {t("theme.colors.reset")}
      </ButtonPrimary>
    </ColorConfigurationsContainer>
  );
};
