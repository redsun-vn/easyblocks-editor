import { InternalAnyField, InternalField } from "@redsun-vn/easyblocks-core/_internals";
import { Config, FormApi, FormState } from "final-form";
export interface FormOptions<S, F extends InternalField = InternalAnyField> extends Config<S> {
    id: any;
    label: string;
    fields?: F[];
    __type?: string;
    reset?(): void;
    actions?: any[];
    buttons?: {
        save: string;
        reset: string;
    };
    loadInitialValues?: () => Promise<S>;
    onChange?(values: FormState<S>): void;
}
export declare class Form<S extends Record<string, any> = any, F extends InternalField = InternalAnyField> {
    private _reset;
    __type: string;
    id: any;
    label: string;
    fields: F[];
    finalForm: FormApi<S>;
    actions: any[];
    buttons: {
        save: string;
        reset: string;
    };
    loading: boolean;
    constructor({ id, label, fields, actions, buttons, reset, loadInitialValues, onChange, ...options }: FormOptions<S, F>);
    /**
     * Returns the current values of the form.
     *
     * if the form is still loading it returns `undefined`.
     */
    get values(): S | undefined;
    /**
     * The values the form was initialized with.
     */
    get initialValues(): Partial<S>;
    /**
     * @deprecated Unnecessary indirection
     */
    updateFields(fields: F[]): void;
    /**
     * Subscribes to changes to the form. The subscriber will only be called when
     * values specified in subscription change. A form can have many subscribers.
     */
    subscribe: FormApi<S>["subscribe"];
    onSubmit: Config<S>["onSubmit"];
    private handleSubmit;
    /**
     * Changes the value of the given field.
     *
     * @param name
     * @param value
     */
    change(name: string, value?: any): void;
    get mutators(): Record<string, (...args: any[]) => any>;
    /**
     * Updates multiple fields in the form.
     *
     * The updates are batched so that it only triggers one `onChange` event.
     *
     * In order to prevent disruptions to the user's editing experience this
     * function will _not_ update the value of any field that is currently
     * being edited.
     *
     * @param values
     */
    updateValues(values: S): void;
    /**
     * Replaces the initialValues of the form without deleting the current values.
     *
     * This function is helpful when the initialValues are loaded asynchronously.
     *
     * @param initialValues
     */
    updateInitialValues(initialValues: S): void;
}
//# sourceMappingURL=form.d.ts.map