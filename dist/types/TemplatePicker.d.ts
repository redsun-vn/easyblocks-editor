import { ComponentDefinitionShared, NoCodeComponentEntry, Template } from "@redsun-vn/easyblocks-core";
import { TEasyblocksEditorMode } from "./types";
export type TemplatesDictionary = {
    [componentId: string]: {
        component: ComponentDefinitionShared & {
            group?: string;
        };
        templates: Template[];
    };
};
export type TemplatePickerProps = {
    isOpen: boolean;
    templates?: TemplatesDictionary;
    templateCount?: Record<string, any>;
    isFetching?: boolean;
    onClose: (template?: Template) => void;
    onSearchGroup?: (text: string) => void;
    onFilters?: (filters: string) => void;
    onLoadMore?: (page: number, groupId: string) => Promise<void> | void;
    mode?: string;
    editorMode: TEasyblocksEditorMode;
    loadMode?: "replace" | "append";
};
export type TemplatePicker<T = Record<never, never>> = React.FC<TemplatePickerProps & T>;
export type SaveAsTemplatePickerProps = TemplatePickerProps & {
    saveAsEntry: NoCodeComponentEntry | null;
    title?: string;
    onClose: () => void;
    onSuccess?: () => void;
    onError?: () => void;
};
export type SaveAsTemplatePicker<T = Record<never, never>> = React.FC<SaveAsTemplatePickerProps & T>;
//# sourceMappingURL=TemplatePicker.d.ts.map