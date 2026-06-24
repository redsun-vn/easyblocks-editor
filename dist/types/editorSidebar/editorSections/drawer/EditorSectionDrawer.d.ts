import React from "react";
import { TSectionTemplate } from "../EditorSections";
export declare const EditorSectionDrawer: ({ templates, isFetching, isLoadingMore, hasMore, onLoadMore, onAddTemplate, containerRef, title, onClose, }: {
    templates: TSectionTemplate[];
    isFetching?: boolean;
    isLoadingMore?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    onAddTemplate: (template: TSectionTemplate) => void;
    containerRef?: React.MutableRefObject<HTMLDivElement | null>;
    title?: string;
    onClose?: () => void;
}) => React.JSX.Element;
//# sourceMappingURL=EditorSectionDrawer.d.ts.map