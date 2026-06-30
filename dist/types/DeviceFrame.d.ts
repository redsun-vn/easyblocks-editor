import React from "react";
export type DeviceFamily = "mobile-portrait" | "mobile-landscape" | "tablet-portrait" | "tablet-landscape" | "laptop" | "desktop" | null;
export declare function getDeviceFamily(viewport: string): DeviceFamily;
export declare const DEVICE_LABELS: Record<string, string>;
export interface DeviceFrameProps {
    viewport: string;
    width: number;
    height: number;
    transform: string;
    visible: boolean;
}
/** Overlay frame — rendered above the iframe via z-index:10 */
export declare function DeviceFrame({ viewport, width, height, transform, visible, }: DeviceFrameProps): React.JSX.Element | null;
//# sourceMappingURL=DeviceFrame.d.ts.map