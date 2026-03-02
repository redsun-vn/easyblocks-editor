import React from "react";
export interface IMenu {
    id: string;
    label: string;
    isLoading?: boolean;
    onClick?: (payload?: unknown) => void;
    children?: IMenu[];
    isHidden?: boolean;
}
export declare const MenuItem: ({ menu }: {
    menu: IMenu;
}) => React.JSX.Element;
export declare const Menu: ({ menus, styles, }: {
    menus: IMenu[];
    styles?: {
        top: string;
        left: string;
    };
}) => React.JSX.Element;
//# sourceMappingURL=Menu.d.ts.map