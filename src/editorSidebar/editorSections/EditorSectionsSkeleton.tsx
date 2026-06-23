import { Colors } from "@redsun-vn/easyblocks-design-system";
import React from "react";
import styled, { keyframes } from "styled-components";

const SKELETON_ROWS = 20;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const SkeletonBar = styled.div`
  padding-top: 4px;
  padding-left: 4px;
  height: 26px;
  border-radius: 2px;
  background-color: ${Colors.black10};
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

// Shared loading placeholder for the editor section lists.
// Single source of truth — imported by EditorSectionGroup and EditorSectionCard.
export const EditorSectionsSkeleton = () => (
  <>
    {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
      <SkeletonBar key={index} />
    ))}
  </>
);
