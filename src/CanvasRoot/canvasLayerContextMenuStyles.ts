import type { CSSProperties } from "react";

// Inline styles: the menu renders inside the site page, so it must not depend on page CSS.

const menuStyles: CSSProperties = {
  position: "fixed",
  zIndex: 2147483647,
  minWidth: 180,
  maxWidth: 320,
  maxHeight: "60vh",
  overflowY: "auto",
  padding: "4px 0",
  borderRadius: 4,
  background: "#fff",
  boxShadow: "var(--tina-shadow-big)",
  color: "var(--tina-color-grey-10)",
  fontFamily: "var(--tina-font-family)",
  fontSize: 13,
  lineHeight: "20px",
};

const titleStyles: CSSProperties = {
  padding: "4px 12px",
  color: "var(--tina-color-grey-6)",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

const itemStyles: CSSProperties = {
  display: "block",
  width: "100%",
  padding: "6px 12px",
  border: 0,
  cursor: "pointer",
  color: "inherit",
  font: "inherit",
  textAlign: "left",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export { itemStyles, menuStyles, titleStyles };
