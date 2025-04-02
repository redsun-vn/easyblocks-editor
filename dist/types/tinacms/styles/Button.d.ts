interface ButtonProps {
    primary?: boolean;
    small?: boolean;
    margin?: boolean;
    grow?: boolean;
    open?: boolean;
    busy?: boolean;
    disabled?: boolean;
}
export declare const ICON_BUTTON_SIZE = 23;
export declare const IconButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<Omit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, keyof ButtonProps> & ButtonProps, "ref"> & {
    ref?: ((instance: HTMLButtonElement | null) => void | import("react").DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES[keyof import("react").DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES]) | import("react").RefObject<HTMLButtonElement> | null | undefined;
}, never>> & string;
export {};
//# sourceMappingURL=Button.d.ts.map