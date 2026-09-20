import { Colors } from "@redsun-vn/easyblocks-design-system";
import React from "react";
import styled from "styled-components";

const StyledField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 12px 8px;
  background: ${Colors.white};
`;

const StyledInput = styled.input`
  width: 100%;
  height: 30px;
  padding: 0 26px 0 28px;
  border: 1px solid ${Colors.black10};
  border-radius: 6px;
  background: ${Colors.black5};
  font: inherit;
  font-size: 12px;
  color: ${Colors.black900};
  box-sizing: border-box;

  &::placeholder {
    color: ${Colors.black40};
  }

  &:focus {
    outline: none;
    border-color: ${Colors.blue50};
    background: ${Colors.white};
  }
`;

const StyledIcon = styled.span`
  position: absolute;
  left: 21px;
  display: flex;
  color: ${Colors.black40};
  pointer-events: none;
`;

const StyledClear = styled.button`
  position: absolute;
  right: 20px;
  width: 16px;
  height: 16px;
  display: grid;
  place-items: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: ${Colors.black20};
  color: ${Colors.white};
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
`;

/**
 * The search box under a panel's title.
 *
 * It filters what is already on screen rather than replacing the panel with a
 * result page, so an empty box and a cleared box are the same thing and the
 * way back is always one click on the cross.
 */
export const EditorSectionSearch = ({
  value,
  placeholder,
  clearLabel,
  onChange,
}: {
  value: string;
  placeholder: string;
  clearLabel: string;
  onChange: (value: string) => void;
}) => (
  <StyledField>
    <StyledIcon aria-hidden="true">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <circle
          cx="7"
          cy="7"
          r="4.6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10.6 10.6 14 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </StyledIcon>

    <StyledInput
      // `text`, not `search`: a search input draws a clear button of its own in
      // Chrome, and the panel already has one that the keyboard can reach.
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />

    {value ? (
      <StyledClear
        type="button"
        aria-label={clearLabel}
        onClick={() => onChange("")}
      >
        ×
      </StyledClear>
    ) : null}
  </StyledField>
);
