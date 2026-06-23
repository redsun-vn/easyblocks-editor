import { Colors } from "@redsun-vn/easyblocks-design-system";
import { Loader } from "@redsun-vn/easyblocks-design-system/Loader";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "../../../useTranslation";
import { TSectionTemplate } from "../EditorSections";
import { EditorSectionDrawerCard } from "./EditorSectionDrawerCard";
import { EditorSectionDrawerSkeleton } from "./EditorSectionDrawerSkeleton";

// Trigger load-more when scrolled within this many px of the bottom.
const SCROLL_THRESHOLD = 80;

const DRAWER_WIDTH = 600;

const StyledEditorSectionDrawer = styled.div`
  position: absolute;
  top: 47px;
  left: 198px;
  width: ${DRAWER_WIDTH}px;
  max-height: calc(100vh - 120px);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 16px;
  background: ${Colors.white};
  border: 1px solid ${Colors.black100};
  box-shadow: var(--tina-shadow-big);
  z-index: var(--tina-z-index-5);
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 12px;
`;

const StyledLoadMore = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0 4px;
`;

export const EditorSectionDrawer = ({
  templates,
  isFetching,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onAddTemplate,
  containerRef,
}: {
  templates: TSectionTemplate[];
  isFetching?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onAddTemplate: (template: TSectionTemplate) => void;
  containerRef?: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  const { t } = useTranslation();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAdd = (template: TSectionTemplate, id: string) => {
    if (loadingId) return; // ignore re-clicks during the brief add operation
    setLoadingId(id);
    requestAnimationFrame(() => {
      onAddTemplate(template);
      setLoadingId(null);
    });
  };

  // Infinite scroll: load the next page when scrolled near the bottom.
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || isLoadingMore || !onLoadMore) return;
    const el = event.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD) {
      onLoadMore();
    }
  };

  if (isFetching) {
    return (
      <StyledEditorSectionDrawer ref={containerRef}>
        <EditorSectionDrawerSkeleton />
      </StyledEditorSectionDrawer>
    );
  }

  if (!templates.length) {
    return (
      <StyledEditorSectionDrawer ref={containerRef}>
        <Typography variant="body">{t("noData")}!</Typography>
      </StyledEditorSectionDrawer>
    );
  }

  return (
    <StyledEditorSectionDrawer ref={containerRef} onScroll={handleScroll}>
      <StyledGrid>
        {templates.map((template) => {
          const id = template.template?.id ?? template.id;
          return (
            <EditorSectionDrawerCard
              key={id}
              template={template}
              isLoading={loadingId === id}
              onClick={() => handleAdd(template, id)}
            />
          );
        })}
      </StyledGrid>
      {isLoadingMore ? (
        <StyledLoadMore>
          <Loader />
        </StyledLoadMore>
      ) : null}
    </StyledEditorSectionDrawer>
  );
};
