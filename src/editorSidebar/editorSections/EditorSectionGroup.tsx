import { Colors } from "@redsun-vn/easyblocks-design-system";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { EditorSectionRow } from "./EditorSectionRow";
import { isGroupCollapsed, setGroupCollapsed } from "./panelCollapse";

/** One insertable item, already reduced to what a row needs to draw itself. */
export type TSectionRow = {
  key: string;
  label: string;
  thumbnail?: string;
  onPick: () => void;
  /** Absent on a row that cannot be dragged; the row then only clicks. */
  onDragStart?: (event: React.DragEvent) => void;
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
  margin: 0 0 4px;
  background: ${Colors.white};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: ${Colors.black500};
`;

/**
 * The whole heading is the hit area, not a chevron the size of a full stop.
 *
 * It stays a `button` even in the two places that cannot fold — a search
 * result list, a group with nothing under it — so the row does not shift by a
 * pixel as the reader types.
 */
const StyledHeadingButton = styled.button<{ $canToggle: boolean }>`
  display: flex;
  align-items: baseline;
  gap: 6px;
  width: 100%;
  margin: 0;
  padding: 6px 6px 5px;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: ${({ $canToggle }) => ($canToggle ? "pointer" : "default")};

  &:focus-visible {
    outline: 2px solid ${Colors.blue60};
    outline-offset: -2px;
    border-radius: 3px;
  }
`;

/**
 * Points down over an open group and right over a closed one.
 *
 * Drawn rather than lettered so it turns with the group instead of being
 * swapped for a different glyph, and hidden entirely where folding is not on
 * offer — an arrow that does nothing is worse than no arrow.
 */
const StyledChevron = styled.svg<{ $open: boolean }>`
  flex: none;
  align-self: center;
  width: 8px;
  height: 8px;
  color: ${Colors.black40};
  transform: rotate(${({ $open }) => ($open ? "90deg" : "0deg")});
  transition: transform 120ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
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
 *
 * `storageKey` makes the group foldable and is what its folded state is
 * remembered under. Without one the group is simply open, which is right for
 * the single list a search collapses the taxonomy into.
 *
 * `forceOpen` unfolds the group for as long as it is set, and takes the
 * chevron away while it is. A reader who types a query wants the matches, and
 * a heading with a count over a fold they have to remember to open is the kind
 * of quiet failure that reads as a broken search.
 */
export const EditorSectionGroup = ({
  label,
  count,
  rows,
  isLoading,
  hasMore,
  emptyLabel,
  moreLabel,
  storageKey,
  forceOpen,
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
  storageKey?: string;
  forceOpen?: boolean;
  onLoadMore?: () => void;
  onEnterView?: () => void;
}) => {
  const rootRef = useRef<HTMLElement | null>(null);

  // Read on the first render rather than in an effect, so a group the reader
  // folded last time never flashes open before folding itself. The editor is
  // mounted client-side only, so there is no server render to disagree with.
  const [isFolded, setIsFolded] = useState(() =>
    storageKey ? isGroupCollapsed(storageKey) : false,
  );

  const canToggle = Boolean(storageKey) && !forceOpen;
  const isOpen = !isFolded || Boolean(forceOpen);

  const toggle = () => {
    if (!storageKey || !canToggle) {
      return;
    }

    const next = !isFolded;

    setIsFolded(next);
    setGroupCollapsed(storageKey, next);
  };
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
        <StyledHeadingButton
          type="button"
          $canToggle={canToggle}
          aria-expanded={canToggle ? isOpen : undefined}
          onClick={toggle}
        >
          {canToggle ? (
            <StyledChevron
              $open={isOpen}
              viewBox="0 0 8 8"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M2 0 L7 4 L2 8 Z" fill="currentColor" />
            </StyledChevron>
          ) : null}

          {label}

          {typeof count === "number" && count > 0 ? (
            <StyledCount>{count}</StyledCount>
          ) : null}
        </StyledHeadingButton>
      </StyledHeading>

      {isOpen ? (
        <>
          <StyledRows>
            {rows.map((row) => (
              <EditorSectionRow
                key={row.key}
                label={row.label}
                thumbnail={row.thumbnail}
                onPick={row.onPick}
                onDragStart={row.onDragStart}
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
        </>
      ) : null}
    </StyledGroup>
  );
};
