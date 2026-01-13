import { ComponentDefinitionShared, Template } from "@redsun-vn/easyblocks-core";
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
    onLoadMore?: () => void;
    mode?: string;
};
export type TemplatePicker<T = Record<never, never>> = React.FC<TemplatePickerProps & T>;
//# sourceMappingURL=TemplatePicker.d.ts.map