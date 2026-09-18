import React from "react";
/** What an entry in the section list stands for. */
export type TSectionItemKind = "builtin" | "template";
/**
 * One category row of a sidebar panel.
 *
 * Rows carry no icon: which of the two lists this is — components or templates
 * — is already said by the rail button that opened the panel and by the panel
 * title above, so a glyph on every row would repeat it once per line and eat
 * width the category names need.
 */
export declare const EditorSectionItem: ({ id, name, selected, onSelectSection, }: {
    id: string;
    selected: boolean;
    name: string;
    onSelectSection: (id: string) => void;
}) => React.JSX.Element;
//# sourceMappingURL=EditorSectionItem.d.ts.map