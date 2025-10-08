import React from 'react'
import styled, { keyframes } from 'styled-components';

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

const SkeletonCanvas = styled.div`
  width: 100%;
  max-width: 1300px;
  background: white;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

const SkeletonEditorCanvasArea = () => {
  return (
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
  )
}

export default SkeletonEditorCanvasArea
