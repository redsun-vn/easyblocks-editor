import { Locale } from "@redsun-vn/easyblocks-core";
import { Colors, Fonts } from "@redsun-vn/easyblocks-design-system";
import React, { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useTranslation } from "./useTranslation";
import { getFlagUrl } from "./utils/getFlagSvgUrl";

/**
 * The two languages of the editor, in one control.
 *
 * They were one value: the flag in the top bar set `contextParams.locale`, and
 * the panel read its own words out of that same value. So opening the English
 * version of a page to work on it turned every field label English too, and
 * there was no way to say "English page, Vietnamese panel" — which is what a
 * Vietnamese shop owner editing an English page actually wants.
 *
 * Two separate controls would have said that clearly, but the top bar is
 * already crowded and two flags side by side invite the same confusion from
 * the other end. One trigger that opens onto two named rows says the thing
 * once: these are different questions, here is the answer to each.
 */

const Trigger = styled.button`
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 6px;
  border-radius: 2px;
  ${Fonts.body};

  box-shadow: 0 0 0 1px ${Colors.black10};
  transition: box-shadow 0.1s;

  @media (hover: hover) {
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 0 1px ${Colors.black20};
    }
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${Colors.focus};
  }
`;

const Anchor = styled.div`
  position: relative;
`;

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 100200;

  min-width: 220px;
  max-height: 420px;
  overflow-y: auto;

  padding: 4px 0;
  background: #fff;
  border: 1px solid ${Colors.black10};
  border-radius: 2px;
  box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.15);
`;

const GroupLabel = styled.div`
  ${Fonts.label};
  color: ${Colors.black40};
  padding: 6px 10px 4px;
`;

const Separator = styled.div`
  height: 1px;
  margin: 4px 0;
  background: ${Colors.black10};
`;

const Option = styled.button<{ $isSelected: boolean }>`
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 28px;
  padding: 0 10px;

  ${Fonts.body};
  color: #000;
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};

  @media (hover: hover) {
    cursor: pointer;

    &:hover {
      background: #daeafd;
    }
  }

  &:focus-visible {
    background: #daeafd;
  }
`;

const Flag = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
`;

const Check = styled.span`
  margin-left: auto;
  color: ${Colors.black40};
`;

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type LanguageSelectProps = {
  /** The languages this shop publishes its pages in. */
  contentLocales: Locale[];
  contentLocale: string;
  onContentLocaleChange: (locale: string) => void;
  /** The languages the editor itself has been translated into. */
  uiLocales: string[];
  uiLocale: string;
  onUiLocaleChange: (locale: string) => void;
};

export function LanguageSelect({
  contentLocales,
  contentLocale,
  onContentLocaleChange,
  uiLocales,
  uiLocale,
  onUiLocaleChange,
}: LanguageSelectProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnOutsideClick(event: MouseEvent) {
      if (!anchorRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    // `mousedown` rather than `click`: a click that starts inside the popover
    // and ends outside it — dragging across a long language name — is not
    // somebody asking to close it.
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  /**
   * What to call a language.
   *
   * A translated name first, so the editor's own row reads in the reader's
   * language. Shop languages come from a table of 163 English names, which is
   * the right answer for a language nobody has translated a name for, and the
   * bare code is better than an empty row for one that is not in the table.
   */
  const localeName = (code: string) => {
    const translated = t(`editor.language.${code}`);

    if (translated !== `editor.language.${code}`) {
      return translated;
    }

    return contentLocales.find((l) => l.code === code)?.name ?? code;
  };

  const renderOption = (
    code: string,
    isSelected: boolean,
    onSelect: () => void,
  ) => (
    <Option
      key={code}
      type="button"
      $isSelected={isSelected}
      onClick={() => {
        onSelect();
        setIsOpen(false);
      }}
    >
      {getFlagUrl(code) ? <Flag src={getFlagUrl(code)} alt="" /> : null}
      <Name>{localeName(code)}</Name>
      {isSelected ? <Check>✓</Check> : null}
    </Option>
  );

  return (
    <Anchor ref={anchorRef}>
      <Trigger
        type="button"
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        title={t("editor.language.tooltip")}
      >
        {getFlagUrl(contentLocale) ? (
          <Flag src={getFlagUrl(contentLocale)} alt="" />
        ) : null}
        <Name>{localeName(contentLocale)}</Name>
      </Trigger>

      {isOpen && (
        <Popover>
          <GroupLabel>{t("editor.language.content")}</GroupLabel>
          {contentLocales.map((locale) =>
            renderOption(locale.code, locale.code === contentLocale, () =>
              onContentLocaleChange(locale.code),
            ),
          )}

          <Separator />

          <GroupLabel>{t("editor.language.ui")}</GroupLabel>
          {uiLocales.map((code) =>
            renderOption(code, code === uiLocale, () => onUiLocaleChange(code)),
          )}
        </Popover>
      )}
    </Anchor>
  );
}
