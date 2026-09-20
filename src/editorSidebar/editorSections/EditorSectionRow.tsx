import { Colors } from "@redsun-vn/easyblocks-design-system";
import React from "react";
import styled from "styled-components";

const StyledRow = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 5px 6px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;

  &:hover {
    background: ${Colors.black5};
    border-color: ${Colors.black10};
  }

  &:focus-visible {
    outline: 2px solid ${Colors.blue50};
    outline-offset: -1px;
  }

  &:disabled {
    cursor: default;
  }
`;

/**
 * The picture of what the row will add.
 *
 * Fixed size rather than a ratio, so every row is the same height however tall
 * the thumbnail behind it is and the list stays a column of even rows to scan
 * down. A thumbnail that is missing leaves the box empty rather than absent —
 * the labels would otherwise start at two different left edges in the same
 * group.
 */
const StyledPreview = styled.span`
  position: relative;
  flex: 0 0 auto;
  width: 48px;
  height: 34px;
  border-radius: 4px;
  background: ${Colors.black5};
  border: 1px solid ${Colors.black10};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

/**
 * What an item without a thumbnail shows: its own initials.
 *
 * Two letters of the name it already carries beats a generic glyph repeated
 * down the column, because the whole point of the picture is telling one row
 * from the next at a glance.
 */
const StyledInitials = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${Colors.black500};
  text-transform: uppercase;
`;

const StyledLabel = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 12px;
  line-height: 1.35;
  color: ${Colors.black900};
  /* Two lines, because a section name reads "Mở đầu — form đăng ký bên cạnh"
     and one line of 190px would cut it at the dash, where every row in the
     group looks identical. */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/** `"Mở đầu — canh giữa"` → `"MC"`. */
function initialsOf(label: string): string {
  const words = label.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word));

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

/**
 * One insertable item in a sidebar panel.
 *
 * Clicking it adds the thing to the page. There is no intermediate step: the
 * row already shows the picture and the name that a gallery would have shown,
 * so opening one to click the same item again was a click that bought nothing.
 */
export const EditorSectionRow = ({
  label,
  thumbnail,
  onPick,
}: {
  label: string;
  thumbnail?: string;
  onPick: () => void;
}) => (
  <StyledRow type="button" title={label} onClick={onPick}>
    <StyledPreview>
      {thumbnail ? (
        <StyledThumbnail src={thumbnail} alt="" loading="lazy" />
      ) : (
        <StyledInitials>{initialsOf(label)}</StyledInitials>
      )}
    </StyledPreview>
    <StyledLabel>{label}</StyledLabel>
  </StyledRow>
);
