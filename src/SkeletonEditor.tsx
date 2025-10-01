import { Colors } from "@redsun-vn/easyblocks-design-system";
import React from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -800px 0;
  }
  100% {
    background-position: 800px 0;
  }
`;

const SkeletonBox = styled.div<{ width?: string; height?: string; borderRadius?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  background: linear-gradient(
    to right,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 800px 100px;
  animation: ${shimmer} 3s infinite linear;
  border-radius: ${props => props.borderRadius || '4px'};
`;

// Mimic the actual editor structure
const SkeletonEditorContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;
`;

const SkeletonTopBar = styled.div`
  height: 40px;
  background: ${Colors.white};
  border-bottom: 1px solid ${Colors.black100};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  gap: 16px;
`;

const SkeletonTopBarLeft = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SkeletonTopBarCenter = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SkeletonTopBarRight = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const SkeletonMainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const SkeletonCanvasArea = styled.div`
  flex: 1;
  background: #e5e5e5;
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
`;

const SkeletonCanvas = styled.div`
  width: 100%;
  max-width: 1300px;
  background: white;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 32px;
`;

const SkeletonSidebar = styled.div`
  flex: 0 0 240px;
  background: ${Colors.white};
  border-left: 1px solid ${Colors.black100};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SkeletonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
`;

const SkeletonContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonMeta = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
`;

export const SkeletonEditor = () => {
  return (
    <SkeletonEditorContainer>
        {/* Top Bar Skeleton */}
        <SkeletonTopBar>
          <SkeletonTopBarLeft>
            <SkeletonBox width="28px" height="28px" borderRadius="4px" />
            <SkeletonBox width="28px" height="28px" borderRadius="4px" />
            <SkeletonBox width="28px" height="28px" borderRadius="4px" />
            <SkeletonBox width="60px" height="28px" borderRadius="6px" />
          </SkeletonTopBarLeft>
          
          <SkeletonTopBarCenter>
            <SkeletonBox width="28px" height="28px" borderRadius="4px" />
            <SkeletonBox width="28px" height="28px" borderRadius="4px" />
            <SkeletonBox width="28px" height="28px" borderRadius="4px" />
            <SkeletonBox width="28px" height="28px" borderRadius="4px" />
            <SkeletonBox width="28px" height="28px" borderRadius="4px" />
            <SkeletonBox width="28px" height="28px" borderRadius="4px" />
            <SkeletonBox width="28px" height="28px" borderRadius="4px" />
          </SkeletonTopBarCenter>
          
          <SkeletonTopBarRight>
            <SkeletonBox width="100px" height="28px" borderRadius="6px" />
            <SkeletonBox width="60px" height="28px" borderRadius="6px" />
            <SkeletonBox width="86px" height="28px" borderRadius="6px" />
          </SkeletonTopBarRight>
        </SkeletonTopBar>

        {/* Main Content Area */}
        <SkeletonMainContent>
          {/* Canvas Area */}
          <SkeletonCanvasArea>
            <SkeletonCanvas>
              {/* Items */}
              <SkeletonItem>
                <SkeletonBox width="188px" height="138px" borderRadius="6px" />
                <SkeletonContent>
                  <SkeletonBox width="100%" height="24px" />
                  <SkeletonBox width="85%" height="20px" />
                  <SkeletonMeta>
                    <SkeletonBox width="100px" height="16px" />
                    <SkeletonBox width="80px" height="16px" />
                  </SkeletonMeta>
                  <SkeletonBox width="60px" height="24px" />
                </SkeletonContent>
              </SkeletonItem>

              <SkeletonItem>
                <SkeletonBox width="188px" height="138px" borderRadius="6px" />
                <SkeletonContent>
                  <SkeletonBox width="95%" height="24px" />
                  <SkeletonBox width="100%" height="18px" />
                  <SkeletonBox width="70%" height="18px" />
                  <SkeletonMeta>
                    <SkeletonBox width="100px" height="16px" />
                    <SkeletonBox width="80px" height="16px" />
                  </SkeletonMeta>
                </SkeletonContent>
              </SkeletonItem>

              <SkeletonItem>
                <SkeletonBox width="188px" height="138px" borderRadius="6px" />
                <SkeletonContent>
                  <SkeletonBox width="90%" height="24px" />
                  <SkeletonMeta>
                    <SkeletonBox width="100px" height="16px" />
                    <SkeletonBox width="80px" height="16px" />
                  </SkeletonMeta>
                </SkeletonContent>
              </SkeletonItem>

              <SkeletonItem>
                <SkeletonBox width="188px" height="138px" borderRadius="6px" />
                <SkeletonContent>
                  <SkeletonBox width="90%" height="24px" />
                  <SkeletonMeta>
                    <SkeletonBox width="100px" height="16px" />
                    <SkeletonBox width="80px" height="16px" />
                  </SkeletonMeta>
                </SkeletonContent>
              </SkeletonItem>
            </SkeletonCanvas>
          </SkeletonCanvasArea>

          {/* Sidebar Skeleton */}
          <SkeletonSidebar>
            <SkeletonSection>
              <SkeletonBox width="100px" height="20px" />
              <SkeletonBox width="100%" height="18px" />
            </SkeletonSection>

            <SkeletonSection>
              <SkeletonBox width="120px" height="20px" />
              <SkeletonBox width="100%" height="18px" />
              <SkeletonBox width="100%" height="18px" />
            </SkeletonSection>

            <SkeletonSection>
              <SkeletonBox width="80px" height="20px" />
              <SkeletonBox width="100%" height="18px" />
              <SkeletonBox width="100%" height="18px" />
              <SkeletonBox width="100%" height="18px" />
            </SkeletonSection>

            <SkeletonSection>
              <SkeletonBox width="80px" height="20px" />
              <SkeletonBox width="100%" height="18px" />
              <SkeletonBox width="100%" height="18px" />
              <SkeletonBox width="100%" height="18px" />
            </SkeletonSection>

            <SkeletonSection>
              <SkeletonBox width="100px" height="20px" />
              <SkeletonBox width="100%" height="18px" />
            </SkeletonSection>

            <SkeletonSection>
              <SkeletonBox width="120px" height="20px" />
              <SkeletonBox width="100%" height="18px" />
              <SkeletonBox width="100%" height="18px" />
            </SkeletonSection>

            <SkeletonSection>
              <SkeletonBox width="120px" height="20px" />
              <SkeletonBox width="100%" height="18px" />
              <SkeletonBox width="100%" height="18px" />
            </SkeletonSection>

            <SkeletonSection>
              <SkeletonBox width="80px" height="20px" />
              <SkeletonBox width="100%" height="18px" />
              <SkeletonBox width="100%" height="18px" />
              <SkeletonBox width="100%" height="18px" />
            </SkeletonSection>
          </SkeletonSidebar>
        </SkeletonMainContent>
      </SkeletonEditorContainer>
  )
}
