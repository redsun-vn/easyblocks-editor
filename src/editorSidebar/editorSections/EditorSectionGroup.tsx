import { Colors } from "@redsun-vn/easyblocks-design-system";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { EditorSectionRow } from "./EditorSectionRow";

/** One insertable item, already reduced to what a row needs to draw itself. */
export type TSectionRow = {
  key: string;
  label: string;
  thumbnail?: string;
  onPick: () => void;
};

const StyledGroup = styled.section`
  & + & {
    margin-top: 14px;
  }
`;

/**
 * The group name, pinned while its own rows scroll past.
 *
 * Every row in a group looks alike by design, so the name is the only thing
 * saying which part of the library is on screen. Pinning it means that answer
 * is still there twenty rows down.
 */
const StyledHeading = styled.h3`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0 0 4px;
  padding: 6px 6px 5px;
  background: ${Colors.white};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: ${Colors.black500};
`;

const StyledCount = styled.span`
  font-weight: 500;
  letter-spacing: 0;
  color: ${Colors.black40};
`;

const StyledRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledPlaceholderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 6px;

  &::before {
    content: "";
    width: 48px;
    height: 34px;
    border-radius: 4px;
    background: ${Colors.black5};
  }

  &::after {
    content: "";
    flex: 1;
    height: 10px;
    border-radius: 3px;
    background: ${Colors.black5};
  }
`;

const StyledMore = styled.button`
  margin: 4px 0 0 6px;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 11.5px;
  color: ${Colors.blue60};
  cursor: pointer;

  &:disabled {
    color: ${Colors.black40};
    cursor: default;
  }
`;

const StyledEmpty = styled.p`
  margin: 0 0 0 6px;
  font-size: 11.5px;
  color: ${Colors.black500};
`;

/**
 * One named group of a sidebar panel.
 *
 * `onEnterView` fires the first time the group is close to the viewport, which
 * is what lets the Templates panel show every group at once without asking the
 * backend for all of them up front: a group two screens down costs nothing
 * until it is nearly on screen. The components panel passes nothing, because
 * its items are already in memory.
 */
export const EditorSectionGroup = ({
  label,
  count,
  rows,
  isLoading,
  hasMore,
  emptyLabel,
  moreLabel,
  onLoadMore,
  onEnterView,
}: {
  label: string;
  count?: number;
  rows: TSectionRow[];
  isLoading?: boolean;
  hasMore?: boolean;
  emptyLabel?: string;
  moreLabel?: string;
  onLoadMore?: () => void;
  onEnterView?: () => void;
}) => {
  const rootRef = useRef<HTMLElement | null>(null);
  // Held in a ref so the observer is created once: the callback is rebuilt on
  // every render of the panel above, and depending on it would tear the
  // observer down and set it up again each time, which fires it again too.
  const enterRef = useRef(onEnterView);
  enterRef.current = onEnterView;

  useEffect(() => {
    const node = rootRef.current;

    if (!node || !enterRef.current) {
      return;
    }

    // Without IntersectionObserver — jsdom, an old embedded webview — the
    // group asks straight away. Asking too early is a wasted request; never
    // asking is a group that is permanently empty, which is far worse.
    if (typeof IntersectionObserver === "undefined") {
      enterRef.current();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        // Once only: the group is filled from here on, and a second call while
        // the first page is still in flight would fetch it twice.
        observer.disconnect();
        enterRef.current?.();
      },
      // A screenful of margin, so the rows are there by the time the group is
      // scrolled to rather than appearing under the reader's eyes.
      { rootMargin: "400px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <StyledGroup ref={rootRef}>
      <StyledHeading>
        {label}
        {typeof count === "number" && count > 0 ? (
          <StyledCount>{count}</StyledCount>
        ) : null}
      </StyledHeading>

      <StyledRows>
        {rows.map((row) => (
          <EditorSectionRow
            key={row.key}
            label={row.label}
            thumbnail={row.thumbnail}
            onPick={row.onPick}
          />
        ))}

        {isLoading ? (
          <>
            <StyledPlaceholderRow />
            <StyledPlaceholderRow />
            <StyledPlaceholderRow />
          </>
        ) : null}
      </StyledRows>

      {!isLoading && rows.length === 0 && emptyLabel ? (
        <StyledEmpty>{emptyLabel}</StyledEmpty>
      ) : null}

      {hasMore && !isLoading ? (
        <StyledMore type="button" onClick={onLoadMore}>
          {moreLabel}
        </StyledMore>
      ) : null}
    </StyledGroup>
  );
};
