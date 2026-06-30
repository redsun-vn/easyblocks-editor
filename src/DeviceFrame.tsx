import React from "react";
import { styled } from "styled-components";

// ---------------------------------------------------------------------------
// xs  → mobile-portrait   (phone portrait)
// sm  → mobile-landscape  (phone landscape)
// md  → tablet-portrait   (tablet portrait)
// lg  → tablet-landscape  (tablet landscape)
// xl  → laptop            (laptop/macbook)
// 2xl → desktop           (desktop monitor)
// ---------------------------------------------------------------------------

export type DeviceFamily =
  | "mobile-portrait"
  | "mobile-landscape"
  | "tablet-portrait"
  | "tablet-landscape"
  | "laptop"
  | "desktop"
  | null;

export function getDeviceFamily(viewport: string): DeviceFamily {
  if (viewport === "fit-screen") return null;
  if (viewport === "xs") return "mobile-portrait";
  if (viewport === "sm") return "mobile-landscape";
  if (viewport === "md") return "tablet-portrait";
  if (viewport === "lg") return "tablet-landscape";
  if (viewport === "xl") return "laptop";
  if (viewport === "2xl") return "desktop";
  return null;
}

export const DEVICE_LABELS: Record<string, string> = {
  xs: "Mobile",
  sm: "Mobile",
  md: "Tablet",
  lg: "Tablet",
  xl: "Laptop",
  "2xl": "Desktop",
  "fit-screen": "Fit Screen",
};

// Shared helper — builds a rounded-rect SVG path
function rrPath(
  x: number, y: number, w: number, h: number,
  r: number, cw = true
): string {
  if (r <= 0) {
    // Degenerate: plain rect
    return cw
      ? `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`
      : `M ${x} ${y} V ${y + h} H ${x + w} V ${y} Z`;
  }
  if (cw) {
    return [
      `M ${x + r} ${y}`,
      `H ${x + w - r}`, `Q ${x + w} ${y}   ${x + w} ${y + r}`,
      `V ${y + h - r}`, `Q ${x + w} ${y + h} ${x + w - r} ${y + h}`,
      `H ${x + r}`, `Q ${x}   ${y + h} ${x}     ${y + h - r}`,
      `V ${y + r}`, `Q ${x}   ${y}   ${x + r}   ${y}`,
      `Z`,
    ].join(" ");
  } else {
    // CCW — for evenodd screen hole; include display corner radius
    return [
      `M ${x + r} ${y}`,
      `V ${y}`, // noop, start here
      `Q ${x} ${y}   ${x}     ${y + r}`,
      `V ${y + h - r}`, `Q ${x}   ${y + h} ${x + r}   ${y + h}`,
      `H ${x + w - r}`, `Q ${x + w} ${y + h} ${x + w}   ${y + h - r}`,
      `V ${y + r}`, `Q ${x + w} ${y}   ${x + w - r} ${y}`,
      `Z`,
    ].join(" ");
  }
}

// Frame gradient IDs are made unique per-frame via a prefix prop
function FrameGrads({ id }: { id: string }) {
  return (
    <>
      {/* Main frame fill — Space Black */}
      <linearGradient id={`${id}Fill`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2e2e32" />
        <stop offset="40%" stopColor="#1e1e22" />
        <stop offset="100%" stopColor="#111114" />
      </linearGradient>
      {/* Top-edge catch light — matte aluminum barely catches ambient */}
      <linearGradient id={`${id}TopEdge`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.09)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
      </linearGradient>
    </>
  );
}

function MobilePortraitFrame({ width, height }: { width: number; height: number }) {
  const bezel = width * 0.0422;
  const rxOuter = width * 0.170;
  const rxScr = width * 0.112;

  const svgLeft = -bezel;
  const svgTop = -bezel;
  const svgW = width + bezel * 2;
  const svgH = height + bezel * 2;

  const shellPath =
    rrPath(0, 0, svgW, svgH, rxOuter, true) +
    " " +
    rrPath(bezel, bezel, width, height, rxScr, false);

  // Power button — right side
  const btnDepth = Math.max(2.5, bezel * 0.42);
  const btnRx = btnDepth * 0.4;
  const pwrH = height * (95 / 852);
  const pwrY = bezel + height * (190 / 852);
  // Volume up / down — left side
  const vuH = height * (61 / 852);
  const vuY = bezel + height * (195 / 852);
  const vdH = height * (61 / 852);
  const vdY = bezel + height * (265 / 852);
  // Action button — left side (replaces silent switch on 15 Pro)
  const actH = height * (67 / 852);
  const actY = bezel + height * (115 / 852);

  // Dynamic Island — pill-shaped cutout near top of screen, horizontally
  // centered. Real iPhone proportions: ~126pt wide x 37pt tall on a 393pt
  // wide / 852pt tall screen, sitting ~11pt below the top edge.
  const diW = width * (126 / 393);
  const diH = height * (37 / 852);
  const diX = bezel + (width - diW) / 2;
  const diY = bezel + height * (11 / 852);
  const diRx = diH / 2;

  // Camera — sits inside the Dynamic Island, offset toward the right side
  // (matches real hardware: the TrueDepth/IR camera cluster sits right of
  // center while the left portion of the pill is reserved for sensors).
  const camR = diH * 0.30;
  const camCx = diX + diW - diH * 0.62;
  const camCy = diY + diH / 2;

  // Home indicator bar — bottom safe-area gesture bar, thin rounded pill
  // centered near the bottom edge of the screen.
  const homeW = width * (134 / 393);
  const homeH = height * (5 / 852);
  const homeX = bezel + (width - homeW) / 2;
  const homeY = bezel + height - height * (8 / 852) - homeH;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={svgW} height={svgH}
      style={{
        position: "absolute", top: svgTop, left: svgLeft,
        pointerEvents: "none", overflow: "visible"
      }}>
      <defs>
        <FrameGrads id="mobP" />
      </defs>

      <g filter="url(#frameShadow)">
        <path d={shellPath} fillRule="evenodd" fill="url(#mobPFill)" />
      </g>

      {/* Outer edge bevel — top catches light, bottom in shadow */}
      <path d={`M ${rxOuter} 0 H ${svgW - rxOuter} Q ${svgW} 0 ${svgW} ${rxOuter}`}
        fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" strokeLinecap="round" />
      <path d={`M 0 ${rxOuter} V ${svgH - rxOuter}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <path d={`M ${svgW} ${rxOuter} V ${svgH - rxOuter} Q ${svgW} ${svgH} ${svgW - rxOuter} ${svgH} H ${rxOuter} Q 0 ${svgH} 0 ${svgH - rxOuter}`}
        fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" strokeLinecap="round" />

      {/* Display edge — thin 1px border at glass boundary, no shadow inside */}
      <path d={rrPath(bezel, bezel, width, height, rxScr, true)}
        fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1" />

      {/* Action button — left */}
      <rect x={0} y={actY} width={btnDepth} height={actH}
        rx={btnRx} ry={btnRx} fill="url(#mobPFill)" />
      {/* Volume up — left */}
      <rect x={0} y={vuY} width={btnDepth} height={vuH}
        rx={btnRx} ry={btnRx} fill="url(#mobPFill)" />
      {/* Volume down — left */}
      <rect x={0} y={vdY} width={btnDepth} height={vdH}
        rx={btnRx} ry={btnRx} fill="url(#mobPFill)" />
      {/* Power — right */}
      <rect x={svgW - btnDepth} y={pwrY} width={btnDepth} height={pwrH}
        rx={btnRx} ry={btnRx} fill="url(#mobPFill)" />

      {/* Dynamic Island — sits on screen, same fill as frame so it reads as
          a true cutout regardless of the iframe content behind it */}
      <rect x={diX} y={diY} width={diW} height={diH} rx={diRx} ry={diRx}
        fill="#000000" />
      {/* subtle inner highlight so the pill doesn't look perfectly flat */}
      <rect x={diX} y={diY} width={diW} height={diH} rx={diRx} ry={diRx}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
      {/* Camera — offset toward the right side of the island */}
      <circle cx={camCx} cy={camCy} r={camR} fill="#0a0a0c" />
      <circle cx={camCx} cy={camCy} r={camR * 0.55} fill="#1c2230" />
      <circle cx={camCx - camR * 0.25} cy={camCy - camR * 0.25} r={camR * 0.18}
        fill="rgba(255,255,255,0.35)" />

      {/* Home indicator bar */}
      <rect x={homeX} y={homeY} width={homeW} height={homeH} rx={homeH / 2} ry={homeH / 2}
        fill="rgba(0,0,0,0.55)" />
    </svg>
  );
}

function MobileLandscapeFrame({ width, height }: { width: number; height: number }) {
  const bezel = height * 0.0422;
  const rxOuter = height * 0.170;
  const rxScr = height * 0.112;

  const svgLeft = -bezel;
  const svgTop = -bezel;
  const svgW = width + bezel * 2;
  const svgH = height + bezel * 2;

  const shellPath =
    rrPath(0, 0, svgW, svgH, rxOuter, true) +
    " " +
    rrPath(bezel, bezel, width, height, rxScr, false);

  const btnDepth = Math.max(2.5, bezel * 0.42);
  const btnRx = btnDepth * 0.4;
  // Power — top
  const pwrW = width * (95 / 852);
  const pwrX = bezel + width * (190 / 852);
  // Action — bottom right
  const actW = width * (67 / 852);
  const actX = bezel + width * (670 / 852);
  // Volume up/down — bottom
  const vuW = width * (61 / 852);
  const vuX = bezel + width * (588 / 852);
  const vdW = width * (61 / 852);
  const vdX = bezel + width * (518 / 852);

  // Dynamic Island — rotated 90°, now a vertical pill on the left edge of
  // the screen, vertically centered (mirrors the portrait top-center pill).
  const diH = height * (126 / 393);
  const diW = width * (37 / 852);
  const diY = bezel + (height - diH) / 2;
  const diX = bezel + width * (11 / 852);
  const diRx = diW / 2;

  // Camera — offset toward the bottom of the island (mirrors the
  // "right side" offset from portrait, rotated 90° clockwise).
  const camR = diW * 0.30;
  const camCy = diY + diH - diW * 0.62;
  const camCx = diX + diW / 2;

  // Home indicator bar — moves to the right edge in landscape.
  const homeH = height * (134 / 393);
  const homeW = width * (5 / 852);
  const homeY = bezel + (height - homeH) / 2;
  const homeX = bezel + width - width * (8 / 852) - homeW;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={svgW} height={svgH}
      style={{
        position: "absolute", top: svgTop, left: svgLeft,
        pointerEvents: "none", overflow: "visible"
      }}>
      <defs>
        <FrameGrads id="mobL" />
      </defs>

      <g filter="url(#frameShadow)">
        <path d={shellPath} fillRule="evenodd" fill="url(#mobLFill)" />
      </g>

      <path d={`M ${rxOuter} 0 H ${svgW - rxOuter} Q ${svgW} 0 ${svgW} ${rxOuter}`}
        fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" strokeLinecap="round" />
      <path d={`M 0 ${rxOuter} V ${svgH - rxOuter}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <path d={`M ${svgW} ${rxOuter} V ${svgH - rxOuter} Q ${svgW} ${svgH} ${svgW - rxOuter} ${svgH} H ${rxOuter} Q 0 ${svgH} 0 ${svgH - rxOuter}`}
        fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" strokeLinecap="round" />

      <path d={rrPath(bezel, bezel, width, height, rxScr, true)}
        fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1" />

      {/* Power — top */}
      <rect x={pwrX} y={0} width={pwrW} height={btnDepth}
        rx={btnRx} ry={btnRx} fill="url(#mobLFill)" />
      {/* Action — bottom */}
      <rect x={actX} y={svgH - btnDepth} width={actW} height={btnDepth}
        rx={btnRx} ry={btnRx} fill="url(#mobLFill)" />
      {/* Volume up — bottom */}
      <rect x={vuX} y={svgH - btnDepth} width={vuW} height={btnDepth}
        rx={btnRx} ry={btnRx} fill="url(#mobLFill)" />
      {/* Volume down — bottom */}
      <rect x={vdX} y={svgH - btnDepth} width={vdW} height={btnDepth}
        rx={btnRx} ry={btnRx} fill="url(#mobLFill)" />

      {/* Dynamic Island — vertical pill on the left edge */}
      <rect x={diX} y={diY} width={diW} height={diH} rx={diRx} ry={diRx}
        fill="#000000" />
      <rect x={diX} y={diY} width={diW} height={diH} rx={diRx} ry={diRx}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
      {/* Camera — offset toward the bottom of the island */}
      <circle cx={camCx} cy={camCy} r={camR} fill="#0a0a0c" />
      <circle cx={camCx} cy={camCy} r={camR * 0.55} fill="#1c2230" />
      <circle cx={camCx - camR * 0.25} cy={camCy - camR * 0.25} r={camR * 0.18}
        fill="rgba(255,255,255,0.35)" />

      {/* Home indicator bar — right edge */}
      <rect x={homeX} y={homeY} width={homeW} height={homeH} rx={homeW / 2} ry={homeW / 2}
        fill="rgba(0,0,0,0.55)" />
    </svg>
  );
}

function TabletPortraitFrame({ width, height }: { width: number; height: number }) {
  const bezel = width * 0.0426;
  const rxOuter = width * 0.0907;
  const rxScr = Math.max(0, rxOuter - bezel);

  const svgLeft = -bezel;
  const svgTop = -bezel;
  const svgW = width + bezel * 2;
  const svgH = height + bezel * 2;

  const shellPath =
    rrPath(0, 0, svgW, svgH, rxOuter, true) +
    " " +
    rrPath(bezel, bezel, width, height, rxScr, false);

  // Power/Touch ID — top edge, right area
  const pwrW = width * 0.176;
  const pwrH = bezel * 0.62;
  const pwrX = bezel + width - width * 0.060 - pwrW;
  // Volume — right side
  const volH = height * 0.113;
  const volBW = bezel * 0.62;
  const vol1Y = bezel + height * 0.220;
  const vol2Y = bezel + height * 0.345;

  // Front camera — latest iPad Pro (M4) moved the TrueDepth camera to the
  // landscape long edge so it's centered when the device is used sideways
  // (the most common orientation for video calls on iPad). In portrait
  // that puts it on the right-edge bezel, vertically centered.
  const camR = bezel * 0.26;
  const camCx = bezel + width + bezel / 2;
  const camCy = bezel + height / 2;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={svgW} height={svgH}
      style={{
        position: "absolute", top: svgTop, left: svgLeft,
        pointerEvents: "none", overflow: "visible"
      }}>
      <defs>
        <FrameGrads id="tabP" />
      </defs>

      <g filter="url(#frameShadow)">
        <path d={shellPath} fillRule="evenodd" fill="url(#tabPFill)" />
      </g>

      <path d={`M ${rxOuter} 0 H ${svgW - rxOuter} Q ${svgW} 0 ${svgW} ${rxOuter}`}
        fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" strokeLinecap="round" />
      <path d={`M 0 ${rxOuter} V ${svgH - rxOuter}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <path d={`M ${svgW} ${rxOuter} V ${svgH - rxOuter} Q ${svgW} ${svgH} ${svgW - rxOuter} ${svgH} H ${rxOuter} Q 0 ${svgH} 0 ${svgH - rxOuter}`}
        fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" strokeLinecap="round" />

      <path d={rrPath(bezel, bezel, width, height, rxScr, true)}
        fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1" />

      {/* Power — top */}
      <rect x={pwrX} y={0} width={pwrW} height={pwrH}
        rx={pwrH * 0.30} ry={pwrH * 0.30} fill="url(#tabPFill)" />
      {/* Volume up — right */}
      <rect x={svgW - volBW} y={vol1Y} width={volBW} height={volH}
        rx={volBW * 0.28} ry={volBW * 0.28} fill="url(#tabPFill)" />
      {/* Volume down — right */}
      <rect x={svgW - volBW} y={vol2Y} width={volBW} height={volH}
        rx={volBW * 0.28} ry={volBW * 0.28} fill="url(#tabPFill)" />

      {/* Front camera — right edge bezel, vertically centered
          (landscape-long-edge placement per latest iPad Pro) */}
      <circle cx={camCx} cy={camCy} r={camR} fill="#0a0a0c" />
      <circle cx={camCx} cy={camCy} r={camR * 0.55} fill="#1c2230" />
      <circle cx={camCx - camR * 0.25} cy={camCy - camR * 0.25} r={camR * 0.18}
        fill="rgba(255,255,255,0.30)" />
    </svg>
  );
}

function TabletLandscapeFrame({ width, height }: { width: number; height: number }) {
  const bezelH = height * 0.0426;
  const bezelW = width * 0.0319;
  const rxOuter = height * 0.0907;
  // Concentric with the outer radius (see TabletPortraitFrame for rationale)
  const rxScr = Math.max(0, rxOuter - bezelH);

  const svgLeft = -bezelW;
  const svgTop = -bezelH;
  const svgW = width + bezelW * 2;
  const svgH = height + bezelH * 2;

  const shellPath =
    rrPath(0, 0, svgW, svgH, rxOuter, true) +
    " " +
    rrPath(bezelW, bezelH, width, height, rxScr, false);

  // Power — right side, lower area
  const pwrH = height * 0.176;
  const pwrW = bezelH * 0.62;
  const pwrY = bezelH + height - height * 0.060 - pwrH;
  // Volume — top edge
  const volW = width * 0.113;
  const volBH = bezelH * 0.62;
  const vol1X = bezelW + width * 0.220;
  const vol2X = bezelW + width * 0.345;

  // Front camera — top edge bezel, horizontally centered. This is the
  // native orientation for the relocated TrueDepth camera on the latest
  // iPad Pro: centered on the long edge for landscape video calls.
  const camR = bezelH * 0.26;
  const camCx = bezelW + width / 2;
  const camCy = bezelH / 2;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={svgW} height={svgH}
      style={{
        position: "absolute", top: svgTop, left: svgLeft,
        pointerEvents: "none", overflow: "visible"
      }}>
      <defs>
        <FrameGrads id="tabL" />
      </defs>

      <g filter="url(#frameShadow)">
        <path d={shellPath} fillRule="evenodd" fill="url(#tabLFill)" />
      </g>

      <path d={`M ${rxOuter} 0 H ${svgW - rxOuter} Q ${svgW} 0 ${svgW} ${rxOuter}`}
        fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" strokeLinecap="round" />
      <path d={`M 0 ${rxOuter} V ${svgH - rxOuter}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <path d={`M ${svgW} ${rxOuter} V ${svgH - rxOuter} Q ${svgW} ${svgH} ${svgW - rxOuter} ${svgH} H ${rxOuter} Q 0 ${svgH} 0 ${svgH - rxOuter}`}
        fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" strokeLinecap="round" />

      <path d={rrPath(bezelW, bezelH, width, height, rxScr, true)}
        fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1" />

      {/* Power — right */}
      <rect x={svgW - pwrW} y={pwrY} width={pwrW} height={pwrH}
        rx={pwrW * 0.30} ry={pwrW * 0.30} fill="url(#tabLFill)" />
      {/* Volume up — top */}
      <rect x={vol1X} y={0} width={volW} height={volBH}
        rx={volBH * 0.28} ry={volBH * 0.28} fill="url(#tabLFill)" />
      {/* Volume down — top */}
      <rect x={vol2X} y={0} width={volW} height={volBH}
        rx={volBH * 0.28} ry={volBH * 0.28} fill="url(#tabLFill)" />

      {/* Front camera — top edge bezel, horizontally centered
          (native landscape placement on latest iPad Pro) */}
      <circle cx={camCx} cy={camCy} r={camR} fill="#0a0a0c" />
      <circle cx={camCx} cy={camCy} r={camR * 0.55} fill="#1c2230" />
      <circle cx={camCx - camR * 0.25} cy={camCy - camR * 0.25} r={camR * 0.18}
        fill="rgba(255,255,255,0.30)" />
    </svg>
  );
}

function LaptopFrame({ width, height }: { width: number; height: number }) {
  const bT = Math.round(height * 0.032);
  const bS = Math.round(width * 0.014);
  const bB = Math.round(height * 0.040);
  const rx = Math.round(width * 0.010);

  const overhang = Math.round(width * 0.026);
  const bodyH = Math.round(width * 0.021);
  const bodyRx = Math.round(width * 0.006);
  const hingeH = Math.round(bodyH * 0.35);
  const edgeH = Math.round(bodyH * 0.30);

  const svgLeft = -(overhang + bS);
  const svgTop = -bT;

  const lidX = overhang;
  const lidY = 0;
  const lidW = bS + width + bS;
  const lidH = bT + height + bB;
  const scrX = overhang + bS;
  const scrY = bT;
  const scrW = width;
  const scrH = height;

  const camCx = lidX + lidW / 2;
  const camCy = bT / 2;
  const camR = Math.max(2.5, Math.round(width * 0.003));

  const indW = Math.round(width * 0.060);
  const indH = Math.round(bB * 0.28);
  const indX = lidX + (lidW - indW) / 2;
  const indY = scrY + scrH + (bB - indH) / 2;

  const glare = {
    x1: lidX + 6, y1: bT * 0.3,
    cx: lidX + 60, cy: bT * 0.1,
    x2: lidX + Math.round(width * 0.14), y2: bT * 0.55,
  };

  const bodyX = 0;
  const bodyY = lidH;
  const bodyW = overhang + lidW + overhang;
  const svgW = bodyW;
  const svgH = lidH + bodyH + Math.round(height * 0.015);

  const lidPath = rrPath(lidX, lidY, lidW, lidH, rx, true)
    + " " + rrPath(scrX, scrY, scrW, scrH, 0, false);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={svgW} height={svgH}
      style={{ position: "absolute", top: svgTop, left: svgLeft, pointerEvents: "none", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="mbBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b2b2b6" />
          <stop offset="45%" stopColor="#9c9ca0" />
          <stop offset="100%" stopColor="#8a8a8e" />
        </linearGradient>
        <linearGradient id="mbHingeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#505054" />
          <stop offset="100%" stopColor="#3c3c40" />
        </linearGradient>
        <linearGradient id="mbEdgeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#686870" />
          <stop offset="100%" stopColor="#8a8a8e" />
        </linearGradient>
        <linearGradient id="mbLidGrad"
          gradientUnits="userSpaceOnUse"
          x1="0" y1={`${lidY}`} x2="0" y2={`${lidH}`}>
          <stop offset="0%" stopColor="#2c2c30" />
          <stop offset="100%" stopColor="#1c1c20" />
        </linearGradient>
      </defs>

      <g filter="url(#mbShadow)">
        <path d={lidPath} fillRule="evenodd" fill="url(#mbLidGrad)" />
        <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH}
          rx={bodyRx} ry={bodyRx} fill="url(#mbBodyGrad)" />
      </g>

      <path d={lidPath} fillRule="evenodd"
        fill="none" stroke="rgba(90,90,96,0.85)" strokeWidth="1" />
      <rect x={scrX - 1} y={scrY - 1} width={scrW + 2} height={scrH + 2}
        fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" />
      <path d={`M ${glare.x1} ${glare.y1} Q ${glare.cx} ${glare.cy} ${glare.x2} ${glare.y2}`}
        fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="5" strokeLinecap="round" />

      <circle cx={camCx} cy={camCy} r={camR} fill="rgba(55,55,62,0.92)" />
      <circle cx={camCx} cy={camCy} r={camR * 0.40} fill="rgba(90,90,110,0.45)" />

      <rect x={indX} y={indY} width={indW} height={indH}
        rx={indH / 2} ry={indH / 2}
        fill="rgba(0,0,0,0.32)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />

      <rect x={bodyX} y={bodyY} width={bodyW} height={hingeH} fill="url(#mbHingeGrad)" />
      <line x1={bodyX} y1={bodyY + hingeH} x2={bodyX + bodyW} y2={bodyY + hingeH}
        stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
      <rect x={bodyX + bodyRx} y={bodyY + bodyH - edgeH} width={bodyW - bodyRx * 2} height={edgeH}
        fill="url(#mbEdgeGrad)" />
    </svg>
  );
}

function DesktopFrame({ width, height }: { width: number; height: number }) {
  const bezelSide = width * 0.0239;
  const bezelTop = width * 0.0192;
  const chinH = width * 0.0671;
  const rxOuter = width * 0.0230;
  const rxScr = width * 0.0153;

  const neckTopW = width * 0.1916;
  const neckBotW = width * 0.2491;
  const neckH = width * 0.1820;
  const baseW = width * 0.5939;
  const baseH = width * 0.0421;
  const baseRx = baseH * 0.50;

  const svgLeft = -bezelSide;
  const svgTop = -bezelTop;
  const svgW = width + bezelSide * 2;
  const monH = bezelTop + height + chinH;
  const svgH = monH + neckH + baseH + width * 0.010;

  // Monitor: outer rounded rect (CW) + screen hole (CCW with display rx)
  const monPath =
    rrPath(0, 0, svgW, monH, rxOuter, true) +
    " " +
    rrPath(bezelSide, bezelTop, width, height, rxScr, false);

  const neckTopX = (svgW - neckTopW) / 2;
  const neckBotX = (svgW - neckBotW) / 2;
  const neckY = monH;
  const baseX = (svgW - baseW) / 2;
  const baseY = neckY + neckH;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={svgW} height={svgH}
      style={{
        position: "absolute", top: svgTop, left: svgLeft,
        pointerEvents: "none", overflow: "visible"
      }}>
      <defs>
        <linearGradient id="deskMon" gradientUnits="userSpaceOnUse"
          x1="0" y1="0" x2="0" y2={`${monH}`}>
          <stop offset="0%" stopColor="#242428" />
          <stop offset="100%" stopColor="#131316" />
        </linearGradient>
        <linearGradient id="deskNeck" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#141418" />
          <stop offset="50%" stopColor="#2e2e34" />
          <stop offset="100%" stopColor="#141418" />
        </linearGradient>
        <linearGradient id="deskBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0e0e12" />
          <stop offset="50%" stopColor="#282830" />
          <stop offset="100%" stopColor="#0e0e12" />
        </linearGradient>
      </defs>

      <g filter="url(#desktopShadow)">
        <path d={monPath} fillRule="evenodd" fill="url(#deskMon)" />
        <path d={[
          `M ${neckTopX} ${neckY}`,
          `L ${neckBotX} ${neckY + neckH}`,
          `L ${neckBotX + neckBotW} ${neckY + neckH}`,
          `L ${neckTopX + neckTopW} ${neckY}`,
          `Z`,
        ].join(" ")} fill="url(#deskNeck)" />
        <rect x={baseX} y={baseY} width={baseW} height={baseH}
          rx={baseRx} ry={baseRx} fill="url(#deskBase)" />
      </g>

      {/* Monitor outer edge */}
      <path d={`M ${rxOuter} 0 H ${svgW - rxOuter} Q ${svgW} 0 ${svgW} ${rxOuter}`}
        fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" strokeLinecap="round" />
      <path d={`M 0 ${rxOuter} V ${monH - rxOuter}`}
        fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
      <path d={`M ${svgW} ${rxOuter} V ${monH - rxOuter} Q ${svgW} ${monH} ${svgW - rxOuter} ${monH} H ${rxOuter} Q 0 ${monH} 0 ${monH - rxOuter}`}
        fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="0.8" strokeLinecap="round" />

      {/* Screen boundary — 1px border only */}
      <path d={rrPath(bezelSide, bezelTop, width, height, rxScr, true)}
        fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1" />

      {/* Chin separation line */}
      <line
        x1={bezelSide + rxScr} y1={bezelTop + height}
        x2={bezelSide + width - rxScr} y2={bezelTop + height}
        stroke="rgba(0,0,0,0.40)" strokeWidth="1" />

      {/* Neck edges */}
      <line x1={neckTopX} y1={neckY} x2={neckBotX} y2={neckY + neckH}
        stroke="rgba(0,0,0,0.40)" strokeWidth="1" />
      <line x1={neckTopX + neckTopW} y1={neckY} x2={neckBotX + neckBotW} y2={neckY + neckH}
        stroke="rgba(0,0,0,0.40)" strokeWidth="1" />
      {/* Neck centre highlight */}
      <line
        x1={(neckTopX + neckTopW * 0.4)} y1={neckY + 2}
        x2={(neckBotX + neckBotW * 0.4)} y2={neckY + neckH - 2}
        stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Base edges */}
      <rect x={baseX} y={baseY} width={baseW} height={baseH}
        rx={baseRx} ry={baseRx}
        fill="none" stroke="rgba(0,0,0,0.40)" strokeWidth="0.8" />
      <line x1={baseX + baseRx + 4} y1={baseY + 1} x2={baseX + baseW - baseRx - 4} y2={baseY + 1}
        stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    </svg>
  );
}

const FrameWrap = styled.div`
  /* Overlay: sits above iframe, anchors to IframeInnerContainer */
  position: absolute;
  inset: 0;
  display: grid;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 10;
  overflow: visible;
`;

interface FrameBoxProps {
  $width: number;
  $height: number;
  $transform: string;
}
const FrameBox = styled.div<FrameBoxProps>`
  width: ${(p) => p.$width}px;
  height: ${(p) => p.$height}px;
  transform: ${(p) => p.$transform};
  transform-origin: center;
  position: relative;
  flex-shrink: 0;
  overflow: visible;
`;

export interface DeviceFrameProps {
  viewport: string;
  width: number;
  height: number;
  transform: string;
  visible: boolean;
}

/** Overlay frame — rendered above the iframe via z-index:10 */
export function DeviceFrame({
  viewport, width, height, transform, visible,
}: DeviceFrameProps) {
  if (!visible || width === 0 || height === 0) return null;
  const family = getDeviceFamily(viewport);
  if (!family) return null;

  return (
    <FrameWrap>
      <FrameBox $width={width} $height={height} $transform={transform}>
        {family === "mobile-portrait" && <MobilePortraitFrame width={width} height={height} />}
        {family === "mobile-landscape" && <MobileLandscapeFrame width={width} height={height} />}
        {family === "tablet-portrait" && <TabletPortraitFrame width={width} height={height} />}
        {family === "tablet-landscape" && <TabletLandscapeFrame width={width} height={height} />}
        {family === "laptop" && <LaptopFrame width={width} height={height} />}
        {family === "desktop" && <DesktopFrame width={width} height={height} />}
      </FrameBox>
    </FrameWrap>
  );
}
