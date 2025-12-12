type FontVariant = "regular" | `${number}` | "italic" | `${number}italic`;
export interface GoogleFont {
    family: string;
    files: Record<FontVariant, string>;
}
export declare function fetchGoogleFonts(): Promise<any>;
export declare function loadGoogleFonts(): Promise<void>;
export {};
//# sourceMappingURL=googleFonts.d.ts.map