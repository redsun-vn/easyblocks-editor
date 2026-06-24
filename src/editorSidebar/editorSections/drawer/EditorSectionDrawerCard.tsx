import { Colors } from "@redsun-vn/easyblocks-design-system";
import { Loader } from "@redsun-vn/easyblocks-design-system/Loader";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React from "react";
import styled from "styled-components";
import { TSectionTemplate } from "../EditorSections";

// Single template card shown in the section drawer gallery.
// Preview box renders the template thumbnail when available, otherwise
// falls back to the centered label text (e.g. "Empty Banner Section").
const StyledCard = styled.div<{ isLoading?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: ${({ isLoading }) => (isLoading ? "default" : "pointer")};
`;

const StyledPreview = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px;
  border-radius: 2px;
  background: ${Colors.black10};
  color: ${Colors.black500};
  overflow: hidden;
  box-sizing: border-box;

  ${StyledCard}:hover & {
    outline: 2px solid ${Colors.blue50};
  }
`;

// Centered spinner shown over the preview box while the section is being added.
const StyledLoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
`;

const StyledThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Fallback label shown inside the preview box when there's no thumbnail.
// Clamps to 2 lines then ellipsis (the box has vertical room from its
// aspect-ratio). Full text is available via the card's title tooltip.
const StyledPlaceholderLabel = styled(Typography)`
  max-width: 90px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

// Bottom label: single line then ellipsis. Full text via the card's title.
const StyledLabel = styled(Typography)`
  max-width: 180px;
  text-align: center !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EditorSectionDrawerCard = ({
  template,
  onClick,
  isLoading,
}: {
  template: TSectionTemplate;
  onClick: () => void;
  isLoading?: boolean;
}) => {
  const label = template.label ?? template.template?.id ?? "";
  const thumbnail = template.template?.thumbnail;

  return (
    <StyledCard onClick={onClick} title={label} isLoading={isLoading}>
      <StyledPreview>
        {thumbnail ? (
          <StyledThumbnail src={thumbnail} alt={label} />
        ) : (
          <StyledPlaceholderLabel variant="body">
            {label}
          </StyledPlaceholderLabel>
        )}
        {isLoading ? (
          <StyledLoadingOverlay>
            <Loader />
          </StyledLoadingOverlay>
        ) : null}
      </StyledPreview>
      <StyledLabel variant="body">{label}</StyledLabel>
    </StyledCard>
  );
};
