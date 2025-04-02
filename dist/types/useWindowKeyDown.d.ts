export declare enum ExtraKeys {
    ALT_KEY = "altKey",
    CTRL_KEY = "ctrlKey",
    META_KEY = "metaKey",
    SHIFT_KEY = "shiftKey"
}
interface GlobalKeyDownConfig {
    extraKeys: ExtraKeys[];
    isDisabled: boolean;
}
export declare const useWindowKeyDown: (key: string, callback: (...args: unknown[]) => any, { extraKeys, isDisabled }?: GlobalKeyDownConfig) => void;
export {};
//# sourceMappingURL=useWindowKeyDown.d.ts.map