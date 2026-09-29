/**
 * Set on the canvas root while the author asks to see every block's boundary.
 * Frames read it through an ancestor selector, so turning it on or off is one
 * attribute flip rather than a re-render of every frame.
 */
export declare const CANVAS_OUTLINES_ATTRIBUTE = "data-easyblocks-show-outlines";
/**
 * A white ring inside a dark one. Whatever colour sits under a frame, one of
 * the two stands out from it: the white on a dark hero video, the dark on a
 * white page. The insertion line already carried customer content this way;
 * the selection frame now does too, instead of a lone blue hairline that
 * vanished on anything darker than the blue itself.
 */
export declare const CONTRAST_RING: string;
/**
 * The frame's own `::after` for its resting, hovered and selected states.
 *
 * Hovered and selected differ in weight, not in opacity: a half-transparent
 * hairline was the old hover, and on a busy background it was not there at all.
 *
 * The outlines rule sits in `:where()` so it adds no specificity: every drag
 * state declared after it (drop target, refusal) still wins, and so does hover.
 */
export declare function selectionFrameOutlineStyles(hoveredTargetFrame: string): {
    [x: string]: {
        content: string;
        boxSizing: string;
        display: string;
        position: string;
        left: number;
        top: number;
        width: string;
        height: string;
        border: string;
        opacity: number;
        pointerEvents: string;
        userSelect: string;
        transition: string;
        borderStyle?: undefined;
        boxShadow?: undefined;
        borderWidth?: undefined;
    } | {
        opacity: number;
        borderStyle: string;
        content?: undefined;
        boxSizing?: undefined;
        display?: undefined;
        position?: undefined;
        left?: undefined;
        top?: undefined;
        width?: undefined;
        height?: undefined;
        border?: undefined;
        pointerEvents?: undefined;
        userSelect?: undefined;
        transition?: undefined;
        boxShadow?: undefined;
        borderWidth?: undefined;
    } | {
        opacity: number;
        borderStyle: string;
        boxShadow: string;
        content?: undefined;
        boxSizing?: undefined;
        display?: undefined;
        position?: undefined;
        left?: undefined;
        top?: undefined;
        width?: undefined;
        height?: undefined;
        border?: undefined;
        pointerEvents?: undefined;
        userSelect?: undefined;
        transition?: undefined;
        borderWidth?: undefined;
    } | {
        opacity: number;
        borderStyle: string;
        borderWidth: string;
        boxShadow: string;
        content?: undefined;
        boxSizing?: undefined;
        display?: undefined;
        position?: undefined;
        left?: undefined;
        top?: undefined;
        width?: undefined;
        height?: undefined;
        border?: undefined;
        pointerEvents?: undefined;
        userSelect?: undefined;
        transition?: undefined;
    };
    "&[data-draggable-active=false]::after": {
        content: string;
        boxSizing: string;
        display: string;
        position: string;
        left: number;
        top: number;
        width: string;
        height: string;
        border: string;
        opacity: number;
        pointerEvents: string;
        userSelect: string;
        transition: string;
    };
    ":where([data-easyblocks-show-outlines=true]) &[data-draggable-active=false]::after": {
        opacity: number;
        borderStyle: string;
    };
    "&[data-active=true]::after": {
        opacity: number;
        borderStyle: string;
        borderWidth: string;
        boxShadow: string;
    };
};
//# sourceMappingURL=selection-frame-outline-styles.d.ts.map