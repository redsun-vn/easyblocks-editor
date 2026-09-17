import React from "react";
/** What an entry in the section list stands for, which also picks its icon. */
export type TSectionItemKind = "builtin" | "template";
export declare const EditorSectionItem: ({ id, name, kind, hovered, onHoverSection, }: {
    id: string;
    hovered: boolean;
    name: string;
    /**
     * Built-in components get `+`, templates get the template glyph. Defaults to
     * the built-in icon so an older caller that predates the split still renders.
     */
    kind?: TSectionItemKind;
    onHoverSection: (id: string) => void;
}) => React.JSX.Element;
//# sourceMappingURL=EditorSectionItem.d.ts.map