import {
  Colors,
  Icons,
  Loader,
  Typography,
} from "@redsun-vn/easyblocks-design-system";
import React, { useRef, useState } from "react";
import styled from "styled-components";

const SelectionMoreActionsContainer = styled.div<{
  styles?: { top: string; left: string };
}>`
  ${({ styles }) => `
    position: ${styles?.top && styles?.left ? "absolute" : "unset"};
    top: ${styles?.top ?? "unset"};
    left: ${styles?.left ?? "unset"};
  `}
  border-radius: 4px;
  box-shadow: var(--tina-shadow-big);
  width: max-content;
  background: ${Colors.white};
  pointer-events: all;
`;

const SelectionMoreActionsGroupButtons = styled.div`
  height: 36px;
  position: relative;
  padding: 0px 16px;
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;

  &:hover {
    background: ${Colors.black10};
  }
`;

export interface IMenu {
  id: string;
  label: string;
  isLoading?: boolean;
  onClick?: (payload?: unknown) => void;
  children?: IMenu[];
  isHidden?: boolean;
}

export const MenuItem = ({ menu }: { menu: IMenu }) => {
  const [isHoverMenu, setIsHoverMenu] = useState(false);
  const menuItemRef = useRef<HTMLDivElement>(null);

  const onClickMenu = () => {
    if (!menu.isLoading) {
      return !menu?.children?.length ? menu?.onClick?.() : undefined;
    }
  };

  return (
    <SelectionMoreActionsGroupButtons
      ref={menuItemRef}
      onMouseEnter={() => setIsHoverMenu(true)}
      onMouseLeave={() => setIsHoverMenu(false)}
      onClick={onClickMenu}
    >
      <Typography
        style={{ cursor: "pointer" }}
        variant="body"
        component="label"
      >
        {menu.isLoading ? <Loader /> : menu.label}
      </Typography>
      {menu?.children?.length ? <Icons.ChevronRight size={18} /> : null}
      {isHoverMenu && menu?.children ? (
        <Menu
          styles={{
            top: "0px",
            left: `${menuItemRef.current?.offsetWidth ?? 0}px`,
          }}
          menus={menu.children}
        />
      ) : null}
    </SelectionMoreActionsGroupButtons>
  );
};

export const Menu = ({
  menus,
  styles,
}: {
  menus: IMenu[];
  styles?: { top: string; left: string };
}) => {
  return (
    <SelectionMoreActionsContainer styles={styles}>
      {menus
        .filter((menu) => !menu.isHidden)
        .map((menu) => (
          <MenuItem key={menu.id} menu={menu} />
        ))}
    </SelectionMoreActionsContainer>
  );
};
