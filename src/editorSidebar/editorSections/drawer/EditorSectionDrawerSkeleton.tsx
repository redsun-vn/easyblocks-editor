import { Colors } from "@redsun-vn/easyblocks-design-system";
import React from "react";
import styled, { keyframes } from "styled-components";

// Loading placeholder for the section drawer gallery: a title bar on top and a
// 4-column grid of card skeletons (preview rect + label pill below).
const SKELETON_CARDS = 6;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 12px;
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const StyledPreview = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 6px;
  background: ${Colors.black10};
`;

const StyledPill = styled.div`
  width: 70%;
  height: 12px;
  border-radius: 6px;
  background: ${Colors.black10};
`;

export const EditorSectionDrawerSkeleton = () => (
  <StyledRoot>
    <StyledGrid>
      {Array.from({ length: SKELETON_CARDS }).map((_, index) => (
        <StyledCard key={index}>
          <StyledPreview />
          <StyledPill />
        </StyledCard>
      ))}
    </StyledGrid>
  </StyledRoot>
);
