import { InternalField } from "@redsun-vn/easyblocks-core/_internals";
import { EditorContextType } from "../../../../EditorContext";
import { Form } from "../../../../form";
export type ResponsiveFieldDefinition = Omit<InternalField, "component"> & {
    component: "responsive2";
    subComponent: string;
    hasAuto?: boolean;
};
type ResponsiveFieldController = {
    field: InternalField;
    isResponsive: boolean;
    isSet: boolean;
    reset: () => void;
    toggleOffAuto: () => void;
};
export declare function responsiveFieldController(config: {
    field: ResponsiveFieldDefinition;
    formValues: Form["values"];
    onChange: (newValues: Array<any>) => void;
    editorContext: EditorContextType;
    valuesAfterAuto: Record<string, any>;
}): ResponsiveFieldController;
export {};
//# sourceMappingURL=responsiveFieldController.d.ts.map