import { Form, FormOptions } from "../../form";
interface WatchableFormValue {
    values: any;
    label: FormOptions<any>["label"];
    fields: FormOptions<any>["fields"];
}
/**
 * A hook that creates a form and updates it's watched properties.
 */
export declare function useForm<FormShape = any>({ loadInitialValues, ...options }: FormOptions<any>, watch?: Partial<WatchableFormValue>): [FormShape, Form, boolean];
export {};
//# sourceMappingURL=use-form.d.ts.map