"use client";
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var easyblocksCore = require('@redsun-vn/easyblocks-core');
var React = require('react');
var isPropValid = require('@emotion/is-prop-valid');
var modals = require('@redsun-vn/easyblocks-design-system/modals');
var Toaster = require('@redsun-vn/easyblocks-design-system/Toaster');
var Tooltip$1 = require('@redsun-vn/easyblocks-design-system/Tooltip');
var styled = require('styled-components');
var _extends = require('@babel/runtime/helpers/extends');
var _internals = require('@redsun-vn/easyblocks-core/_internals');
var easyblocksDesignSystem = require('@redsun-vn/easyblocks-design-system');
var throttle = require('lodash.throttle');
var debounce = require('lodash/debounce');
var Modal = require('react-modal');
var lodash = require('lodash');
var buttons = require('@redsun-vn/easyblocks-design-system/buttons');
var icons = require('@redsun-vn/easyblocks-design-system/icons');
var Input = require('@redsun-vn/easyblocks-design-system/Input');
var Typography = require('@redsun-vn/easyblocks-design-system/Typography');
var ThumbnailButton = require('@redsun-vn/easyblocks-design-system/ThumbnailButton');
var ReactDOM = require('react-dom');
var tooltip = require('@react-aria/tooltip');
var reactPopper = require('react-popper');
var Loader = require('@redsun-vn/easyblocks-design-system/Loader');
var Select = require('@redsun-vn/easyblocks-design-system/Select');
var RadixRadioGroup = require('@radix-ui/react-radio-group');
var Toggle$1 = require('@redsun-vn/easyblocks-design-system/Toggle');
var ToggleButton = require('@redsun-vn/easyblocks-design-system/ToggleButton');
var Slider$1 = require('@redsun-vn/easyblocks-design-system/Slider');
var ReactIcons = require('@redsun-vn/easyblocks-design-system/radix-ui/ReactIcons');
var ReactSelect = require('@redsun-vn/easyblocks-design-system/radix-ui/ReactSelect');
var ToggleGroup = require('@redsun-vn/easyblocks-design-system/ToggleGroup');
var FormElement = require('@redsun-vn/easyblocks-design-system/FormElement');
var AccordionGroup = require('@redsun-vn/easyblocks-design-system/AccordionGroup');
var finalForm = require('final-form');
var arrayMutators = require('final-form-arrays');
var rows = require('@redsun-vn/easyblocks-design-system/rows');
var core = require('@dnd-kit/core');
var sortable = require('@dnd-kit/sortable');
var zod = require('zod');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var React__namespace = /*#__PURE__*/_interopNamespace(React);
var isPropValid__default = /*#__PURE__*/_interopDefaultLegacy(isPropValid);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var _extends__default = /*#__PURE__*/_interopDefaultLegacy(_extends);
var throttle__default = /*#__PURE__*/_interopDefaultLegacy(throttle);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);
var Modal__default = /*#__PURE__*/_interopDefaultLegacy(Modal);
var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
var RadixRadioGroup__namespace = /*#__PURE__*/_interopNamespace(RadixRadioGroup);
var arrayMutators__default = /*#__PURE__*/_interopDefaultLegacy(arrayMutators);

function deepClone(source) {
  return JSON.parse(JSON.stringify(source));
}

function deepCompare(...objectsToCompare) {
  for (let index = 0; index < objectsToCompare.length - 1; index++) {
    const currentObject = sortObject(objectsToCompare[index]);
    const nextObject = sortObject(objectsToCompare[index + 1]);
    const areObjectsHashesEqual = JSON.stringify(currentObject) === JSON.stringify(nextObject);
    if (!areObjectsHashesEqual) {
      return false;
    }
  }
  return true;
}
function sortObject(value) {
  if (typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return [...value].sort();
  }
  if (value === null) {
    return null;
  }
  const sortedObject = {};
  const objectKeys = Object.keys(value).sort();
  objectKeys.forEach(key => {
    sortedObject[key] = sortObject(value[key]);
  });
  return sortedObject;
}

function useForceRerender() {
  const [, setDummyState] = React.useState({});
  const forceRerender = React.useRef(() => {
    setDummyState({});
  }).current;
  return {
    forceRerender
  };
}

function checkLocalesCorrectness(locales) {
  if (locales.length === 0) {
    throw new Error("Locales array can't be empty");
  }
  const defaultLocales = locales.filter(l => l.isDefault);
  if (defaultLocales.length === 0) {
    throw new Error("One locale must be set as default, you didn't set any");
  }
  if (defaultLocales.length > 1) {
    throw new Error("Only one locale must be set as default, you set more than one");
  }
  const defaultLocale = defaultLocales[0];
  if (defaultLocale.fallback) {
    throw new Error("Default locale can't have fallback");
  }

  // Check for incorrect fallbacks
  locales.forEach(locale => {
    if (locale.fallback) {
      const fallback = locales.find(x => x.code === locale.fallback);
      if (!fallback) {
        throw new Error(`Locale ${locale} has a fallback ${locale.fallback} which doesn't exist in the locales list.`);
      }
    }
    // If there is no fallback, then we treat default locale as a fallback!
  });

  // Let's check for circulars
  locales.forEach(locale => {
    const localeChain = [];
    let currentLocale = locale;
    do {
      localeChain.push(currentLocale.code);
      const fallbackId = currentLocale.fallback ?? easyblocksCore.getDefaultLocale(locales).code;

      // If we got to the default locale then we're fine
      if (fallbackId === easyblocksCore.getDefaultLocale(locales).code) {
        break;
      }

      // If fallbackId does already exists in localeChain then it means we have circular!
      if (localeChain.includes(fallbackId)) {
        throw new Error(`There is circular reference in locales: ${[...localeChain, fallbackId].join(",")}`);
      }
      currentLocale = locales.find(x => x.code === fallbackId);
    } while (true);
  });
  return true;
}

/**
 * Traverses recursively the config tree (similar to traverseConfig) but behaves like "Array.map". It returns new tree with elements mapped to new ones.
 * Responsive values are mapped "per breakpoint", it smells a bit, maybe in the future we'll have to apply some flag to have option whether we want to disassemble responsives or not.
 */

function configMapArray(configArray, context, callback, prefix) {
  /**
   * Why this?
   *
   * Sometimes you might need configMap for config that have not yet been normalized. Such config still can be considered correct if it has a component that have a new schema property. Example of this is mergeSingleLocaleConfigsIntoConfig.
   */
  if (configArray === undefined) {
    return;
  }
  if (!Array.isArray(configArray)) {
    return;
  }
  return configArray.map((x, index) => configMapInternal(x, context, callback, `${prefix}.${index}`));
}
function configMap(config, context, callback) {
  return configMapInternal(config, context, callback, "");
}
function configMapInternal(config, context, callback, prefix) {
  const componentDefinition = _internals.findComponentDefinition(config, context);
  const result = {
    ...config
  };
  if (!componentDefinition) {
    return result;
  }
  prefix = prefix === undefined || prefix === "" ? "" : `${prefix}.`;
  componentDefinition.schema.forEach(schemaProp => {
    if (schemaProp.type === "component-collection-localised") {
      if (config[schemaProp.prop] === undefined) {
        return;
      }
      result[schemaProp.prop] = {};
      for (const locale in config[schemaProp.prop]) {
        if (locale === "__fallback") {
          continue;
        }
        result[schemaProp.prop][locale] = configMapArray(config[schemaProp.prop][locale], context, callback, `${prefix}${schemaProp.prop}.${locale}`);
      }
      result[schemaProp.prop] = callback({
        value: result[schemaProp.prop],
        path: `${prefix}${schemaProp.prop}`,
        schemaProp
      });
    } else if (schemaProp.type === "component" || schemaProp.type === "component-collection") {
      result[schemaProp.prop] = configMapArray(config[schemaProp.prop], context, callback, `${prefix}${schemaProp.prop}`);
      result[schemaProp.prop] = callback({
        value: result[schemaProp.prop],
        path: `${prefix}${schemaProp.prop}`,
        schemaProp
      });
    } else {
      if (easyblocksCore.isTrulyResponsiveValue(result[schemaProp.prop])) {
        const mappedVal = {
          $res: true
        };
        for (const key in result[schemaProp.prop]) {
          if (key === "$res") {
            continue;
          }
          mappedVal[key] = callback({
            value: result[schemaProp.prop][key],
            schemaProp,
            path: `${prefix}${schemaProp.prop}.${key}`
          });
        }
        result[schemaProp.prop] = mappedVal;
      } else {
        result[schemaProp.prop] = callback({
          value: result[schemaProp.prop],
          schemaProp,
          path: `${prefix}${schemaProp.prop}`
        });
      }
    }
  });
  return result;
}

function removeLocalizedFlag(config, context) {
  return configMap(config, context, ({
    value,
    schemaProp
  }) => {
    if (schemaProp.type === "text" && value?.id.startsWith("local.") || schemaProp.type === "component-collection-localised") {
      delete value.__localized;
    }
    return value;
  });
}

function dotNotationGet(obj, path) {
  if (path === "") {
    return obj;
  }
  return path.split(".").reduce((acc, curVal) => acc && acc[curVal], obj);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function uniqueId() {
  const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
      v = c == "x" ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
  return id;
}

const ConfigAfterAutoContext = /*#__PURE__*/React__default["default"].createContext(null);
function useConfigAfterAuto() {
  const configAfterAutoContext = React.useContext(ConfigAfterAutoContext);
  if (!configAfterAutoContext) {
    throw new Error("CompiledConfigContext is required for Responsive field");
  }
  return configAfterAutoContext;
}

const EditorContext = /*#__PURE__*/React__default["default"].createContext(null);
function useEditorContext() {
  const context = React.useContext(EditorContext);
  if (!context) {
    throw new Error("EditorContext not defined");
  }
  return context;
}

const ExternalDataContext = /*#__PURE__*/React.createContext({});
function EditorExternalDataProvider({
  children,
  externalData
}) {
  return /*#__PURE__*/React__default["default"].createElement(ExternalDataContext.Provider, {
    value: externalData
  }, children);
}
function useEditorExternalData() {
  return React.useContext(ExternalDataContext);
}

let ExtraKeys = /*#__PURE__*/function (ExtraKeys) {
  ExtraKeys["ALT_KEY"] = "altKey";
  ExtraKeys["CTRL_KEY"] = "ctrlKey";
  ExtraKeys["META_KEY"] = "metaKey";
  ExtraKeys["SHIFT_KEY"] = "shiftKey";
  return ExtraKeys;
}({});
const actionKeys = [ExtraKeys.ALT_KEY, ExtraKeys.CTRL_KEY, ExtraKeys.META_KEY, ExtraKeys.SHIFT_KEY];
const useWindowKeyDown = (key, callback, {
  extraKeys,
  isDisabled
} = {
  extraKeys: [],
  isDisabled: false
}) => {
  const downHandler = event => {
    const isExtraKeysPressed = extraKeys.every(k => event[k]);
    const extraKeysSet = new Set([...extraKeys]);
    const isOtherExtraKeysPressed = actionKeys.filter(k => !extraKeysSet.has(k)).some(k => event[k]);
    if (event.key === key && isExtraKeysPressed && !isOtherExtraKeysPressed) {
      event.preventDefault();
      callback();
    }
  };
  React.useEffect(() => {
    if (!isDisabled) {
      document.getElementsByTagName("iframe")[0].contentWindow.window.document.body.addEventListener("keydown", downHandler);
      window.addEventListener("keydown", downHandler);
      return () => {
        window.removeEventListener("keydown", downHandler);
      };
    }
  }, [isDisabled]);
};

// ---------------------------------------------------------------------------
// xs  → mobile-portrait   (phone portrait)
// sm  → mobile-landscape  (phone landscape)
// md  → tablet-portrait   (tablet portrait)
// lg  → tablet-landscape  (tablet landscape)
// xl  → laptop            (laptop/macbook)
// 2xl → desktop           (desktop monitor)
// ---------------------------------------------------------------------------

function getDeviceFamily(viewport) {
  if (viewport === "fit-screen") return null;
  if (viewport === "xs") return "mobile-portrait";
  if (viewport === "sm") return "mobile-landscape";
  if (viewport === "md") return "tablet-portrait";
  if (viewport === "lg") return "tablet-landscape";
  if (viewport === "xl") return "laptop";
  if (viewport === "2xl") return "desktop";
  return null;
}
const DEVICE_LABELS = {
  xs: "Mobile",
  sm: "Mobile",
  md: "Tablet",
  lg: "Tablet",
  xl: "Laptop",
  "2xl": "Desktop",
  "fit-screen": "Fit Screen"
};

// Shared helper — builds a rounded-rect SVG path
function rrPath(x, y, w, h, r, cw = true) {
  if (r <= 0) {
    // Degenerate: plain rect
    return cw ? `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z` : `M ${x} ${y} V ${y + h} H ${x + w} V ${y} Z`;
  }
  if (cw) {
    return [`M ${x + r} ${y}`, `H ${x + w - r}`, `Q ${x + w} ${y}   ${x + w} ${y + r}`, `V ${y + h - r}`, `Q ${x + w} ${y + h} ${x + w - r} ${y + h}`, `H ${x + r}`, `Q ${x}   ${y + h} ${x}     ${y + h - r}`, `V ${y + r}`, `Q ${x}   ${y}   ${x + r}   ${y}`, `Z`].join(" ");
  } else {
    // CCW — for evenodd screen hole; include display corner radius
    return [`M ${x + r} ${y}`, `V ${y}`,
    // noop, start here
    `Q ${x} ${y}   ${x}     ${y + r}`, `V ${y + h - r}`, `Q ${x}   ${y + h} ${x + r}   ${y + h}`, `H ${x + w - r}`, `Q ${x + w} ${y + h} ${x + w}   ${y + h - r}`, `V ${y + r}`, `Q ${x + w} ${y}   ${x + w - r} ${y}`, `Z`].join(" ");
  }
}

// Frame gradient IDs are made unique per-frame via a prefix prop
function FrameGrads({
  id
}) {
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("linearGradient", {
    id: `${id}Fill`,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "0%",
    stopColor: "#2e2e32"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "40%",
    stopColor: "#1e1e22"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "100%",
    stopColor: "#111114"
  })), /*#__PURE__*/React__default["default"].createElement("linearGradient", {
    id: `${id}TopEdge`,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "0%",
    stopColor: "rgba(255,255,255,0.14)"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "50%",
    stopColor: "rgba(255,255,255,0.09)"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "100%",
    stopColor: "rgba(255,255,255,0.04)"
  })));
}
function MobilePortraitFrame({
  width,
  height
}) {
  const bezel = width * 0.0422;
  const rxOuter = width * 0.170;
  const rxScr = width * 0.112;
  const svgLeft = -bezel;
  const svgTop = -bezel;
  const svgW = width + bezel * 2;
  const svgH = height + bezel * 2;
  const shellPath = rrPath(0, 0, svgW, svgH, rxOuter, true) + " " + rrPath(bezel, bezel, width, height, rxScr, false);

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
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: svgW,
    height: svgH,
    style: {
      position: "absolute",
      top: svgTop,
      left: svgLeft,
      pointerEvents: "none",
      overflow: "visible"
    }
  }, /*#__PURE__*/React__default["default"].createElement("defs", null, /*#__PURE__*/React__default["default"].createElement(FrameGrads, {
    id: "mobP"
  })), /*#__PURE__*/React__default["default"].createElement("g", {
    filter: "url(#frameShadow)"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: shellPath,
    fillRule: "evenodd",
    fill: "url(#mobPFill)"
  })), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M ${rxOuter} 0 H ${svgW - rxOuter} Q ${svgW} 0 ${svgW} ${rxOuter}`,
    fill: "none",
    stroke: "rgba(255,255,255,0.16)",
    strokeWidth: "0.8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M 0 ${rxOuter} V ${svgH - rxOuter}`,
    fill: "none",
    stroke: "rgba(255,255,255,0.08)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M ${svgW} ${rxOuter} V ${svgH - rxOuter} Q ${svgW} ${svgH} ${svgW - rxOuter} ${svgH} H ${rxOuter} Q 0 ${svgH} 0 ${svgH - rxOuter}`,
    fill: "none",
    stroke: "rgba(0,0,0,0.35)",
    strokeWidth: "0.8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: rrPath(bezel, bezel, width, height, rxScr, true),
    fill: "none",
    stroke: "rgba(0,0,0,0.55)",
    strokeWidth: "1"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: 0,
    y: actY,
    width: btnDepth,
    height: actH,
    rx: btnRx,
    ry: btnRx,
    fill: "url(#mobPFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: 0,
    y: vuY,
    width: btnDepth,
    height: vuH,
    rx: btnRx,
    ry: btnRx,
    fill: "url(#mobPFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: 0,
    y: vdY,
    width: btnDepth,
    height: vdH,
    rx: btnRx,
    ry: btnRx,
    fill: "url(#mobPFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: svgW - btnDepth,
    y: pwrY,
    width: btnDepth,
    height: pwrH,
    rx: btnRx,
    ry: btnRx,
    fill: "url(#mobPFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: diX,
    y: diY,
    width: diW,
    height: diH,
    rx: diRx,
    ry: diRx,
    fill: "#000000"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: diX,
    y: diY,
    width: diW,
    height: diH,
    rx: diRx,
    ry: diRx,
    fill: "none",
    stroke: "rgba(255,255,255,0.06)",
    strokeWidth: "0.6"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx,
    cy: camCy,
    r: camR,
    fill: "#0a0a0c"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx,
    cy: camCy,
    r: camR * 0.55,
    fill: "#1c2230"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx - camR * 0.25,
    cy: camCy - camR * 0.25,
    r: camR * 0.18,
    fill: "rgba(255,255,255,0.35)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: homeX,
    y: homeY,
    width: homeW,
    height: homeH,
    rx: homeH / 2,
    ry: homeH / 2,
    fill: "rgba(0,0,0,0.55)"
  }));
}
function MobileLandscapeFrame({
  width,
  height
}) {
  const bezel = height * 0.0422;
  const rxOuter = height * 0.170;
  const rxScr = height * 0.112;
  const svgLeft = -bezel;
  const svgTop = -bezel;
  const svgW = width + bezel * 2;
  const svgH = height + bezel * 2;
  const shellPath = rrPath(0, 0, svgW, svgH, rxOuter, true) + " " + rrPath(bezel, bezel, width, height, rxScr, false);
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
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: svgW,
    height: svgH,
    style: {
      position: "absolute",
      top: svgTop,
      left: svgLeft,
      pointerEvents: "none",
      overflow: "visible"
    }
  }, /*#__PURE__*/React__default["default"].createElement("defs", null, /*#__PURE__*/React__default["default"].createElement(FrameGrads, {
    id: "mobL"
  })), /*#__PURE__*/React__default["default"].createElement("g", {
    filter: "url(#frameShadow)"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: shellPath,
    fillRule: "evenodd",
    fill: "url(#mobLFill)"
  })), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M ${rxOuter} 0 H ${svgW - rxOuter} Q ${svgW} 0 ${svgW} ${rxOuter}`,
    fill: "none",
    stroke: "rgba(255,255,255,0.16)",
    strokeWidth: "0.8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M 0 ${rxOuter} V ${svgH - rxOuter}`,
    fill: "none",
    stroke: "rgba(255,255,255,0.08)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M ${svgW} ${rxOuter} V ${svgH - rxOuter} Q ${svgW} ${svgH} ${svgW - rxOuter} ${svgH} H ${rxOuter} Q 0 ${svgH} 0 ${svgH - rxOuter}`,
    fill: "none",
    stroke: "rgba(0,0,0,0.35)",
    strokeWidth: "0.8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: rrPath(bezel, bezel, width, height, rxScr, true),
    fill: "none",
    stroke: "rgba(0,0,0,0.55)",
    strokeWidth: "1"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: pwrX,
    y: 0,
    width: pwrW,
    height: btnDepth,
    rx: btnRx,
    ry: btnRx,
    fill: "url(#mobLFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: actX,
    y: svgH - btnDepth,
    width: actW,
    height: btnDepth,
    rx: btnRx,
    ry: btnRx,
    fill: "url(#mobLFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: vuX,
    y: svgH - btnDepth,
    width: vuW,
    height: btnDepth,
    rx: btnRx,
    ry: btnRx,
    fill: "url(#mobLFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: vdX,
    y: svgH - btnDepth,
    width: vdW,
    height: btnDepth,
    rx: btnRx,
    ry: btnRx,
    fill: "url(#mobLFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: diX,
    y: diY,
    width: diW,
    height: diH,
    rx: diRx,
    ry: diRx,
    fill: "#000000"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: diX,
    y: diY,
    width: diW,
    height: diH,
    rx: diRx,
    ry: diRx,
    fill: "none",
    stroke: "rgba(255,255,255,0.06)",
    strokeWidth: "0.6"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx,
    cy: camCy,
    r: camR,
    fill: "#0a0a0c"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx,
    cy: camCy,
    r: camR * 0.55,
    fill: "#1c2230"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx - camR * 0.25,
    cy: camCy - camR * 0.25,
    r: camR * 0.18,
    fill: "rgba(255,255,255,0.35)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: homeX,
    y: homeY,
    width: homeW,
    height: homeH,
    rx: homeW / 2,
    ry: homeW / 2,
    fill: "rgba(0,0,0,0.55)"
  }));
}
function TabletPortraitFrame({
  width,
  height
}) {
  const bezel = width * 0.0426;
  const rxOuter = width * 0.0907;
  const rxScr = Math.max(0, rxOuter - bezel);
  const svgLeft = -bezel;
  const svgTop = -bezel;
  const svgW = width + bezel * 2;
  const svgH = height + bezel * 2;
  const shellPath = rrPath(0, 0, svgW, svgH, rxOuter, true) + " " + rrPath(bezel, bezel, width, height, rxScr, false);

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
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: svgW,
    height: svgH,
    style: {
      position: "absolute",
      top: svgTop,
      left: svgLeft,
      pointerEvents: "none",
      overflow: "visible"
    }
  }, /*#__PURE__*/React__default["default"].createElement("defs", null, /*#__PURE__*/React__default["default"].createElement(FrameGrads, {
    id: "tabP"
  })), /*#__PURE__*/React__default["default"].createElement("g", {
    filter: "url(#frameShadow)"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: shellPath,
    fillRule: "evenodd",
    fill: "url(#tabPFill)"
  })), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M ${rxOuter} 0 H ${svgW - rxOuter} Q ${svgW} 0 ${svgW} ${rxOuter}`,
    fill: "none",
    stroke: "rgba(255,255,255,0.16)",
    strokeWidth: "0.8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M 0 ${rxOuter} V ${svgH - rxOuter}`,
    fill: "none",
    stroke: "rgba(255,255,255,0.08)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M ${svgW} ${rxOuter} V ${svgH - rxOuter} Q ${svgW} ${svgH} ${svgW - rxOuter} ${svgH} H ${rxOuter} Q 0 ${svgH} 0 ${svgH - rxOuter}`,
    fill: "none",
    stroke: "rgba(0,0,0,0.35)",
    strokeWidth: "0.8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: rrPath(bezel, bezel, width, height, rxScr, true),
    fill: "none",
    stroke: "rgba(0,0,0,0.55)",
    strokeWidth: "1"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: pwrX,
    y: 0,
    width: pwrW,
    height: pwrH,
    rx: pwrH * 0.30,
    ry: pwrH * 0.30,
    fill: "url(#tabPFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: svgW - volBW,
    y: vol1Y,
    width: volBW,
    height: volH,
    rx: volBW * 0.28,
    ry: volBW * 0.28,
    fill: "url(#tabPFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: svgW - volBW,
    y: vol2Y,
    width: volBW,
    height: volH,
    rx: volBW * 0.28,
    ry: volBW * 0.28,
    fill: "url(#tabPFill)"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx,
    cy: camCy,
    r: camR,
    fill: "#0a0a0c"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx,
    cy: camCy,
    r: camR * 0.55,
    fill: "#1c2230"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx - camR * 0.25,
    cy: camCy - camR * 0.25,
    r: camR * 0.18,
    fill: "rgba(255,255,255,0.30)"
  }));
}
function TabletLandscapeFrame({
  width,
  height
}) {
  const bezelH = height * 0.0426;
  const bezelW = width * 0.0319;
  const rxOuter = height * 0.0907;
  // Concentric with the outer radius (see TabletPortraitFrame for rationale)
  const rxScr = Math.max(0, rxOuter - bezelH);
  const svgLeft = -bezelW;
  const svgTop = -bezelH;
  const svgW = width + bezelW * 2;
  const svgH = height + bezelH * 2;
  const shellPath = rrPath(0, 0, svgW, svgH, rxOuter, true) + " " + rrPath(bezelW, bezelH, width, height, rxScr, false);

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
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: svgW,
    height: svgH,
    style: {
      position: "absolute",
      top: svgTop,
      left: svgLeft,
      pointerEvents: "none",
      overflow: "visible"
    }
  }, /*#__PURE__*/React__default["default"].createElement("defs", null, /*#__PURE__*/React__default["default"].createElement(FrameGrads, {
    id: "tabL"
  })), /*#__PURE__*/React__default["default"].createElement("g", {
    filter: "url(#frameShadow)"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: shellPath,
    fillRule: "evenodd",
    fill: "url(#tabLFill)"
  })), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M ${rxOuter} 0 H ${svgW - rxOuter} Q ${svgW} 0 ${svgW} ${rxOuter}`,
    fill: "none",
    stroke: "rgba(255,255,255,0.16)",
    strokeWidth: "0.8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M 0 ${rxOuter} V ${svgH - rxOuter}`,
    fill: "none",
    stroke: "rgba(255,255,255,0.08)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M ${svgW} ${rxOuter} V ${svgH - rxOuter} Q ${svgW} ${svgH} ${svgW - rxOuter} ${svgH} H ${rxOuter} Q 0 ${svgH} 0 ${svgH - rxOuter}`,
    fill: "none",
    stroke: "rgba(0,0,0,0.35)",
    strokeWidth: "0.8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: rrPath(bezelW, bezelH, width, height, rxScr, true),
    fill: "none",
    stroke: "rgba(0,0,0,0.55)",
    strokeWidth: "1"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: svgW - pwrW,
    y: pwrY,
    width: pwrW,
    height: pwrH,
    rx: pwrW * 0.30,
    ry: pwrW * 0.30,
    fill: "url(#tabLFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: vol1X,
    y: 0,
    width: volW,
    height: volBH,
    rx: volBH * 0.28,
    ry: volBH * 0.28,
    fill: "url(#tabLFill)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: vol2X,
    y: 0,
    width: volW,
    height: volBH,
    rx: volBH * 0.28,
    ry: volBH * 0.28,
    fill: "url(#tabLFill)"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx,
    cy: camCy,
    r: camR,
    fill: "#0a0a0c"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx,
    cy: camCy,
    r: camR * 0.55,
    fill: "#1c2230"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx - camR * 0.25,
    cy: camCy - camR * 0.25,
    r: camR * 0.18,
    fill: "rgba(255,255,255,0.30)"
  }));
}
function LaptopFrame({
  width,
  height
}) {
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
    x1: lidX + 6,
    y1: bT * 0.3,
    cx: lidX + 60,
    cy: bT * 0.1,
    x2: lidX + Math.round(width * 0.14),
    y2: bT * 0.55
  };
  const bodyX = 0;
  const bodyY = lidH;
  const bodyW = overhang + lidW + overhang;
  const svgW = bodyW;
  const svgH = lidH + bodyH + Math.round(height * 0.015);
  const lidPath = rrPath(lidX, lidY, lidW, lidH, rx, true) + " " + rrPath(scrX, scrY, scrW, scrH, 0, false);
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: svgW,
    height: svgH,
    style: {
      position: "absolute",
      top: svgTop,
      left: svgLeft,
      pointerEvents: "none",
      overflow: "visible"
    }
  }, /*#__PURE__*/React__default["default"].createElement("defs", null, /*#__PURE__*/React__default["default"].createElement("linearGradient", {
    id: "mbBodyGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "0%",
    stopColor: "#b2b2b6"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "45%",
    stopColor: "#9c9ca0"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "100%",
    stopColor: "#8a8a8e"
  })), /*#__PURE__*/React__default["default"].createElement("linearGradient", {
    id: "mbHingeGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "0%",
    stopColor: "#505054"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "100%",
    stopColor: "#3c3c40"
  })), /*#__PURE__*/React__default["default"].createElement("linearGradient", {
    id: "mbEdgeGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "0%",
    stopColor: "#686870"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "100%",
    stopColor: "#8a8a8e"
  })), /*#__PURE__*/React__default["default"].createElement("linearGradient", {
    id: "mbLidGrad",
    gradientUnits: "userSpaceOnUse",
    x1: "0",
    y1: `${lidY}`,
    x2: "0",
    y2: `${lidH}`
  }, /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "0%",
    stopColor: "#2c2c30"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "100%",
    stopColor: "#1c1c20"
  }))), /*#__PURE__*/React__default["default"].createElement("g", {
    filter: "url(#mbShadow)"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: lidPath,
    fillRule: "evenodd",
    fill: "url(#mbLidGrad)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: bodyX,
    y: bodyY,
    width: bodyW,
    height: bodyH,
    rx: bodyRx,
    ry: bodyRx,
    fill: "url(#mbBodyGrad)"
  })), /*#__PURE__*/React__default["default"].createElement("path", {
    d: lidPath,
    fillRule: "evenodd",
    fill: "none",
    stroke: "rgba(90,90,96,0.85)",
    strokeWidth: "1"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: scrX - 1,
    y: scrY - 1,
    width: scrW + 2,
    height: scrH + 2,
    fill: "none",
    stroke: "rgba(0,0,0,0.5)",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M ${glare.x1} ${glare.y1} Q ${glare.cx} ${glare.cy} ${glare.x2} ${glare.y2}`,
    fill: "none",
    stroke: "rgba(255,255,255,0.09)",
    strokeWidth: "5",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx,
    cy: camCy,
    r: camR,
    fill: "rgba(55,55,62,0.92)"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: camCx,
    cy: camCy,
    r: camR * 0.40,
    fill: "rgba(90,90,110,0.45)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: indX,
    y: indY,
    width: indW,
    height: indH,
    rx: indH / 2,
    ry: indH / 2,
    fill: "rgba(0,0,0,0.32)",
    stroke: "rgba(255,255,255,0.05)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: bodyX,
    y: bodyY,
    width: bodyW,
    height: hingeH,
    fill: "url(#mbHingeGrad)"
  }), /*#__PURE__*/React__default["default"].createElement("line", {
    x1: bodyX,
    y1: bodyY + hingeH,
    x2: bodyX + bodyW,
    y2: bodyY + hingeH,
    stroke: "rgba(255,255,255,0.16)",
    strokeWidth: "1"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: bodyX + bodyRx,
    y: bodyY + bodyH - edgeH,
    width: bodyW - bodyRx * 2,
    height: edgeH,
    fill: "url(#mbEdgeGrad)"
  }));
}
function DesktopFrame({
  width,
  height
}) {
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
  const monPath = rrPath(0, 0, svgW, monH, rxOuter, true) + " " + rrPath(bezelSide, bezelTop, width, height, rxScr, false);
  const neckTopX = (svgW - neckTopW) / 2;
  const neckBotX = (svgW - neckBotW) / 2;
  const neckY = monH;
  const baseX = (svgW - baseW) / 2;
  const baseY = neckY + neckH;
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: svgW,
    height: svgH,
    style: {
      position: "absolute",
      top: svgTop,
      left: svgLeft,
      pointerEvents: "none",
      overflow: "visible"
    }
  }, /*#__PURE__*/React__default["default"].createElement("defs", null, /*#__PURE__*/React__default["default"].createElement("linearGradient", {
    id: "deskMon",
    gradientUnits: "userSpaceOnUse",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: `${monH}`
  }, /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "0%",
    stopColor: "#242428"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "100%",
    stopColor: "#131316"
  })), /*#__PURE__*/React__default["default"].createElement("linearGradient", {
    id: "deskNeck",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "0%",
    stopColor: "#141418"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "50%",
    stopColor: "#2e2e34"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "100%",
    stopColor: "#141418"
  })), /*#__PURE__*/React__default["default"].createElement("linearGradient", {
    id: "deskBase",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "0%",
    stopColor: "#0e0e12"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "50%",
    stopColor: "#282830"
  }), /*#__PURE__*/React__default["default"].createElement("stop", {
    offset: "100%",
    stopColor: "#0e0e12"
  }))), /*#__PURE__*/React__default["default"].createElement("g", {
    filter: "url(#desktopShadow)"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: monPath,
    fillRule: "evenodd",
    fill: "url(#deskMon)"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: [`M ${neckTopX} ${neckY}`, `L ${neckBotX} ${neckY + neckH}`, `L ${neckBotX + neckBotW} ${neckY + neckH}`, `L ${neckTopX + neckTopW} ${neckY}`, `Z`].join(" "),
    fill: "url(#deskNeck)"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: baseX,
    y: baseY,
    width: baseW,
    height: baseH,
    rx: baseRx,
    ry: baseRx,
    fill: "url(#deskBase)"
  })), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M ${rxOuter} 0 H ${svgW - rxOuter} Q ${svgW} 0 ${svgW} ${rxOuter}`,
    fill: "none",
    stroke: "rgba(255,255,255,0.10)",
    strokeWidth: "0.8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M 0 ${rxOuter} V ${monH - rxOuter}`,
    fill: "none",
    stroke: "rgba(255,255,255,0.05)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: `M ${svgW} ${rxOuter} V ${monH - rxOuter} Q ${svgW} ${monH} ${svgW - rxOuter} ${monH} H ${rxOuter} Q 0 ${monH} 0 ${monH - rxOuter}`,
    fill: "none",
    stroke: "rgba(0,0,0,0.45)",
    strokeWidth: "0.8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: rrPath(bezelSide, bezelTop, width, height, rxScr, true),
    fill: "none",
    stroke: "rgba(0,0,0,0.55)",
    strokeWidth: "1"
  }), /*#__PURE__*/React__default["default"].createElement("line", {
    x1: bezelSide + rxScr,
    y1: bezelTop + height,
    x2: bezelSide + width - rxScr,
    y2: bezelTop + height,
    stroke: "rgba(0,0,0,0.40)",
    strokeWidth: "1"
  }), /*#__PURE__*/React__default["default"].createElement("line", {
    x1: neckTopX,
    y1: neckY,
    x2: neckBotX,
    y2: neckY + neckH,
    stroke: "rgba(0,0,0,0.40)",
    strokeWidth: "1"
  }), /*#__PURE__*/React__default["default"].createElement("line", {
    x1: neckTopX + neckTopW,
    y1: neckY,
    x2: neckBotX + neckBotW,
    y2: neckY + neckH,
    stroke: "rgba(0,0,0,0.40)",
    strokeWidth: "1"
  }), /*#__PURE__*/React__default["default"].createElement("line", {
    x1: neckTopX + neckTopW * 0.4,
    y1: neckY + 2,
    x2: neckBotX + neckBotW * 0.4,
    y2: neckY + neckH - 2,
    stroke: "rgba(255,255,255,0.06)",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }), /*#__PURE__*/React__default["default"].createElement("rect", {
    x: baseX,
    y: baseY,
    width: baseW,
    height: baseH,
    rx: baseRx,
    ry: baseRx,
    fill: "none",
    stroke: "rgba(0,0,0,0.40)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React__default["default"].createElement("line", {
    x1: baseX + baseRx + 4,
    y1: baseY + 1,
    x2: baseX + baseW - baseRx - 4,
    y2: baseY + 1,
    stroke: "rgba(255,255,255,0.08)",
    strokeWidth: "1"
  }));
}
const FrameWrap = styled.styled.div.withConfig({
  displayName: "DeviceFrame__FrameWrap",
  componentId: "sc-tojvsf-0"
})(["position:absolute;inset:0;display:grid;justify-content:center;align-items:center;pointer-events:none;z-index:10;overflow:visible;"]);
const FrameBox = styled.styled.div.withConfig({
  displayName: "DeviceFrame__FrameBox",
  componentId: "sc-tojvsf-1"
})(["width:", "px;height:", "px;transform:", ";transform-origin:center;position:relative;flex-shrink:0;overflow:visible;"], p => p.$width, p => p.$height, p => p.$transform);
/** Overlay frame — rendered above the iframe via z-index:10 */
function DeviceFrame({
  viewport,
  width,
  height,
  transform,
  visible
}) {
  if (!visible || width === 0 || height === 0) return null;
  const family = getDeviceFamily(viewport);
  if (!family) return null;
  return /*#__PURE__*/React__default["default"].createElement(FrameWrap, null, /*#__PURE__*/React__default["default"].createElement(FrameBox, {
    $width: width,
    $height: height,
    $transform: transform
  }, family === "mobile-portrait" && /*#__PURE__*/React__default["default"].createElement(MobilePortraitFrame, {
    width: width,
    height: height
  }), family === "mobile-landscape" && /*#__PURE__*/React__default["default"].createElement(MobileLandscapeFrame, {
    width: width,
    height: height
  }), family === "tablet-portrait" && /*#__PURE__*/React__default["default"].createElement(TabletPortraitFrame, {
    width: width,
    height: height
  }), family === "tablet-landscape" && /*#__PURE__*/React__default["default"].createElement(TabletLandscapeFrame, {
    width: width,
    height: height
  }), family === "laptop" && /*#__PURE__*/React__default["default"].createElement(LaptopFrame, {
    width: width,
    height: height
  }), family === "desktop" && /*#__PURE__*/React__default["default"].createElement(DesktopFrame, {
    width: width,
    height: height
  })));
}

function EditorIframe({
  onEditorHistoryRedo,
  onEditorHistoryUndo,
  onSave,
  isSaving,
  width,
  height,
  transform,
  containerRef,
  showDeviceFrame = false,
  viewport = "fit-screen"
}) {
  const [isIframeReady, setIframeReady] = React.useState(false);
  const debouncedSave = lodash.debounce(fn => fn(), 200);
  const handleIframeLoaded = () => {
    setIframeReady(true);
  };
  const onKeyDownSave = () => {
    if (onSave && !isSaving) {
      debouncedSave(onSave);
    }
  };
  useWindowKeyDown("z", onEditorHistoryUndo, {
    extraKeys: [ExtraKeys.META_KEY],
    isDisabled: !isIframeReady
  });
  useWindowKeyDown("z", onEditorHistoryRedo, {
    extraKeys: [ExtraKeys.META_KEY, ExtraKeys.SHIFT_KEY],
    isDisabled: !isIframeReady
  });
  useWindowKeyDown("z", onEditorHistoryUndo, {
    extraKeys: [ExtraKeys.CTRL_KEY],
    isDisabled: !isIframeReady
  });
  useWindowKeyDown("y", onEditorHistoryRedo, {
    extraKeys: [ExtraKeys.CTRL_KEY],
    isDisabled: !isIframeReady
  });
  useWindowKeyDown("s", onKeyDownSave, {
    extraKeys: [ExtraKeys.CTRL_KEY],
    isDisabled: !isIframeReady
  });
  useWindowKeyDown("s", onKeyDownSave, {
    extraKeys: [ExtraKeys.META_KEY],
    isDisabled: !isIframeReady
  });
  return /*#__PURE__*/React__default["default"].createElement(IframeContainer, {
    ref: containerRef
  }, /*#__PURE__*/React__default["default"].createElement(IframeInnerContainer, null, /*#__PURE__*/React__default["default"].createElement(Iframe, {
    id: "editor-canvas",
    src: window.location.href,
    onLoad: handleIframeLoaded,
    style: {
      // These properties will change a lot during resizing, so we don't pass it to styled component to prevent
      // class name recalculations
      width,
      height,
      transform
    }
  }), /*#__PURE__*/React__default["default"].createElement(DeviceFrame, {
    viewport: viewport,
    width: width,
    height: height,
    transform: transform,
    visible: showDeviceFrame
  })));
}
const IframeContainer = styled.styled.div.withConfig({
  displayName: "EditorIframe__IframeContainer",
  componentId: "sc-1k2h6r-0"
})(["position:relative;flex:1 1 auto;background:", ";isolation:isolate;"], easyblocksDesignSystem.Colors.black100);
const IframeInnerContainer = styled.styled.div.withConfig({
  displayName: "EditorIframe__IframeInnerContainer",
  componentId: "sc-1k2h6r-1"
})(["position:absolute;top:0;left:0;width:100%;height:100%;display:grid;justify-content:center;align-items:center;"]);
const Iframe = styled.styled.iframe.withConfig({
  displayName: "EditorIframe__Iframe",
  componentId: "sc-1k2h6r-2"
})(["background:white;border:none;transform-origin:center;"]);

function pathToCompiledPath(path, editorContext) {
  const pathInfo = _internals.parsePath(path, editorContext.form);
  if (pathInfo.parent) {
    const definition = _internals.findComponentDefinitionById(pathInfo.parent.templateId, editorContext);
    const schemaProp = definition.schema.find(schemaProp => schemaProp.prop === pathInfo.parent.fieldName);
    const result = `${pathToCompiledPath(pathInfo.parent.path, editorContext)}.${getPropertyNameFromSchemaProp(schemaProp)}.${pathInfo.parent.fieldName}.${pathInfo.index}`;
    if (result.startsWith(".")) {
      return result.substring(1);
    }
    return result;
  }
  return "";
}
function getPropertyNameFromSchemaProp(schemaProp) {
  if (_internals.isSchemaPropTextModifier(schemaProp) || _internals.isSchemaPropActionTextModifier(schemaProp)) {
    return "textModifiers";
  }
  return "components";
}

function isFieldPortal(x) {
  return "portal" in x;
}
function buildTinaFields(path, editorContext) {
  return internalBuildTinaFields(path, editorContext);
}
function internalBuildTinaFields(path, editorContext, fieldsFilter) {
  const compiledPath = pathToCompiledPath(_internals.stripRichTextPartSelection(path), editorContext);
  const compiledComponent = dotNotationGet(editorContext.compiledComponentConfig, compiledPath);
  let allFields = [];
  (compiledComponent?.__editing?.fields ?? []).filter(field => fieldsFilter ? fieldsFilter(field) : true).forEach(item => {
    if (isFieldPortal(item)) {
      let fields = [];
      if (item.portal === "component") {
        const portalComponentFields = internalBuildTinaFields(item.source, editorContext);
        fields.push(...portalComponentFields);
        if (!item.includeHeader) {
          fields = fields.filter(x => x.prop !== "$myself");
        }
        const groups = item.groups;
        if (groups) {
          fields = fields.filter(x => x.prop === "$myself" || groups.includes(x.group || "___doesn't matter___"));
        }
      } else if (item.portal === "field") {
        if (item.hidden) {
          return;
        }
        const portalFieldFields = internalBuildTinaFields(item.source, editorContext, field => !isFieldPortal(field) && field.prop === item.fieldName);
        if (portalFieldFields.length === 0) {
          console.warn(`Missing field "${item.fieldName}" at path "${item.source}" in portal for component ${compiledComponent._component}`);
          return;
        }
        const portalField = {
          ...portalFieldFields[0],
          ...item.overrides
        };
        fields.push(portalField);
      } else if (item.portal === "multi-field") {
        if (item.sources.length === 0) {
          if (item.hidden) {
            return;
          }
          throw new Error(`Missing sources for multi field portal of component "${compiledComponent._component}" at path "${path}". Set "hidden" to "true" for this portal if sources are empty`);
        }
        const portalFieldFields = item.sources.flatMap(source => internalBuildTinaFields(source, editorContext, field => !isFieldPortal(field) && field.prop === item.fieldName));
        const firstField = portalFieldFields[0];
        const combinedField = {
          ...firstField,
          ...item.overrides,
          name: portalFieldFields.flatMap(field => field.name)
        };
        fields.push(combinedField);
      }
      allFields = [...allFields, ...fields];
    } else {
      allFields.push(item);
    }
  });

  // Analytics fields should always go to the bottom (later they'll be in separate tab)

  const nonAnalyticsFields = allFields.filter(x => x.group !== "Analytics");
  const analyticsFields = allFields.filter(x => x.group === "Analytics");
  return [...nonAnalyticsFields, ...analyticsFields];
}

const fallbackTranslation = "en-US";
const getTranslation = editorContext => {
  const {
    translationFiles = {},
    contextParams
  } = editorContext;
  const {
    locale
  } = contextParams;
  const t = key => {
    const files = translationFiles[locale] ? translationFiles[locale] : translationFiles[fallbackTranslation];
    return files?.[key] ?? key;
  };
  return {
    t
  };
};
const useTranslation = () => {
  const {
    translationFiles = {},
    contextParams
  } = useEditorContext();
  const {
    locale
  } = contextParams;
  const t = key => {
    const files = translationFiles[locale] ? translationFiles[locale] : translationFiles[fallbackTranslation];
    return files?.[key] ?? key;
  };
  return {
    t
  };
};

function SaveAsPicker({
  mode,
  Component,
  saveAsEntry,
  setSaveAsEntry
}) {
  const toaster = Toaster.useToaster();
  const {
    t
  } = useTranslation();
  return /*#__PURE__*/React__default["default"].createElement(Component, {
    isOpen: !!saveAsEntry,
    saveAsEntry: saveAsEntry,
    onClose: () => setSaveAsEntry(null),
    onSuccess: () => toaster.success(t("template.entry.saveAs.success")),
    onError: () => toaster.error(t("template.entry.saveAs.error")),
    editorMode: mode
  });
}

async function copyToClipboard(textToCopy) {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(textToCopy);
  } else {
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";
    document.body.prepend(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
}

const SidebarFooterContainer = styled.styled.div.withConfig({
  displayName: "SidebarFooter__SidebarFooterContainer",
  componentId: "sc-17xf0ak-0"
})(["position:sticky;bottom:0;background:", ";"], easyblocksDesignSystem.Colors.white);
const HorizontalLine$4 = styled.styled.div.withConfig({
  displayName: "SidebarFooter__HorizontalLine",
  componentId: "sc-17xf0ak-1"
})(["height:1px;margin-top:-1px;background-color:", ";"], easyblocksDesignSystem.Colors.black10);
const IdWrapper = styled.styled.div.withConfig({
  displayName: "SidebarFooter__IdWrapper",
  componentId: "sc-17xf0ak-2"
})(["padding:12px 16px;gap:16px;", " color:", ";"], easyblocksDesignSystem.Fonts.body, easyblocksDesignSystem.Colors.black40);
const ButtonWrapper = styled.styled.div.withConfig({
  displayName: "SidebarFooter__ButtonWrapper",
  componentId: "sc-17xf0ak-3"
})(["display:flex;justify-content:end;gap:8px;"]);
const StyledButtonCopyTemplate = styled.styled(buttons.ButtonSecondary).withConfig({
  displayName: "SidebarFooter__StyledButtonCopyTemplate",
  componentId: "sc-17xf0ak-4"
})(["min-width:auto !important;& svg{width:14px !important;height:14px !important;}"]);
function SidebarFooter(props) {
  const editorContext = useEditorContext();
  const toaster = Toaster.useToaster();
  const {
    t
  } = useTranslation();
  const {
    form,
    mode
  } = editorContext;
  const [saveAsEntry, setSaveAsEntry] = React.useState(null);
  if (props.paths.length === 0) {
    return null;
  }
  const path = _internals.stripRichTextPartSelection(props.paths[0]);
  const value = dotNotationGet(form.values, path);
  if (!value) {
    return null;
  }
  const compiledPath = pathToCompiledPath(path, editorContext);
  const compiledValue = dotNotationGet(editorContext.compiledComponentConfig, compiledPath);
  const widthInfo = compiledValue.__editing?.widthInfo;
  const width = widthInfo?.width?.xl;
  const widthAuto = widthInfo?.auto?.xl;
  const definition = _internals.findComponentDefinition(value, editorContext);
  const isSaveable = !!definition?.allowSave;
  const showSaveAsTemplate = isSaveable && !editorContext.readOnly && !editorContext.disableCustomTemplates;
  const onCopy = async value => {
    try {
      if (typeof value === "string") {
        await copyToClipboard(value);
      } else {
        await copyToClipboard(JSON.stringify(value));
      }
      toaster.success(t("template.entry.copy.success"));
    } catch (error) {
      toaster.error(t("template.entry.copy.error"));
    }
  };
  return /*#__PURE__*/React__namespace.createElement(SidebarFooterContainer, null, /*#__PURE__*/React__namespace.createElement(HorizontalLine$4, null), /*#__PURE__*/React__namespace.createElement(IdWrapper, null, showSaveAsTemplate ? /*#__PURE__*/React__namespace.createElement(ButtonWrapper, null, showSaveAsTemplate && mode !== "admin" && /*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, /*#__PURE__*/React__namespace.createElement(buttons.ButtonSecondary, {
    icon: icons.Icons.Save1,
    hideLabel: true,
    onClick: () => {
      editorContext.actions.openTemplateModal({
        mode: "create",
        config: value,
        width,
        widthAuto
      });
    },
    style: {
      minWidth: "auto"
    }
  }, t("template.save")), /*#__PURE__*/React__namespace.createElement(buttons.ButtonSecondary, {
    style: {
      minWidth: "auto"
    },
    icon: icons.Icons.SaveAs,
    hideLabel: true,
    onClick: () => setSaveAsEntry(value)
  }, t("template.saveAs"))), mode !== "user" && /*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, /*#__PURE__*/React__namespace.createElement(StyledButtonCopyTemplate, {
    icon: icons.Icons.Copy,
    hideLabel: true,
    onClick: () => onCopy(value)
  }, t("template.entry.copy")), value._master && /*#__PURE__*/React__namespace.createElement("div", {
    style: {
      paddingTop: 16
    }
  }, "Master: ", value._master)), /*#__PURE__*/React__namespace.createElement(buttons.ButtonSecondary, {
    icon: icons.Icons.Id,
    hideLabel: true,
    onClick: () => onCopy(value._id),
    style: {
      minWidth: "auto"
    }
  }, t("template.id.copy"))) : null), props.SaveAsPicker ? /*#__PURE__*/React__namespace.createElement(SaveAsPicker, {
    saveAsEntry: saveAsEntry,
    setSaveAsEntry: setSaveAsEntry,
    Component: props.SaveAsPicker,
    mode: mode
  }) : null);
}

// eslint-disable-next-line @typescript-eslint/ban-types
function toArray(scalarOrCollection) {
  if (Array.isArray(scalarOrCollection)) {
    return scalarOrCollection;
  }
  return [scalarOrCollection];
}

const Toggle = ({
  input,
  field,
  disabled = false
}) => {
  const checked = !!(input.value || input.checked);
  const toggleProps = {
    ...input,
    labels: null,
    name: field.name,
    disabled,
    value: checked,
    checked
  };
  return /*#__PURE__*/React__default["default"].createElement(ToggleFieldWrapper, null, /*#__PURE__*/React__default["default"].createElement(Toggle$1.Toggle, toggleProps));
};
const ToggleFieldWrapper = styled.styled.div.withConfig({
  displayName: "Toggle__ToggleFieldWrapper",
  componentId: "sc-1ldymt4-0"
})(["display:flex;justify-content:flex-end;"]);

const MIXED_VALUE = "__MIXED__";
const CUSTOM_OPTION_VALUE = "__custom__";
const COMPONENTS_SUPPORTING_MIXED_VALUES = ["block", "radio-group", "select", "token"];

function isMixedFieldValue(value) {
  return typeof value === "object" && value !== null && "__mixed__" in value && value.__mixed__;
}

const SelectFieldComponent = ({
  input,
  field,
  options
}) => {
  const {
    value,
    onChange
  } = input;
  const isMixedValue = isMixedFieldValue(value);
  const selectOptions = options || field.options;
  const normalizedSelectOptions = selectOptions.map(toProps);
  if (isMixedValue) {
    normalizedSelectOptions.unshift({
      label: "Mixed",
      value: MIXED_VALUE
    }, {
      isDivider: true
    });
  }
  const inputValue = isMixedValue ? MIXED_VALUE : value;
  const handleChange = value => {
    onChange(value);
  };
  return /*#__PURE__*/React__default["default"].createElement(Select.Select, {
    value: inputValue,
    onChange: handleChange
  }, normalizedSelectOptions.map(toComponent));
};
function toProps(option) {
  if (typeof option === "object") return option;
  return {
    value: option,
    label: option
  };
}
function toComponent(option) {
  if ("isDivider" in option) {
    return /*#__PURE__*/React__default["default"].createElement(Select.SelectSeparator, {
      key: "divider"
    });
  }
  return /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    key: option.value,
    value: option.value,
    isDisabled: option.value === MIXED_VALUE
  }, option.label);
}

const RadioGroup = ({
  input,
  field,
  options
}) => {
  const {
    value
  } = input;
  const radioOptions = options || field.options;
  const toggleButtonValue = isMixedFieldValue(value) ? undefined : value;
  const toProps = option => {
    if (typeof option === "object") return option;
    return {
      value: option,
      label: option
    };
  };
  const radioOptionsMapped = radioOptions ? radioOptions.map(toProps) : [];
  return radioOptionsMapped && /*#__PURE__*/React__default["default"].createElement(ToggleButton.SelectInline, _extends__default["default"]({}, input, {
    value: toggleButtonValue
  }), radioOptionsMapped.map(option => {
    let Icon = undefined;
    if (typeof option.icon === "string" && option.icon in icons.Icons) {
      Icon = icons.Icons[option.icon];
    }
    if (typeof option.icon === "function") {
      Icon = option.icon;
    }
    return /*#__PURE__*/React__default["default"].createElement(ToggleButton.ToggleButton, {
      key: option.value,
      icon: Icon,
      value: option.value,
      hideLabel: option.hideLabel
    }, option.label ?? option.value);
  }));
};

const NumberInput = ({
  onChange,
  value,
  step,
  min,
  max
}) => /*#__PURE__*/React__namespace.createElement(Input.Input, {
  type: "number"
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ,
  step: step,
  value: value,
  onChange: onChange,
  min: min,
  max: max
});

const Tooltip = /*#__PURE__*/React.forwardRef(({
  children,
  style = {},
  ...rest
}, ref) => {
  return /*#__PURE__*/ReactDOM.createPortal(/*#__PURE__*/React__default["default"].createElement("div", _extends__default["default"]({
    style: {
      ...style,
      zIndex: 100100,
      top: 5
    },
    ref: ref
  }, rest), children), document.body);
});
Tooltip.displayName = "Tooltip";
const TooltipBody = styled.styled.div.withConfig({
  displayName: "Tooltip__TooltipBody",
  componentId: "sc-tkogle-0"
})(["position:relative;top:6px;display:flex;flex-direction:row;justify-content:center;align-items:center;padding:6px 8px;background:", ";border-radius:2px;", " color:", ";"], easyblocksDesignSystem.Colors.black800, easyblocksDesignSystem.Fonts.body, easyblocksDesignSystem.Colors.white);
const TooltipArrow = styled.styled.div.withConfig({
  displayName: "Tooltip__TooltipArrow",
  componentId: "sc-tkogle-1"
})(["width:12px;height:6px;margin:0 auto;background:", ";clip-path:polygon(50% 0%,0% 100%,100% 100%);"], easyblocksDesignSystem.Colors.black800);

function useTooltip({
  isDisabled,
  onClick
} = {}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [triggerElement, setTriggerElement] = React.useState(null);
  const [tooltipElement, setTooltipElement] = React.useState(null);
  const [arrowElement, setArrowElement] = React.useState(null);
  const {
    styles,
    attributes
  } = reactPopper.usePopper(triggerElement, tooltipElement, {
    strategy: "absolute",
    placement: "bottom",
    modifiers: [{
      name: "arrow",
      options: {
        element: arrowElement,
        padding: 6
      }
    }]
  });
  const tooltipTrigger = tooltip.useTooltipTrigger({
    isDisabled,
    delay: 0
  }, {
    isOpen,
    open: () => {
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
    }
  }, {
    current: triggerElement
  });
  const triggerProps = {
    ref: setTriggerElement,
    ...tooltipTrigger.triggerProps,
    onClick: onClick === undefined ? tooltipTrigger.tooltipProps.onClick : event => {
      tooltipTrigger.tooltipProps.onClick?.(event);
      onClick();
    }
  };
  const tooltipProps = {
    ref: setTooltipElement,
    style: styles.popper,
    ...attributes.popper,
    ...tooltipTrigger.tooltipProps
  };
  const arrowProps = {
    ref: setArrowElement,
    style: styles.arrow
  };
  return {
    isOpen,
    triggerProps,
    tooltipProps,
    arrowProps
  };
}

// Wraps the Field component in labels describing the field's meta state
// Add any other fields that the Field component should expect onto the ExtraFieldProps generic type

function FieldMetaWrapper({
  children,
  field,
  input,
  noWrap,
  layout = "row",
  renderLabel,
  isLabelHidden
}) {
  const editorContext = useEditorContext();
  const configAfterAuto = useConfigAfterAuto();
  const externalData = useEditorExternalData();
  const {
    isOpen,
    tooltipProps,
    triggerProps,
    arrowProps
  } = useTooltip();
  const {
    actions: {
      runChange
    },
    form,
    focussedField
  } = editorContext;
  const isMixedValueSupported = isMixedValueSupportedByComponent(isResponsiveField(field) ? field.subComponent : field.component);
  const isMixedValue = isMixedFieldValue(input.value);
  const fieldNames = toArray(field.name);
  const allowCustom = field.allowCustom ?? false;
  function handleButtonMixedClick() {
    runChange(() => {
      fieldNames.forEach((fieldName, _, names) => {
        const firstFieldValue = dotNotationGet(form.values, names[0]);
        form.change(fieldName, firstFieldValue);
      });
    });
  }
  const resolvedLayout = field.layout ?? layout;
  const content = /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      width: "100%",
      display: "flex",
      alignItems: resolvedLayout === "row" ? "flex-end" : "flex-start",
      flexDirection: "column"
    }
  }, !isMixedValue || isMixedValue && isMixedValueSupported ? children : /*#__PURE__*/React__default["default"].createElement(TextButton, {
    component: "button",
    variant: "label",
    color: "black40",
    onClick: handleButtonMixedClick
  }, "Mixed"));
  if (noWrap) {
    return content;
  }
  const label = field.label || input.name;
  const {
    schemaProp
  } = field;
  const isExternalField = _internals.isExternalSchemaProp(schemaProp, editorContext.types) || schemaProp.type === "text" && !input.value.id?.startsWith("local.");
  const componentPaths = fieldNames.map(fieldName => fieldName[0].split(".").slice(0, -1).join("."));
  const fieldValues = fieldNames.map(f => dotNotationGet(configAfterAuto, f));
  const configs = componentPaths.map(c => dotNotationGet(configAfterAuto, c));
  const externalValues = isExternalField ? configs.map(c => externalData[easyblocksCore.getExternalReferenceLocationKey(focussedField.length === 0 ? "$" : c._id, schemaProp.prop, easyblocksCore.isTrulyResponsiveValue(input.value) ? easyblocksCore.responsiveValueFindDeviceWithDefinedValue(input.value, editorContext.breakpointIndex, editorContext.devices)?.id : undefined)]) : undefined;
  const currentBreakpointFieldValues = fieldValues.map(v => easyblocksCore.responsiveValueForceGet(v, editorContext.breakpointIndex));
  const isLoadingExternalValue = isExternalField && externalValues?.length === 0 && currentBreakpointFieldValues.every(v => !easyblocksCore.isEmptyExternalReference(v) && !easyblocksCore.isIdReferenceToDocumentExternalValue(v.id));
  const getSelectedValue = () => {
    if (input.value === undefined || input.value === null) {
      return CUSTOM_OPTION_VALUE;
    }
    if (isMixedFieldValue(input.value)) {
      return MIXED_VALUE;
    }
    const isResponsive = input.value?.$res;
    if (!isResponsive && input.value.tokenId) {
      return input.value.tokenId;
    }
    if (isResponsive) {
      const hasBreakpointIndexValue = input.value[editorContext.breakpointIndex];
      const hasBreakpointIndexValueTokenId = input.value[editorContext.breakpointIndex]?.tokenId;
      if (!hasBreakpointIndexValue || hasBreakpointIndexValue && hasBreakpointIndexValueTokenId) {
        return hasBreakpointIndexValueTokenId;
      }
    }
    return CUSTOM_OPTION_VALUE;
  };
  const isCustomField = getSelectedValue() === CUSTOM_OPTION_VALUE && allowCustom;
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(FieldWrapper$1, {
    margin: false,
    layout: resolvedLayout,
    isCustom: isCustomField
  }, !isLabelHidden && /*#__PURE__*/React__default["default"].createElement(FieldLabelWrapper, {
    isFullWidth: resolvedLayout === "column",
    isCustom: isCustomField
  }, renderLabel?.({
    label
  }) ?? /*#__PURE__*/React__default["default"].createElement(FieldLabel$1, _extends__default["default"]({
    htmlFor: toArray(field.name).join(","),
    isError: externalValues !== undefined && "error" in externalValues
  }, triggerProps), /*#__PURE__*/React__default["default"].createElement("span", {
    style: {
      lineHeight: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, label), isOpen && /*#__PURE__*/React__default["default"].createElement(Tooltip, tooltipProps, /*#__PURE__*/React__default["default"].createElement(TooltipArrow, arrowProps), /*#__PURE__*/React__default["default"].createElement(TooltipBody, null, field.description ?? field.label))), isLoadingExternalValue && /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      marginLeft: "6px"
    }
  }, /*#__PURE__*/React__default["default"].createElement(Loader.Loader, null)), resolvedLayout === "column" && (_internals.isExternalSchemaProp(schemaProp, editorContext.types) || schemaProp.type === "text") && !isMixedValue && /*#__PURE__*/React__default["default"].createElement(WidgetsSelect, {
    schemaProp: schemaProp,
    value: currentBreakpointFieldValues[0],
    onChange: widgetId => {
      if (widgetId === "@easyblocks/local-text") {
        const newFieldValue = {
          id: `local.${uniqueId()}`,
          value: {},
          widgetId
        };
        input.onChange(newFieldValue);
        return;
      }
      if (easyblocksCore.isTrulyResponsiveValue(input.value)) {
        const newFieldValue = {
          ...input.value,
          [editorContext.breakpointIndex]: {
            id: null,
            widgetId
          }
        };
        input.onChange(newFieldValue);
      } else {
        const newFieldValue = {
          id: null,
          widgetId
        };
        input.onChange(newFieldValue);
      }
    },
    isRootComponent: fieldNames.some(f => f.split(".").length === 1)
  })), /*#__PURE__*/React__default["default"].createElement(FieldInputWrapper, {
    isCustom: isCustomField,
    layout: resolvedLayout
  }, content), !isMixedFieldValue && isExternalField && externalValues.length > 0 && "error" in externalValues[0] && /*#__PURE__*/React__default["default"].createElement(FieldError, null, externalValues[0].error.message)));
}
function WidgetsSelect({
  value,
  onChange,
  schemaProp,
  isRootComponent
}) {
  const editorContext = useEditorContext();
  const [selectedWidgetId, setSelectedWidgetId] = React.useState(value.widgetId);
  const widgets = editorContext.types[schemaProp.type].widgets;
  const availableWidgets = isRootComponent ? widgets.filter(w => {
    return w.id !== "@easyblocks/document-data";
  }) : [...widgets];
  if (schemaProp.type === "text") {
    availableWidgets.unshift({
      id: "@easyblocks/local-text",
      label: "Local text",
      component: () => {
        return null;
      }
    });
  }
  if (availableWidgets.length <= 1) {
    return null;
  }
  return /*#__PURE__*/React__default["default"].createElement(FieldLabelIconWrapper, null, /*#__PURE__*/React__default["default"].createElement(Select.Select, {
    value: selectedWidgetId,
    onChange: widgetId => {
      setSelectedWidgetId(widgetId);
      onChange(widgetId);
    }
  }, availableWidgets.map(widget => {
    return /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
      value: widget.id,
      key: widget.id
    }, widget.label ?? widget.id);
  })));
}
function isResponsiveField(field) {
  return typeof field.component === "string" && field.component === "responsive2";
}
function isMixedValueSupportedByComponent(component) {
  if (typeof component === "string") {
    return COMPONENTS_SUPPORTING_MIXED_VALUES.includes(component);
  }
  return false;
}
const TextButton = styled.styled(Typography.Typography).withConfig({
  displayName: "wrapFieldWithMeta__TextButton",
  componentId: "sc-1asy4oy-0"
})(["padding:0;margin:0;background:transparent;border:0;font-weight:500;&:hover{color:black;cursor:pointer;text-decoration:underline;}"]);
function wrapFieldsWithMeta(Field, extraProps) {
  return props => {
    return /*#__PURE__*/React__default["default"].createElement(FieldMetaWrapper, _extends__default["default"]({}, props, extraProps), /*#__PURE__*/React__default["default"].createElement(Field, props));
  };
}
const FieldWrapper$1 = styled.styled.div.withConfig({
  displayName: "wrapFieldWithMeta__FieldWrapper",
  componentId: "sc-1asy4oy-1"
})(["display:flex;flex-direction:", ";gap:", ";justify-content:space-between;align-items:flex-start;", " position:relative;padding:4px 16px;"], ({
  layout,
  isCustom
}) => isCustom ? "column" : layout, ({
  layout
}) => layout === "row" ? "10px" : "4px", ({
  layout
}) => layout === "column" && styled.css`
      flex-grow: 1;
    `);
const FieldLabelWrapper = styled.styled.div.withConfig({
  displayName: "wrapFieldWithMeta__FieldLabelWrapper",
  componentId: "sc-1asy4oy-2"
})(["all:unset;", ",position:relative;display:flex;flex-direction:row;align-items:center;", " min-height:28px;overflow:hidden;"], ({
  isCustom
}) => ({
  position: isCustom ? "absolute" : "relative"
}), ({
  isFullWidth
}) => isFullWidth && {
  width: "100%"
});
const FieldLabel$1 = styled.styled.label.withConfig({
  displayName: "wrapFieldWithMeta__FieldLabel",
  componentId: "sc-1asy4oy-3"
})(["all:unset;", ";color:", ";text-overflow:ellipsis;overflow:hidden;cursor:default;"], easyblocksDesignSystem.Fonts.body, ({
  isError
}) => isError ? "red" : "#000");
const FieldLabelIconWrapper = styled.styled.span.withConfig({
  displayName: "wrapFieldWithMeta__FieldLabelIconWrapper",
  componentId: "sc-1asy4oy-4"
})(["display:flex;font-size:14px;line-height:1;margin-left:auto;padding-left:8px;svg{width:14px;height:14px;flex-shrink:0;}"]);
const FieldError = styled.styled.span.withConfig({
  displayName: "wrapFieldWithMeta__FieldError",
  componentId: "sc-1asy4oy-5"
})(["display:block;color:red;font-size:var(--tina-font-size-1);margin-top:8px;font-weight:var(--tina-font-weight-regular);"]);
const FieldInputWrapper = styled.styled.div.withConfig({
  displayName: "wrapFieldWithMeta__FieldInputWrapper",
  componentId: "sc-1asy4oy-6"
})(["display:flex;justify-content:flex-end;align-items:center;text-align:end;", ";min-height:28px;"], ({
  layout,
  isCustom
}) => layout === "row" && !isCustom ? styled.css`
          flex-grow: 1;
        ` : styled.css`
          width: 100%;
        `);

const parse$1 = value => value && +value;

const NumberField = wrapFieldsWithMeta(({
  input,
  field
}) => {
  return /*#__PURE__*/React__default["default"].createElement(NumberInput, _extends__default["default"]({}, input, {
    step: field.step,
    min: field.min,
    max: field.max
  }));
});
const NumberFieldPlugin = {
  name: "number",
  Component: NumberField,
  parse: parse$1
};

const parse = value => value || "";

const SelectField = wrapFieldsWithMeta(SelectFieldComponent);
const SelectFieldPlugin = {
  name: "select",
  type: "select",
  Component: SelectField,
  parse
};

const RadioGroupField = wrapFieldsWithMeta(RadioGroup);
const RadioGroupFieldPlugin = {
  name: "radio-group",
  Component: RadioGroupField
};

function TextField({
  input,
  field,
  noWrap
}) {
  const editorContext = useEditorContext();
  const {
    value,
    onChange,
    ...restInputProperties
  } = input;
  const inputProps = _internals.useTextValue(value, onChange, editorContext.contextParams.locale, editorContext.locales, field.placeholder, field.normalize);
  const isTextSchemaProp = field.schemaProp.type === "text";
  return /*#__PURE__*/React__default["default"].createElement(FieldMetaWrapper, {
    input: input,
    field: field,
    layout: isTextSchemaProp ? "column" : "row",
    noWrap: noWrap
  }, /*#__PURE__*/React__default["default"].createElement(Input.Input, _extends__default["default"]({}, restInputProperties, inputProps, {
    controlSize: "full-width",
    align: !isTextSchemaProp ? "right" : "left",
    withBorder: isTextSchemaProp
  })));
}
const TextFieldPlugin = {
  name: "text",
  Component: TextField,
  parse
};

const ToggleField = wrapFieldsWithMeta(Toggle);
const ToggleFieldPlugin = {
  name: "toggle",
  type: "checkbox",
  Component: ToggleField
};

const useTokenTypes = () => {
  const editorContext = useEditorContext();
  const tokenTypes = Object.fromEntries(Object.entries(editorContext.types).filter(typeDefinitionEntry => {
    return typeDefinitionEntry[1].type === "token";
  }));
  return tokenTypes;
};

const ColorCustomFieldsStyle = styled__default["default"].div.withConfig({
  displayName: "ColorCustomFields__ColorCustomFieldsStyle",
  componentId: "sc-83vwfl-0"
})(["display:flex;flex-direction:column;gap:8px;width:100%;margin-top:6px;"]);
const ColorCustomFieldsWrapper = styled__default["default"].div.withConfig({
  displayName: "ColorCustomFields__ColorCustomFieldsWrapper",
  componentId: "sc-83vwfl-1"
})(["display:flex;justify-content:flex-end;align-items:center;gap:10px;"]);
const InputStyle = styled__default["default"](Input.InputColor).withConfig({
  displayName: "ColorCustomFields__InputStyle",
  componentId: "sc-83vwfl-2"
})(["width:100%;height:100%;"]);
const InputStyleWrapper = styled__default["default"].div.withConfig({
  displayName: "ColorCustomFields__InputStyleWrapper",
  componentId: "sc-83vwfl-3"
})(["width:100px;height:20px;"]);
const ColorCustomFields = ({
  input
}) => {
  const editorContext = useEditorContext();
  const inputColorRef = React.useRef(null);
  const currentValue = React.useMemo(() => input.value?.value || input.value?.[editorContext.breakpointIndex]?.value, [input]);
  const onChange = newColor => {
    input.onChange({
      value: newColor,
      widgetId: undefined
    });
  };
  React.useEffect(() => {
    if (inputColorRef.current && inputColorRef.current.value) {
      inputColorRef.current.value = currentValue;
    }
  }, [currentValue]);
  return /*#__PURE__*/React__default["default"].createElement(ColorCustomFieldsStyle, null, /*#__PURE__*/React__default["default"].createElement(ColorCustomFieldsWrapper, null, /*#__PURE__*/React__default["default"].createElement(Input.Input, {
    ref: inputColorRef,
    defaultValue: currentValue,
    onChange: event => onChange(event.target.value)
  }), /*#__PURE__*/React__default["default"].createElement(InputStyleWrapper, null, /*#__PURE__*/React__default["default"].createElement(InputStyle, {
    value: currentValue,
    onChange: onChange
  }))));
};

const Root$1 = styled__default["default"].div.withConfig({
  displayName: "FontCustomFieldInput__Root",
  componentId: "sc-122q2iv-0"
})(["display:flex;flex-direction:column;align-items:flex-end;", ""], ({
  isCustom
}) => isCustom && {
  width: "100%"
});
const FontCustomFieldInput = ({
  inputType = "text",
  options = [],
  customField,
  onChange
}) => {
  const customValueTextFieldRef = React.useRef(null);
  const [inputValue, setInputValue] = React.useState(customField?.value?.toString() ?? "");
  const isCustomValue = options.every(option => String(option.value) !== String(inputValue));
  const [isShowCustomValue, setIsShowCustomValue] = React.useState(isCustomValue);
  const shouldShowCustomValueInput = (isCustomValue || isShowCustomValue) && customField.allowCustom;
  React.useEffect(() => {
    setIsShowCustomValue(options.every(option => String(option.value) !== String(customField.value)));
    setInputValue(customField.value?.toString() ?? "");
  }, [customField.value]);
  const customInputElement = shouldShowCustomValueInput ? /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      width: "100%",
      textAlign: "end"
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      height: 4
    }
  }), /*#__PURE__*/React__default["default"].createElement(Input.Input, {
    value: inputValue,
    onChange: e => {
      setInputValue(e.target.value);
    },
    onBlur: () => {
      onChange(customField.key, inputValue, customField.type);
    },
    ref: customValueTextFieldRef,
    style: {
      width: "100%"
    },
    align: "right"
  })) : null;
  switch (inputType) {
    case "text":
      {
        return /*#__PURE__*/React__default["default"].createElement(Input.Input, {
          value: customField.value ?? customField.defaultValue,
          onChange: e => {
            onChange(customField.key, e.target.value, customField.type);
          },
          align: "right"
        });
      }
    case "select":
      {
        return /*#__PURE__*/React__default["default"].createElement(Root$1, {
          isCustom: isCustomValue
        }, /*#__PURE__*/React__default["default"].createElement(Select.Select, {
          value: isCustomValue || isShowCustomValue ? CUSTOM_OPTION_VALUE : String(customField.value ?? customField.defaultValue),
          onChange: selectedValue => {
            if (selectedValue !== CUSTOM_OPTION_VALUE) {
              onChange(customField.key, selectedValue, customField.type);
              setInputValue(selectedValue);
            } else {
              setIsShowCustomValue(true);
            }
          }
        }, options.map(o => {
          return /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
            key: o.id,
            value: o.value
          }, /*#__PURE__*/React__default["default"].createElement("div", {
            style: {
              fontFamily: o.value
            }
          }, o.label));
        }), customField?.allowCustom && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Select.SelectSeparator, null), /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
          value: CUSTOM_OPTION_VALUE
        }, "Custom"))), customInputElement);
      }
  }
};

const FieldLabel = styled__default["default"].label.withConfig({
  displayName: "FontCustomFields__FieldLabel",
  componentId: "sc-opt9vi-0"
})(["all:unset;", ";color:#000;text-overflow:ellipsis;overflow:hidden;cursor:default;"], easyblocksDesignSystem.Fonts.body);
const FontCustomFieldsStyle = styled__default["default"].div.withConfig({
  displayName: "FontCustomFields__FontCustomFieldsStyle",
  componentId: "sc-opt9vi-1"
})(["display:flex;flex-direction:column;gap:8px;width:100%;margin-top:6px;"]);
const FontCustomField = ({
  customField,
  onChange
}) => {
  const {
    isOpen,
    tooltipProps,
    triggerProps,
    arrowProps
  } = useTooltip();
  return /*#__PURE__*/React__default["default"].createElement("div", {
    key: customField.key,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React__default["default"].createElement(FieldLabel, triggerProps, /*#__PURE__*/React__default["default"].createElement("span", {
    style: {
      lineHeight: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, customField.label), isOpen && /*#__PURE__*/React__default["default"].createElement(Tooltip, tooltipProps, /*#__PURE__*/React__default["default"].createElement(TooltipArrow, arrowProps), /*#__PURE__*/React__default["default"].createElement(TooltipBody, null, customField.label))), /*#__PURE__*/React__default["default"].createElement(FontCustomFieldInput, {
    inputType: customField.inputType,
    options: customField.options,
    customField: customField,
    onChange: onChange
  }));
};
const FontCustomFields = ({
  input,
  field
}) => {
  const {
    t
  } = useTranslation();
  const editorContext = useEditorContext();
  const normalizeCustomValue = field.normalizeCustomValue || (x => x);
  const customFields = React.useMemo(() => [{
    key: "fontFamily",
    label: t("definition.schema.label.fontFamily"),
    options: easyblocksCore.getFontFamilies(),
    type: "string",
    inputType: "select",
    defaultValue: easyblocksCore.defaultFontFamily
  }, {
    key: "fontSize",
    label: t("definition.schema.label.fontSize"),
    type: "number",
    options: easyblocksCore.getFontSizes(),
    inputType: "select",
    defaultValue: easyblocksCore.defaultFontSize,
    allowCustom: true
  }, {
    key: "fontWeight",
    label: t("definition.schema.label.fontWeight"),
    type: "number",
    options: easyblocksCore.getFontWeights(),
    inputType: "select",
    defaultValue: easyblocksCore.defaultFontWeight
  }, {
    key: "lineHeight",
    label: t("definition.schema.label.lineHeight"),
    type: "number",
    options: easyblocksCore.getLineHeights(),
    inputType: "select",
    defaultValue: easyblocksCore.defaultLineHeight,
    allowCustom: true
  }], []);
  const defaultInputValue = customFields.reduce((prev, curr) => {
    prev[curr.key] = curr.defaultValue ?? (curr.type === "number" ? 0 : "");
    return prev;
  }, {});
  const inputValue = React.useMemo(() => input.value?.value || input.value?.[editorContext.breakpointIndex]?.value || defaultInputValue, [input]);
  const onChange = (key, value, type) => {
    if (type === "number" && !Number(value)) {
      return;
    }
    const newInputValue = {
      ...inputValue,
      [key]: type === "number" ? Number(value) : value.toString()
    };
    input.onChange({
      value: normalizeCustomValue(newInputValue),
      widgetId: undefined
    });
  };
  return /*#__PURE__*/React__default["default"].createElement(FontCustomFieldsStyle, null, customFields.map(customField => {
    const customFieldValue = inputValue[customField.key];
    return /*#__PURE__*/React__default["default"].createElement(FontCustomField, {
      key: customField.key,
      customField: {
        ...customField,
        value: customFieldValue
      },
      onChange: onChange
    });
  }));
};

const CustomField = ({
  field,
  input
}) => {
  const tokenTypes = useTokenTypes();
  const tokenTypeDefinition = tokenTypes[field.schemaProp.type];
  switch (tokenTypeDefinition?.token) {
    case "fonts":
      {
        return /*#__PURE__*/React__default["default"].createElement(FontCustomFields, {
          field: field,
          input: input
        });
      }
    case "colors":
      {
        return /*#__PURE__*/React__default["default"].createElement(ColorCustomFields, {
          field: field,
          input: input
        });
      }
    default:
      {
        return null;
      }
  }
};

const Trigger = styled__default["default"](ReactSelect.RadixSelectTrigger).withConfig({
  displayName: "ColorFieldPlugin__Trigger",
  componentId: "sc-19dwflf-0"
})(["all:unset;display:flex;align-items:center;", ";display:flex;gap:4px;max-width:100%;box-sizing:border-box;height:28px;padding:0 2px 0 6px;border-radius:2px;@media (hover:hover){&:hover{box-shadow:0 0 0 1px ", ";}}"], easyblocksDesignSystem.Fonts.body, easyblocksDesignSystem.Colors.black10);
const Content$2 = styled__default["default"](ReactSelect.RadixSelectContent).withConfig({
  displayName: "ColorFieldPlugin__Content",
  componentId: "sc-19dwflf-1"
})(["overflow:hidden;background-color:white;border-radius:2px;border:1px solid #ddd;box-shadow:0px 4px 12px #0000001a;padding:4px 0;width:250px;"]);
const Viewport = styled__default["default"](ReactSelect.RadixSelectViewport).withConfig({
  displayName: "ColorFieldPlugin__Viewport",
  componentId: "sc-19dwflf-2"
})(["display:grid;grid-template-columns:", ";padding:", ";max-height:200px;overflow:auto;justify-items:center;justify-content:center;"], ({
  shape
}) => `repeat(${shape === "circle" ? "8" : "5"}, ${shape === "circle" ? "30px" : "46px"})`, ({
  shape
}) => shape === "circle" ? "2px" : "2px 8px");
const Item = styled__default["default"](ReactSelect.RadixSelectItem).withConfig({
  displayName: "ColorFieldPlugin__Item",
  componentId: "sc-19dwflf-3"
})(["position:relative;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;transform:scale(1.2);width:8px;height:8px;outline:none;margin:10px;&[data-highlighted]{background-color:#f2f2f2;}&[data-state=\"checked\"]{cursor:pointer;transform:scale(1.4);", ";", ";z-index:1;}@media (hover:hover){&:hover{background-color:transparent;border:none;cursor:pointer;transform:scale(1.4);z-index:2;}}"], ({
  shape
}) => shape === "circle" ? "box-shadow: 0 0 1px 2px #fff, 0 0 0 4px #7e8796;" : "", ({
  shape
}) => shape === "circle" ? "border-radius: 100%" : "");
const ItemText = styled__default["default"](ReactSelect.RadixSelectItemText).withConfig({
  displayName: "ColorFieldPlugin__ItemText",
  componentId: "sc-19dwflf-4"
})(["@media (hover:hover){&:hover{border:none;background-color:transparent;}}"]);
const SelectTitle = styled__default["default"].div.withConfig({
  displayName: "ColorFieldPlugin__SelectTitle",
  componentId: "sc-19dwflf-5"
})(["padding:8px 8px 2px 8px;", ";font-size:14px;"], easyblocksDesignSystem.Fonts.body);
const transparentImage = 'url(\'data:image/svg+xml,<svg width="100" height="50" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="checker" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="%23ccc" /><rect x="2" y="2" width="2" height="2" fill="%23ccc" /></pattern></defs><rect width="100" height="50" fill="url(%23checker)" /></svg>\')';
const ColorOptions = ({
  field,
  options,
  shape = "circle"
}) => {
  return options.map(option => {
    const color = field.tokens[option.id]?.value ?? option.id;
    const colorStyled = color === "transparent" ? {
      backgroundImage: transparentImage
    } : {
      background: color
    };
    return /*#__PURE__*/React__default["default"].createElement(Item, {
      key: option.id,
      value: option.id,
      shape: shape
    }, /*#__PURE__*/React__default["default"].createElement(ItemText, null, /*#__PURE__*/React__default["default"].createElement(Tooltip$1.Tooltip, null, /*#__PURE__*/React__default["default"].createElement(Tooltip$1.TooltipTrigger, null, /*#__PURE__*/React__default["default"].createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: shape === "circle" ? 6 : 0
      }
    }, shape === "circle" ? /*#__PURE__*/React__default["default"].createElement("span", {
      style: {
        width: 16,
        height: 16,
        ...colorStyled,
        border: `1px solid ${easyblocksDesignSystem.Colors.black100}`,
        borderRadius: "100%"
      }
    }) : /*#__PURE__*/React__default["default"].createElement("span", {
      style: {
        width: 40,
        height: 16,
        background: color,
        ...colorStyled,
        border: `1px solid ${easyblocksDesignSystem.Colors.black100}`
      }
    }))), /*#__PURE__*/React__default["default"].createElement(Tooltip$1.TooltipContent, null, /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
      color: "white"
    }, color)))));
  });
};
const ColorFieldPlugin = ({
  type = "list",
  tokenTypeDefinition,
  shouldShowCustomValueInput,
  inputValue,
  setInputValue,
  input,
  selectValue,
  onSelectChange,
  field,
  SelectColorTokenItem,
  options
}) => {
  const {
    t
  } = useTranslation();
  const CustomInputWidgetComponent = tokenTypeDefinition?.widget?.component;
  const previewColor = selectValue === CUSTOM_OPTION_VALUE ? input.value.value : undefined;
  const customInputElement = shouldShowCustomValueInput ? /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      width: "100%",
      textAlign: "end"
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      height: 4
    }
  }), CustomInputWidgetComponent ? /*#__PURE__*/React__default["default"].createElement(CustomInputWidgetComponent, {
    value: inputValue,
    onChange: value => {
      input.onChange({
        value,
        widgetId: tokenTypeDefinition.widget?.id
      });
    },
    params: "params" in field.schemaProp ? field.schemaProp.params : undefined
  }) : /*#__PURE__*/React__default["default"].createElement(CustomField, {
    input: input,
    field: field
  })) : null;
  const themeOptions = options.filter(o => o.id.startsWith("theme_"));
  const myColorOptions = options.filter(o => !o.id.startsWith("theme_"));
  React.useEffect(() => {
    const value = input.value.value;
    if (value) {
      setInputValue(value);
    }
  }, [input]);
  if (type === "grid") {
    return /*#__PURE__*/React__default["default"].createElement(React.Fragment, null, /*#__PURE__*/React__default["default"].createElement(ReactSelect.RadixSelectRoot, {
      value: selectValue,
      onValueChange: onSelectChange
    }, /*#__PURE__*/React__default["default"].createElement(Trigger, null, /*#__PURE__*/React__default["default"].createElement(ReactSelect.RadixSelectValue, {
      placeholder: "Select item"
    }), /*#__PURE__*/React__default["default"].createElement(ReactIcons.ChevronDownIcon, {
      color: easyblocksDesignSystem.Colors.black40
    })), /*#__PURE__*/React__default["default"].createElement(ReactSelect.RadixSelectPortal, null, /*#__PURE__*/React__default["default"].createElement(Content$2, null, /*#__PURE__*/React__default["default"].createElement(SelectTitle, null, t("theme.colors")), /*#__PURE__*/React__default["default"].createElement(Viewport, {
      shape: "rectangle"
    }, /*#__PURE__*/React__default["default"].createElement(ColorOptions, {
      options: themeOptions,
      field: field,
      shape: "rectangle"
    })), /*#__PURE__*/React__default["default"].createElement(SelectTitle, null, t("theme.myColors")), /*#__PURE__*/React__default["default"].createElement(Viewport, {
      shape: "circle"
    }, /*#__PURE__*/React__default["default"].createElement(ColorOptions, {
      options: myColorOptions,
      field: field
    })), field?.allowCustom && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Select.SelectSeparator, null), /*#__PURE__*/React__default["default"].createElement(SelectColorTokenItem, {
      value: CUSTOM_OPTION_VALUE,
      previewColor: previewColor
    }, "Custom"))))), customInputElement);
  }
  return /*#__PURE__*/React__default["default"].createElement(React.Fragment, null, /*#__PURE__*/React__default["default"].createElement(Select.Select, {
    value: selectValue,
    onChange: onSelectChange
  }, isMixedFieldValue(input.value) && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(SelectColorTokenItem, {
    value: MIXED_VALUE,
    isDisabled: true
  }, "Mixed"), /*#__PURE__*/React__default["default"].createElement(Select.SelectSeparator, null)), /*#__PURE__*/React__default["default"].createElement(React.Fragment, null, options.map(o => {
    return /*#__PURE__*/React__default["default"].createElement(SelectColorTokenItem, {
      key: o.id,
      value: o.id
      // Color tokens are always strings
      ,
      previewColor: field.tokens[o.id]?.value ?? o.id
    }, o.label);
  }), field?.allowCustom && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Select.SelectSeparator, null), /*#__PURE__*/React__default["default"].createElement(SelectColorTokenItem, {
    value: CUSTOM_OPTION_VALUE,
    previewColor: selectValue === CUSTOM_OPTION_VALUE ? input.value.value : undefined
  }, "Custom")))), customInputElement);
};

function extraValuesIncludes(extraValues, value) {
  for (let i = 0; i < extraValues.length; i++) {
    const extraValue = extraValues[i];
    if (typeof extraValue === "string") {
      if (extraValue === value) {
        return true;
      }
    } else {
      if (extraValue.value === value) {
        return true;
      }
    }
  }
  return false;
}
function TokenFieldComponent({
  input,
  field
}) {
  const editorContext = useEditorContext();
  const tokenTypes = useTokenTypes();
  const tokenTypeDefinition = tokenTypes[field.schemaProp.type];
  const normalizeCustomValue = field.normalizeCustomValue || (x => x);
  const allowCustom = field.allowCustom ?? false;
  const extraValues = field.extraValues ?? [];
  const [inputValue, setInputValue] = React.useState(isMixedFieldValue(input.value) ? "" : input.value?.value.toString() ?? "");
  const customValueTextFieldRef = React.useRef(null);
  const options = Object.entries(field.tokens).map(([tokenId, tokenValue]) => {
    if (tokenTypeDefinition.token === "fonts") {
      const fontTokenLabel = getFontTokenLabel(tokenId, tokenValue, editorContext);
      return {
        id: tokenId,
        label: fontTokenLabel
      };
    }
    return {
      id: tokenId,
      label: tokenValue.label ?? tokenId
    };
  });

  // Extra values are displayed in select
  if (field.extraValues) {
    field.extraValues.forEach(extraValue => {
      if (typeof extraValue === "string") {
        options.push({
          id: extraValue,
          label: extraValue
        });
      } else {
        options.push({
          id: extraValue.value,
          label: extraValue.label
        });
      }
    });
  }

  // If token exist but is removed from a theme -> let's add special option for this
  if (!isMixedFieldValue(input.value) && typeof input.value?.tokenId === "string" && !field.tokens[input.value?.tokenId]) {
    options.unshift({
      id: input.value.tokenId,
      label: `(removed) ${input.value.tokenId}`
    });
  }
  const isExtraValueSelected = !isMixedFieldValue(input.value) && !input.value?.tokenId && extraValuesIncludes(extraValues, easyblocksCore.responsiveValueGetDefinedValue(input.value?.value, editorContext.breakpointIndex, editorContext.devices, easyblocksCore.getDevicesWidths(editorContext.devices) /** FOR NOW TOKENS ARE RELATIVE TO SCREEN **/));
  const shouldShowCustomValueInput = !isMixedFieldValue(input.value) && !(input.value?.tokenId || isExtraValueSelected) && allowCustom;
  const selectValue = isMixedFieldValue(input.value) ? MIXED_VALUE : input.value?.tokenId ?? (isExtraValueSelected ? input.value?.value : CUSTOM_OPTION_VALUE);
  const onSelectChange = selectedValue => {
    if (selectedValue === CUSTOM_OPTION_VALUE) {
      if (isMixedFieldValue(input.value)) {
        input.onChange({
          value: "",
          widgetId: tokenTypeDefinition.widget?.id
        });
        setInputValue("");
        return;
      }
      let value = input.value.value;

      // responsive token values are transformed into value from current breakpoint
      if (easyblocksCore.isTrulyResponsiveValue(value)) {
        value = easyblocksCore.responsiveValueGetDefinedValue(
        // Not sure about usage of responsiveValueGet without widths
        value, editorContext.breakpointIndex, editorContext.devices, easyblocksCore.getDevicesWidths(editorContext.devices) /** FOR NOW TOKENS ARE RELATIVE TO SCREEN **/);
      }
      input.onChange({
        value,
        widgetId: input.value.widgetId
      });
      queueMicrotask(() => {
        customValueTextFieldRef.current?.focus();
      });
    } else if (extraValuesIncludes(extraValues, selectedValue)) {
      input.onChange({
        value: selectedValue,
        widgetId: tokenTypeDefinition.widget?.id
      });
    } else {
      input.onChange({
        tokenId: selectedValue,
        value: field.tokens[selectedValue].value,
        widgetId: tokenTypeDefinition.widget?.id
      });
    }
  };
  const CustomInputWidgetComponent = tokenTypeDefinition?.widget?.component;
  const customInputElement = shouldShowCustomValueInput ? /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      width: "100%",
      textAlign: "end"
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      height: 4
    }
  }), CustomInputWidgetComponent ? /*#__PURE__*/React__default["default"].createElement(CustomInputWidgetComponent, {
    value: inputValue,
    onChange: value => {
      input.onChange({
        value,
        widgetId: tokenTypeDefinition.widget?.id
      });
    },
    params: "params" in field.schemaProp ? field.schemaProp.params : undefined
  }) : ["fonts", "colors"].includes(tokenTypeDefinition.token) ? /*#__PURE__*/React__default["default"].createElement(CustomField, {
    input: input,
    field: field
  }) : /*#__PURE__*/React__default["default"].createElement(Input.Input, {
    value: inputValue,
    onChange: e => {
      setInputValue(e.target.value);
    },
    onBlur: () => {
      const normalizedValue = normalizeCustomValue(inputValue);
      setInputValue(normalizedValue);
      input.onChange({
        value: normalizedValue
      });
    },
    ref: customValueTextFieldRef,
    style: {
      width: "100%"
    },
    align: "right"
  })) : null;
  React.useEffect(() => {
    const value = input.value?.value;
    if (value) {
      setInputValue(value);
    }
  }, [input]);
  if (tokenTypeDefinition.token === "colors") {
    return /*#__PURE__*/React__default["default"].createElement(ColorFieldPlugin, {
      type: "grid",
      field: field,
      input: input,
      options: options,
      inputValue: inputValue,
      setInputValue: setInputValue,
      tokenTypeDefinition: tokenTypeDefinition,
      shouldShowCustomValueInput: shouldShowCustomValueInput,
      selectValue: selectValue,
      onSelectChange: onSelectChange,
      SelectColorTokenItem: SelectColorTokenItem
    });
  }
  return /*#__PURE__*/React__default["default"].createElement(Root, {
    isCustom: shouldShowCustomValueInput
  }, /*#__PURE__*/React__default["default"].createElement(Select.Select, {
    value: selectValue,
    onChange: onSelectChange
  }, isMixedFieldValue(input.value) && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    value: MIXED_VALUE,
    isDisabled: true
  }, "Mixed"), /*#__PURE__*/React__default["default"].createElement(Select.SelectSeparator, null)), selectValue === CUSTOM_OPTION_VALUE && !allowCustom && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    value: CUSTOM_OPTION_VALUE,
    isDisabled: true
  }, "Custom"), /*#__PURE__*/React__default["default"].createElement(Select.SelectSeparator, null)), /*#__PURE__*/React__default["default"].createElement(React.Fragment, null, options.map(o => {
    return /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
      key: o.id,
      value: o.id
    }, o.label);
  }), allowCustom && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Select.SelectSeparator, null), /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    value: CUSTOM_OPTION_VALUE
  }, "Custom")))), customInputElement);
}
function getFontTokenLabel(name, token, editorContext) {
  const filledResponsiveFontValue = easyblocksCore.responsiveValueFill(token.value, editorContext.devices, easyblocksCore.getDevicesWidths(editorContext.devices));
  const currentDeviceFontValue = easyblocksCore.responsiveValueForceGet(filledResponsiveFontValue, editorContext.breakpointIndex);
  if (isValidFontTokenValue(currentDeviceFontValue)) {
    return `${token.label ?? name} (${stripPxUnit(currentDeviceFontValue.fontSize)}/${stripPxUnit(currentDeviceFontValue.lineHeight)})`;
  }
  return token.label ?? name;
}
function stripPxUnit(value) {
  if (typeof value === "number") {
    return value;
  }
  return value.replace(new RegExp("px"), "");
}
function isValidFontTokenValue(value) {
  return typeof value === "object" && value !== null && "fontSize" in value && "lineHeight" in value;
}
const Root = styled.styled.div.withConfig({
  displayName: "TokenFieldPlugin__Root",
  componentId: "sc-1hbwipe-0"
})(["display:flex;flex-direction:column;align-items:flex-end;", ""], ({
  isCustom
}) => isCustom && {
  width: "100%"
});
const TokenFieldPlugin = {
  name: "token",
  type: "token",
  Component: wrapFieldsWithMeta(TokenFieldComponent)
};
const SelectColorTokenItem = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    value: props.value,
    isDisabled: props.isDisabled,
    ref: ref
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "6px"
    }
  }, /*#__PURE__*/React__default["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "15",
    height: "16",
    viewBox: "0 0 15 16",
    fill: "none"
  }, /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: "7.28931",
    cy: "8.00024",
    r: "6.78931",
    fill: props.previewColor ?? "#fff",
    stroke: easyblocksDesignSystem.Colors.black100
  })), /*#__PURE__*/React__default["default"].createElement("span", null, props.children)));
});
SelectColorTokenItem.displayName = "SelectColorTokenItem";

const RICH_TEXT_PART_CONFIG_PATH_REGEXP = /\.elements\.[a-z(\-_A-Z)?]+\.\d+(\.elements\.\d+){2,3}(\.\{\d+,\d+\})?$/;
function isConfigPathRichTextPart(configPath) {
  return RICH_TEXT_PART_CONFIG_PATH_REGEXP.test(configPath);
}

function last(collection) {
  return collection[collection.length - 1];
}

/**
 *
 * @param collection Array of values
 * @param mapper Optional callback function that will be invoked for each item of given array to map it into comparable string
 */
function getUniqueValues(collection, mapper) {
  if (mapper) {
    const uniqueValues = new Set();
    const uniqueItems = [];
    collection.forEach((item, index) => {
      const mappedItem = mapper(item, index);
      if (!uniqueValues.has(mappedItem)) {
        uniqueValues.add(mappedItem);
        uniqueItems.push(item);
      }
    });
    return uniqueItems;
  }
  return Array.from(new Set(collection));
}

function mergeCommonFields({
  fields
}) {
  const mergedCommonFields = [];
  const fieldsGroupedByProperty = groupFieldsByPropertyName(fields.flat());
  for (const currentFields of Object.values(fieldsGroupedByProperty)) {
    if (currentFields.length < fields.length) {
      continue;
    }

    /**
     * Some fields can be hidden depending on the context of usage
     * ex. margin bottom is not applicable to the last element in stack
     */
    const visibleFields = currentFields.filter(field => {
      return !field.hidden;
    });
    if (visibleFields.length === 0) {
      continue;
    }
    const fieldDefinitionIds = visibleFields.map(field => getFieldSchemaWithDefinition(field).definition.id);

    /**
     * All fields for given property have to be defined within the same schema, because ex.
     * field can have the same prop name in schema A, but different meaning in schema B
     */
    const uniqueDefinitionIds = getUniqueValues(fieldDefinitionIds);

    // It's common when interacting with $richText to pass fields of parent or ancestor down to @easyblocks/rich-text-part.
    // Verify if the all unique ids aren't fields of $richText components.
    if (uniqueDefinitionIds.length > 1 && !uniqueDefinitionIds.every(id => id.startsWith("@easyblocks/rich-text"))) {
      continue;
    }
    const firstVisibleField = visibleFields[0];
    mergedCommonFields.push({
      ...firstVisibleField,
      name: visibleFields.length === 1 ? firstVisibleField.name : getUniqueValues(visibleFields.flatMap(field => field.name))
    });
  }
  return mergedCommonFields;
}
function groupFieldsByPropertyName(fields) {
  return fields.reduce((repeatedFields, field) => {
    const currentFieldPropertyName = getPropertyName(field.schemaProp.prop);
    const fields = repeatedFields[currentFieldPropertyName];
    repeatedFields[currentFieldPropertyName] = fields !== undefined ? [...fields, field] : [field];
    return repeatedFields;
  }, {});
}
function getPropertyName(fieldName) {
  const fieldNameParts = fieldName.split(".");
  let lastPart = last(fieldNameParts);

  // If property name starts with `$` sign it's a special property of fake field.
  if (lastPart.startsWith("$")) {
    lastPart = lastPart.slice(1);
  }
  if (fieldNameParts[0] === "$previous") {
    return `${fieldNameParts[0]}.${lastPart}`;
  }
  return lastPart;
}
function getFieldSchemaWithDefinition(field) {
  return field.schemaProp;
}

const BlockField = ({
  field,
  input,
  isLabelHidden
}) => {
  const {
    isOpen,
    tooltipProps,
    triggerProps,
    arrowProps
  } = useTooltip();
  const [isSubcomponentPanelExpanded, setIsSubcomponentPanelExpanded] = React__default["default"].useState(false);
  const editorContext = useEditorContext();
  const {
    actions
  } = editorContext;
  const {
    openComponentPicker
  } = actions;
  const isMixed = isMixedFieldValue(input.value);
  const config = (() => {
    if (isMixed) {
      return null;
    }

    // @ts-expect-error We can safely ignore the error since we know the value is not mixed
    return input.value[0] || null;
  })();
  const normalizedName = toArray(field.name);
  // Let's create paths
  const paths = normalizedName.map(x => `${x}.0`);
  const componentPickerPath = normalizedName[0];
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, !isLabelHidden && /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      padding: "4px 16px",
      minHeight: "28px",
      cursor: "default"
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends__default["default"]({
    style: {
      overflow: "hidden"
    }
  }, triggerProps), /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, field.label || field.name)), isOpen && /*#__PURE__*/React__default["default"].createElement(Tooltip, tooltipProps, /*#__PURE__*/React__default["default"].createElement(TooltipArrow, arrowProps), /*#__PURE__*/React__default["default"].createElement(TooltipBody, null, field.label || field.name))), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "4px 16px"
    }
  }, config !== null && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      flex: "1 1 auto",
      minWidth: 0
    }
  }, /*#__PURE__*/React__default["default"].createElement(SubComponentPanelButton, {
    paths: paths,
    isExpanded: isSubcomponentPanelExpanded,
    onExpand: () => {
      setIsSubcomponentPanelExpanded(true);
    },
    onCollapse: () => {
      setIsSubcomponentPanelExpanded(false);
    }
  })), !field.schemaProp.required && /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      flex: "0 0 auto",
      minWidth: 0
    }
  }, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    showTooltip: false,
    onClick: () => {
      if (editorContext.focussedField.some(isConfigPathRichTextPart)) {
        input.onChange([]);
      } else {
        actions.removeItems(paths);
      }
    },
    icon: icons.Icons.Remove,
    "aria-label": "Remove"
  }))), config === null && (isMixed ? /*#__PURE__*/React__default["default"].createElement(ThumbnailButton.ThumbnailButton, {
    label: "Mixed",
    disabled: true
  }) : /*#__PURE__*/React__default["default"].createElement(AddButton$1, {
    onAdd: () => {
      openComponentPicker({
        path: componentPickerPath
      }).then(newConfig => {
        if (newConfig) {
          if (editorContext.focussedField.some(isConfigPathRichTextPart)) {
            input.onChange([newConfig]);
          } else {
            actions.replaceItems(paths, newConfig);
          }
          setIsSubcomponentPanelExpanded(true);
        }
      });
    }
  }))));
};
function AddButton$1({
  onAdd
}) {
  const {
    t
  } = useTranslation();
  return /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    showTooltip: false,
    style: {
      width: "100%",
      paddingLeft: "0"
    },
    onClick: onAdd,
    height: "32px",
    noPadding: true
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      width: "100%"
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "grid",
      placeItems: "center",
      width: "32px",
      height: "32px",
      marginLeft: "-1px",
      border: `1px dashed ${easyblocksDesignSystem.Colors.black20}`,
      borderRadius: "2px"
    }
  }, /*#__PURE__*/React__default["default"].createElement(icons.Icons.Add, {
    size: 16
  })), t("add")));
}
const SubComponentPanelButton = ({
  paths,
  isExpanded,
  onExpand,
  onCollapse
}) => {
  const sidebarPanelsRoot = document.getElementById("sidebar-panels-root");
  const editorContext = useEditorContext();
  const externalData = useEditorExternalData();
  const entryAfterAuto = useConfigAfterAuto();
  const config = dotNotationGet(editorContext.form.values, paths[0]);
  const componentDefinition = _internals.findComponentDefinition(config, editorContext);
  const label = componentDefinition?.label ?? componentDefinition?.id ?? `Can’t find custom component with id: ${config._component} in your project. Please contact your developers to resolve this issue.`;
  const showError = componentDefinition === undefined;
  const sidebarPreview = componentDefinition ? getSidebarPreview(componentDefinition, dotNotationGet(entryAfterAuto, paths[0]), externalData, editorContext) : undefined;
  const defaultThumbnail = componentDefinition?.thumbnail ? {
    type: "image",
    src: componentDefinition.thumbnail
  } : undefined;
  const thumbnail = sidebarPreview?.thumbnail ?? defaultThumbnail;
  const description = sidebarPreview?.description;
  return showError ? /*#__PURE__*/React__default["default"].createElement(Error$2, null, label) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(ThumbnailButton.ThumbnailButton, {
    onClick: onExpand,
    label: label,
    description: description,
    thumbnail: thumbnail
  }), sidebarPanelsRoot && /*#__PURE__*/ReactDOM__default["default"].createPortal(/*#__PURE__*/React__default["default"].createElement(Panel, {
    isExpanded: isExpanded,
    onCollapse: onCollapse,
    paths: paths
  }), sidebarPanelsRoot));
};
function getSidebarPreview(componentDefinition, entryAfterAuto, externalData, editorContext) {
  const previewValues = Object.fromEntries(componentDefinition.schema.map(s => {
    const value = easyblocksCore.responsiveValueForceGet(entryAfterAuto[s.prop], editorContext.breakpointIndex);
    if (_internals.isExternalSchemaProp(s, editorContext.types)) {
      const externalDataValue = easyblocksCore.resolveExternalValue(value, entryAfterAuto._id, s, externalData);
      return [s.prop, externalDataValue];
    }
    if (s.type === "text") {
      return [s.prop, easyblocksCore.resolveLocalisedValue(value.value, editorContext)?.value];
    }
    return [s.prop, value];
  }));
  return componentDefinition.preview?.({
    values: previewValues,
    externalData
  });
}
const Error$2 = styled.styled.div.withConfig({
  displayName: "BlockFieldPlugin__Error",
  componentId: "sc-5mryxt-0"
})(["", " padding:7px 6px 7px;color:hsl(0deg 0% 50% / 0.8);white-space:normal;background:hsl(0deg 100% 50% / 0.2);margin-right:10px;border-radius:2px;"], easyblocksDesignSystem.Fonts.body);
const PanelContext = /*#__PURE__*/React__default["default"].createContext(undefined);
function Panel({
  onCollapse,
  isExpanded,
  paths
}) {
  const editorContext = useEditorContext();
  const fields = React__default["default"].useMemo(() => {
    if (!isExpanded) {
      return [];
    }
    const fieldsPerName = toArray(paths).map(path => {
      return buildTinaFields(path, editorContext);
    });
    const mergedFields = mergeCommonFields({
      fields: fieldsPerName
    });
    return mergedFields;
  }, [isExpanded, paths]);
  return /*#__PURE__*/React__default["default"].createElement(PanelContext.Provider, {
    value: {
      onClose: onCollapse
    }
  }, /*#__PURE__*/React__default["default"].createElement(GroupPanel, {
    isExpanded: isExpanded
  }, /*#__PURE__*/React__default["default"].createElement(PanelBody, null, isExpanded ? /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement(FieldsBuilder, {
    form: editorContext.form,
    fields: fields
  }), /*#__PURE__*/React__default["default"].createElement(SidebarFooter, {
    paths: paths
  })) : null)));
}
const BlockFieldPlugin = {
  __type: "field",
  name: "block",
  Component: BlockField
};
const PanelBody = styled.styled.div.withConfig({
  displayName: "BlockFieldPlugin__PanelBody",
  componentId: "sc-5mryxt-1"
})(["background:white;position:relative;height:100%;overflow-y:auto;"]);
const GroupPanelKeyframes = styled.keyframes`
  0% {
    transform: translate3d( 100%, 0, 0 );
  }
  100% {
    transform: translate3d( 0, 0, 0 );
  }
`;
const GroupPanel = styled.styled.div.withConfig({
  displayName: "BlockFieldPlugin__GroupPanel",
  componentId: "sc-5mryxt-2"
})(["position:absolute;width:100%;top:0;bottom:0;left:0;overflow:hidden;pointer-events:", ";> *{", ";", ";}"], p => p.isExpanded ? "all" : "none", p => p.isExpanded && styled.css`
        animation-name: ${GroupPanelKeyframes};
        animation-duration: 150ms;
        animation-delay: 0ms;
        animation-iteration-count: 1;
        animation-timing-function: ease-out;
        animation-fill-mode: backwards;
      `, p => !p.isExpanded && styled.css`
        transition: transform 150ms ease-out;
        transform: translate3d(100%, 0, 0);
      `);

const HorizontalLine$3 = styled__default["default"].div.withConfig({
  displayName: "IdentityFieldPlugin__HorizontalLine",
  componentId: "sc-ayv92b-0"
})(["height:1px;margin-top:-1px;background-color:", ";"], easyblocksDesignSystem.Colors.black10);
const IdentityFieldWrapper = styled__default["default"].div.withConfig({
  displayName: "IdentityFieldPlugin__IdentityFieldWrapper",
  componentId: "sc-ayv92b-1"
})(["display:flex;gap:8px;min-height:28px;padding:10px;background:", ";"], easyblocksDesignSystem.Colors.white);
const IdentityFieldContainer = styled__default["default"].div.withConfig({
  displayName: "IdentityFieldPlugin__IdentityFieldContainer",
  componentId: "sc-ayv92b-2"
})([""]);
function IdentityField({
  input,
  field
}) {
  const editorContext = useEditorContext();
  const panelContext = React.useContext(PanelContext);
  const {
    t
  } = useTranslation();
  const isMixed = isMixedFieldValue(input.value);
  const config = isMixed ? null : input.value;
  if (config == null) {
    return null;
  }
  const componentDefinition = _internals.findComponentDefinitionById(config._component, editorContext);
  const configPaths = toArray(field.name);
  const {
    parent
  } = _internals.parsePath(configPaths[0], editorContext.form);
  const isWithinNestedPanel = panelContext !== undefined;
  const parentComponentDefinition = parent ? _internals.findComponentDefinitionById(parent.templateId, editorContext) : undefined;
  const parentSchemaProp = parentComponentDefinition?.schema.find(schemaProp => schemaProp.prop === parent.fieldName);
  const isNonRemovable = componentDefinition?.id.startsWith("@easyblocks/rich-text") && componentDefinition.id !== "@easyblocks/rich-text" || (parentSchemaProp ? parentSchemaProp.type === "component" && parentSchemaProp.required : true);
  const isNonChangable = componentDefinition?.id === "@easyblocks/rich-text-part" || componentDefinition?.id === editorContext.rootComponent.id;
  function handleChangeComponentType() {
    if (isNonChangable) {
      return;
    }
    if (!parent) {
      return;
    }
    const componentPickerPath = parent.path + "." + parent.fieldName;
    editorContext.actions.openComponentPicker({
      path: componentPickerPath
    }).then(selectedConfig => {
      if (!selectedConfig) {
        return;
      }
      editorContext.actions.replaceItems(configPaths, selectedConfig);
    });
  }
  const titleContent = /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "2px"
    }
  }, /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    style: {
      lineHeight: "14px",
      fontWeight: "700"
    }
  }, componentDefinition?.label ?? componentDefinition?.id), !isNonChangable && /*#__PURE__*/React__default["default"].createElement(icons.Icons.ChevronDown, {
    size: 16
  }));
  return /*#__PURE__*/React__default["default"].createElement(IdentityFieldContainer, null, /*#__PURE__*/React__default["default"].createElement(IdentityFieldWrapper, null, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      flex: "1 0"
    }
  }, isWithinNestedPanel && /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.ChevronLeft,
    onClick: () => {
      panelContext.onClose();
    },
    style: {
      marginRight: "auto"
    }
  }), isNonChangable && /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      padding: "7px 6px"
    }
  }, titleContent), !isNonChangable && /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    showTooltip: false,
    onClick: handleChangeComponentType
  }, titleContent), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    "aria-label": t("delete"),
    icon: icons.Icons.Remove,
    hideLabel: true,
    showTooltip: false,
    onClick: () => {
      editorContext.setFocussedField([]);
    },
    style: {
      marginLeft: "auto",
      opacity: isNonRemovable ? 0 : 1,
      pointerEvents: isNonRemovable ? "none" : "auto"
    }
  }, t("delete")))), /*#__PURE__*/React__default["default"].createElement(HorizontalLine$3, null));
}
const IdentityFieldPlugin = {
  name: "identity",
  Component: IdentityField
};

function MissingWidget(props) {
  return /*#__PURE__*/React__default["default"].createElement(Typography.Typography, null, "Missing widget for type \"", props.type, "\".");
}

const ExternalFieldComponent = props => {
  const {
    tinaForm,
    field,
    input,
    input: {
      value
    }
  } = props;
  const editorContext = useEditorContext();
  const externalData = useEditorExternalData();
  const fieldNames = toArray(field.name);
  const isSchemaPropRootParam = field.schemaProp.type.startsWith("param__");
  const ExternalField = !isMixedFieldValue(input.value) ? isSchemaPropRootParam ? getWidgetComponentForRootParam(input.value, editorContext) : getWidgetComponentByType(input.value, field.schemaProp.type, editorContext) : undefined;
  const path = fieldNames[0].split(".").slice(0, -1).join(".");
  const configId = dotNotationGet(editorContext.form.values, path)._id;
  const externalReferenceLocationKey = easyblocksCore.getExternalReferenceLocationKey(configId, field.schemaProp.prop, field.schemaProp.responsive ? editorContext.breakpointIndex : undefined);
  const externalValue = externalReferenceLocationKey ? externalData[externalReferenceLocationKey] : undefined;
  const isExternalValueResolvedCompoundExternalDataValue = !isMixedFieldValue(value) && !easyblocksCore.isEmptyExternalReference(value) && externalValue !== undefined && easyblocksCore.isResolvedCompoundExternalDataValue(externalValue);
  const basicResources = isExternalValueResolvedCompoundExternalDataValue ? getBasicResourcesOfType(externalValue.value, field.schemaProp.type) : [];
  const isCompoundResourceValueSelectVisible = isExternalValueResolvedCompoundExternalDataValue && !easyblocksCore.isIdReferenceToDocumentExternalValue(value.id) && basicResources.length > 1;
  React.useLayoutEffect(() => {
    if (isExternalValueResolvedCompoundExternalDataValue && basicResources.length === 1 && !value.key) {
      // We perform form change manually to avoid storing this change in editor's history
      editorContext.form.change(fieldNames[0], {
        ...value,
        key: basicResources[0].key
      });
    }
  });
  return /*#__PURE__*/React__default["default"].createElement(FieldMetaWrapper, _extends__default["default"]({}, props, {
    form: tinaForm,
    layout: "column"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      width: "100%"
    }
  }, isMixedFieldValue(value) ? "Mixed" : /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "8px"
    }
  }, ExternalField ? /*#__PURE__*/React__default["default"].createElement(ExternalField, {
    id: value.id,
    resourceKey: "key" in value ? value.key : undefined,
    onChange: (newId, newKey) => {
      const newValue = {
        id: newId,
        widgetId: value.widgetId
      };
      if (newKey && newValue.id !== null) {
        newValue.key = newKey;
      }
      input.onChange(newValue);
    },
    path: fieldNames[0],
    params: field.schemaProp.params
  }) : /*#__PURE__*/React__default["default"].createElement(MissingWidget, {
    type: field.schemaProp.type
  }), isCompoundResourceValueSelectVisible && /*#__PURE__*/React__default["default"].createElement(CompoundResourceValueSelect, {
    options: basicResources.map(r => ({
      id: externalReferenceLocationKey,
      key: r.key,
      label: r.label ?? r.key
    })),
    resource: {
      id: externalReferenceLocationKey,
      key: value.key
    },
    onResourceKeyChange: (_, key) => {
      input.onChange({
        ...value,
        key
      });
    }
  }))));
};
const ExternalFieldPlugin = {
  name: "external",
  Component: ExternalFieldComponent
};
function getWidgetComponentByType(externalReference, type, editorContext) {
  return editorContext.types[type].widgets.find(w => w.id === externalReference.widgetId)?.component;
}
function getWidgetComponentForRootParam(externalReference, editorContext) {
  return Object.values(editorContext.types).filter(t => t.type === "external").flatMap(t => t.widgets).find(w => w.id === externalReference.widgetId)?.component;
}
function getBasicResourcesOfType(compoundResourceValues, type) {
  return Object.entries(compoundResourceValues).filter(([, r]) => r.type === type).map(([key, r]) => {
    return {
      key,
      ...r
    };
  });
}
function CompoundResourceValueSelect(props) {
  return /*#__PURE__*/React__default["default"].createElement(Select.Select, {
    onChange: value => {
      const selectedOption = JSON.parse(value);
      props.onResourceKeyChange(selectedOption.id, selectedOption.key);
    },
    value: props.resource.id !== null && props.resource.key !== undefined ? JSON.stringify({
      id: props.resource.id,
      key: props.resource.key
    }) : "",
    placeholder: "Select source..."
  }, props.options.map(r => {
    return /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
      key: `${r.id}.${r.key}`,
      value: JSON.stringify({
        id: r.id,
        key: r.key
      })
    }, r.label);
  }));
}

function getSavedValue(value, previousValue, editorContext) {
  const breakpointIndex = editorContext.breakpointIndex;
  if (typeof value === "string" && value.startsWith("##")) ;

  // Responsiveness is not enabled for this field
  if (!easyblocksCore.isTrulyResponsiveValue(previousValue)) {
    if (value === undefined || value === null) {
      return null;
    }
    return value;
  }
  const result = {
    ...previousValue
  };
  result[breakpointIndex] = value;
  return result;
}
function responsiveFieldController(config) {
  const {
    field,
    formValues,
    onChange,
    editorContext,
    valuesAfterAuto
  } = config;
  function originalFormat(value, fieldName) {
    return field.format?.(value, fieldName, field) ?? value;
  }
  function originalParse(value, fieldName) {
    return field.parse?.(value, fieldName, field) ?? value;
  }
  const normalizedFieldName = toArray(field.name);
  const fieldValues = normalizedFieldName.map(fieldName => dotNotationGet(formValues, fieldName));
  const isResponsive = fieldValues.every(fieldValue => easyblocksCore.isTrulyResponsiveValue(fieldValue));
  const isSet = isResponsive && fieldValues.every(fieldValue => fieldValue[editorContext.breakpointIndex] !== undefined);
  const format = (value, name) => {
    const valueAfterFormat = originalFormat(value, name);
    const displayedValue = (easyblocksCore.isTrulyResponsiveValue(valueAfterFormat) ? valueAfterFormat[editorContext.breakpointIndex] : valueAfterFormat) ?? null;
    return displayedValue;
  };
  const parse = (value, name) => {
    if (value === null) {
      throw new Error("parse in ResponsiveController has null value which should be impossible (null values should disappear once other value is picked!");
    }
    const fieldValue = originalFormat(dotNotationGet(formValues, name), name);
    const savedValue = getSavedValue(value, fieldValue, editorContext);
    return originalParse(savedValue, name);
  };
  const reset = () => {
    if (!isResponsive) {
      throw new Error("should never happen");
    }
    const nextValues = normalizedFieldName.map(fieldName => {
      const previousValue = originalFormat(dotNotationGet(formValues, fieldName), fieldName);
      const newValue = {
        ...previousValue
      };
      delete newValue[editorContext.breakpointIndex];
      if (Object.keys(newValue).length <= 1) {
        return field.defaultValue;
      }
      return originalParse(newValue, fieldName);
    });
    onChange(nextValues);
  };
  const toggleOffAuto = () => {
    const currentBreakpointValues = fieldValues.map(fieldValue => fieldValue[editorContext.breakpointIndex]);
    let areAllFieldValuesAuto = true;
    let isAnyFieldValueAuto = false;
    currentBreakpointValues.forEach(value => {
      if (value === undefined) {
        if (!isAnyFieldValueAuto) {
          isAnyFieldValueAuto = true;
        }
      } else {
        if (areAllFieldValuesAuto) {
          areAllFieldValuesAuto = false;
        }
      }
    });
    const newFieldsValues = normalizedFieldName.map(fieldName => {
      const fieldValue = dotNotationGet(formValues, fieldName);
      const nextFieldValue = areAllFieldValuesAuto ? dotNotationGet(valuesAfterAuto, normalizedFieldName[0]) : isAnyFieldValueAuto ? fieldValues.find(value => value[editorContext.breakpointIndex] !== undefined) : fieldValue;
      const newFieldValue = {
        ...fieldValue,
        [editorContext.breakpointIndex]: easyblocksCore.responsiveValueForceGet(
        // next field comes from auto, so value is defined
        nextFieldValue, editorContext.breakpointIndex)
      };
      return newFieldValue;
    });
    onChange(newFieldsValues);
  };
  const valueField = {
    ...field,
    component: field.subComponent,
    format,
    parse
  };
  return {
    field: valueField,
    isResponsive,
    isSet,
    reset,
    toggleOffAuto
  };
}

const ResponsiveField = props => {
  const {
    tinaForm,
    field,
    input
  } = props;
  const editorContext = useEditorContext();
  const configAfterAuto = useConfigAfterAuto();
  const normalizedFieldName = toArray(field.name);
  const fieldValues = normalizedFieldName.map(fieldName => dotNotationGet(configAfterAuto, fieldName));
  const scalarFieldValues = fieldValues.map(fieldValue => {
    return easyblocksCore.responsiveValueForceGet(
    // value from auto, so it's safe
    fieldValue, editorContext.breakpointIndex);
  });
  const uniqueValues = getUniqueValues(scalarFieldValues, value => typeof value === "object" ? JSON.stringify(value) : value);
  const isMixedValue = uniqueValues.length > 1;
  const value = isMixedValue ? MIXED_VALUE : uniqueValues[0];
  const controller = responsiveFieldController({
    field,
    onChange: newValues => {
      input.onChange(...newValues);
    },
    formValues: tinaForm.values,
    editorContext,
    valuesAfterAuto: configAfterAuto
  });
  const isValueDifferentFromMainBreakpoint = controller.isSet && editorContext.breakpointIndex !== editorContext.mainBreakpointIndex;
  const isFieldVisible = !controller.isResponsive || controller.isSet || editorContext.breakpointIndex === editorContext.mainBreakpointIndex;
  const uniqueFieldValues = getUniqueValues(scalarFieldValues);
  const autoLabelChildren = uniqueFieldValues.length > 1 && uniqueFieldValues.includes(undefined) ? "Mixed" : getAutoLabelButtonLabel(value);
  const isExternalField = field.subComponent === "external";
  const {
    isOpen,
    arrowProps,
    tooltipProps,
    triggerProps
  } = useTooltip({
    isDisabled: !isValueDifferentFromMainBreakpoint,
    onClick: () => {
      controller.reset();
    }
  });
  return /*#__PURE__*/React__default["default"].createElement(FieldMetaWrapper, _extends__default["default"]({}, props, {
    layout: isExternalField ? "column" : "row",
    renderLabel: isValueDifferentFromMainBreakpoint ? ({
      label
    }) => /*#__PURE__*/React__default["default"].createElement(ResetButton, _extends__default["default"]({
      "aria-label": "Revert to auto"
    }, triggerProps), /*#__PURE__*/React__default["default"].createElement(icons.Icons.Reset, null), /*#__PURE__*/React__default["default"].createElement(ResetButtonLabel, null, label), isOpen && /*#__PURE__*/React__default["default"].createElement(Tooltip, tooltipProps, /*#__PURE__*/React__default["default"].createElement(TooltipArrow, arrowProps), /*#__PURE__*/React__default["default"].createElement(TooltipBody, null, "Revert to auto"))) : undefined
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      width: "100%"
    }
  }, isFieldVisible ? /*#__PURE__*/React__default["default"].createElement(FieldBuilder, {
    form: tinaForm,
    field: controller.field,
    noWrap: true
  }) : /*#__PURE__*/React__default["default"].createElement(AutoLabel, {
    align: isExternalField ? "left" : "right",
    onClick: () => {
      controller.toggleOffAuto();
    }
  }, autoLabelChildren)));
};
const ResponsiveFieldPlugin = {
  name: "responsive2",
  Component: ResponsiveField
};
const AutoLabel = styled.styled.div.withConfig({
  displayName: "ResponsiveFieldPlugin__AutoLabel",
  componentId: "sc-1m7fdh0-0"
})(["", ";color:", ";text-align:", ";&:hover{color:black;cursor:pointer;text-decoration:underline;}"], easyblocksDesignSystem.Fonts.body, easyblocksDesignSystem.Colors.black40, props => props.align);
const ResetButton = styled.styled.button.withConfig({
  displayName: "ResponsiveFieldPlugin__ResetButton",
  componentId: "sc-1m7fdh0-1"
})(["display:flex;align-items:center;gap:4px;background-color:transparent;border:0;padding:0;color:", ";cursor:pointer;"], easyblocksDesignSystem.Colors.purple);
const ResetButtonLabel = styled.styled.span.withConfig({
  displayName: "ResponsiveFieldPlugin__ResetButtonLabel",
  componentId: "sc-1m7fdh0-2"
})(["", ";line-height:16px;"], easyblocksDesignSystem.Fonts.body);
function getAutoLabelButtonLabel(value) {
  if (value === MIXED_VALUE) {
    return "auto: Mixed";
  }

  /**
   * This piece of code is crap
   */
  if (typeof value === "object") {
    if (value.tokenId !== undefined && value.value !== undefined) {
      const refNameParts = value.tokenId.split(".");
      return `auto: ${refNameParts[refNameParts.length - 1]}`;
    } else if (value.value !== undefined && value.id === undefined) {
      // just value field -> token
      switch (typeof value.value) {
        case "number":
          {
            return `auto: ${Math.round(value.value * 100) / 100}`;
          }
        case "object":
          {
            return "auto: Custom";
          }
        default:
          {
            return `auto: ${value.value}`;
          }
      }
    }
    return "auto";
  }
  if (typeof value === "boolean") {
    return `auto: ${JSON.stringify(value)}`;
  }
  return `auto: ${value}`;
}

function transformStrokeAndFill(node) {
  const fill = node.getAttribute("fill");
  const stroke = node.getAttribute("stroke");
  if (fill && fill !== "none") {
    node.setAttribute("fill", "currentColor");
  }
  if (stroke && stroke !== "none") {
    node.setAttribute("stroke", "currentColor");
  }
  Array.from(node.children).forEach(child => transformStrokeAndFill(child));
}
const SVGPicker = wrapFieldsWithMeta(({
  input,
  meta,
  field
}) => {
  const svgString = input.value.value;
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    function readFileAsString() {
      // @ts-ignore
      const files = this.files;
      if (files.length === 0) {
        return;
      }
      const reader = new FileReader();
      reader.onload = function (event) {
        // @ts-ignore to explore
        const trimmed = event.target?.result.trim();
        const emptyDiv = document.createElement("div");
        emptyDiv.innerHTML = trimmed;
        const svg = emptyDiv.children[0];
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.setAttribute("style", "position: absolute; width: 100%;height: 100%;");
        transformStrokeAndFill(svg);
        if (svg.tagName.toLowerCase() !== "svg") {
          alert("incorrect file");
          return;
        }
        input.onChange({
          value: emptyDiv.innerHTML
        });
      };
      reader.readAsText(files[0]);
    }
    inputRef.current.addEventListener("change", readFileAsString);
    return () => {
      inputRef.current.removeEventListener("change", readFileAsString);
    };
  }, []);
  return /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      width: 24,
      height: 24,
      position: "relative",
      color: "black",
      marginBottom: 16
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    dangerouslySetInnerHTML: {
      __html: svgString
    }
  })), /*#__PURE__*/React__default["default"].createElement("input", {
    type: "file",
    id: "upload",
    accept: ".svg",
    ref: inputRef
  }));
});
const SVGPickerFieldPlugin = {
  __type: "field",
  name: "icon",
  Component: SVGPicker
};

const Slider = wrapFieldsWithMeta(({
  input,
  field
}) => {
  return /*#__PURE__*/React__default["default"].createElement(Slider$1.RangeSlider, _extends__default["default"]({}, input, {
    max: field.max,
    min: field.min,
    step: field.step
  }));
});
const SliderFieldPlugin = {
  __type: "field",
  name: "slider",
  Component: Slider
};

function useInlineTypes() {
  const editorContext = useEditorContext();
  const tokenTypes = Object.fromEntries(Object.entries(editorContext.types).filter(typeDefinitionEntry => {
    return typeDefinitionEntry[1].type === "inline";
  }));
  return tokenTypes;
}
const LocalFieldPlugin = {
  name: "local",
  Component: wrapFieldsWithMeta(function LocalField({
    field,
    input
  }) {
    const inlineTypes = useInlineTypes();
    const inlineTypeDefinition = inlineTypes[field.schemaProp.type];
    const WidgetComponent = inlineTypeDefinition?.widget.component;
    if (!WidgetComponent) {
      return /*#__PURE__*/React__default["default"].createElement(MissingWidget, {
        type: field.schemaProp.type
      });
    }
    return /*#__PURE__*/React__default["default"].createElement(WidgetComponent, {
      value: input.value.value,
      onChange: value => {
        input.onChange({
          value,
          widgetId: input.value.widgetId
        });
      },
      params: "params" in field.schemaProp ? field.schemaProp.params : undefined
    });
  })
};

const StyledRadioItem = styled.styled(RadixRadioGroup__namespace.Item).withConfig({
  displayName: "PositionPickerInput__StyledRadioItem",
  componentId: "sc-1uvtpi7-0"
})(["all:unset;position:relative;display:flex;justify-content:", ";align-items:", ";box-sizing:border-box;width:20px;height:20px;padding:8px;&:hover > div{opacity:", ";}"], props => horizontalPositionToFlexJustifyContentValue(props.horizontal), props => verticalPositionToFlexAlignItemsValue(props.vertical), props => props.p.value === props.position ? 1 : 0.5);
const positions = [{
  label: "Top Left",
  value: "top-left"
}, {
  label: "Top Center",
  value: "top-center"
}, {
  label: "Top Right",
  value: "top-right"
}, {
  label: "Center Left",
  value: "center-left"
}, {
  label: "Center Center",
  value: "center-center"
}, {
  label: "Center Right",
  value: "center-right"
}, {
  label: "Bottom Left",
  value: "bottom-left"
}, {
  label: "Bottom Center",
  value: "bottom-center"
}, {
  label: "Bottom Right",
  value: "bottom-right"
}];
function horizontalPositionToFlexJustifyContentValue(position) {
  switch (position) {
    case "left":
      return "flex-start";
    case "center":
      return "center";
    case "right":
      return "flex-end";
  }
}
function verticalPositionToFlexAlignItemsValue(position) {
  switch (position) {
    case "top":
      return "flex-start";
    case "center":
      return "center";
    case "bottom":
      return "flex-end";
  }
}
function PositionPickerInput({
  position,
  onPositionChange
}) {
  return /*#__PURE__*/React__default["default"].createElement(RadixRadioGroup__namespace.Root, {
    value: position,
    onValueChange: newPosition => {
      onPositionChange(newPosition);
    },
    style: {
      display: "grid",
      gridTemplateRows: "repeat(3, 1fr)",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "0",
      borderRadius: "2px",
      border: `1px solid ${easyblocksDesignSystem.Colors.black10}`
    }
  }, positions.map(p => {
    const [vertical, horizontal] = p.value.split("-");
    return /*#__PURE__*/React__default["default"].createElement(StyledRadioItem, {
      value: p.value,
      key: p.value,
      "aria-label": p.label,
      horizontal: horizontal,
      vertical: vertical,
      p: p,
      position: position
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        width: "2px",
        height: "2px",
        backgroundColor: "#d9d9d9"
      }
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        position: "absolute",
        top: "2px",
        left: "2px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: horizontalPositionToFlexJustifyContentValue(horizontal),
        gap: "2px",
        width: "16px",
        height: "16px",
        opacity: p.value === position ? 1 : 0
      }
    }, /*#__PURE__*/React__default["default"].createElement(PositionIndicator, {
      $size: vertical === "top" ? "full" : "normal"
    }), /*#__PURE__*/React__default["default"].createElement(PositionIndicator, {
      $size: vertical === "center" ? "full" : "normal"
    }), /*#__PURE__*/React__default["default"].createElement(PositionIndicator, {
      $size: vertical === "bottom" ? "full" : "normal"
    })));
  }));
}
const PositionIndicator = styled.styled.div.withConfig({
  displayName: "PositionPickerInput__PositionIndicator",
  componentId: "sc-1uvtpi7-1"
})(["width:", ";height:4px;background-color:#202123;"], p => p.$size === "full" ? "100%" : "75%");

function PositionField(props) {
  return /*#__PURE__*/React__default["default"].createElement(PositionPickerInput, {
    position: props.input.value,
    onPositionChange: position => {
      props.input.onChange(position);
    }
  });
}
const PositionFieldPlugin = {
  name: "position",
  Component: wrapFieldsWithMeta(PositionField)
};

// "any" here is on purpose (although doesn't make sense from TS perspective).
// It suggests that in onChange you can pass event OR any value. It's a bit confusing and should be cleaned up in the future.

function createFieldController({
  field,
  editorContext,
  format = v => v,
  parse = v => v
}) {
  const {
    actions,
    contextParams,
    form,
    locales,
    focussedField
  } = editorContext;
  const normalizedFieldName = toArray(field.name);
  return {
    onChange(mainNewValue, ...extraNewValues) {
      /**
       * There are 2 modes of onChange: single param and multiple params
       *
       * 1. single param mode is when onChange is given ONE value (1 parameter). It means: "apply this value for all selected fields"
       * 2. multiple param mode is when onChange is given more than one value. It means: "apply each value for respective selected field".
       */

      const newValue = extraNewValues.length === 0 ? mainNewValue : [mainNewValue, ...extraNewValues];
      if (!Array.isArray(mainNewValue) && Array.isArray(newValue) && newValue.length !== normalizedFieldName.length) {
        throw new Error("onChange in multiple param mode was given wrong number of values");
      }
      if (focussedField.some(isConfigPathRichTextPart)) {
        // For editor selection we can safely pick a first field name because:
        // * we only can select fields that are children of @easyblocks/rich-text-part
        // * we only can update only single property
        const {
          templateId
        } = _internals.parsePath(normalizedFieldName[0], form);
        invalidateCache(normalizedFieldName[0], editorContext);
        if (templateId === "@easyblocks/rich-text-part") {
          const schemaPropNameToUpdate = last(normalizedFieldName[0].split("."));
          const canvasIframe = document.getElementById("editor-canvas");
          if (canvasIframe === null || canvasIframe.contentWindow === null) {
            throw new Error("No Shopstory canvas");
          }
          if (extraNewValues.length > 0) {
            const parsedValues = newValue.map(value => parse(getValue(value), normalizedFieldName[0], field));
            canvasIframe.contentWindow.postMessage(_internals.richTextChangedEvent({
              prop: schemaPropNameToUpdate,
              schemaProp: field.schemaProp,
              values: parsedValues
            }), "*");
          } else {
            const parsedValue = parse(getValue(newValue), normalizedFieldName[0], field);
            canvasIframe.contentWindow.postMessage(_internals.richTextChangedEvent({
              prop: schemaPropNameToUpdate,
              schemaProp: field.schemaProp,
              values: [parsedValue]
            }), "*");
          }
          return;
        }
      }
      actions.runChange(() => {
        normalizedFieldName.forEach((path, fieldIndex) => {
          const inputValue = Array.isArray(newValue) ? getValue(newValue[fieldIndex]) : getValue(newValue);
          const customTypeDefinition = editorContext.types[field.schemaProp.type];
          if (customTypeDefinition && "validate" in customTypeDefinition && customTypeDefinition.validate && "value" in inputValue && (customTypeDefinition.type === "token" ? !("tokenId" in inputValue) : true)) {
            const isInputValueValid = customTypeDefinition.validate(inputValue.value);
            if (!isInputValueValid) {
              return;
            }
          }
          let parsedValue = parse(inputValue, path, field);

          // If path has locale token [locale] (component-collection-localised) then we must first replace it with correct token
          if (hasLocaleToken(path)) {
            const currentLocaleFieldName = replaceLocaleToken(path, contextParams.locale);
            const currentLocaleValue = dotNotationGet(form.values, currentLocaleFieldName);
            parsedValue = parse(inputValue, currentLocaleFieldName, field);

            // If the path doesn't exist it means that there is no config for path for current locale. It means we must create it!
            if (currentLocaleValue === undefined) {
              const fallbackLocale = easyblocksCore.getFallbackLocaleForLocale(contextParams.locale, locales);
              const fieldNameSegments = path.split(".");
              const localeTokenIndex = fieldNameSegments.indexOf("[locale]");
              const localisedConfigPath = [...fieldNameSegments.slice(0, localeTokenIndex + 1), "0"].join(".");
              const fallbackLocaleFieldName = replaceLocaleToken(localisedConfigPath, fallbackLocale);
              const localeConfigPath = replaceLocaleToken(localisedConfigPath, contextParams.locale);
              form.change(localeConfigPath, _internals.duplicateConfig(dotNotationGet(form.values, fallbackLocaleFieldName), editorContext));
            }
            path = currentLocaleFieldName;
          }
          invalidateCache(path, editorContext);

          // At this point we have correct fieldName and correct parsedValue after all [locale] issues solved

          /**
           * Below we're trying to see whether there is a custom change function for specific EditableComponent
           */

          const split = path.split(".");
          const propName = last(split);

          // TODO: here we can have either a component or component field. parsePath should take this into account!
          const componentPath = split.slice(0, split.length - 1).join(".");
          const {
            templateId
          } = _internals.parsePath(componentPath, editorContext.form);
          const parentDefinition = _internals.findComponentDefinitionById(templateId, editorContext);
          const config = dotNotationGet(editorContext.form.values, componentPath);
          if (parentDefinition && parentDefinition.change) {
            const values = {};
            const closestDefinedValues = {};
            parentDefinition.schema.forEach(schemaProp => {
              const val = config[schemaProp.prop];
              values[schemaProp.prop] = easyblocksCore.isTrulyResponsiveValue(val) ? val[editorContext.breakpointIndex] : val;
              closestDefinedValues[schemaProp.prop] = easyblocksCore.responsiveValueGetDefinedValue(val, editorContext.breakpointIndex, editorContext.devices, easyblocksCore.getDevicesWidths(editorContext.devices));
            });
            const inputValue = easyblocksCore.isTrulyResponsiveValue(parsedValue) ? parsedValue[editorContext.breakpointIndex] : parsedValue;
            const result = parentDefinition.change({
              newValue: inputValue,
              prop: propName,
              values,
              /**
               * IMPORTANT!!!
               *
               * valuesAfterAuto are an approximation for now, they're not real auto values, they just have closest defined values.
               *
               */
              valuesAfterAuto: closestDefinedValues
            }) ?? {
              [propName]: inputValue
            };
            parentDefinition.schema.forEach(schemaProp => {
              if (!result.hasOwnProperty(schemaProp.prop)) {
                return;
              }
              let pathPrefix = `${componentPath}.${schemaProp.prop}`;
              if (pathPrefix[0] === ".") {
                pathPrefix = pathPrefix.substring(1);
              }
              if (easyblocksCore.isTrulyResponsiveValue(config[schemaProp.prop])) {
                form.change(`${pathPrefix}.${editorContext.breakpointIndex}`, result[schemaProp.prop]);
              } else {
                form.change(`${pathPrefix}`, result[schemaProp.prop]);
              }
            });
          } else {
            form.change(path, parsedValue);
          }
        });
      });
    },
    getValue() {
      const fieldValues = normalizedFieldName.map(fieldName => {
        const propName = last(fieldName.split("."));
        if (propName.startsWith("$") && "defaultValue" in field.schemaProp) {
          return field.schemaProp.defaultValue;
        }
        if (hasLocaleToken(fieldName)) {
          const resolvedFieldName = replaceLocaleToken(fieldName, editorContext.contextParams.locale);
          const fieldValue = dotNotationGet(form.values, resolvedFieldName);
          if (fieldValue) {
            return fieldValue;
          }
          const fallbackLocale = easyblocksCore.getFallbackLocaleForLocale(editorContext.contextParams.locale, editorContext.locales);
          const resolvedFieldFallbackName = replaceLocaleToken(fieldName, fallbackLocale);
          const fieldFallbackValue = dotNotationGet(form.values, resolvedFieldFallbackName);
          return fieldFallbackValue;
        }
        return dotNotationGet(form.values, fieldName);
      });
      const uniqueFieldValues = getUniqueValues(fieldValues, fieldValue => {
        const {
          getHash
        } = _internals.getSchemaDefinition(field.schemaProp, editorContext);
        return getHash(fieldValue, editorContext.breakpointIndex, editorContext.devices);
      });
      if (uniqueFieldValues.length > 1) {
        return {
          __mixed__: true
        };
      }
      return format(uniqueFieldValues[0], normalizedFieldName[0], field);
    }
  };
}
function hasLocaleToken(configPath) {
  return configPath.includes("[locale]");
}
function replaceLocaleToken(configPath, locale) {
  const localisedFieldName = configPath.replace("[locale]", locale);
  return localisedFieldName;
}
function getValue(eventOrValue) {
  // Event of course has more properties or methods, but for this case
  // checking only for `currentTarget` is sufficient
  const isEventObject = typeof eventOrValue === "object" && eventOrValue !== null && "currentTarget" in eventOrValue;
  if (isEventObject) {
    if ("checked" in eventOrValue.currentTarget && eventOrValue.currentTarget.type === "checkbox") {
      return eventOrValue.currentTarget.checked;
    }
    return eventOrValue.currentTarget.value;
  } else {
    return eventOrValue;
  }
}
// $richText and @easyblocks/rich-text-part uses a lot of portals to display correct fields within sidebar
// Changing value through portal won't trigger the recompilation of component using that portal.
// When we change any $richText related component we remove cache for that component (if it is $richText)
// and for all of its ancestors.
const richTextCacheInvalidator = (cache, changedPath, context) => {
  const cacheKeysToRemove = [];
  const {
    templateId,
    fieldName,
    parent
  } = _internals.parsePath(changedPath, context.form);
  const isRichTextOrRichTextAncestorComponent = templateId.startsWith("@easyblocks/rich-text") || parent?.templateId.startsWith("@easyblocks/rich-text");
  if (isRichTextOrRichTextAncestorComponent) {
    const richTextPath = templateId === "@easyblocks/rich-text" && fieldName ? changedPath.replace(`.${fieldName}`, "") : _internals.findPathOfFirstAncestorOfType(changedPath, "@easyblocks/rich-text", context.form);
    const richTextConfig = dotNotationGet(context.form.values, richTextPath);
    _internals.traverseComponents(richTextConfig, context, ({
      componentConfig
    }) => {
      if (componentConfig && componentConfig._component.startsWith("@easyblocks/rich-text")) {
        cacheKeysToRemove.push(componentConfig._id);
      }
    });
  }
  return cacheKeysToRemove;
};
const cacheInvalidators = [richTextCacheInvalidator];
function invalidateCache(changedPath, context) {
  const cacheKeysToRemove = new Set(cacheInvalidators.flatMap(invalidator => {
    return invalidator(context.compilationCache, changedPath, context);
  }));
  cacheKeysToRemove.forEach(cacheKey => {
    context.compilationCache.remove(cacheKey);
  });
}

const SelectFrameIcon = () => {
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "120",
    height: "60"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    fill: "#000624",
    fillRule: "evenodd",
    d: "M89.5 50a2.503 2.503 0 0 1-2.5-2.5c0-1.379 1.122-2.5 2.5-2.5s2.5 1.121 2.5 2.5-1.122 2.5-2.5 2.5Zm-30.25-9.87a.501.501 0 0 0-.836.388l.23 6.482H33.95A3.486 3.486 0 0 0 31 44.051V25.949A3.486 3.486 0 0 0 33.95 23h52.1A3.486 3.486 0 0 0 89 25.949v18.102A3.486 3.486 0 0 0 86.05 47H66.798l-7.549-6.87ZM30.5 50a2.503 2.503 0 0 1-2.5-2.5c0-1.379 1.122-2.5 2.5-2.5s2.5 1.121 2.5 2.5-1.122 2.5-2.5 2.5ZM28 22.5c0-1.379 1.122-2.5 2.5-2.5s2.5 1.121 2.5 2.5-1.122 2.5-2.5 2.5a2.503 2.503 0 0 1-2.5-2.5ZM89.5 20c1.378 0 2.5 1.121 2.5 2.5S90.878 25 89.5 25a2.503 2.503 0 0 1-2.5-2.5c0-1.379 1.122-2.5 2.5-2.5Zm.5 24.051V25.949c1.692-.245 3-1.691 3-3.449 0-1.93-1.57-3.5-3.5-3.5-1.759 0-3.204 1.309-3.45 3h-52.1c-.246-1.691-1.69-3-3.45-3-1.93 0-3.5 1.57-3.5 3.5 0 1.758 1.308 3.204 3 3.449v18.102c-1.692.245-3 1.691-3 3.449 0 1.93 1.57 3.5 3.5 3.5 1.76 0 3.204-1.309 3.45-3h24.728l.364 10.209a.499.499 0 0 0 .888.297l3.446-4.264 2.531 5.468a.505.505 0 0 0 .454.29.513.513 0 0 0 .21-.046l2.22-1.027a.5.5 0 0 0 .242-.664L66.5 52.791l5.49.119c.213-.014.397-.121.474-.314a.499.499 0 0 0-.128-.556L67.897 48H86.05c.246 1.691 1.691 3 3.45 3 1.93 0 3.5-1.57 3.5-3.5 0-1.758-1.308-3.204-3-3.449Z"
  }));
};
const EmptyField = () => {
  const {
    t
  } = useTranslation();
  return /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      padding: 16,
      paddingTop: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React__default["default"].createElement(SelectFrameIcon, null), /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    style: {
      whiteSpace: "initial",
      textAlign: "center"
    }
  }, t("editor.sidebar.emptyField")));
};
function shouldFieldBeDisplayed(field) {
  if (field.component === null) return false;
  if (Array.isArray(field.name)) {
    return true;
  }
  if (field.hidden) {
    return false;
  }
  return true;
}
const FIELD_COMPONENTS = [TextFieldPlugin, NumberFieldPlugin, ToggleFieldPlugin, SelectFieldPlugin, RadioGroupFieldPlugin, PositionFieldPlugin, BlockFieldPlugin, SliderFieldPlugin, SVGPickerFieldPlugin, ResponsiveFieldPlugin, ExternalFieldPlugin, TokenFieldPlugin, IdentityFieldPlugin, LocalFieldPlugin];
function FieldBuilder({
  form,
  field,
  noWrap,
  isLabelHidden
}) {
  const editorContext = useEditorContext();
  const {
    t
  } = useTranslation();
  if (!shouldFieldBeDisplayed(field)) {
    return null;
  }
  const fieldComponent = FIELD_COMPONENTS.find(component => component.name === field.component);
  const {
    onChange,
    getValue
  } = createFieldController({
    field,
    editorContext,
    format: field.format ?? fieldComponent?.format,
    parse: field.parse ?? fieldComponent?.parse
  });
  const fieldParsed = React.useMemo(() => {
    let fieldResult = field;
    if (typeof field.label === "string") {
      field.label = t(field.label);
    }
    return fieldResult;
  }, [field]);
  if (fieldComponent) {
    return /*#__PURE__*/React__default["default"].createElement(fieldComponent.Component, {
      // Let's talk about this code
      // This branch of code is created to display single input and label that handles multiple inputs under the hood
      // To make this work, we had to skip usage of `Field` from `Final Form` because it requires a single field object with single name
      // Moreover, since we don't use `Field` anymore we have to pretend that it still exists to make fields works as it was there.
      // In the future, this code should become a part of new component (ex. FieldWrapper)
      // and new controller should be introduced (ex. fieldWrapperController) to have single source of truth about behaviour of responsive field.
      input: {
        value: getValue(),
        onChange
      }
      // MetaFieldWrapper accesses `error` property of this object, it's needed to prevent runtime error
      ,
      meta: {},
      tinaForm: form,
      form: form.finalForm,
      field: fieldParsed,
      noWrap: noWrap,
      isLabelHidden: isLabelHidden
    });
  }
  if (typeof field.component !== "string" && field.component !== null) {
    return /*#__PURE__*/React__default["default"].createElement(field.component, {
      input: {
        value: getValue(),
        onChange
      },
      meta: {},
      tinaForm: form,
      form: form.finalForm,
      field: field,
      noWrap: noWrap,
      isLabelHidden: isLabelHidden
    });
  }
  return /*#__PURE__*/React__default["default"].createElement(FieldMetaWrapper, {
    input: {
      value: getValue(),
      onChange
    },
    field: field,
    layout: "column"
  }, /*#__PURE__*/React__default["default"].createElement(Typography.Typography, null, "Unrecognized field type"));
}

/** Diacritics-insensitive so "mau" finds "Màu". */
const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const SearchBar = styled.styled.div.withConfig({
  displayName: "fields-builder__SearchBar",
  componentId: "sc-ignixa-0"
})(["position:relative;padding:8px 12px;border-bottom:1px solid ", ";input{padding-right:26px;}"], easyblocksDesignSystem.Colors.black10);
const SearchClearButton = styled.styled.button.withConfig({
  displayName: "fields-builder__SearchClearButton",
  componentId: "sc-ignixa-1"
})(["all:unset;box-sizing:border-box;position:absolute;top:8px;bottom:8px;right:14px;display:flex;align-items:center;justify-content:center;width:20px;border-radius:4px;cursor:pointer;color:", ";&:hover{color:", ";}&:focus-visible{box-shadow:0 0 0 2px ", ";}"], easyblocksDesignSystem.Colors.black40, easyblocksDesignSystem.Colors.black700, easyblocksDesignSystem.Colors.blue60);
const tabs = [{
  id: "styles",
  label: "Styles"
}, {
  id: "data",
  label: "Data"
}, {
  id: "animation",
  label: "Animation"
}];

// Underline-style tab bar (flat text buttons sitting on a baseline track).
const TabsBar = styled.styled.div.withConfig({
  displayName: "fields-builder__TabsBar",
  componentId: "sc-ignixa-2"
})(["display:flex;justify-content:space-between;border-bottom:1px solid ", ";"], easyblocksDesignSystem.Colors.black10);

// Active tab: faint Colors.black5 underline + bold/dark text so it stays
// distinguishable even though the underline color is subtle.
const TabButton = styled.styled.button.withConfig({
  displayName: "fields-builder__TabButton",
  componentId: "sc-ignixa-3"
})(["padding:8px 16px;margin-bottom:-1px;border:none;border-bottom:2px solid ", ";background:transparent;cursor:pointer;font-size:12px;font-weight:", ";color:", ";transition:all 0.15s ease;white-space:nowrap;&:hover{color:black;}"], p => p.$active ? easyblocksDesignSystem.Colors.black500 : "transparent", p => p.$active ? "600" : "400", p => p.$active ? "black" : easyblocksDesignSystem.Colors.black40);
const NoData = styled.styled(Typography.Typography).withConfig({
  displayName: "fields-builder__NoData",
  componentId: "sc-ignixa-4"
})(["padding:20px 16px;"]);
const HorizontalLine$2 = styled.styled.div.withConfig({
  displayName: "fields-builder__HorizontalLine",
  componentId: "sc-ignixa-5"
})(["height:1px;margin-top:-1px;background-color:", ";"], easyblocksDesignSystem.Colors.black10);
function FieldsBuilder({
  form,
  fields,
  isEmptyField = false,
  showSearch = false
}) {
  const {
    t
  } = useTranslation();
  const editorContext = useEditorContext();
  const panelContext = React.useContext(PanelContext);
  const [activeTab, setActiveTab] = React.useState("styles");
  const [query, setQuery] = React.useState("");
  const searchInputRef = React.useRef(null);
  const hasTabs = fields.some(f => f.component !== "identity" && f.component !== null);
  const isSearching = showSearch && normalize(query).length > 0;
  const matchesQuery = field => {
    const needle = normalize(query);
    const label = typeof field.label === "string" ? normalize(t(field.label)) : "";
    const group = field.group ? normalize(t(field.group)) : "";
    return label.includes(needle) || group.includes(needle);
  };

  // While searching, ignore the tab split: a property the user is looking for
  // often sits on a tab other than the open one, and finding nothing there
  // would read as "this property does not exist".
  const visibleFields = isSearching ? fields.filter(matchesQuery) : hasTabs ? fields.filter(f => {
    const fieldTab = f.schemaProp?.tab ?? "styles";
    return fieldTab === activeTab;
  }) : fields;
  const grouped = {};
  const ungrouped = [];
  visibleFields.forEach(field => {
    if (!shouldFieldBeDisplayed(field)) {
      return;
    }
    if (field.group) {
      grouped[field.group] = grouped[field.group] || [];
      grouped[field.group].push(field);
    } else {
      if (field.component === "identity") {
        return;
      }
      ungrouped.push(field);
    }
  });
  const horizontalLine = /*#__PURE__*/React__default["default"].createElement(HorizontalLine$2, null);
  const identityField = fields.find(field => field.component === "identity");
  const breakpointIndex = panelContext ? editorContext.breakpointIndex : undefined;
  return /*#__PURE__*/React__default["default"].createElement(FieldsGroup, null, identityField !== undefined && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(FieldBuilder, {
    field: identityField,
    form: form
  }), horizontalLine), showSearch && !isEmptyField && /*#__PURE__*/React__default["default"].createElement(SearchBar, null, /*#__PURE__*/React__default["default"].createElement(Input.Input, {
    ref: searchInputRef,
    controlSize: "full-width",
    value: query,
    placeholder: t("editor.properties.search"),
    onChange: event => setQuery(event.target.value)
  }), query !== "" && /*#__PURE__*/React__default["default"].createElement(SearchClearButton, {
    type: "button",
    "aria-label": t("editor.properties.search.clear"),
    onClick: () => {
      setQuery("");
      // Clearing is a step in the search, not the end of it, so the caret
      // stays where the user was typing.
      searchInputRef.current?.focus();
    }
  }, /*#__PURE__*/React__default["default"].createElement(icons.Icons.Close, {
    size: 14
  }))), hasTabs && !isEmptyField && !isSearching && /*#__PURE__*/React__default["default"].createElement(TabsBar, null, tabs.map(tab => /*#__PURE__*/React__default["default"].createElement(TabButton, {
    key: tab.id,
    $active: activeTab === tab.id,
    onClick: () => setActiveTab(tab.id)
  }, tab.label))), isEmptyField ? /*#__PURE__*/React__default["default"].createElement(EmptyField, null) : null, isSearching && visibleFields.length === 0 && /*#__PURE__*/React__default["default"].createElement(NoData, null, t("editor.properties.noResults")), Object.keys(grouped).map(groupName => /*#__PURE__*/React__default["default"].createElement("div", {
    key: groupName
  }, /*#__PURE__*/React__default["default"].createElement(FieldsGroupLabel, null, groupName), grouped[groupName].map((field, index, fields) => /*#__PURE__*/React__default["default"].createElement(FieldWrapper, {
    key: generateFieldKey(field, breakpointIndex),
    isLast: index === fields.length - 1
  }, /*#__PURE__*/React__default["default"].createElement(FieldBuilder, {
    field: field,
    form: form,
    isLabelHidden: field.schemaProp.isLabelHidden
  }))), horizontalLine)), ungrouped.map((field, index, fields) => /*#__PURE__*/React__default["default"].createElement(FieldWrapper, {
    key: generateFieldKey(field, breakpointIndex),
    isLast: index === fields.length - 1
  }, /*#__PURE__*/React__default["default"].createElement(FieldBuilder, {
    field: field,
    form: form,
    isLabelHidden: field.schemaProp.isLabelHidden
  }))), !Object.keys(grouped).length && !ungrouped.length && !isEmptyField ? /*#__PURE__*/React__default["default"].createElement(NoData, {
    variant: "body"
  }, t("noData"), "!") : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null), !isEmptyField ? horizontalLine : null);
}
function generateFieldKey(field, breakpointIndex) {
  const key = `${toArray(field.name).join("_")}_${field.schemaProp.type}${breakpointIndex ? `_${breakpointIndex}` : ""}`;
  return key;
}
const FieldWrapper = styled.styled.div.withConfig({
  displayName: "fields-builder__FieldWrapper",
  componentId: "sc-ignixa-6"
})(["margin-bottom:", ";"], props => props.isLast ? "8px" : 0);
const FieldsGroupLabel = styled.styled.div.withConfig({
  displayName: "fields-builder__FieldsGroupLabel",
  componentId: "sc-ignixa-7"
})(["display:flex;align-items:center;padding:20px 16px 10px 16px;", ";color:#000;"], easyblocksDesignSystem.Fonts.label);
const FieldsGroup = styled.styled.div.withConfig({
  displayName: "fields-builder__FieldsGroup",
  componentId: "sc-ignixa-8"
})(["position:relative;display:block;width:100%;padding:0;white-space:nowrap;overflow:unset;"]);

const theme = styled.css([":root{--tina-color-primary-light:#2296fe;--tina-color-primary:#2296fe;--tina-color-primary-dark:#0574e4;--tina-color-error-light:#eb6337;--tina-color-error:#ec4815;--tina-color-error-dark:#dc4419;--tina-color-warning-light:#f5e06e;--tina-color-warning:#e9d050;--tina-color-warning-dark:#d3ba38;--tina-color-success-light:#57c355;--tina-color-success:#3cad3a;--tina-color-success-dark:#249a21;--tina-color-grey-0:#ffffff;--tina-color-grey-1:#f6f6f9;--tina-color-grey-2:#edecf3;--tina-color-grey-3:#e1ddec;--tina-color-grey-4:#b2adbe;--tina-color-grey-5:#918c9e;--tina-color-grey-6:#716c7f;--tina-color-grey-7:#565165;--tina-color-grey-8:#433e52;--tina-color-grey-9:#363145;--tina-color-grey-10:#282828;--tina-radius-small:5px;--tina-radius-big:24px;--tina-padding-small:12px;--tina-padding-big:20px;--tina-font-size-0:12px;--tina-font-size-1:13px;--tina-font-size-2:15px;--tina-font-size-3:16px;--tina-font-size-4:18px;--tina-font-size-5:20px;--tina-font-size-6:22px;--tina-font-size-7:26px;--tina-font-size-8:32px;--tina-font-family:\"Roboto\",sans-serif;--tina-font-weight-regular:400;--tina-font-weight-bold:600;--tina-shadow-big:0px 2px 3px rgba(0,0,0,0.05),0 4px 12px rgba(0,0,0,0.1);--tina-shadow-small:0px 2px 3px rgba(0,0,0,0.12);--tina-timing-short:85ms;--tina-timing-medium:150ms;--tina-timing-long:250ms;--tina-z-index-0:500;--tina-z-index-1:1000;--tina-z-index-2:1500;--tina-z-index-3:2000;--tina-z-index-4:2500;--tina-z-index-5:3000;--tina-sidebar-width:340px;--tina-sidebar-header-height:60px;--tina-toolbar-height:62px;}"]);
const GlobalStyles = styled.createGlobalStyle(["", ";"], theme);
const tina_reset_styles = styled.css(["*{font-family:\"Roboto\",sans-serif;&::-webkit-scrollbar{width:8px;}::-webkit-scrollbar-track{background:transparent;border-left:1px solid var(--tina-color-grey-2);}&::-webkit-scrollbar-thumb{background-color:var(--tina-color-grey-3);border-radius:0;border:none;}}*,*:before,*:after{box-sizing:border-box;}hr{border-color:var(--tina-color-grey-2);color:var(--tina-color-grey-2);margin-bottom:var(--tina-padding-big);margin-left:calc(var(--tina-padding-big) * -1);margin-right:calc(var(--tina-padding-big) * -1);border-top:1px solid var(--tina-color-grey-2);border-bottom:none;height:0;box-sizing:content-box;}h1,h2,h3,h4,h5,h6,p{:not([class]){font-family:\"Roboto\",sans-serif;&:first-child{margin-top:0;}&:last-child{margin-bottom:0;}}}td,th{padding:0;width:auto;height:auto;border:inherit;margin:0;}h1,h2,h3,h4,h5,h6{:not([class]){font-weight:var(--tina-font-weight-bold);}}h1:not([class]){font-size:var(--tina-font-size-8);}h2:not([class]){font-size:var(--tina-font-size-7);}h3:not([class]){font-size:var(--tina-font-size-5);}h4:not([class]){font-size:var(--tina-font-size-4);}h5:not([class]){font-size:var(--tina-font-size-3);}h6:not([class]){font-size:var(--tina-font-size-2);}"]);
const StyleReset = styled.styled.div.withConfig({
  displayName: "Styles__StyleReset",
  componentId: "sc-1igvyu7-0"
})(["", ""], tina_reset_styles);

const Button = styled.styled.button.withConfig({
  displayName: "Button",
  componentId: "sc-qplww2-0"
})(["text-align:center;border:0;border-radius:var(--tina-radius-big);box-shadow:var(--tina-shadow-small);background-color:var(--tina-color-grey-0);border:1px solid var(--tina-color-grey-2);color:var(--tina-color-primary);fill:var(--tina-color-primary);font-weight:var(--tina-font-weight-regular);cursor:pointer;font-size:var(--tina-font-size-1);height:40px;padding:0 var(--tina-padding-big);transition:all 85ms ease-out;&:hover{background-color:var(--tina-color-grey-1);}&:active{background-color:var(--tina-color-grey-2);outline:none;}", ";", ";", ";", ";", ";", ";"], p => p.disabled && styled.css(["opacity:0.3;pointer:not-allowed;pointer-events:none;"]), p => p.primary && styled.css(["background-color:var(--tina-color-primary);color:var(--tina-color-grey-0);fill:var(--tina-color-grey-0);border:none;&:hover{background-color:var(--tina-color-primary-light);}&:active{background-color:var(--tina-color-primary-dark);}"]), p => p.small && styled.css(["height:32px;font-size:var(--tina-font-size-0);padding:0 var(--tina-padding-big);"]), p => p.margin && styled.css(["&:not(:first-child){margin-left:8px;}"]), p => p.grow && styled.css(["flex-grow:1;"]), p => p.busy && styled.css(["cursor:wait;"]));
const ICON_BUTTON_SIZE = 18;
const ICON_SIZE = 18;
const IconButton = styled.styled(Button).withConfig({
  displayName: "Button__IconButton",
  componentId: "sc-qplww2-1"
})(["padding:0;width:", "px;height:", "px;margin:0;position:relative;transform-origin:50% 50%;transition:all 150ms ease-out;padding:2px;display:flex;flex-shrink:0;justify-content:center;align-items:center;svg{width:", "px;height:", "px;transition:all 150ms ease-out;}", ";"], ICON_BUTTON_SIZE, ICON_BUTTON_SIZE, ICON_SIZE, ICON_SIZE, props => props.open && styled.css(["background-color:var(--tina-color-grey-0);border-color:var(--tina-color-grey-2);outline:none;fill:var(--tina-color-primary);svg{transform:rotate(45deg);}&:hover{background-color:var(--tina-color-grey-1);}&:active{background-color:var(--tina-color-grey-2);}"]));

function InlineSettings({
  fields,
  SaveAsPicker
}) {
  const hasNoExtraFields = !(fields && fields.length);
  if (hasNoExtraFields) {
    return null;
  }
  return /*#__PURE__*/React__default["default"].createElement(StyleReset, {
    onClick: e => {
      e.stopPropagation();
    },
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/React__default["default"].createElement(SettingsContent, {
    fields: fields,
    SaveAsPicker: SaveAsPicker
  }));
}
function SettingsContent({
  fields,
  SaveAsPicker
}) {
  const {
    form,
    focussedField
  } = useEditorContext();
  return /*#__PURE__*/React__default["default"].createElement(FormBody, {
    id: "sidebar-panels-root"
  }, /*#__PURE__*/React__default["default"].createElement(Wrapper$1, null, /*#__PURE__*/React__default["default"].createElement(FieldsBuilder, {
    form: form,
    fields: fields,
    isEmptyField: !focussedField.length,
    showSearch: true
  }), /*#__PURE__*/React__default["default"].createElement(SidebarFooter, {
    paths: focussedField,
    SaveAsPicker: SaveAsPicker
  })));
}
const FormBody = styled.styled.div.withConfig({
  displayName: "inline-settings__FormBody",
  componentId: "sc-fe5cee-0"
})(["position:relative;flex:1 1 auto;display:flex;flex-direction:column;width:100%;height:100%;border-top:1px solid var(--tina-color-grey-2);background-color:white;"]);
const Wrapper$1 = styled.styled.div.withConfig({
  displayName: "inline-settings__Wrapper",
  componentId: "sc-fe5cee-1"
})(["display:block;margin:0 auto;width:100%;height:100%;overflow-y:auto;"]);

const Error$1 = styled.styled.div.withConfig({
  displayName: "EditorSidebar__Error",
  componentId: "sc-xkxfa3-0"
})(["", " padding:7px 6px 7px;color:hsl(0deg 0% 50% / 0.8);white-space:normal;background:hsl(0deg 100% 50% / 0.2);margin-right:10px;border-radius:2px;margin:16px;"], easyblocksDesignSystem.Fonts.body);
const EmptyState = styled.styled.div.withConfig({
  displayName: "EditorSidebar__EmptyState",
  componentId: "sc-xkxfa3-1"
})(["", " padding:24px;color:hsl(0deg 0% 50% / 0.8);text-align:center;white-space:normal;"], easyblocksDesignSystem.Fonts.body);
const EditorSidebar = props => {
  const {
    focussedField,
    form,
    SaveAsPicker,
    isCollapsed
  } = props;
  const editorContext = useEditorContext();
  const {
    t
  } = useTranslation();

  // Nothing selected: skip buildTinaFields entirely, it would render a
  // meaningless field list for the empty path.
  if (isCollapsed === true) {
    return /*#__PURE__*/React__default["default"].createElement(EmptyState, null, t("editor.sidebar.emptySelection"));
  }
  const error = (() => {
    if (focussedField.length === 1) {
      const path = focussedField[0];
      const compiledComponent = dotNotationGet(editorContext.compiledComponentConfig, path);
      const editableComponent = dotNotationGet(form.values, path);
      if (compiledComponent?._component === "@easyblocks/missing-component") {
        return `Can’t find definition for component: ${editableComponent._component} in your project. Please contact your developers to resolve this issue.`;
      }
    }
    return null;
  })();
  const areMultipleFieldsSelected = focussedField.length > 1;
  const focusedFields = focussedField.length === 0 ? [""] : focussedField;
  const fieldsPerFocusedField = focusedFields.map(focusedField => {
    return buildTinaFields(focusedField, editorContext);
  });
  const mergedFields = areMultipleFieldsSelected ? mergeCommonFields({
    fields: fieldsPerFocusedField
  }) : fieldsPerFocusedField.flat();
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, error && /*#__PURE__*/React__default["default"].createElement(Error$1, null, error), /*#__PURE__*/React__default["default"].createElement(InlineSettings, {
    fields: mergedFields,
    SaveAsPicker: SaveAsPicker
  }));
};

const ColorConfigurationsContainer = styled__default["default"].div.withConfig({
  displayName: "ColorConfigurations__ColorConfigurationsContainer",
  componentId: "sc-qln4q1-0"
})(["width:100%;display:flex;flex-direction:column;gap:20px;"]);
const StyledColorWrapper = styled__default["default"].div.withConfig({
  displayName: "ColorConfigurations__StyledColorWrapper",
  componentId: "sc-qln4q1-1"
})([""]);
const StyledColorCardWrapper = styled__default["default"].div.withConfig({
  displayName: "ColorConfigurations__StyledColorCardWrapper",
  componentId: "sc-qln4q1-2"
})(["max-width:500px;width:100%;display:flex;overflow:hidden;border:1px solid ", ";border-radius:4px;"], easyblocksDesignSystem.Colors.black100);
const StyledColorContentWrapper = styled__default["default"].div.withConfig({
  displayName: "ColorConfigurations__StyledColorContentWrapper",
  componentId: "sc-qln4q1-3"
})(["display:flex;flex-direction:column;gap:10px;"]);
const StyledColorCard = styled__default["default"].div.withConfig({
  displayName: "ColorConfigurations__StyledColorCard",
  componentId: "sc-qln4q1-4"
})(["display:flex;justify-content:center;align-items:center;width:100%;height:40px;background:", ";& > div{display:none;color:", ";}&:hover{cursor:pointer;& > div{display:block;}}"], ({
  background
}) => background, ({
  background
}) => easyblocksCore.getBrightnessColor(background));
const StyledInputWrapper = styled__default["default"].div.withConfig({
  displayName: "ColorConfigurations__StyledInputWrapper",
  componentId: "sc-qln4q1-5"
})(["margin-top:10px;"]);
const StyledInputColor = styled__default["default"](Input.Input).withConfig({
  displayName: "ColorConfigurations__StyledInputColor",
  componentId: "sc-qln4q1-6"
})(["box-shadow:0 0 0 1px ", ";width:100% !important;border-radius:2px;&:focus{outline:none;}"], easyblocksDesignSystem.Colors.black10);
const StyledButtonGroup$3 = styled__default["default"].div.withConfig({
  displayName: "ColorConfigurations__StyledButtonGroup",
  componentId: "sc-qln4q1-7"
})(["display:flex;flex-direction:row;justify-content:flex-end;margin-top:14px;gap:12px;"]);
const StyleColorTitle = styled__default["default"].div.withConfig({
  displayName: "ColorConfigurations__StyleColorTitle",
  componentId: "sc-qln4q1-8"
})(["color:", ";text-transform:uppercase;margin-bottom:10px;", " font-size:14px;font-weight:500;"], easyblocksDesignSystem.Colors.black40, easyblocksDesignSystem.Fonts.bodyLarge);
const StyleColorError = styled__default["default"].div.withConfig({
  displayName: "ColorConfigurations__StyleColorError",
  componentId: "sc-qln4q1-9"
})(["position:absolute;color:", ";margin-top:10px;", " font-size:11px;"], easyblocksDesignSystem.Colors.red, easyblocksDesignSystem.Fonts.body);
const ColorCard = ({
  themeOption,
  openModal
}) => {
  const backgroundColor = Object.keys(themeOption)[0];
  return /*#__PURE__*/React__default["default"].createElement(StyledColorCard, {
    background: themeOption[backgroundColor].value,
    onClick: openModal
  }, /*#__PURE__*/React__default["default"].createElement(icons.Icons.Pencil, {
    size: 18
  }));
};
const ColorConfigurations = ({
  editorContext,
  onConfigChange
}) => {
  const colorTokens = editorContext.theme.colors;
  const fontTokens = editorContext.theme.fonts;
  const backend = editorContext.backend;
  let changeColorDetail;
  const router = new URLSearchParams(window.location.search);
  const themeId = router.get("themeId");
  const {
    t
  } = useTranslation();
  const toaster = Toaster.useToaster();
  const [openEditColor, setOpenEditColor] = React.useState(null);
  const [isLoadingReset, setIsLoadingReset] = React.useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = React.useState(false);
  const [openConfirmReset, setOpenConfirmReset] = React.useState(false);
  const [colorInputError, setColorInputError] = React.useState("");
  const themeOptions1 = Object.entries(colorTokens).filter(([id]) => id.startsWith("theme_1"));
  const themeOptions2 = Object.entries(colorTokens).filter(([id]) => id.startsWith("theme_2"));
  const themeOptions3 = Object.entries(colorTokens).filter(([id]) => id.startsWith("theme_3"));
  const themeOptions4 = Object.entries(colorTokens).filter(([id]) => id.startsWith("theme_4"));
  const themeOptions5 = Object.entries(colorTokens).filter(([id]) => id.startsWith("theme_5"));
  const themeBackgroundAndTextOptions = {
    id: "theme-background-and-text",
    title: t("theme.background-and-text"),
    options: [themeOptions1]
  };
  const themeActionColorsOptions = {
    id: "theme-action-colors",
    title: t("theme.action-colors"),
    options: [themeOptions2]
  };
  const themeMoreColorsOptions = {
    id: "theme-more-colors",
    title: t("theme.more-colors"),
    options: [themeOptions3, themeOptions4, themeOptions5]
  };
  const themeOptions = [themeBackgroundAndTextOptions, themeActionColorsOptions, themeMoreColorsOptions];
  const onCloseConfirmReset = () => {
    setOpenConfirmReset(false);
  };
  const closeEditColor = () => {
    setOpenEditColor(null);
  };
  const onReset = async () => {
    if (themeId) {
      setIsLoadingReset(true);
      try {
        await backend.themes?.reset({
          id: themeId,
          configs: ["colors"]
        });
        toaster.success(t("theme.colors.reset.success"));
      } catch (error) {
        toaster.error(t("theme.colors.reset.fail"));
      } finally {
        setIsLoadingReset(false);
        setOpenConfirmReset(false);
        onConfigChange?.();
      }
    }
  };
  const setColor = newColor => {
    setOpenEditColor(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        value: newColor
      };
    });
  };
  const onChangeColor = newColor => {
    clearTimeout(changeColorDetail);
    changeColorDetail = setTimeout(() => {
      if (typeof newColor === "string" && !easyblocksCore.validateColor(newColor)) {
        setColorInputError(t("theme.colors.input.error"));
      } else {
        setColorInputError("");
      }
      setColor(newColor);
    }, 100);
  };
  const onSaveEditColor = async () => {
    if (themeId && openEditColor?.value && !colorInputError) {
      setIsLoadingEdit(true);
      const newColorTokens = {
        ...colorTokens,
        [openEditColor?.id]: {
          value: openEditColor.value.trim(),
          isDefault: openEditColor.isDefault,
          label: openEditColor.label?.trim()
        }
      };
      const fontTokenPayloads = Object.entries(fontTokens).map(([id, value]) => ({
        id,
        ...value
      }));
      const colorTokenPayloads = Object.entries(newColorTokens).map(([id, value]) => ({
        id,
        ...value
      }));
      try {
        await backend.themes?.update({
          id: themeId,
          config: {
            fonts: fontTokenPayloads,
            colors: colorTokenPayloads
          }
        });
        toaster.success(t("topBar.saved"));
      } catch (error) {
        toaster.error(t("topBar.save.error"));
      } finally {
        setIsLoadingEdit(false);
        closeEditColor();
        onConfigChange?.();
      }
    }
  };
  const onEnterChangeColor = event => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      event.stopPropagation();
      onSaveEditColor();
    }
  };
  return /*#__PURE__*/React__default["default"].createElement(ColorConfigurationsContainer, null, themeOptions.map(themeOption => /*#__PURE__*/React__default["default"].createElement(StyledColorWrapper, {
    key: themeOption.id
  }, /*#__PURE__*/React__default["default"].createElement(StyleColorTitle, null, themeOption.title), /*#__PURE__*/React__default["default"].createElement(StyledColorContentWrapper, null, themeOption.options.map(themeOptionItems => {
    return /*#__PURE__*/React__default["default"].createElement(StyledColorCardWrapper, null, themeOptionItems.map(([colorId, colorDetail]) => /*#__PURE__*/React__default["default"].createElement(ColorCard, {
      key: colorId,
      themeOption: {
        [colorId]: colorDetail
      },
      openModal: () => setOpenEditColor({
        id: colorId,
        ...colorDetail
      })
    })));
  })))), openEditColor ? /*#__PURE__*/React__default["default"].createElement(modals.Modal, {
    title: t("theme.colors.edit"),
    isOpen: !!openEditColor,
    mode: "fit",
    onRequestClose: closeEditColor,
    maxHeight: "auto",
    endAdornment: /*#__PURE__*/React__default["default"].createElement(StyledButtonGroup$3, null, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonSecondary, {
      onClick: closeEditColor
    }, t("cancel")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonPrimary, {
      isLoading: isLoadingEdit,
      disabled: isLoadingEdit || !!colorInputError,
      onClick: onSaveEditColor
    }, t("template.save.default")))
  }, /*#__PURE__*/React__default["default"].createElement(Input.ColorPicker, {
    value: openEditColor?.value,
    onChange: onChangeColor
  }), /*#__PURE__*/React__default["default"].createElement(StyledInputWrapper, null, /*#__PURE__*/React__default["default"].createElement(StyledInputColor, {
    defaultValue: openEditColor?.value,
    value: openEditColor?.value,
    onChange: e => {
      const newColor = e.target.value;
      if (typeof newColor === "string" && !easyblocksCore.validateColor(newColor)) {
        setColorInputError(t("theme.colors.input.error"));
      } else {
        setColorInputError("");
      }
      setColor(newColor);
    },
    onKeyDown: onEnterChangeColor
  }), colorInputError ? /*#__PURE__*/React__default["default"].createElement(StyleColorError, null, colorInputError) : null)) : null, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonDanger, {
    style: {
      width: "fit-content"
    },
    onClick: () => setOpenConfirmReset(true)
  }, t("theme.colors.reset")), /*#__PURE__*/React__default["default"].createElement(modals.Modal, {
    title: t("theme.colors.reset"),
    isOpen: openConfirmReset,
    onRequestClose: onCloseConfirmReset,
    mode: "fit",
    height: "auto",
    endAdornment: /*#__PURE__*/React__default["default"].createElement(StyledButtonGroup$3, null, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonSecondary, {
      onClick: onCloseConfirmReset
    }, t("cancel")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonDanger, {
      isLoading: isLoadingReset,
      disabled: isLoadingReset,
      onClick: onReset
    }, t("theme.colors.reset")))
  }, /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    variant: "body",
    component: "label"
  }, t("theme.colors.reset.confirm"))));
};

const stringKeys = ["fontFamily"];
const StyledButtonGroup$2 = styled__default["default"].div.withConfig({
  displayName: "FontConfigurations__StyledButtonGroup",
  componentId: "sc-1rpaqke-0"
})(["display:flex;flex-direction:row;justify-content:flex-end;margin-top:14px;gap:12px;"]);
const Container = styled__default["default"].div.withConfig({
  displayName: "FontConfigurations__Container",
  componentId: "sc-1rpaqke-1"
})(["background-color:#ffffff;max-height:100vh;font-family:system-ui,-apple-system,sans-serif;"]);
const FontGrid = styled__default["default"].div.withConfig({
  displayName: "FontConfigurations__FontGrid",
  componentId: "sc-1rpaqke-2"
})(["display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;"]);
const FontCard = styled__default["default"].div.withConfig({
  displayName: "FontConfigurations__FontCard",
  componentId: "sc-1rpaqke-3"
})(["width:230px;border:1px solid transparent;padding:4px;cursor:pointer;transition:border-color 0.2s ease;&:hover{border-color:", ";}"], easyblocksDesignSystem.Colors.black10);
const FontPreviewBox = styled__default["default"].div.withConfig({
  displayName: "FontConfigurations__FontPreviewBox",
  componentId: "sc-1rpaqke-4"
})(["height:120px;display:flex;align-items:center;justify-content:center;background-color:", ";padding:32px;overflow:hidden;"], easyblocksDesignSystem.Colors.black10);
const FontPreviewText = styled__default["default"].div.withConfig({
  displayName: "FontConfigurations__FontPreviewText",
  componentId: "sc-1rpaqke-5"
})(["font-size:", "px;font-family:", ";font-weight:", ";line-height:", ";color:#000;text-align:center;user-select:none;max-width:100%;word-break:break-word;overflow-wrap:break-word;overflow:hidden;"], f => f.fontSize, f => f.fontFamily, f => f.fontWeight, f => f.lineHeight);
const FontDetails = styled__default["default"].div.withConfig({
  displayName: "FontConfigurations__FontDetails",
  componentId: "sc-1rpaqke-6"
})(["margin-top:8px;background-color:white;font-size:12px;line-height:16px;color:#000;text-align:center;"]);
const Content$1 = styled__default["default"].div.withConfig({
  displayName: "FontConfigurations__Content",
  componentId: "sc-1rpaqke-7"
})(["::-webkit-scrollbar{width:8px;}::-webkit-scrollbar-track{background:#f1f1f1;}::-webkit-scrollbar-thumb{background:", ";border-radius:4px;}::-webkit-scrollbar-thumb:hover{background:#9ca3af;}scrollbar-width:thin;scrollbar-color:", " #f1f1f1;"], easyblocksDesignSystem.Colors.black10, easyblocksDesignSystem.Colors.black10);
const Form$1 = styled__default["default"].form.withConfig({
  displayName: "FontConfigurations__Form",
  componentId: "sc-1rpaqke-8"
})(["display:flex;flex-direction:column;gap:12px;margin-top:2px;"]);
const Row = styled__default["default"].div.withConfig({
  displayName: "FontConfigurations__Row",
  componentId: "sc-1rpaqke-9"
})(["display:grid;grid-template-columns:2fr 1fr 2fr 1fr;gap:12px;& > button{justify-content:flex-end;overflow:hidden;box-shadow:0 0 0 1px ", ";cursor:pointer;& > span{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;& > div{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}}}"], easyblocksDesignSystem.Colors.black10);
const PreviewTextarea = styled__default["default"].textarea.withConfig({
  displayName: "FontConfigurations__PreviewTextarea",
  componentId: "sc-1rpaqke-10"
})(["border-radius:4px;width:100%;height:17vh;background-color:", ";resize:none;outline:none;padding:1rem;font-family:", ";font-size:", "px;font-weight:", ";line-height:", ";"], easyblocksDesignSystem.Colors.black10, f => f.fontFamily, f => f.fontSize, f => f.fontWeight, f => f.lineHeight);
const StyledSelect = styled__default["default"](Select.Select).withConfig({
  displayName: "FontConfigurations__StyledSelect",
  componentId: "sc-1rpaqke-11"
})(["display:flex;flex-direction:column;align-items:flex-end;min-width:0;cursor:pointer;border:1px solid ", ";border-radius:4px;"], easyblocksDesignSystem.Colors.black10);
const StyledFontWrapper = styled__default["default"].div.withConfig({
  displayName: "FontConfigurations__StyledFontWrapper",
  componentId: "sc-1rpaqke-12"
})([""]);
const StyleFontTitle = styled__default["default"].div.withConfig({
  displayName: "FontConfigurations__StyleFontTitle",
  componentId: "sc-1rpaqke-13"
})(["color:", ";text-transform:uppercase;margin-bottom:10px;", " font-size:14px;font-weight:500;"], easyblocksDesignSystem.Colors.black40, easyblocksDesignSystem.Fonts.bodyLarge);
const FontConfigurations = ({
  editorContext,
  onConfigChange
}) => {
  const colorTokens = editorContext.theme.colors;
  const fontTokens = editorContext.theme.fonts;
  const backend = editorContext.backend;
  const {
    t
  } = useTranslation();
  const toaster = Toaster.useToaster();
  const router = new URLSearchParams(window.location.search);
  const themeId = router.get("themeId");
  const [isLoadingReset, setIsLoadingReset] = React.useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = React.useState(false);
  const [openEditFont, setOpenEditFont] = React.useState(null);
  const [openConfirmReset, setOpenConfirmReset] = React.useState(false);
  const themeHeadingOptions = {
    id: "theme-heading",
    title: t("theme.heading"),
    options: Object.entries(fontTokens).filter(([id]) => id.startsWith("heading"))
  };
  const themeBodyOptions = {
    id: "theme-body",
    title: t("theme.body"),
    options: Object.entries(fontTokens).filter(([id]) => id.startsWith("body"))
  };
  const themeTitleOptions = {
    id: "theme-title",
    title: t("theme.title"),
    options: Object.entries(fontTokens).filter(([id]) => id.startsWith("title"))
  };
  const themeTextOptions = {
    id: "theme-text",
    title: t("theme.text"),
    options: Object.entries(fontTokens).filter(([id]) => id.startsWith("text"))
  };
  const themeOptions = [themeHeadingOptions, themeBodyOptions, themeTitleOptions, themeTextOptions];
  const handleOpenEditFont = (id, fontDetail) => {
    setOpenEditFont({
      id,
      ...fontDetail
    });
  };
  const onCloseConfirmReset = () => {
    setOpenConfirmReset(false);
  };
  const handleFontClose = () => {
    setOpenEditFont(null);
  };
  const onReset = async () => {
    if (themeId) {
      setIsLoadingReset(true);
      try {
        await backend.themes?.reset({
          id: themeId,
          configs: ["fonts"]
        });
        toaster.success(t("theme.font.reset.success"));
      } catch (error) {
        toaster.error(t("theme.font.reset.error"));
      } finally {
        setIsLoadingReset(false);
        onConfigChange?.();
      }
    }
  };
  const onSubmit = async event => {
    event?.preventDefault();
    if (!openEditFont) {
      return;
    }
    const canSend = openEditFont?.label?.trim() !== "";
    if (!canSend) return;
    if (themeId) {
      setIsLoadingEdit(true);
      const newFontTokens = {
        ...fontTokens,
        [openEditFont.id]: {
          value: openEditFont.value,
          isDefault: openEditFont.isDefault,
          label: openEditFont.label
        }
      };
      const fontTokenPayloads = Object.entries(newFontTokens).map(([id, value]) => ({
        id,
        ...value
      }));
      const colorTokenPayloads = Object.entries(colorTokens).map(([id, value]) => ({
        id,
        ...value
      }));
      try {
        await backend.themes?.update({
          id: themeId,
          config: {
            fonts: fontTokenPayloads,
            colors: colorTokenPayloads
          }
        });
        toaster.success(t("theme.font.save.success"));
      } catch (error) {
        toaster.error(t("theme.font.save.error"));
      } finally {
        setIsLoadingEdit(false);
        handleFontClose();
        onConfigChange?.();
      }
    }
  };
  const onChange = (id, newValue) => {
    setOpenEditFont(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        value: {
          ...prev.value,
          [id]: stringKeys.includes(id) ? newValue : Number(newValue)
        }
      };
    });
  };
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Container, null, themeOptions.map(themeOption => /*#__PURE__*/React__default["default"].createElement(StyledFontWrapper, {
    key: themeOption.id
  }, /*#__PURE__*/React__default["default"].createElement(StyleFontTitle, null, themeOption.title), /*#__PURE__*/React__default["default"].createElement(FontGrid, null, themeOption.options.map(([key, fontDetail]) => /*#__PURE__*/React__default["default"].createElement(FontCard, {
    key: key,
    onClick: () => handleOpenEditFont(key, fontDetail)
  }, /*#__PURE__*/React__default["default"].createElement(FontPreviewBox, null, /*#__PURE__*/React__default["default"].createElement(FontPreviewText, {
    fontSize: fontDetail.value?.fontSize >= 32 ? 32 : fontDetail.value?.fontSize,
    fontFamily: fontDetail.value?.fontFamily,
    fontWeight: fontDetail.value?.fontWeight,
    lineHeight: fontDetail.value?.lineHeight
  }, fontDetail.label)), /*#__PURE__*/React__default["default"].createElement(FontDetails, null, [fontDetail.value?.fontFamily?.split(",")[0], fontDetail.value?.fontWeight ? `Font Weight: ${fontDetail.value?.fontWeight}` : null, fontDetail.value?.fontSize ? `${fontDetail.value?.fontSize}` : null, fontDetail.value?.lineHeight ? `${fontDetail.value?.lineHeight}` : null].filter(Boolean).join(", "))))))), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonDanger, {
    onClick: () => setOpenConfirmReset(true)
  }, t("theme.font.reset")), /*#__PURE__*/React__default["default"].createElement(modals.Modal, {
    title: t("theme.font.reset"),
    isOpen: openConfirmReset,
    onRequestClose: onCloseConfirmReset,
    mode: "fit",
    height: "auto",
    endAdornment: /*#__PURE__*/React__default["default"].createElement(StyledButtonGroup$2, null, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonSecondary, {
      onClick: onCloseConfirmReset
    }, t("cancel")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonDanger, {
      isLoading: isLoadingReset,
      disabled: isLoadingReset,
      onClick: onReset
    }, t("theme.font.reset")))
  }, /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    variant: "body",
    component: "label"
  }, t("theme.font.reset.confirm")))), openEditFont ? /*#__PURE__*/React__default["default"].createElement(modals.Modal, {
    width: "30vw",
    maxHeight: "auto",
    title: `${t("theme.font.edit")} ${openEditFont?.label ?? "Font"}`,
    isOpen: !!openEditFont,
    onRequestClose: () => handleFontClose(),
    mode: "center-small",
    headerLine: true
  }, /*#__PURE__*/React__default["default"].createElement(Content$1, null, /*#__PURE__*/React__default["default"].createElement(Form$1, {
    onSubmit: onSubmit
  }, /*#__PURE__*/React__default["default"].createElement(Row, null, /*#__PURE__*/React__default["default"].createElement(StyledSelect, {
    value: openEditFont?.value?.fontFamily ?? easyblocksCore.defaultFontFamily,
    onChange: newFontFamily => {
      onChange("fontFamily", newFontFamily);
    }
  }, easyblocksCore.getFontFamilies().map(f => /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    key: f.id,
    value: f.value
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      fontFamily: f.value
    }
  }, f.label)))), /*#__PURE__*/React__default["default"].createElement(StyledSelect, {
    value: String(openEditFont?.value?.fontSize ?? easyblocksCore.defaultFontSize),
    onChange: newFontSize => {
      onChange("fontSize", newFontSize);
    }
  }, easyblocksCore.getFontSizes().map(f => /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    key: f.id,
    value: f.value
  }, f.label))), /*#__PURE__*/React__default["default"].createElement(StyledSelect, {
    value: String(openEditFont?.value?.fontWeight ?? easyblocksCore.defaultFontWeight),
    onChange: newFontWeight => {
      onChange("fontWeight", newFontWeight);
    }
  }, easyblocksCore.getFontWeights().map(f => /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    key: f.id,
    value: f.value
  }, f.label))), /*#__PURE__*/React__default["default"].createElement(StyledSelect, {
    value: String(openEditFont?.value?.lineHeight ?? easyblocksCore.defaultLineHeight),
    onChange: newLineHeight => {
      onChange("lineHeight", newLineHeight);
    }
  }, easyblocksCore.getLineHeights().map(f => /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    key: f.id,
    value: f.value
  }, f.label)))), /*#__PURE__*/React__default["default"].createElement(PreviewTextarea, {
    id: "textPreview",
    fontFamily: openEditFont?.value?.fontFamily ?? easyblocksCore.defaultFontFamily,
    fontSize: openEditFont?.value?.fontSize ?? easyblocksCore.defaultFontSize,
    fontWeight: openEditFont?.value?.fontWeight ?? easyblocksCore.defaultFontWeight,
    lineHeight: openEditFont?.value?.lineHeight ?? easyblocksCore.defaultLineHeight,
    defaultValue: "Text preview"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 8,
      gap: 8
    }
  }, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonSecondary, {
    onClick: () => handleFontClose()
  }, t("theme.font.cancel")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonPrimary, {
    isLoading: isLoadingEdit,
    disabled: isLoadingEdit,
    type: "submit"
  }, t("theme.font.save")))))) : null);
};

const ModalRoot$1 = styled__default["default"].div.withConfig({
  displayName: "FontColorConfigsModal__ModalRoot",
  componentId: "sc-1xvfmbx-0"
})(["position:absolute;top:0;left:0;width:100%;height:100%;display:grid;grid-template-columns:200px 1fr;overflow:hidden;"]);
const Sidebar$1 = styled__default["default"].div.withConfig({
  displayName: "FontColorConfigsModal__Sidebar",
  componentId: "sc-1xvfmbx-1"
})(["overflow-x:hidden;overflow-y:auto;border-right:1px solid ", ";height:100%;"], easyblocksDesignSystem.Colors.black5);
const ContentWrapper = styled__default["default"].div.withConfig({
  displayName: "FontColorConfigsModal__ContentWrapper",
  componentId: "sc-1xvfmbx-2"
})(["padding:1rem;padding-right:0;overflow:hidden;height:100%;"]);
const Content = styled__default["default"].div.withConfig({
  displayName: "FontColorConfigsModal__Content",
  componentId: "sc-1xvfmbx-3"
})(["overflow-x:hidden;overflow-y:auto;height:100%;"]);
const SidebarContent$1 = styled__default["default"].div.withConfig({
  displayName: "FontColorConfigsModal__SidebarContent",
  componentId: "sc-1xvfmbx-4"
})(["padding:24px 4px;display:flex;flex-direction:column;"]);
const SidebarButton$1 = styled__default["default"].button.withConfig({
  displayName: "FontColorConfigsModal__SidebarButton",
  componentId: "sc-1xvfmbx-5"
})(["all:unset;height:38px;", " display:flex;padding-left:16px;align-items:center;&:hover{background:", ";}background:", ";cursor:pointer;"], easyblocksDesignSystem.Fonts.body, easyblocksDesignSystem.Colors.black5, ({
  isActive
}) => isActive ? `${easyblocksDesignSystem.Colors.black5}` : "");
const FontColorConfigsModal = ({
  isOpen,
  onConfigChange,
  onClose
}) => {
  const {
    t
  } = useTranslation();
  const sidebarContents = [{
    id: "typography",
    title: t("editor.sidebar.typography"),
    content: FontConfigurations
  }, {
    id: "color",
    title: t("editor.sidebar.color"),
    content: ColorConfigurations
  }];
  const editorContext = useEditorContext();
  const [activeSidebar, setActiveSidebar] = React.useState(sidebarContents[0].id);
  const activeTitle = sidebarContents.find(sidebarContent => sidebarContent.id === activeSidebar)?.title;
  const ActiveContent = sidebarContents.find(sidebarContent => sidebarContent.id === activeSidebar)?.content;
  return /*#__PURE__*/React__default["default"].createElement(modals.Modal, {
    title: activeTitle,
    isOpen: isOpen,
    onRequestClose: onClose,
    mode: "center-huge",
    headerLine: true
  }, /*#__PURE__*/React__default["default"].createElement(ModalRoot$1, null, /*#__PURE__*/React__default["default"].createElement(Sidebar$1, null, /*#__PURE__*/React__default["default"].createElement(SidebarContent$1, null, sidebarContents.map(sidebarContent => /*#__PURE__*/React__default["default"].createElement(SidebarButton$1, {
    key: sidebarContent.id,
    onClick: () => setActiveSidebar(sidebarContent.id),
    isActive: activeSidebar === sidebarContent.id
  }, sidebarContent.title)))), /*#__PURE__*/React__default["default"].createElement(ContentWrapper, null, /*#__PURE__*/React__default["default"].createElement(Content, null, ActiveContent ? /*#__PURE__*/React__default["default"].createElement(ActiveContent, {
    editorContext: editorContext,
    onConfigChange: onConfigChange
  }) : null))));
};

/**
 * Template glyph: a framed page with a header band, drawn locally rather than
 * taken from the design system.
 *
 * The design system has no "template" icon, and adding one there would not help
 * here: this package resolves `@redsun-vn/easyblocks-design-system` from an
 * installed git build, so a new export only becomes visible after that package
 * is published — which the release rules for this change forbid. The three
 * existing candidates are all taken: `Master` is a four-diamond cluster that
 * reads as "component", while `Duplicate` and `LayerGroup` already mean
 * "duplicate this block" and "select the parent block" on the block toolbar.
 *
 * Lives in its own module because both the panel rail button and the rows
 * inside the template panel draw it, and two copies would drift apart.
 */
const TemplateIcon = ({
  size = 16
}) => /*#__PURE__*/React__default["default"].createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": "true",
  focusable: "false"
}, /*#__PURE__*/React__default["default"].createElement("rect", {
  x: "2.5",
  y: "2.5",
  width: "11",
  height: "11",
  rx: "1.5",
  stroke: "currentColor"
}), /*#__PURE__*/React__default["default"].createElement("path", {
  d: "M2.5 6.5H13.5",
  stroke: "currentColor"
}), /*#__PURE__*/React__default["default"].createElement("path", {
  d: "M6.5 6.5V13.5",
  stroke: "currentColor"
}));

const SUBDIVISION_OVERRIDES = {
  "gd-GB": "gb-sct",
  // Scotland flag
  "cy-GB": "gb-wls" // Wales flag
};
function getFlagUrl(locale, size) {
  const override = SUBDIVISION_OVERRIDES[locale];
  const code = override || locale.split("-")[1]?.toLowerCase();
  if (!code) return "";

  // SVG cho quality cao
  if (!size) return `https://flagcdn.com/${code}.svg`;

  // PNG cho size cụ thể
  return `https://flagcdn.com/w${size}/${code}.png`;
}

const TOP_BAR_HEIGHT = 40;
const TopBar = styled.styled.div.withConfig({
  displayName: "EditorTopBar__TopBar",
  componentId: "sc-726nw9-0"
})(["position:relative;box-sizing:border-box;background-color:white;border-bottom:1px solid #eaeaea;padding:0 64px;min-height:", "px;display:flex;flex-direction:row;justify-content:center;align-items:center;"], TOP_BAR_HEIGHT);
const Label = styled.styled.div.withConfig({
  displayName: "EditorTopBar__Label",
  componentId: "sc-726nw9-1"
})(["background:", ";height:24px;", " display:flex;justify-content:center;align-items:center;padding-left:12px;padding-right:12px;border-radius:12px;color:white;"], easyblocksDesignSystem.Colors.purple, easyblocksDesignSystem.Fonts.label);
const TopBarLeft = styled.styled.div.withConfig({
  displayName: "EditorTopBar__TopBarLeft",
  componentId: "sc-726nw9-2"
})(["position:absolute;top:0;left:4px;height:100%;display:flex;flex-direction:row;align-items:center;gap:4px;"]);
const TopBarRight = styled.styled.div.withConfig({
  displayName: "EditorTopBar__TopBarRight",
  componentId: "sc-726nw9-3"
})(["position:absolute;top:0;right:8px;height:100%;display:flex;flex-direction:row;align-items:center;gap:16px;"]);
const TopBarCenter = styled.styled.div.withConfig({
  displayName: "EditorTopBar__TopBarCenter",
  componentId: "sc-726nw9-4"
})(["position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:row;align-items:center;gap:8px;white-space:nowrap;"]);
const ImageContainer$1 = styled.styled.div.withConfig({
  displayName: "EditorTopBar__ImageContainer",
  componentId: "sc-726nw9-5"
})(["position:relative;width:20px;height:20px;"]);
const Image = styled.styled.img.withConfig({
  displayName: "EditorTopBar__Image",
  componentId: "sc-726nw9-6"
})(["width:100%;height:100%;object-fit:contain;"]);
const VerticalLine = styled.styled.div.withConfig({
  displayName: "EditorTopBar__VerticalLine",
  componentId: "sc-726nw9-7"
})(["width:1px;height:20px;background-color:", ";"], easyblocksDesignSystem.Colors.black10);
const debouncedSave = debounce__default["default"](fn => fn(), 200);
const EditorTopBar = ({
  onClose,
  onSaveDocument: _onSaveDocument,
  onConfigChange,
  isSaving,
  editorHistoryInstance,
  onViewportChange,
  devices,
  viewport,
  onIsEditingChange,
  isEditing,
  onUndo,
  onRedo,
  locales,
  locale,
  onLocaleChange,
  hideCloseButton,
  readOnly,
  showLeftSidebar,
  onShowLeftSidebar,
  showRightSidebar,
  onShowRightSidebar,
  editorMode,
  showDeviceFrame,
  onToggleDeviceFrame,
  zoom,
  onZoomChange
}) => {
  const headingRef = React.useRef(null);
  const router = new URLSearchParams(window.location.search);
  const themeId = router.get("themeId");
  const shopId = router.get("shopId");
  const {
    t
  } = useTranslation();
  const [isOpenConfigs, setIsOpenConfigs] = React.useState(false);
  const isAdminTemplate = editorMode === "admin-template";
  // Shop owners get a deliberately smaller chrome: no theme-building tools.
  const isShopUser = editorMode === "user";
  const onSaveDocument = () => {
    if (_onSaveDocument && !isSaving) {
      debouncedSave(_onSaveDocument);
    }
  };
  return /*#__PURE__*/React__default["default"].createElement(TopBar, {
    ref: headingRef
  }, /*#__PURE__*/React__default["default"].createElement(TopBarLeft, null, !hideCloseButton && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.Close,
    hideLabel: true,
    onClick: onClose
  }, "Close"), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      height: "100%",
      background: easyblocksDesignSystem.Colors.black10,
      width: 1
    }
  })), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.Undo,
    hideLabel: true,
    disabled: editorHistoryInstance.isOldest(),
    onClick: () => {
      onUndo();
    }
  }, t("editor.sidebar.undo")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.Redo,
    hideLabel: true,
    disabled: editorHistoryInstance.isNewest(),
    onClick: () => {
      onRedo();
    }
  }, t("editor.sidebar.redo")), /*#__PURE__*/React__default["default"].createElement(VerticalLine, null), readOnly && /*#__PURE__*/React__default["default"].createElement(Label, null, "(Read-Only)"), !isAdminTemplate && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.Add,
    hideLabel: true,
    onClick: () => onShowLeftSidebar("components"),
    style: {
      background: showLeftSidebar === "components" ? easyblocksDesignSystem.Colors.black10 : "transparent"
    }
  }, t("editor.sidebar.sections.components")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: TemplateIcon,
    hideLabel: true,
    onClick: () => onShowLeftSidebar("templates"),
    style: {
      background: showLeftSidebar === "templates" ? easyblocksDesignSystem.Colors.black10 : "transparent"
    }
  }, t("editor.sidebar.sections.templates")), !isShopUser && /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.GlobalSections,
    hideLabel: true,
    onClick: () => onShowLeftSidebar("global-sections"),
    style: {
      background: showLeftSidebar === "global-sections" ? easyblocksDesignSystem.Colors.black10 : "transparent"
    }
  }, t("editor.sidebar.globalSections"))), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.Layers,
    hideLabel: true,
    onClick: () => onShowLeftSidebar("layers"),
    style: {
      background: showLeftSidebar === "layers" ? easyblocksDesignSystem.Colors.black10 : "transparent"
    }
  }, t("editor.sidebar.layers")), !isAdminTemplate && !isShopUser && /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.ColorAndFonts,
    hideLabel: true,
    onClick: () => setIsOpenConfigs(prev => !prev)
  }, t("editor.sidebar.configurations")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.PencilLine,
    hideLabel: true,
    onClick: () => onShowRightSidebar(),
    style: {
      background: showRightSidebar ? easyblocksDesignSystem.Colors.black10 : "transparent"
    }
  }, t("editor.sidebar.properties")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.Device,
    hideLabel: true,
    onClick: onToggleDeviceFrame,
    style: {
      background: showDeviceFrame ? easyblocksDesignSystem.Colors.black10 : "transparent"
    }
  }, t('editor.sidebar.deviceFrame')), /*#__PURE__*/React__default["default"].createElement(FontColorConfigsModal, {
    isOpen: isOpenConfigs,
    onConfigChange: onConfigChange,
    onClose: () => setIsOpenConfigs(false)
  })), /*#__PURE__*/React__default["default"].createElement(TopBarCenter, null, /*#__PURE__*/React__default["default"].createElement(DeviceSwitch, {
    devices: devices,
    deviceId: viewport,
    onDeviceChange: onViewportChange,
    editorMode: editorMode
  }), /*#__PURE__*/React__default["default"].createElement(ZoomSelect, {
    zoom: zoom,
    onZoomChange: onZoomChange,
    fitLabel: t("editor.zoom.fit")
  })), /*#__PURE__*/React__default["default"].createElement(TopBarRight, null, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      gap: "6px",
      alignItems: "center"
    }
  }, !isAdminTemplate && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Select.Select, {
    value: locale,
    onChange: locale => onLocaleChange(locale)
  }, locales.map(l => /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    key: l.code,
    value: l.code
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      gap: 4
    }
  }, l.code ? /*#__PURE__*/React__default["default"].createElement(ImageContainer$1, null, /*#__PURE__*/React__default["default"].createElement(Image, {
    src: getFlagUrl(l.code),
    alt: l.name
  })) : null, l.name)))), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    hideLabel: true,
    icon: icons.Icons.Save,
    onClick: onSaveDocument,
    disabled: isSaving,
    isLoading: isSaving
  }, t("topBar.save")), /*#__PURE__*/React__default["default"].createElement("a", {
    href: `/?previewId=${themeId}&shopId=${shopId}`,
    target: "_blank"
  }, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    hideLabel: true,
    icon: icons.Icons.Preview
  }, t("topBar.preview"))), /*#__PURE__*/React__default["default"].createElement(VerticalLine, null)), /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    variant: "body",
    component: "label",
    htmlFor: "easyblocks-edit-mode-button",
    style: {
      marginLeft: 6
    }
  }, t("topBar.editMode")), " ", /*#__PURE__*/React__default["default"].createElement(Toggle$1.Toggle, {
    name: "easyblocks-edit-mode-button",
    checked: isEditing,
    onChange: () => {
      onIsEditingChange();
    }
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      width: editorMode === "admin-template" ? 30 : 0
    }
  }))));
};
const DEVICE_ID_TO_ICON = {
  xs: /*#__PURE__*/React__default["default"].createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M10 2.51691H6C5.44772 2.51691 5 2.96463 5 3.51691L5.00005 12.483C5.00005 13.0353 5.44777 13.483 6.00005 13.483H10.0001C10.5523 13.483 11.0001 13.0353 11.0001 12.483L11 3.51691C11 2.96463 10.5523 2.51691 10 2.51691ZM6 1.51691C4.89543 1.51691 4 2.41234 4 3.51691L4.00005 12.483C4.00005 13.5876 4.89548 14.483 6.00005 14.483H10.0001C11.1046 14.483 12.0001 13.5876 12.0001 12.483L12 3.51691C12 2.41234 11.1046 1.51691 10 1.51691H6Z",
    fill: "black"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M8.99548 12.5H7.00452V11.5H8.99548V12.5Z",
    fill: "black"
  })),
  sm: /*#__PURE__*/React__default["default"].createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2.51694 6.00005L2.51694 10C2.51694 10.5523 2.96466 11 3.51694 11L12.4831 11C13.0353 11 13.4831 10.5523 13.4831 9.99999L13.4831 5.99999C13.4831 5.44771 13.0353 4.99999 12.4831 4.99999L3.51694 5.00005C2.96466 5.00005 2.51694 5.44776 2.51694 6.00005ZM1.51694 10C1.51694 11.1046 2.41238 12 3.51694 12L12.4831 12C13.5876 12 14.4831 11.1046 14.4831 9.99999L14.4831 5.99999C14.4831 4.89542 13.5876 3.99999 12.4831 3.99999L3.51694 4.00005C2.41237 4.00005 1.51694 4.89548 1.51694 6.00005L1.51694 10Z",
    fill: "black"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12.5 7.00452L12.5 8.99548L11.5 8.99548L11.5 7.00452L12.5 7.00452Z",
    fill: "black"
  })),
  md: /*#__PURE__*/React__default["default"].createElement("svg", {
    width: "16",
    height: "18",
    viewBox: "0 0 16 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12.4918 1.97229L3.50793 1.9723C2.95565 1.9723 2.50793 2.42001 2.50793 2.9723L2.50797 15.0277C2.50797 15.58 2.95569 16.0277 3.50797 16.0277L12.4918 16.0277C13.0441 16.0277 13.4918 15.58 13.4918 15.0277L13.4918 2.97229C13.4918 2.42001 13.0441 1.97229 12.4918 1.97229ZM3.50793 0.972299C2.40337 0.972299 1.50793 1.86773 1.50793 2.9723L1.50797 15.0277C1.50797 16.1323 2.4034 17.0277 3.50797 17.0277L12.4918 17.0277C13.5964 17.0277 14.4918 16.1323 14.4918 15.0277L14.4918 2.97229C14.4918 1.86772 13.5964 0.97229 12.4918 0.97229L3.50793 0.972299Z",
    fill: "black"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M10 14.9777H6V13.9777H10V14.9777Z",
    fill: "black"
  })),
  lg: /*#__PURE__*/React__default["default"].createElement("svg", {
    width: "18",
    height: "16",
    viewBox: "0 0 18 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M1.97229 3.50815L1.9723 12.492C1.9723 13.0443 2.42001 13.492 2.9723 13.492L15.0277 13.492C15.58 13.492 16.0277 13.0443 16.0277 12.492L16.0277 3.50812C16.0277 2.95583 15.58 2.50812 15.0277 2.50812L2.97229 2.50815C2.42 2.50815 1.97229 2.95587 1.97229 3.50815ZM0.972299 12.492C0.972299 13.5966 1.86773 14.492 2.9723 14.492L15.0277 14.492C16.1323 14.492 17.0277 13.5965 17.0277 12.492L17.0277 3.50812C17.0277 2.40355 16.1323 1.50812 15.0277 1.50812L2.97229 1.50815C1.86772 1.50815 0.97229 2.40359 0.97229 3.50815L0.972299 12.492Z",
    fill: "black"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M14.9778 6L14.9778 10L13.9778 10L13.9778 6L14.9778 6Z",
    fill: "black"
  })),
  xl: /*#__PURE__*/React__default["default"].createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M14.5111 13.0004L1.48889 13.0004L1.48889 12.0004L14.5111 12.0004V13.0004Z",
    fill: "black"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12.5828 3.99961H3.41723V9.91598H12.5828V3.99961ZM2.5 2.99961V10.916H13.5V2.99961H2.5Z",
    fill: "black"
  })),
  "2xl": /*#__PURE__*/React__default["default"].createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M14 3.00213H2V10.9979H14V3.00213ZM1 2.00213V11.9979H15V2.00213H1Z",
    fill: "black"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M11 13.9979L5 13.9979V12.9979L11 12.9979V13.9979Z",
    fill: "black"
  })),
  "fit-screen": /*#__PURE__*/React__default["default"].createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M14.2872 7.97504L12.2872 5.79322M14.2872 7.97504C14.2872 7.97504 13.0683 9.30481 12.2872 10.1569M14.2872 7.97504L10.0372 7.97504",
    stroke: "black"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M1.79272 7.97503L3.79272 10.1568M1.79272 7.97503C1.79272 7.97503 3.01168 6.64527 3.79272 5.79321M1.79272 7.97503L6.04272 7.97503",
    stroke: "black"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M3.96777 2.52881H12.0323V4.49858H13.0323V1.52881H2.96777V4.49858H3.96777V2.52881ZM3.96777 11.5014H2.96777V14.4712H13.0323V11.5014H12.0323V13.4712H3.96777V11.5014Z",
    fill: "black"
  }))
};
const ZOOM_STEPS = [0.5, 0.75, 1];
function ZoomSelect({
  zoom,
  onZoomChange,
  fitLabel
}) {
  return /*#__PURE__*/React__default["default"].createElement(Select.Select, {
    value: zoom === "fit" ? "fit" : String(zoom),
    onChange: value => {
      onZoomChange(value === "fit" ? "fit" : Number(value));
    }
  }, ZOOM_STEPS.map(step => /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    key: step,
    value: String(step)
  }, `${Math.round(step * 100)}%`)), /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    value: "fit"
  }, fitLabel));
}
function DeviceSwitch({
  deviceId,
  devices,
  onDeviceChange,
  editorMode
}) {
  const {
    t
  } = useTranslation();
  const isShopUser = editorMode === "user";

  // Shop owners pick between three familiar devices; theme builders keep the
  // full breakpoint set. `isMain` is the desktop breakpoint, read off the
  // device list so no extra prop is needed.
  const shopUserDevices = isShopUser ? [{
    device: devices.find(d => d.id === "xs"),
    label: t("editor.device.mobile")
  }, {
    device: devices.find(d => d.id === "md"),
    label: t("editor.device.tablet")
  }, {
    device: devices.find(d => d.isMain),
    label: t("editor.device.desktop")
  }].flatMap(({
    device,
    label
  }) => device ? [{
    device,
    label
  }] : []) : null;
  const visibleDevices = shopUserDevices ?? devices.filter(d => !d.hidden).map(d => ({
    device: d,
    label: DEVICE_LABELS[d.id] ?? d.label ?? d.id
  }));
  return /*#__PURE__*/React__default["default"].createElement(ToggleGroup.ToggleGroup, {
    value: deviceId,
    onChange: deviceId => {
      if (deviceId === "") {
        return;
      }
      onDeviceChange(deviceId);
    }
  }, visibleDevices.map(({
    device,
    label
  }) => /*#__PURE__*/React__default["default"].createElement(Tooltip$1.Tooltip, {
    key: device.id
  }, /*#__PURE__*/React__default["default"].createElement(Tooltip$1.TooltipTrigger, null, /*#__PURE__*/React__default["default"].createElement(ToggleGroup.ToggleGroupItem, {
    value: device.id
  }, DEVICE_ID_TO_ICON[device.id])), /*#__PURE__*/React__default["default"].createElement(Tooltip$1.TooltipContent, null, /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    color: "white"
  }, label)))), !isShopUser && /*#__PURE__*/React__default["default"].createElement(Tooltip$1.Tooltip, null, /*#__PURE__*/React__default["default"].createElement(Tooltip$1.TooltipTrigger, null, /*#__PURE__*/React__default["default"].createElement(ToggleGroup.ToggleGroupItem, {
    value: "fit-screen"
  }, DEVICE_ID_TO_ICON["fit-screen"])), /*#__PURE__*/React__default["default"].createElement(Tooltip$1.TooltipContent, null, /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    color: "white"
  }, "Fit screen"))));
}

function normalizeToStringArray(arg) {
  return typeof arg === "string" ? [arg] : Array.isArray(arg) ? arg : [];
}

function getAllComponentTypes(editorContext) {
  const componentTypes = getComponentTypesFromDefinitions(editorContext.definitions.components);
  return Array.from(new Set([...componentTypes]));
}
function getComponentTypesFromDefinitions(definitions) {
  const types = new Set();
  definitions.forEach(({
    type
  }) => {
    normalizeToStringArray(type).forEach(componentType => {
      types.add(componentType);
    });
  });
  return Array.from(types);
}

function getAllComponentsOfType(type, editorContext) {
  return getAllComponentsOfTypeFromDefinitionsArray(type, editorContext.definitions.components);
}
function getAllComponentsOfTypeFromDefinitionsArray(type, definitions) {
  return definitions.filter(definition => easyblocksCore.isNoCodeComponentOfType(definition, type));
}

function unrollAcceptsFieldIntoComponents(accepts, editorContext) {
  const allComponentTypes = getAllComponentTypes(editorContext);
  const idsSet = new Set();
  normalizeToStringArray(accepts).forEach(acceptsEntry => {
    if (allComponentTypes.includes(acceptsEntry)) {
      const componentType = acceptsEntry;
      const components = getAllComponentsOfType(componentType, editorContext);
      components.forEach(component => {
        idsSet.add(component);
      });
    } else {
      const componentId = acceptsEntry;
      const component = _internals.findComponentDefinitionById(componentId, editorContext);
      if (component) {
        idsSet.add(component);
      }
    }
  });
  return Array.from(idsSet);
}

const ModalPicker = ({
  config,
  onClose,
  pickers,
  editorMode
}) => {
  const editorContext = useEditorContext();
  const {
    form
  } = editorContext;
  const [loadMode, setLoadMode] = React.useState("replace");
  const split = config.path.split("."); // TODO: right now only for collections
  const parentPath = split.slice(0, split.length - 1).join(".");
  const fieldName = split[split.length - 1];
  const parentData = dotNotationGet(form.values, parentPath);
  const schemaProp = _internals.findComponentDefinition(parentData, editorContext).schema.find(x => x.prop === fieldName);
  const componentTypes = config.componentTypes ?? schemaProp.accepts;
  const localComponents = unrollAcceptsFieldIntoComponents(componentTypes, editorContext);
  let templatesDictionary = undefined;
  let templatesDictionaryCount = editorContext.templates?.count;
  if (editorContext.templates) {
    templatesDictionary = {};
    localComponents.forEach(localComponent => {
      templatesDictionary[localComponent.id] = {
        component: localComponent,
        templates: []
      };
      editorContext.templates.items.forEach(remoteTemplate => {
        if (localComponent.id === remoteTemplate.entry._component) {
          // For local components are visible & remote templates
          if (!remoteTemplate.isUserDefined && localComponent.visible !== false || remoteTemplate.isUserDefined) {
            templatesDictionary[localComponent.id].templates.push(remoteTemplate);
          } else {
            if (!templatesDictionaryCount) {
              templatesDictionaryCount = {};
            }
            if (!templatesDictionaryCount[localComponent.id]) {
              templatesDictionaryCount[localComponent.id] = {
                matchedCount: 0,
                total: 0
              };
            }
            const {
              matchedCount = 0,
              total = 0
            } = templatesDictionaryCount[localComponent.id] ?? {};
            templatesDictionaryCount[localComponent.id].matchedCount = matchedCount <= 0 ? 0 : matchedCount - 1;
            templatesDictionaryCount[localComponent.id].total = total <= 0 ? 0 : total - 1;
          }
        }
      });
      if (templatesDictionary[localComponent.id].templates.length === 0) {
        delete templatesDictionary[localComponent.id];
      }
    });
  }
  const picker = schemaProp.picker ?? "compact";
  const close = config => {
    const _itemProps = {
      [parentData._component]: {
        [fieldName]: {}
      }
    };
    const newComponent = fieldName.startsWith("$") ? config : _internals.duplicateConfig(_internals.normalize({
      ...config,
      _itemProps
    }, editorContext), editorContext);
    onClose(newComponent);
  };
  const onModalClose = template => {
    if (template) {
      close(_internals.normalize(template.entry, editorContext));
    } else {
      onClose();
    }
  };
  const queryLimit = 50;
  const onSearchGroup = search => {
    setLoadMode("replace");
    editorContext.syncTemplateQuery?.({
      filters: "",
      search: search.trim()
    });
  };
  const onFilters = filters => {
    setLoadMode("replace");
    const query = {
      filters: filters.trim(),
      search: "",
      page: 1,
      mode: "replace"
    };
    if (filters) {
      query.limit = queryLimit;
    }
    editorContext.syncTemplateQuery?.(query);
  };
  const onLoadMore = (page, groupId) => {
    setLoadMode("append");
    const templateItems = editorContext.templates?.items ?? [];
    const templateCount = editorContext.templates?.count;
    const totalAvailable = templateCount?.[groupId.trim()]?.matchedCount ?? 0;
    if (!totalAvailable) return;
    const templateItemFilterLength = templateItems ? Object.values(templateItems).filter(item => item.group === groupId.trim()).length : 0;
    const hasNextPage = !!templateCount && totalAvailable > 0 && templateItemFilterLength < totalAvailable;
    if (!hasNextPage) return;
    editorContext.syncTemplateQuery?.({
      page,
      limit: queryLimit,
      mode: "append"
    });
  };
  return pickers?.[picker] ? pickers[picker]({
    loadMode,
    isOpen: true,
    onClose: onModalClose,
    isFetching: editorContext.isFetchingTemplates,
    onSearchGroup,
    onFilters,
    onLoadMore,
    templates: templatesDictionary,
    templateCount: templatesDictionaryCount,
    mode: picker,
    editorMode
  }) : /*#__PURE__*/React__default["default"].createElement("div", null, "Unknown picker: ", picker);
};

const shimmer$1 = styled.keyframes(["0%{background-position:-800px 0;}100%{background-position:800px 0;}"]);
const SkeletonBox$1 = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditorCanvasArea__SkeletonBox",
  componentId: "sc-10zd21k-0"
})(["width:", ";height:", ";background:linear-gradient( to right,#f0f0f0 0%,#e0e0e0 20%,#f0f0f0 40%,#f0f0f0 100% );background-size:800px 100px;animation:", " 3s infinite linear;border-radius:", ";"], props => props.width || '100%', props => props.height || '20px', shimmer$1, props => props.borderRadius || '4px');
const SkeletonCanvas = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditorCanvasArea__SkeletonCanvas",
  componentId: "sc-10zd21k-1"
})(["width:100%;max-width:1300px;background:white;padding:32px;display:flex;flex-direction:column;gap:24px;"]);
const SkeletonItem = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditorCanvasArea__SkeletonItem",
  componentId: "sc-10zd21k-2"
})(["display:flex;gap:16px;padding:16px;border-radius:8px;"]);
const SkeletonContent = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditorCanvasArea__SkeletonContent",
  componentId: "sc-10zd21k-3"
})(["flex:1;display:flex;flex-direction:column;gap:8px;"]);
const SkeletonMeta = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditorCanvasArea__SkeletonMeta",
  componentId: "sc-10zd21k-4"
})(["display:flex;gap:12px;margin-top:4px;"]);
const SkeletonEditorCanvasArea = () => {
  return /*#__PURE__*/React__default["default"].createElement(SkeletonCanvas, null, /*#__PURE__*/React__default["default"].createElement(SkeletonItem, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "188px",
    height: "138px",
    borderRadius: "6px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonContent, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "100%",
    height: "24px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "85%",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonMeta, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "100px",
    height: "16px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "80px",
    height: "16px"
  })), /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "60px",
    height: "24px"
  }))), /*#__PURE__*/React__default["default"].createElement(SkeletonItem, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "188px",
    height: "138px",
    borderRadius: "6px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonContent, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "95%",
    height: "24px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "100%",
    height: "18px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "70%",
    height: "18px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonMeta, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "100px",
    height: "16px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "80px",
    height: "16px"
  })))), /*#__PURE__*/React__default["default"].createElement(SkeletonItem, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "188px",
    height: "138px",
    borderRadius: "6px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonContent, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "90%",
    height: "24px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonMeta, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "100px",
    height: "16px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "80px",
    height: "16px"
  })))), /*#__PURE__*/React__default["default"].createElement(SkeletonItem, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "188px",
    height: "138px",
    borderRadius: "6px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonContent, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "90%",
    height: "24px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonMeta, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "100px",
    height: "16px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox$1, {
    width: "80px",
    height: "16px"
  })))));
};
var SkeletonEditorCanvasArea$1 = SkeletonEditorCanvasArea;

const shimmer = styled.keyframes(["0%{background-position:-800px 0;}100%{background-position:800px 0;}"]);
const SkeletonBox = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditor__SkeletonBox",
  componentId: "sc-133np0d-0"
})(["width:", ";height:", ";background:linear-gradient( to right,#f0f0f0 0%,#e0e0e0 20%,#f0f0f0 40%,#f0f0f0 100% );background-size:800px 100px;animation:", " 3s infinite linear;border-radius:", ";"], props => props.width || "100%", props => props.height || "20px", shimmer, props => props.borderRadius || "4px");

// Mimic the actual editor structure
const SkeletonEditorContainer = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditor__SkeletonEditorContainer",
  componentId: "sc-133np0d-1"
})(["height:100vh;width:100%;display:flex;flex-direction:column;background:#fafafa;"]);
const SkeletonTopBar = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditor__SkeletonTopBar",
  componentId: "sc-133np0d-2"
})(["height:40px;background:", ";border-bottom:1px solid ", ";display:flex;align-items:center;justify-content:space-between;padding:0 4px;gap:16px;"], easyblocksDesignSystem.Colors.white, easyblocksDesignSystem.Colors.black100);
const SkeletonTopBarLeft = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditor__SkeletonTopBarLeft",
  componentId: "sc-133np0d-3"
})(["display:flex;gap:8px;align-items:center;"]);
const SkeletonTopBarCenter = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditor__SkeletonTopBarCenter",
  componentId: "sc-133np0d-4"
})(["display:flex;gap:8px;align-items:center;"]);
const SkeletonTopBarRight = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditor__SkeletonTopBarRight",
  componentId: "sc-133np0d-5"
})(["display:flex;gap:16px;align-items:center;"]);
const SkeletonMainContent = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditor__SkeletonMainContent",
  componentId: "sc-133np0d-6"
})(["flex:1;display:flex;overflow:hidden;"]);
const SkeletonCanvasArea = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditor__SkeletonCanvasArea",
  componentId: "sc-133np0d-7"
})(["flex:1;background:", ";padding:32px;padding-top:64px;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto;"], easyblocksDesignSystem.Colors.black10);
const SkeletonSidebar = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditor__SkeletonSidebar",
  componentId: "sc-133np0d-8"
})(["flex:0 0 240px;background:", ";border-left:1px solid ", ";padding:16px;display:flex;flex-direction:column;gap:24px;"], easyblocksDesignSystem.Colors.white, easyblocksDesignSystem.Colors.black100);
const SkeletonSection = styled__default["default"].div.withConfig({
  displayName: "SkeletonEditor__SkeletonSection",
  componentId: "sc-133np0d-9"
})(["display:flex;flex-direction:column;gap:12px;"]);
const SkeletonEditor = () => {
  return /*#__PURE__*/React__default["default"].createElement(SkeletonEditorContainer, null, /*#__PURE__*/React__default["default"].createElement(SkeletonTopBar, null, /*#__PURE__*/React__default["default"].createElement(SkeletonTopBarLeft, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "28px",
    height: "28px",
    borderRadius: "4px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "28px",
    height: "28px",
    borderRadius: "4px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "28px",
    height: "28px",
    borderRadius: "4px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "60px",
    height: "28px",
    borderRadius: "6px"
  })), /*#__PURE__*/React__default["default"].createElement(SkeletonTopBarCenter, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "28px",
    height: "28px",
    borderRadius: "4px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "28px",
    height: "28px",
    borderRadius: "4px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "28px",
    height: "28px",
    borderRadius: "4px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "28px",
    height: "28px",
    borderRadius: "4px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "28px",
    height: "28px",
    borderRadius: "4px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "28px",
    height: "28px",
    borderRadius: "4px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "28px",
    height: "28px",
    borderRadius: "4px"
  })), /*#__PURE__*/React__default["default"].createElement(SkeletonTopBarRight, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100px",
    height: "28px",
    borderRadius: "6px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "60px",
    height: "28px",
    borderRadius: "6px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "86px",
    height: "28px",
    borderRadius: "6px"
  }))), /*#__PURE__*/React__default["default"].createElement(SkeletonMainContent, null, /*#__PURE__*/React__default["default"].createElement(SkeletonCanvasArea, null, /*#__PURE__*/React__default["default"].createElement(SkeletonEditorCanvasArea$1, null)), /*#__PURE__*/React__default["default"].createElement(SkeletonSidebar, null, /*#__PURE__*/React__default["default"].createElement(SkeletonSection, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100px",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  })), /*#__PURE__*/React__default["default"].createElement(SkeletonSection, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "120px",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  })), /*#__PURE__*/React__default["default"].createElement(SkeletonSection, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "80px",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  })), /*#__PURE__*/React__default["default"].createElement(SkeletonSection, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "80px",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  })), /*#__PURE__*/React__default["default"].createElement(SkeletonSection, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100px",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  })), /*#__PURE__*/React__default["default"].createElement(SkeletonSection, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "120px",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  })), /*#__PURE__*/React__default["default"].createElement(SkeletonSection, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "120px",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  })), /*#__PURE__*/React__default["default"].createElement(SkeletonSection, null, /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "80px",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  }), /*#__PURE__*/React__default["default"].createElement(SkeletonBox, {
    width: "100%",
    height: "18px"
  })))));
};

/** One selectable template category. */

/**
 * Template category access, exposed by the host app's backend on top of the
 * `Backend` contract in `easyblocks-core`.
 *
 * Both members are optional on purpose. A host that does not implement them
 * keeps the previous behaviour — no category field at all — instead of
 * presenting a required field nobody can satisfy.
 */

/**
 * What this modal sends when saving.
 *
 * `category_uuid` is the real relation; `group` stays the human-readable label
 * and is filled from the chosen category's name rather than from typing. The
 * free-text field it replaces is what let a shop write "Layout" and land its
 * own template among the built-in Layout components.
 *
 * Declared as a named type and passed as a variable rather than inlined at the
 * call: the contract in `easyblocks-core` does not yet mention `category_uuid`,
 * and an inline object literal would be rejected for that extra member while a
 * typed variable is simply assignable to it.
 */

const TemplateModal = props => {
  const [error, setError] = React.useState(null);
  const mode = props.action.mode;
  const backend = props.backend;
  const editorContext = useEditorContext();
  const [isLoadingEdit, setLoadingEdit] = React.useState(false);
  const [isLoadingDelete, setLoadingDelete] = React.useState(false);
  const [isUploadingFile, setIsUploadingFile] = React.useState(false);
  const toaster = Toaster.useToaster();
  const {
    t
  } = useTranslation();

  // Same widening trick as the sidebar: every added member is optional, so the
  // plain contract still satisfies the intersection.
  const templatesApi = backend.templates;
  const canListCategories = typeof templatesApi.getCategories === "function";
  const canCreateCategory = typeof templatesApi.createCategory === "function";
  const [categories, setCategories] = React.useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(false);
  // Whether the listing actually came back. A failed call must not be mistaken
  // for "this shop has no categories".
  const [didLoadCategories, setDidLoadCategories] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState(() => props.action.mode === "edit" ? props.action.template.category_uuid ?? "" : "");
  // Inline category creation, open only while the user is typing a new name.
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [isSavingCategory, setIsSavingCategory] = React.useState(false);
  const [template, setTemplate] = React.useState(() => {
    if (props.action.mode === "edit") {
      return props.action.template;
    } else {
      return {
        label: "",
        group: "",
        thumbnail: "",
        thumbnailLabel: "",
        entry: props.action.config
      };
    }
  });
  const {
    label = "",
    group = "",
    thumbnail = "",
    thumbnailLabel = ""
  } = template;
  const open = props.action !== undefined;
  const selectedCategory = React.useMemo(() => categories.find(category => category.id === categoryId), [categories, categoryId]);

  /**
   * A category is mandatory — but only once there is one to pick.
   *
   * Demanding it unconditionally would lock the shop out of saving anything at
   * all on the day this ships: the table starts empty, and a listing that fails
   * or a gateway that has not deployed these routes yet would look exactly like
   * a shop with no categories. So the rule binds when the list came back with
   * entries, and the "add a category" affordance covers the empty case.
   */
  const isCategoryMissing = canListCategories && didLoadCategories && categories.length > 0 && !categoryId;
  const canSend = label.trim() !== "" && !isCategoryMissing;
  const ctaLabel = t("template.save.default");
  const validateUploadImage = file => {
    if (file.size > (backend.attachments?.maxSizeUpload.image ?? 0)) {
      toaster.notify(t("error.file.max-size-upload"));
      return false;
    }
    return true;
  };
  const onClearFile = () => {
    const input = document.querySelector('input[type="file"]');
    if (input) {
      input.value = "";
    }
    setTemplate(prev => ({
      ...prev,
      thumbnail: ""
    }));
  };
  const onUploadFile = async event => {
    const targetFile = event.target.files?.[0];
    const userId = backend.userId;
    if (!targetFile) {
      toaster.notify(t("error.file.notFound"));
      return;
    }
    if (props.mode && !userId) {
      toaster.notify(t("error.userId.notFound"));
      return;
    }
    const isValidUploadImage = validateUploadImage(targetFile);
    setIsUploadingFile(true);
    if (!isValidUploadImage) {
      setIsUploadingFile(false);
      return;
    }
    try {
      const imageUploaded = await backend.attachments?.create({
        userId: String(userId),
        fileUpload: targetFile
      });
      if (imageUploaded) {
        const {
          url
        } = imageUploaded?.data ?? {};
        setTemplate(prev => ({
          ...prev,
          thumbnail: url
        }));
      }
    } catch (e) {
      toaster.error(t("error.file.failedToUpload"));
    } finally {
      setIsUploadingFile(false);
    }
  };
  React.useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  // Load the selectable categories. Read-only: the list the shop is allowed to
  // see (its own plus the system ones) is decided server-side.
  React.useEffect(() => {
    const getCategories = templatesApi.getCategories;
    if (!getCategories) return;
    let cancelled = false;
    setIsLoadingCategories(true);
    getCategories().then(items => {
      if (cancelled) return;
      setCategories(items);
      setDidLoadCategories(true);
    }).catch(() => {
      if (cancelled) return;
      // Stays false on purpose: saving keeps working while the category
      // source is unreachable, instead of silently disabling the button.
      setDidLoadCategories(false);
      toaster.error(t("template.category.load.error"));
    }).finally(() => {
      if (!cancelled) setIsLoadingCategories(false);
    });
    return () => {
      cancelled = true;
    };
  }, [backend]);
  const onCreateCategory = async () => {
    const createCategory = templatesApi.createCategory;
    const name = newCategoryName.trim();
    if (!createCategory || !name || isSavingCategory) return;
    setIsSavingCategory(true);
    try {
      const created = await createCategory({
        name
      });
      setCategories(prev => [...prev, created]);
      setDidLoadCategories(true);
      setCategoryId(created.id);
      setNewCategoryName("");
      setIsAddingCategory(false);
      toaster.success(t("template.category.create.success"));
    } catch {
      toaster.error(t("template.category.create.error"));
    } finally {
      setIsSavingCategory(false);
    }
  };
  return /*#__PURE__*/React__default["default"].createElement(modals.Modal, {
    title: t("template.save.title"),
    isOpen: true,
    onRequestClose: () => {
      props.onClose();
    },
    mode: "center-small",
    headerLine: true,
    maxHeight: "470px"
  }, /*#__PURE__*/React__default["default"].createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setError(null);
      if (!canSend) {
        return;
      }
      setLoadingEdit(true);

      // The label shown in the picker follows the chosen category; with no
      // category source the previously stored string is kept untouched.
      const nextGroup = canListCategories ? selectedCategory?.name ?? group : group;
      const nextCategoryId = canListCategories ? categoryId : undefined;
      if (mode === "create") {
        const createAction = props.action;
        const payload = {
          label,
          group: nextGroup,
          category_uuid: nextCategoryId,
          thumbnail,
          thumbnailLabel,
          entry: createAction.config,
          width: createAction.width,
          widthAuto: createAction.widthAuto
        };
        backend.templates.create(payload).then(newTemplate => {
          editorContext.syncTemplates({
            mode: "create",
            template: {
              id: newTemplate.id,
              ...template,
              group: nextGroup
            }
          });
          toaster.success(t("template.save.success"));
          props.onClose();
        }).catch(() => {
          toaster.error(t("template.save.error"));
        }).finally(() => {
          setLoadingEdit(false);
        });
      } else {
        const payload = {
          label,
          group: nextGroup,
          category_uuid: nextCategoryId,
          thumbnail,
          thumbnailLabel,
          id: template.id
        };
        backend.templates.update(payload).then(() => {
          editorContext.syncTemplates({
            mode: "edit",
            template: {
              ...template,
              group: nextGroup
            }
          });
          toaster.success(t("template.save.success"));
          props.onClose();
        }).catch(() => {
          toaster.error(t("template.save.error"));
        }).finally(() => {
          setLoadingEdit(false);
        });
      }
    }
  }, error && /*#__PURE__*/React__default["default"].createElement("div", null, error), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      marginTop: "8px"
    }
  }, /*#__PURE__*/React__default["default"].createElement(FormElement.FormElement, {
    name: "label",
    label: t("template.save.name")
  }, /*#__PURE__*/React__default["default"].createElement(Input.Input, {
    placeholder: t("template.save.name"),
    required: true,
    value: label,
    onChange: e => {
      setTemplate({
        ...template,
        label: e.target.value
      });
    },
    withBorder: true,
    controlSize: "full-width",
    autoFocus: true
  })), canListCategories && /*#__PURE__*/React__default["default"].createElement(FormElement.FormElement, {
    name: "category",
    label: t("template.save.category")
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      width: "100%"
    }
  }, /*#__PURE__*/React__default["default"].createElement(Select.Select, {
    value: categoryId,
    onChange: setCategoryId,
    placeholder: isLoadingCategories ? t("loading") : t("template.save.category.placeholder"),
    style: {
      width: "100%"
    }
  }, categories.map(category => /*#__PURE__*/React__default["default"].createElement(Select.SelectItem, {
    key: category.id,
    value: category.id
  }, category.name))), !isLoadingCategories && didLoadCategories && categories.length === 0 && !isAddingCategory && /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    variant: "body"
  }, t("template.category.empty")), canCreateCategory && (isAddingCategory ? /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React__default["default"].createElement(Input.Input, {
    placeholder: t("template.category.name"),
    value: newCategoryName,
    onChange: e => setNewCategoryName(e.target.value)
    // Enter inside a nested field must create the category,
    // not submit the template form behind it.
    ,
    onKeyDown: e => {
      if (e.key === "Enter") {
        e.preventDefault();
        onCreateCategory();
      }
    },
    withBorder: true,
    controlSize: "full-width"
  }), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonPrimary, {
    type: "button",
    isLoading: isSavingCategory,
    disabled: !newCategoryName.trim(),
    onClick: e => {
      e.preventDefault();
      onCreateCategory();
    }
  }, t("add")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    type: "button",
    onClick: e => {
      e.preventDefault();
      setIsAddingCategory(false);
      setNewCategoryName("");
    }
  }, t("cancel"))) : /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    type: "button",
    onClick: e => {
      e.preventDefault();
      setIsAddingCategory(true);
    }
  }, t("template.category.create"))))), /*#__PURE__*/React__default["default"].createElement(FormElement.FormElement, {
    name: "thumbnail",
    label: t("template.save.thumbnailLink"),
    position: "start"
  }, /*#__PURE__*/React__default["default"].createElement(Input.InputFile, {
    src: thumbnail,
    alt: t("template.save.thumbnailLink"),
    onChange: onUploadFile,
    onClearFile: onClearFile,
    isLoading: isUploadingFile
  })), /*#__PURE__*/React__default["default"].createElement(FormElement.FormElement, {
    name: "thumbnailLabel",
    label: t("template.save.thumbnailLabel")
  }, /*#__PURE__*/React__default["default"].createElement(Input.Input, {
    placeholder: t("template.save.thumbnailLabel"),
    value: thumbnailLabel,
    onChange: e => {
      setTemplate({
        ...template,
        thumbnailLabel: e.target.value
      });
    },
    withBorder: true,
    controlSize: "full-width"
  })), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
      gap: 10
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      order: 2
    }
  }, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonPrimary, {
    type: "submit",
    disabled: !canSend,
    isLoading: isLoadingEdit,
    style: {
      opacity: !canSend ? 0.7 : 1
    }
  }, ctaLabel)), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      order: 1
    }
  }, mode === "edit" && /*#__PURE__*/React__default["default"].createElement(buttons.ButtonDanger, {
    onClick: e => {
      e.preventDefault();
      setLoadingDelete(true);
      backend.templates.delete({
        id: template.id
      }).then(() => {
        editorContext.syncTemplates({
          mode: "delete",
          template: template
        });
        toaster.success(t("template.delete.success"));
        props.onClose();
      }).catch(() => {
        toaster.error(t("template.delete.error"));
      }).finally(() => {
        setLoadingDelete(false);
      });
    },
    isLoading: isLoadingDelete
  }, t("template.delete.default")))))));
};

const takeNumbers = path => path.split(".").map(x => parseInt(x, 10)).filter(x => !Number.isNaN(x));
const preOrderPathComparator = (direction = "ascending") => (pathA, pathB) => {
  const order = direction === "ascending" ? 1 : -1;
  const numbersA = takeNumbers(pathA);
  const numbersB = takeNumbers(pathB);
  const numberALength = numbersA.length;
  const numberBLength = numbersB.length;
  if (numberALength === 0 || numberBLength === 0) {
    throw new Error(`Cannot compare paths '${pathA}' and '${pathB}'.`);
  }
  const shorterLength = Math.min(numberALength, numberBLength);
  let index = 0;
  while (index < shorterLength) {
    const valueA = numbersA[index];
    const valueB = numbersB[index];
    if (valueA !== valueB) {
      return order * Math.sign(valueA - valueB);
    }
    index++;
  }
  return order * Math.sign(numberBLength - numberALength);
};

function duplicateItem(form, {
  name,
  sourceIndex,
  targetIndex
}, compilationContext) {
  // Placeholders are not copyable
  if (isPlaceholder(name + "." + sourceIndex, form.values)) {
    return;
  }
  const configToDuplicate = dotNotationGet(form.values, name + "." + sourceIndex);
  form.mutators.insert(name, targetIndex, _internals.duplicateConfig(configToDuplicate, compilationContext));
}
function pasteItems({
  what,
  where,
  resolveDestination,
  pasteCommand
}) {
  const successfulInsertsPaths = [];
  takeLastOfEachParent(where).sort(preOrderPathComparator()).map(initialDestination => {
    const destination = successfulInsertsPaths.reduce((acc, current) => shiftPath(acc, current, "downward"), initialDestination);
    const resolvedDestinations = resolveDestination(destination);
    return pasteCommand(resolvedDestinations);
  }).forEach(paste => {
    what.forEach(item => {
      const insertedPath = paste(item);
      if (insertedPath) {
        successfulInsertsPaths.push(insertedPath);
      }
    });
  });
  return successfulInsertsPaths.length !== 0 ? successfulInsertsPaths : where;
}

/**
 * Duplicates fields given in `fieldNames` within given `form`.
 * `compilationContext` is used to properly duplicate elements associated with given names.
 * @returns Array of fields to focus
 */
function duplicateItems(form, fieldNames, compilationContext) {
  const duplicatableFieldNames = fieldNames.filter(fieldName => isFieldDuplicatable(fieldName, form, compilationContext));
  if (duplicatableFieldNames.length === 0) {
    return;
  }
  const fieldsGroupedByParentPath = groupFieldsByParentPath(duplicatableFieldNames, "ascending");
  const nextFocusedFieldsPerGroup = [];
  Object.values(fieldsGroupedByParentPath).forEach((sortedFields, fieldsGroupIndex) => {
    nextFocusedFieldsPerGroup.push([]);
    const lastFieldIndex = getFieldPathIndex(last(sortedFields));
    sortedFields.forEach((focusedField, fieldIndex) => {
      const sourceIndex = getFieldPathIndex(focusedField);
      const targetIndex = lastFieldIndex + 1 + fieldIndex;
      const parentPath = getParentPath(focusedField);
      duplicateItem(form, {
        name: parentPath,
        sourceIndex,
        targetIndex
      }, compilationContext);
      nextFocusedFieldsPerGroup[fieldsGroupIndex].push(`${parentPath}.${lastFieldIndex + 1 + fieldIndex}`);
    });
  });
  return nextFocusedFieldsPerGroup.flat();
}
function moveItem(form, {
  from,
  to,
  name
}) {
  // Placeholders are not movable
  if (isPlaceholder(name + "." + from, form.values)) {
    return;
  }
  form.mutators.move(name, from, to);
}

/**
 * Moves fields given in `fieldNamesToRemove` within given `form` in given `direction`.
 * @returns Array of fields to focus.
 */
function moveItems(form, fieldsToMove, direction) {
  const nextFocusedFields = [];
  const isMovingMultipleFields = fieldsToMove.length > 1;
  if (direction === "top" || direction === "left") {
    const fieldsGroupedByParentPath = groupFieldsByParentPath(fieldsToMove, "ascending");
    Object.values(fieldsGroupedByParentPath).forEach(sortedFields => {
      let wasAnyFieldWithinCurrentGroupMoved = false;
      sortedFields.forEach((fieldName, fieldNameIndex) => {
        const index = getFieldPathIndex(fieldName);
        const parentPath = getParentPath(fieldName);
        if (isFirst(fieldName)) {
          if (isMovingMultipleFields) {
            nextFocusedFields.push(fieldName);
          }
          return;
        }
        if (isMovingMultipleFields && fieldNameIndex > 0 && !wasAnyFieldWithinCurrentGroupMoved) {
          nextFocusedFields.push(fieldName);
          return;
        }
        moveItem(form, {
          from: index,
          name: parentPath,
          to: index - 1
        });
        if (!wasAnyFieldWithinCurrentGroupMoved) {
          wasAnyFieldWithinCurrentGroupMoved = true;
        }
        nextFocusedFields.push(`${parentPath}.${index - 1}`);
      });
    });
    if (nextFocusedFields.length > 0) {
      return nextFocusedFields;
    }
  } else {
    const fieldsGroupedByParentPath = groupFieldsByParentPath(fieldsToMove, "descending");
    Object.values(fieldsGroupedByParentPath).forEach(sortedFields => {
      let wasAnyFieldWithinCurrentGroupMoved = false;
      sortedFields.forEach((fieldName, fieldNameIndex) => {
        if (isLast(fieldName, form)) {
          if (isMovingMultipleFields) {
            nextFocusedFields.push(fieldName);
          }
          return;
        }
        if (isMovingMultipleFields && fieldNameIndex > 0 && !wasAnyFieldWithinCurrentGroupMoved) {
          nextFocusedFields.push(fieldName);
          return;
        }
        const index = getFieldPathIndex(fieldName);
        const parentPath = getParentPath(fieldName);
        moveItem(form, {
          name: parentPath,
          from: index,
          to: index + 1
        });
        if (!wasAnyFieldWithinCurrentGroupMoved) {
          wasAnyFieldWithinCurrentGroupMoved = true;
        }
        nextFocusedFields.push(`${parentPath}.${index + 1}`);
      });
    });
    if (nextFocusedFields.length > 0) {
      return nextFocusedFields;
    }
  }
}
function removeItem(form, {
  index,
  name
}) {
  const configPathToRemove = name + "." + index;

  // Placeholders are not removable
  if (isPlaceholder(configPathToRemove, form.values)) {
    return;
  }
  const componentConfigValue = dotNotationGet(form.values, name);
  if (componentConfigValue.length === 1) {
    form.change(name, []);
  } else {
    form.mutators.remove(name, index);
  }
}

/**
 * Removes fields given in `fieldNamesToRemove` from given `form`.
 * @returns Array of fields to focus
 */
function removeItems(form, fieldNamesToRemove, editorContext) {
  const removableFieldNames = fieldNamesToRemove.filter(fieldName => isFieldRemovable(fieldName, form, editorContext));
  if (removableFieldNames.length === 0) {
    return;
  }
  const isRemovingMultipleFields = removableFieldNames.length > 1;
  const fieldsGroupedByParentPath = groupFieldsByParentPath(removableFieldNames, "descending");
  if (!isRemovingMultipleFields) {
    const {
      index,
      parent,
      templateId
    } = _internals.parsePath(removableFieldNames[0], form);
    if (index === undefined || !parent) {
      throw new Error("Invalid path");
    }
    const fieldPath = `${parent.path}${parent.path === "" ? "" : "."}${parent.fieldName}`;
    const itemsLength = dotNotationGet(form.values, fieldPath).length;
    const isOnlyItem = itemsLength === 1;
    const isLastItem = itemsLength - 1 === index;
    removeItem(form, {
      index,
      name: fieldPath
    });
    const definition = _internals.findComponentDefinitionById(templateId, editorContext);
    const isTextWrapper = definition && easyblocksCore.isNoCodeComponentOfType(definition, "@easyblocks/text-wrapper");

    // If we're removing item from the text wrapper field let's focus the component holding that field for better UX
    // TODO: We shouldn't decide based on the component type but rather on the source of the removal (canvas vs sidebar)
    if (isTextWrapper) {
      return [parent.path];
    }
    if (isOnlyItem) {
      return [];
    } else if (isLastItem) {
      return [`${fieldPath}.${index - 1}`];
    } else {
      return [`${fieldPath}.${index}`];
    }
  }
  Object.values(fieldsGroupedByParentPath).forEach(sortedFields => {
    sortedFields.forEach(focusedField => {
      const field = dotNotationGet(form.values, focusedField);

      // Field could be already removed if its parent element was also selected
      if (!field) {
        return;
      }
      const index = getFieldPathIndex(focusedField);
      const parentPath = getParentPath(focusedField);
      removeItem(form, {
        index,
        name: parentPath
      });
    });
  });
  return [];
}
function replaceItems(paths, newConfig, editorContext) {
  paths.forEach(path => {
    dotNotationGet(editorContext.form.values, path);
    editorContext.form.change(path, _internals.duplicateConfig(
    // newConfig && oldConfig
    //   ? changeComponentConfig(oldConfig, newConfig, editorContext)
    //   : newConfig,
    newConfig, editorContext));
  });
}
function logItems(form, configPaths) {
  const configValues = configPaths.map(configPath => {
    return dotNotationGet(form.values, configPath);
  });
  configValues.forEach((config, index) => {
    console.log("Config for", configPaths[index], config);
  });
}
function groupFieldsByParentPath(fields, sortDirection) {
  const fieldsIndicesGroupedByParentPath = fields.reduce((accumulator, currentField) => {
    const index = getFieldPathIndex(currentField);
    const parentPath = getParentPath(currentField);
    const indices = accumulator[parentPath];
    if (indices) {
      accumulator[parentPath] = [...indices, index].sort((a, b) => {
        return sortDirection === "descending" ? b - a : a - b;
      });
      return accumulator;
    }
    accumulator[parentPath] = [index];
    return accumulator;
  }, {});
  return Object.fromEntries(Object.entries(fieldsIndicesGroupedByParentPath).map(([parentPath, indices]) => {
    return [parentPath, indices.map(index => parentPath + "." + index)];
  }));
}
function getFieldPathIndex(fieldPath) {
  const index = +last(fieldPath.split("."));
  if (Number.isNaN(index)) {
    return -1;
  }
  return index;
}
function getParentPath(fieldPath) {
  const fieldPathParts = fieldPath.split(".");
  return fieldPathParts.slice(0, -1).join(".");
}
function isFirst(fieldPath) {
  const index = getFieldPathIndex(fieldPath);
  return index === 0;
}
function isLast(fieldPath, form) {
  const index = getFieldPathIndex(fieldPath);
  const parentPath = getParentPath(fieldPath);
  const parentFieldElementsCount = dotNotationGet(form.values, parentPath).length;
  return index === parentFieldElementsCount - 1;
}
function isPlaceholder(path, values) {
  const templateId = dotNotationGet(values, path)._component;
  return templateId.startsWith("$Placeholder");
}
function isFieldRemovable(fieldName, form, compilationContext) {
  const {
    parent
  } = _internals.parsePath(fieldName, form);
  if (parent) {
    const parentComponentDefinition = _internals.findComponentDefinitionById(parent.templateId, compilationContext);
    const fieldNameParent = last(getParentPath(fieldName).split("."));
    const fieldSchema = parentComponentDefinition?.schema.find(schema => schema.prop === fieldNameParent);
    if (fieldSchema && fieldSchema.type === "component" && fieldSchema.required) {
      return false;
    }
  }
  return true;
}
function isFieldDuplicatable(fieldName, form, compilationContext) {
  return isFieldRemovable(fieldName, form, compilationContext);
}
const shiftPath = (originalPath, shiftingPath, direction = "downward") => {
  const directionFactor = direction === "downward" ? 1 : -1;
  const original = shiftingPath.split(".");
  const shifting = originalPath.split(".");
  if (original.length < 2) {
    return originalPath;
  }
  let index = 0;
  while (index < original.length - 1 && index < shifting.length - 1) {
    if (shifting[index] !== original[index]) {
      return originalPath;
    }
    if (shifting[index + 1] !== original[index + 1]) {
      const numberA = Number(original[index + 1]);
      const numberB = Number(shifting[index + 1]);
      if (numberA < numberB && (index + 1 == original.length - 1 || index + 1 === shifting.length - 1)) {
        shifting.splice(index + 1, 1, String(numberB + directionFactor));
        return shifting.join(".");
      } else {
        return originalPath;
      }
    }
    index += 2;
  }
  return originalPath;
};
function takeLastOfEachParent(where) {
  const lastOfEachParent = where.reduce((acc, curr) => {
    const trimmed = getParentPath(curr);
    const index = getFieldPathIndex(curr);
    acc[trimmed] = Math.max(index, acc[trimmed] ?? Number.MIN_SAFE_INTEGER);
    return acc;
  }, {});
  return Object.entries(lastOfEachParent).map(([key, value]) => `${key}.${value}`);
}

const SelectionMoreActionsContainer = styled__default["default"].div.withConfig({
  displayName: "Menu__SelectionMoreActionsContainer",
  componentId: "sc-7fauqp-0"
})(["", " border-radius:4px;box-shadow:var(--tina-shadow-big);width:max-content;background:", ";pointer-events:all;"], ({
  styles
}) => `
    position: ${styles?.top && styles?.left ? "absolute" : "unset"};
    top: ${styles?.top ?? "unset"};
    left: ${styles?.left ?? "unset"};
  `, easyblocksDesignSystem.Colors.white);
const SelectionMoreActionsGroupButtons = styled__default["default"].div.withConfig({
  displayName: "Menu__SelectionMoreActionsGroupButtons",
  componentId: "sc-7fauqp-1"
})(["height:36px;position:relative;padding:0px 16px;display:flex;align-items:center;gap:2px;cursor:pointer;&:hover{background:", ";}"], easyblocksDesignSystem.Colors.black10);
const MenuItem = ({
  menu
}) => {
  const [isHoverMenu, setIsHoverMenu] = React.useState(false);
  const menuItemRef = React.useRef(null);
  const onClickMenu = () => {
    if (!menu.isLoading) {
      return !menu?.children?.length ? menu?.onClick?.() : undefined;
    }
  };
  return /*#__PURE__*/React__default["default"].createElement(SelectionMoreActionsGroupButtons, {
    ref: menuItemRef,
    onMouseEnter: () => setIsHoverMenu(true),
    onMouseLeave: () => setIsHoverMenu(false),
    onClick: onClickMenu
  }, /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    style: {
      cursor: "pointer"
    },
    variant: "body",
    component: "label"
  }, menu.isLoading ? /*#__PURE__*/React__default["default"].createElement(Loader.Loader, null) : menu.label), menu?.children?.length ? /*#__PURE__*/React__default["default"].createElement(icons.Icons.ChevronRight, {
    size: 18
  }) : null, isHoverMenu && menu?.children ? /*#__PURE__*/React__default["default"].createElement(Menu, {
    styles: {
      top: "0px",
      left: `${menuItemRef.current?.offsetWidth ?? 0}px`
    },
    menus: menu.children
  }) : null);
};
const Menu = ({
  menus,
  styles
}) => {
  return /*#__PURE__*/React__default["default"].createElement(SelectionMoreActionsContainer, {
    styles: styles
  }, menus.filter(menu => !menu.isHidden).map(menu => /*#__PURE__*/React__default["default"].createElement(MenuItem, {
    key: menu.id,
    menu: menu
  })));
};

const StyledEditorGlobalSectionItem = styled__default["default"].div.withConfig({
  displayName: "EditorGlobalSectionItem__StyledEditorGlobalSectionItem",
  componentId: "sc-5k1508-0"
})(["display:flex;align-items:center;justify-content:space-between;padding:0px 10px 0px 16px;height:38px;"]);
const StyledWrapperMenu = styled__default["default"].div.withConfig({
  displayName: "EditorGlobalSectionItem__StyledWrapperMenu",
  componentId: "sc-5k1508-1"
})(["position:relative;display:flex;align-items:center;gap:4px;"]);
const StyledWrapperCheckIcon = styled__default["default"].div.withConfig({
  displayName: "EditorGlobalSectionItem__StyledWrapperCheckIcon",
  componentId: "sc-5k1508-2"
})(["cursor:pointer;"]);
const StyledWrapperThreeDotsIcon = styled__default["default"].div.withConfig({
  displayName: "EditorGlobalSectionItem__StyledWrapperThreeDotsIcon",
  componentId: "sc-5k1508-3"
})(["cursor:pointer;&:hover{transform:scale(1.2);}"]);
const StyledWrapperMenuDialog = styled__default["default"].div.withConfig({
  displayName: "EditorGlobalSectionItem__StyledWrapperMenuDialog",
  componentId: "sc-5k1508-4"
})(["position:absolute;top:20px;right:0px;z-index:1;"]);
const StyledWrapperAddToPage = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorGlobalSectionItem__StyledWrapperAddToPage",
  componentId: "sc-5k1508-5"
})(["font-weight:500;cursor:pointer;color:", " !important;", ""], easyblocksDesignSystem.Colors.blue60, ({
  disabled
}) => disabled ? `
    cursor: not-allowed;
    user-select: none;
    opacity: 0.7;
    ` : `
      &:hover {
        color: ${easyblocksDesignSystem.Colors.blue50};
      }`);
const StyledWrapperLabel = styled__default["default"].div.withConfig({
  displayName: "EditorGlobalSectionItem__StyledWrapperLabel",
  componentId: "sc-5k1508-6"
})(["width:190px;"]);
const StyledLabel$1 = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorGlobalSectionItem__StyledLabel",
  componentId: "sc-5k1508-7"
})(["text-overflow:ellipsis;white-space:nowrap;overflow:hidden;"]);
const EditorGlobalSectionItem = ({
  group,
  groupItem,
  setOpenDeleteConfirm,
  setOpenEditSection
}) => {
  const editorContext = useEditorContext();
  const router = new URLSearchParams(window.location.search);
  const currentDocument = router.get("document") ?? "";
  const {
    t
  } = useTranslation();
  const menuRef = React.useRef(null);
  const [openMenu, setOpenMenu] = React.useState(null);
  const isAddedToPage = groupItem.pages.includes(currentDocument);
  const onOpenMenu = entryId => {
    setOpenMenu({
      entryId
    });
  };
  const onCloseMenu = () => {
    setOpenMenu(null);
  };
  const onAddToPage = () => {
    const targetEntry = groupItem.entry;
    if (targetEntry?._component && Object.keys(targetEntry).length) {
      let index = 0;
      switch (group.name) {
        case "Headers":
          {
            index = 0;
            break;
          }
        case "Footers":
          {
            index = (editorContext.compiledComponentConfig?.components.data.length ?? 0) + 1;
            break;
          }
      }
      editorContext.actions.insertItem({
        index,
        block: targetEntry,
        name: "data",
        keepId: true
      });
    }
  };
  React.useEffect(() => {
    const modalContainer = document.getElementById("modalContainer");
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !modalContainer?.contains(event.target) && openMenu?.entryId) {
        onCloseMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);
  return /*#__PURE__*/React__default["default"].createElement(StyledEditorGlobalSectionItem, null, /*#__PURE__*/React__default["default"].createElement(Tooltip$1.Tooltip, null, /*#__PURE__*/React__default["default"].createElement(Tooltip$1.TooltipTrigger, null, /*#__PURE__*/React__default["default"].createElement(StyledWrapperLabel, null, /*#__PURE__*/React__default["default"].createElement(StyledLabel$1, null, groupItem.label))), /*#__PURE__*/React__default["default"].createElement(Tooltip$1.TooltipContent, null, /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    color: "white"
  }, groupItem.label))), /*#__PURE__*/React__default["default"].createElement(StyledWrapperMenu, {
    ref: menuRef
  }, isAddedToPage ? /*#__PURE__*/React__default["default"].createElement(StyledWrapperCheckIcon, null, /*#__PURE__*/React__default["default"].createElement(icons.Icons.Check, {
    size: 16
  })) : /*#__PURE__*/React__default["default"].createElement(StyledWrapperAddToPage, {
    disabled: !groupItem.entry?._component,
    onClick: onAddToPage
  }, t("add")), /*#__PURE__*/React__default["default"].createElement(StyledWrapperThreeDotsIcon, {
    onClick: () => onOpenMenu(groupItem.id)
  }, /*#__PURE__*/React__default["default"].createElement(icons.Icons.ThreeDotsHorizontal, {
    size: 16
  })), openMenu && openMenu.entryId === groupItem.id ? /*#__PURE__*/React__default["default"].createElement(StyledWrapperMenuDialog, null, /*#__PURE__*/React__default["default"].createElement(Menu, {
    menus: [{
      id: `delete-section-${groupItem.id}`,
      label: t("delete"),
      onClick: () => {
        setOpenDeleteConfirm({
          entryId: groupItem.id,
          sectionName: groupItem.label,
          groupName: group.name
        });
      }
    }, {
      id: `rename-section-${groupItem.id}`,
      label: t("rename"),
      onClick: () => {
        setOpenEditSection({
          label: groupItem.label,
          entry: groupItem.entry,
          groupName: group.name
        });
      }
    }]
  })) : null));
};

const HorizontalLine$1 = styled__default["default"].div.withConfig({
  displayName: "EditorGlobalSections__HorizontalLine",
  componentId: "sc-1fxbds7-0"
})(["height:1px;margin-top:-1px;background-color:", ";"], easyblocksDesignSystem.Colors.black10);
const StyledEditorGlobalSectionsDescription = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorGlobalSections__StyledEditorGlobalSectionsDescription",
  componentId: "sc-1fxbds7-1"
})(["padding-bottom:20px;padding-left:12px;padding-right:12px;"]);
const StyledEditorGlobalSectionGroup = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorGlobalSections__StyledEditorGlobalSectionGroup",
  componentId: "sc-1fxbds7-2"
})(["padding:10px 0px;"]);
const StyledButtonGroup$1 = styled__default["default"].div.withConfig({
  displayName: "EditorGlobalSections__StyledButtonGroup",
  componentId: "sc-1fxbds7-3"
})(["display:flex;flex-direction:row;justify-content:flex-end;margin-top:14px;gap:12px;"]);
const EditorGlobalSections = ({
  globalSections
}) => {
  const {
    t
  } = useTranslation();
  const editorContext = useEditorContext();
  const inputRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(null);
  const [openEditSection, setOpenEditSection] = React.useState(null);
  const onCloseConfirm = () => {
    if (!isLoading) {
      setOpenDeleteConfirm(null);
    }
  };
  const onCloseEditSection = () => {
    if (!isLoading) {
      setOpenEditSection(null);
    }
  };
  const onConfirmDeleteSection = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    editorContext.onGlobalSectionChange?.({
      mode: "delete",
      groupName: openDeleteConfirm?.groupName ?? "",
      entry: {
        _id: openDeleteConfirm?.entryId ?? "",
        _component: ""
      }
    }).then(() => {
      setIsLoading(false);
      onCloseConfirm();
    }).catch(() => {
      setIsLoading(false);
    });
  };
  const onEditSection = () => {
    if (isLoading || !inputRef?.current?.value) {
      return;
    }
    setIsLoading(true);
    editorContext.onGlobalSectionChange?.({
      mode: "update",
      ...openEditSection,
      groupName: openEditSection?.groupName ?? "",
      label: inputRef.current.value
    }).then(() => {
      setIsLoading(false);
      onCloseEditSection();
    }).catch(() => {
      setIsLoading(false);
    });
  };
  const onEnter = e => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault();
      e.stopPropagation();
      onEditSection();
    }
  };
  React.useEffect(() => {
    if (openEditSection?.groupName) {
      queueMicrotask(() => {
        inputRef.current?.focus();
      });
    }
  }, [openEditSection]);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(StyledEditorGlobalSectionsDescription, null, t("editor.sidebar.globalSections.description")), /*#__PURE__*/React__default["default"].createElement(HorizontalLine$1, null), /*#__PURE__*/React__default["default"].createElement(StyledEditorGlobalSectionGroup, null, easyblocksCore.globalSectionGroups.map(globalSectionGroup => {
    const globalSectionGroupItem = globalSections?.[globalSectionGroup.name];
    return /*#__PURE__*/React__default["default"].createElement(AccordionGroup.AccordionGroup, {
      key: globalSectionGroup.id,
      id: globalSectionGroup.id,
      title: globalSectionGroup.name,
      subTitle: ` (${Object.keys(globalSectionGroupItem?.orders ?? {}).length})`
    }, globalSectionGroupItem?.orders?.map(entryId => {
      const entryValue = globalSectionGroupItem.entities[entryId];
      return /*#__PURE__*/React__default["default"].createElement(EditorGlobalSectionItem, {
        group: globalSectionGroup,
        groupItem: {
          id: entryId,
          entry: entryValue.entry,
          component: entryValue?.entry?._component ?? "",
          label: entryValue.label,
          pages: entryValue.pages
        },
        setOpenDeleteConfirm: setOpenDeleteConfirm,
        setOpenEditSection: setOpenEditSection
      });
    }), /*#__PURE__*/React__default["default"].createElement(modals.Modal, {
      title: `${t("delete")} (${openDeleteConfirm?.sectionName})`,
      isOpen: openDeleteConfirm !== null,
      onRequestClose: onCloseConfirm,
      mode: "fit",
      height: "auto",
      endAdornment: /*#__PURE__*/React__default["default"].createElement(StyledButtonGroup$1, null, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonSecondary, {
        onClick: onCloseConfirm
      }, t("cancel")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonPrimary, {
        isLoading: isLoading,
        disabled: isLoading,
        onClick: onConfirmDeleteSection
      }, t("template.delete.default")))
    }, /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
      variant: "body",
      component: "label"
    }, t("editor.sidebar.globalSections.delete.confirm"))), /*#__PURE__*/React__default["default"].createElement(modals.Modal, {
      title: t("rename"),
      isOpen: openEditSection !== null,
      onRequestClose: onCloseEditSection,
      mode: "fit",
      height: "auto",
      endAdornment: /*#__PURE__*/React__default["default"].createElement(StyledButtonGroup$1, null, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonSecondary, {
        onClick: onCloseEditSection
      }, t("cancel")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonPrimary, {
        isLoading: isLoading,
        disabled: isLoading,
        onClick: onEditSection
      }, t("rename")))
    }, /*#__PURE__*/React__default["default"].createElement(Input.Input, {
      defaultValue: openEditSection?.label,
      ref: inputRef,
      withBorder: true,
      style: {
        width: 300
      },
      onKeyDown: onEnter
    })));
  })));
};

/**
 * Outputs comparable config that is FULL COPY of config
 */
function getConfigSnapshot(config) {
  const strippedConfig = deepClone(config);
  if (!strippedConfig?.data) {
    strippedConfig.data = [];
  }
  return strippedConfig;
}

const normalizeComponentLayers = (components, prefix = "data", _rootParentId) => {
  if (Array.isArray(components)) {
    return components.map((component, layer) => {
      const path = `${prefix}.${layer}`;
      const rootParentId = _rootParentId || component._id;
      return {
        id: component._id,
        component: component._component,
        path,
        rootParentId,
        children: normalizeComponentLayers(component, path, rootParentId)
      };
    });
  }
  if (!Array.isArray(components) && typeof components === "object") {
    return Object.entries(components).filter(([_, componentValue]) => Array.isArray(componentValue) && componentValue.length).map(([componentName, componentValue]) => {
      const path = `${prefix}.${componentName}`;
      const rootParentId = _rootParentId || componentValue._id;
      return normalizeComponentLayers(componentValue, path, rootParentId);
    }).flat();
  }
  return [];
};

const StyledEditorLayerLabel$1 = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorLayerChildren__StyledEditorLayerLabel",
  componentId: "sc-1ntcvip-0"
})(["display:block;cursor:pointer;", ""], ({
  isFocus
}) => `
    font-weight: ${isFocus ? 700 : 400};
  `);
const StyledEditorLayerComponent$1 = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorLayerChildren__StyledEditorLayerComponent",
  componentId: "sc-1ntcvip-1"
})(["display:flex;align-items:center;width:fit-content;min-width:100%;cursor:pointer;padding:6px 10px;gap:2px;", " &:hover{background:", ";}"], ({
  isFocus
}) => `
    background: ${isFocus ? easyblocksDesignSystem.Colors.black10 : "transparent"};
  `, easyblocksDesignSystem.Colors.black10);
const EditorLayerChildren = ({
  layer,
  currentLayer,
  onClickLayer,
  onFocusLayer
}) => {
  React.useEffect(() => {
    if (currentLayer === layer.path) {
      onFocusLayer?.(layer.id);
    }
  }, [currentLayer]);
  return /*#__PURE__*/React__default["default"].createElement(StyledEditorLayerComponent$1, {
    id: `sidebar-layer-${layer.id}`,
    onClick: () => onClickLayer(layer.id, layer.path, layer.rootParentId),
    isFocus: currentLayer === layer.path
  }, /*#__PURE__*/React__default["default"].createElement(icons.Icons.LayerChildren, {
    size: 18
  }), /*#__PURE__*/React__default["default"].createElement(StyledEditorLayerLabel$1, {
    isFocus: currentLayer === layer.path,
    variant: "body",
    component: "label"
  }, layer.component));
};

const StyledEditorLayerLabel = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorLayerGroup__StyledEditorLayerLabel",
  componentId: "sc-1n61cll-0"
})(["display:block;cursor:pointer;", ""], ({
  isFocus
}) => `
    font-weight: ${isFocus ? 700 : 400};
  `);
const StyledEditorLayerComponent = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorLayerGroup__StyledEditorLayerComponent",
  componentId: "sc-1n61cll-1"
})(["display:flex;align-items:center;width:fit-content;min-width:100%;cursor:pointer;padding:6px 10px;gap:2px;", " &:hover{background:", ";}"], ({
  isFocus
}) => `
    background: ${isFocus ? easyblocksDesignSystem.Colors.black10 : "transparent"};
  `, easyblocksDesignSystem.Colors.black10);
const StyledWrapperChevronIcon = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorLayerGroup__StyledWrapperChevronIcon",
  componentId: "sc-1n61cll-2"
})(["transition:transform 0.2s ease;", ""], ({
  isOpen
}) => `transform: rotate(${isOpen ? 180 : 0}deg);`);
const StyledWrapperEditorLayerDetail = styled__default["default"].div.withConfig({
  displayName: "EditorLayerGroup__StyledWrapperEditorLayerDetail",
  componentId: "sc-1n61cll-3"
})(["padding-left:18px;", ""], ({
  isOpen
}) => `
    height: ${isOpen ? "100%" : "0%"}; 
    display: ${isOpen ? "block" : "none"};
    `);
const RawEditorLayerGroup = ({
  layer,
  currentLayer,
  onClickLayer,
  onFocusLayer
}) => {
  const [openedLayer, setOpenedLayer] = React__default["default"].useState(false);
  const expandClickRef = React.useRef(false);
  const isFocus = currentLayer === layer.path;
  const onExpandLayer = React.useCallback(() => {
    expandClickRef.current = true;
    onClickLayer(layer.id, layer.path, layer.rootParentId);
    setOpenedLayer(prev => !prev);
  }, [layer.path, onClickLayer]);
  React.useEffect(() => {
    if (!currentLayer) {
      return;
    }
    if (currentLayer === layer.path) {
      onFocusLayer?.(layer.id);
    }
    if (expandClickRef.current) {
      expandClickRef.current = false;
      return;
    }
    const shouldOpen = currentLayer.length >= layer.path.length && currentLayer.startsWith(layer.path);
    shouldOpen ? setOpenedLayer(shouldOpen) : null;
  }, [currentLayer, layer.path, layer.id]);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(StyledEditorLayerComponent, {
    id: `sidebar-layer-${layer.id}`,
    onClick: onExpandLayer,
    isFocus: isFocus
  }, /*#__PURE__*/React__default["default"].createElement(StyledWrapperChevronIcon, {
    isOpen: openedLayer
  }, /*#__PURE__*/React__default["default"].createElement(icons.Icons.ChevronDown, {
    size: 16
  })), /*#__PURE__*/React__default["default"].createElement(icons.Icons.LayerGroup, {
    size: 18
  }), /*#__PURE__*/React__default["default"].createElement(StyledEditorLayerLabel, {
    isFocus: isFocus,
    variant: "body",
    component: "label"
  }, layer.component)), /*#__PURE__*/React__default["default"].createElement(StyledWrapperEditorLayerDetail, {
    isOpen: openedLayer
  }, /*#__PURE__*/React__default["default"].createElement(EditorLayerDetail, {
    onFocusLayer: onFocusLayer,
    currentLayer: currentLayer,
    onClickLayer: onClickLayer,
    layers: layer.children
  })));
};
const EditorLayerGroup = /*#__PURE__*/React__default["default"].memo(RawEditorLayerGroup);
EditorLayerGroup.displayName = "EditorLayerGroup";

const EditorLayerDetail = ({
  layers,
  currentLayer,
  onClickLayer,
  onFocusLayer
}) => {
  return layers.map(layer => {
    if (layer.children.length) {
      return /*#__PURE__*/React__default["default"].createElement(EditorLayerGroup, {
        currentLayer: currentLayer,
        onClickLayer: (id, path, rootParentId) => onClickLayer?.(id, path, rootParentId),
        onFocusLayer: layerId => onFocusLayer?.(layerId),
        layer: layer,
        key: layer.id
      });
    }
    return /*#__PURE__*/React__default["default"].createElement(EditorLayerChildren, {
      currentLayer: currentLayer,
      onClickLayer: (id, path, rootParentId) => onClickLayer?.(id, path, rootParentId),
      onFocusLayer: layerId => onFocusLayer?.(layerId),
      layer: layer,
      key: layer.id
    });
  });
};

const EditorLayer = () => {
  const editorContext = useEditorContext();
  const [layers, setLayers] = React.useState();
  const deferredLayers = React.useDeferredValue(layers);
  const deferredCurrentLayer = React.useDeferredValue(editorContext.focussedField[0]);
  const initLayers = async () => {
    const localConfig = editorContext.form.values;
    const localConfigSnapshot = getConfigSnapshot(localConfig);
    setLayers(normalizeComponentLayers(localConfigSnapshot.data));
  };
  const onClickLayer = (id, layer, rootParentId) => {
    const editorCanvasIframe = window.document.getElementById("editor-canvas");
    if (rootParentId) {
      const parentTargetComponent = editorCanvasIframe?.contentDocument?.getElementById(rootParentId);
      const childTargetComponent = editorCanvasIframe?.contentDocument?.getElementById(id);
      const parentRectTop = parentTargetComponent?.getBoundingClientRect()?.top ?? 0;
      const childRectTop = childTargetComponent?.getBoundingClientRect()?.top ?? 0;
      const top = (rootParentId === id ? parentRectTop : parentRectTop + childRectTop) + (editorCanvasIframe?.contentWindow?.scrollY ?? 0);
      editorCanvasIframe?.contentWindow?.scrollTo({
        top,
        behavior: "smooth"
      });
    }
    editorContext.setFocussedField(layer);
  };
  const onFocusLayer = layerId => {
    if (layerId) {
      const targetEditorLayer = document.getElementById("editor-layers");
      const targetComponent = document.getElementById(`sidebar-layer-${layerId}`);
      const top = (targetComponent?.getBoundingClientRect()?.top ?? 0) - (targetEditorLayer?.getBoundingClientRect()?.top ?? 0) + (targetEditorLayer?.scrollTop ?? 0);
      targetEditorLayer?.scrollTo({
        top,
        behavior: "smooth"
      });
    }
  };
  React.useEffect(() => {
    initLayers();
  }, [editorContext.form.values]);
  return deferredLayers ? /*#__PURE__*/React__default["default"].createElement(EditorLayerDetail, {
    onFocusLayer: onFocusLayer,
    currentLayer: deferredCurrentLayer,
    onClickLayer: onClickLayer,
    layers: deferredLayers
  }) : null;
};

function getDefaultTemplateForDefinition(def, editorContext) {
  // Text has different way of building a default config
  const config = def.id === "@easyblocks/rich-text" ? easyblocksCore.buildRichTextNoCodeEntry({
    color: getDefaultTokenId(editorContext.theme.colors),
    font: getDefaultTokenId(editorContext.theme.fonts)
  }) : {
    _component: def.id,
    _id: uniqueId()
  };
  return {
    id: `${def.id}_default`,
    label: def.label ?? def.id,
    entry: config,
    isUserDefined: false,
    group: def.group
  };
}
function getDefaultTokenId(tokens) {
  return Object.entries(tokens).find(([, value]) => value.isDefault)?.[0];
}
async function getTemplates(editorContext, configTemplates = [], query) {
  const remoteUserDefinedTemplates = !editorContext.disableCustomTemplates ? await editorContext.backend.templates.getAll(query) : {
    items: [],
    count: {}
  };
  const templates = getTemplatesInternal(editorContext, configTemplates, remoteUserDefinedTemplates.items);
  const textSearch = query?.filters?.split("@").find(filter => filter.includes("label:like:"))?.split("label:like:")[1];
  const templatesFound = textSearch ? templates.filter(template => template.label?.toLowerCase().includes(textSearch.toLowerCase())) : templates;
  return {
    items: templatesFound,
    count: remoteUserDefinedTemplates.count
  };
}
function getNecessaryDefaultTemplates(components, templates, editorContext) {
  const result = [];
  components.forEach(component => {
    const componentTemplates = templates.filter(template => template.entry._component === component.id);
    if (componentTemplates.length === 0) {
      result.push(getDefaultTemplateForDefinition(component, editorContext));
    }
  });
  return result;
}
function normalizeTextLocales(config, editorContext) {
  return configMap(config, editorContext, ({
    value,
    schemaProp
  }) => {
    if (schemaProp.type === "text") {
      const firstDefinedValue = Object.values(value.value).filter(x => x !== null && x !== undefined)[0];
      return {
        ...value,
        value: {
          [easyblocksCore.getDefaultLocale(editorContext.locales).code]: firstDefinedValue
        }
      };
    } else if (schemaProp.type === "component-collection-localised") {
      const firstDefinedValue = Object.values(value).filter(x => x !== null && x !== undefined)[0];
      return {
        [easyblocksCore.getDefaultLocale(editorContext.locales).code]: firstDefinedValue
      };
    }
    return value;
  });
}
function getTemplatesInternal(editorContext, configTemplates, remoteUserDefinedTemplates) {
  // If a component doesn't have a template, here's one added
  const allBuiltinTemplates = [...configTemplates, ...getNecessaryDefaultTemplates(editorContext.definitions.components, configTemplates, editorContext)];
  const allUserTemplates = [...remoteUserDefinedTemplates, ...allBuiltinTemplates];
  const result = allUserTemplates.filter(template => {
    const definition = _internals.findComponentDefinitionById(template.entry._component, editorContext);
    if (!definition || definition.hideTemplates) {
      return false;
    }
    return true;
  }).map(template => {
    const newTemplate = {
      ...template,
      entry: normalizeTextLocales(_internals.normalize({
        ...template.entry,
        _itemProps: {}
      }, editorContext), editorContext)
    };
    return newTemplate;
  });
  return result;
}

// Shared local-group derivation, used by both the EditorSections sidebar and the
// TemplateModal group field so they show the same set of local component groups.

// Components the root "data" field accepts (the local section components).
const getLocalComponents = editorContext => {
  const schemaProp = _internals.findComponentDefinition(editorContext.form.values, editorContext)?.schema.find(x => x.prop === "data");
  return unrollAcceptsFieldIntoComponents(schemaProp?.accepts, editorContext);
};

// Distinct `.group` values of the visible local components ("others" when unset).
const getLocalGroups = localComponents => {
  const groups = new Set();
  localComponents.forEach(component => {
    if (component.visible === false) return;
    groups.add(component.group || "others");
  });
  return [...groups];
};

/**
 * Display label for a component category.
 *
 * Categories travel through the config as plain strings ("Layout", "Content"),
 * because that is what a component definition writes into `.group`. The editor
 * has no list of the host app's categories, so the translation file decides:
 * a `definition.category.<lowercased>` entry means "this is a known built-in
 * category, here is its localized name".
 *
 * `t` returns the key unchanged when it is missing, and that is exactly the
 * signal used here — a shop's own group string ("Banner tết") has no entry, so
 * the raw string is shown instead of a half-translated key. Without that check
 * every unknown group would render as `definition.category.banner tết`.
 */
const getCategoryLabel = (t, group) => {
  const raw = group.trim();
  if (!raw) return group;
  const key = `definition.category.${raw.toLowerCase()}`;
  const translated = t(key);
  return translated === key ? group : translated;
};

// Single template card shown in the section drawer gallery.
// Preview box renders the template thumbnail when available, otherwise
// falls back to the centered label text (e.g. "Empty Banner Section").
const StyledCard$1 = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawerCard__StyledCard",
  componentId: "sc-1g9htdu-0"
})(["display:flex;flex-direction:column;gap:8px;cursor:", ";"], ({
  isLoading
}) => isLoading ? "default" : "pointer");
const StyledPreview$1 = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawerCard__StyledPreview",
  componentId: "sc-1g9htdu-1"
})(["position:relative;width:100%;aspect-ratio:16 / 10;display:flex;align-items:center;justify-content:center;text-align:center;padding:8px;border-radius:2px;background:", ";color:", ";overflow:hidden;box-sizing:border-box;", ":hover &{outline:2px solid ", ";}"], easyblocksDesignSystem.Colors.black10, easyblocksDesignSystem.Colors.black500, StyledCard$1, easyblocksDesignSystem.Colors.blue50);

// Centered spinner shown over the preview box while the section is being added.
const StyledLoadingOverlay = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawerCard__StyledLoadingOverlay",
  componentId: "sc-1g9htdu-2"
})(["position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.6);"]);
const StyledThumbnail = styled__default["default"].img.withConfig({
  displayName: "EditorSectionDrawerCard__StyledThumbnail",
  componentId: "sc-1g9htdu-3"
})(["width:100%;height:100%;object-fit:cover;"]);

// Fallback label shown inside the preview box when there's no thumbnail.
// Clamps to 2 lines then ellipsis (the box has vertical room from its
// aspect-ratio). Full text is available via the card's title tooltip.
const StyledPlaceholderLabel = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorSectionDrawerCard__StyledPlaceholderLabel",
  componentId: "sc-1g9htdu-4"
})(["max-width:90px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;"]);

// Bottom label: single line then ellipsis. Full text via the card's title.
const StyledLabel = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorSectionDrawerCard__StyledLabel",
  componentId: "sc-1g9htdu-5"
})(["max-width:180px;text-align:center !important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"]);
const EditorSectionDrawerCard = ({
  template,
  onClick,
  isLoading
}) => {
  const label = template.label ?? template.template?.id ?? "";
  const thumbnail = template.template?.thumbnail;
  return /*#__PURE__*/React__default["default"].createElement(StyledCard$1, {
    onClick: onClick,
    title: label,
    isLoading: isLoading
  }, /*#__PURE__*/React__default["default"].createElement(StyledPreview$1, null, thumbnail ? /*#__PURE__*/React__default["default"].createElement(StyledThumbnail, {
    src: thumbnail,
    alt: label
  }) : /*#__PURE__*/React__default["default"].createElement(StyledPlaceholderLabel, {
    variant: "body"
  }, label), isLoading ? /*#__PURE__*/React__default["default"].createElement(StyledLoadingOverlay, null, /*#__PURE__*/React__default["default"].createElement(Loader.Loader, null)) : null), /*#__PURE__*/React__default["default"].createElement(StyledLabel, {
    variant: "body"
  }, label));
};

// Loading placeholder for the section drawer gallery body: a 3-column grid of
// card skeletons (preview rect + label pill below). The drawer renders the
// title + close header persistently, so it is not part of this skeleton.
const SKELETON_CARDS = 6;
const pulse$1 = styled.keyframes(["0%,100%{opacity:1;}50%{opacity:0.4;}"]);
const StyledRoot = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawerSkeleton__StyledRoot",
  componentId: "sc-1lbe0dn-0"
})(["display:flex;flex-direction:column;gap:16px;animation:", " 1.2s ease-in-out infinite;"], pulse$1);
const StyledGrid$1 = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawerSkeleton__StyledGrid",
  componentId: "sc-1lbe0dn-1"
})(["display:grid;grid-template-columns:repeat(3,1fr);gap:16px 12px;"]);
const StyledCard = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawerSkeleton__StyledCard",
  componentId: "sc-1lbe0dn-2"
})(["display:flex;flex-direction:column;gap:8px;align-items:center;"]);
const StyledPreview = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawerSkeleton__StyledPreview",
  componentId: "sc-1lbe0dn-3"
})(["width:100%;aspect-ratio:16 / 10;border-radius:2px;background:", ";"], easyblocksDesignSystem.Colors.black10);
const StyledPill = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawerSkeleton__StyledPill",
  componentId: "sc-1lbe0dn-4"
})(["width:70%;height:12px;border-radius:2px;background:", ";"], easyblocksDesignSystem.Colors.black10);
const EditorSectionDrawerSkeleton = () => /*#__PURE__*/React__default["default"].createElement(StyledRoot, null, /*#__PURE__*/React__default["default"].createElement(StyledGrid$1, null, Array.from({
  length: SKELETON_CARDS
}).map((_, index) => /*#__PURE__*/React__default["default"].createElement(StyledCard, {
  key: index
}, /*#__PURE__*/React__default["default"].createElement(StyledPreview, null), /*#__PURE__*/React__default["default"].createElement(StyledPill, null)))));

// Trigger load-more when scrolled within this many px of the bottom.
const SCROLL_THRESHOLD = 80;
const DRAWER_WIDTH = 600;
const StyledEditorSectionDrawer = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawer__StyledEditorSectionDrawer",
  componentId: "sc-bycoqx-0"
})(["position:absolute;top:47px;left:198px;width:", "px;max-height:calc(100vh - 120px);display:flex;flex-direction:column;overflow:hidden;background:", ";border:1px solid ", ";box-shadow:var(--tina-shadow-big);z-index:var(--tina-z-index-5);border-top-right-radius:2px;border-bottom-right-radius:2px;"], DRAWER_WIDTH, easyblocksDesignSystem.Colors.white, easyblocksDesignSystem.Colors.black100);

// Scrollable body region. The drawer header lives outside this element so it
// stays pinned while only the section grid scrolls. min-height: 0 lets this
// flex child shrink below its content size so overflow-y can actually scroll.
const StyledBody = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawer__StyledBody",
  componentId: "sc-bycoqx-1"
})(["flex:1;min-height:0;overflow-x:hidden;overflow-y:auto;padding:16px;padding-top:8px;"]);
const StyledGrid = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawer__StyledGrid",
  componentId: "sc-bycoqx-2"
})(["display:grid;grid-template-columns:repeat(3,1fr);gap:16px 12px;"]);

// Persistent drawer header: section group title on the left, close button on the
// right. Rendered in every state (loading/empty/loaded) so the close control is
// always available and content never jumps.
const StyledHeader = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawer__StyledHeader",
  componentId: "sc-bycoqx-3"
})(["display:flex;align-items:center;justify-content:space-between;gap:8px;padding:16px;padding-bottom:8px;"]);

// Truncate long group names with an ellipsis so the close button stays put and
// the header never wraps to a second line in the fixed-width drawer.
const StyledTitle = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorSectionDrawer__StyledTitle",
  componentId: "sc-bycoqx-4"
})(["flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"]);
const StyledLoadMore = styled__default["default"].div.withConfig({
  displayName: "EditorSectionDrawer__StyledLoadMore",
  componentId: "sc-bycoqx-5"
})(["display:flex;justify-content:center;padding:16px 0 4px;"]);
const EditorSectionDrawer = ({
  templates,
  isFetching,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onAddTemplate,
  containerRef,
  title,
  onClose
}) => {
  const {
    t
  } = useTranslation();
  const [loadingId, setLoadingId] = React.useState(null);
  const handleAdd = (template, id) => {
    if (loadingId) return; // ignore re-clicks during the brief add operation
    setLoadingId(id);
    requestAnimationFrame(() => {
      onAddTemplate(template);
      setLoadingId(null);
    });
  };

  // Infinite scroll: load the next page when scrolled near the bottom.
  const handleScroll = event => {
    if (!hasMore || isLoadingMore || !onLoadMore) return;
    const el = event.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD) {
      onLoadMore();
    }
  };

  // Persistent header (title + close) shown in every state. The close button is
  // always real and functional so the user can dismiss the drawer mid-load.
  const header = /*#__PURE__*/React__default["default"].createElement(StyledHeader, null, /*#__PURE__*/React__default["default"].createElement(StyledTitle, {
    variant: "label",
    title: title
  }, title), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.Close,
    hideLabel: true,
    showTooltip: false,
    onClick: onClose
  }, "Close"));
  let body;
  if (isFetching) {
    body = /*#__PURE__*/React__default["default"].createElement(EditorSectionDrawerSkeleton, null);
  } else if (!templates.length) {
    body = /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
      variant: "body"
    }, t("noData"), "!");
  } else {
    body = /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(StyledGrid, null, templates.map(template => {
      const id = template.template?.id ?? template.id;
      return /*#__PURE__*/React__default["default"].createElement(EditorSectionDrawerCard, {
        key: id,
        template: template,
        isLoading: loadingId === id,
        onClick: () => handleAdd(template, id)
      });
    })), isLoadingMore ? /*#__PURE__*/React__default["default"].createElement(StyledLoadMore, null, /*#__PURE__*/React__default["default"].createElement(Loader.Loader, null)) : null);
  }
  return /*#__PURE__*/React__default["default"].createElement(StyledEditorSectionDrawer, null, header, /*#__PURE__*/React__default["default"].createElement(StyledBody, {
    ref: containerRef,
    onScroll: handleScroll
  }, body));
};

/** What an entry in the section list stands for. */

const StyledRow = styled__default["default"].div.withConfig({
  displayName: "EditorSectionItem__StyledRow",
  componentId: "sc-1li16rj-0"
})(["display:flex;align-items:center;max-width:174px;cursor:pointer;border-radius:2px;padding:4px;", ""], ({
  hovered
}) => `${hovered ? `background: ${easyblocksDesignSystem.Colors.black10};` : ""}`);
const StyledEditorSectionName = styled__default["default"].div.withConfig({
  displayName: "EditorSectionItem__StyledEditorSectionName",
  componentId: "sc-1li16rj-1"
})(["font-size:var(--tina-font-size-0);flex:1;min-width:0;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"]);

/**
 * One category row of a sidebar panel.
 *
 * Rows carry no icon: which of the two lists this is — components or templates
 * — is already said by the rail button that opened the panel and by the panel
 * title above, so a glyph on every row would repeat it once per line and eat
 * width the category names need.
 */
const EditorSectionItem = ({
  id,
  name,
  hovered,
  onHoverSection
}) => {
  const {
    isOpen,
    tooltipProps,
    triggerProps,
    arrowProps
  } = useTooltip();
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(StyledRow, _extends__default["default"]({
    id: id,
    hovered: hovered,
    onMouseEnter: () => onHoverSection(id)
  }, triggerProps), /*#__PURE__*/React__default["default"].createElement(StyledEditorSectionName, null, name)), isOpen && /*#__PURE__*/React__default["default"].createElement(Tooltip, tooltipProps, /*#__PURE__*/React__default["default"].createElement(TooltipArrow, arrowProps), /*#__PURE__*/React__default["default"].createElement(TooltipBody, null, name)));
};

const SKELETON_ROWS = 20;
const pulse = styled.keyframes(["0%,100%{opacity:1;}50%{opacity:0.4;}"]);
const SkeletonBar = styled__default["default"].div.withConfig({
  displayName: "EditorSectionsSkeleton__SkeletonBar",
  componentId: "sc-1kea448-0"
})(["padding-top:4px;padding-left:4px;height:26px;border-radius:2px;background-color:", ";animation:", " 1.2s ease-in-out infinite;"], easyblocksDesignSystem.Colors.black10, pulse);

// Shared loading placeholder for the editor section lists.
// Single source of truth — imported by EditorSectionGroup and EditorSectionCard.
const EditorSectionsSkeleton = () => /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, Array.from({
  length: SKELETON_ROWS
}).map((_, index) => /*#__PURE__*/React__default["default"].createElement(SkeletonBar, {
  key: index
})));

// A single section template (flattened, group layer removed). Shared by the
// left list, the drawer gallery and the drawer card.

const TITLE_HEIGHT = 50;
const PADDING_TOP_HEIGHT = 20;
// Page size for the per-entry remote template fetch (infinite scroll).
const TEMPLATES_LIMIT = 30;
// Discovery only asks whether a category holds anything at all, never what, so
// it requests the smallest page the endpoint will answer with.
const CATEGORY_PROBE_LIMIT = 1;
// Translation key for the row collecting templates filed under no category.
const UNCATEGORIZED_LABEL_KEY = "others";

/** Shape both remote template endpoints answer with. */

/** One entry of the template taxonomy, as the host's backend returns it. */

/**
 * The two template readers the host app's backend adds on top of the `Backend`
 * contract. Both optional, because `easyblocks-core` does not declare them: a
 * host that implements neither shows an empty Templates panel instead of
 * breaking.
 *
 * `getAllPublic` reads the system library. System templates have no `shop_id`,
 * and every shop-side query is pinned to a shop id down in Elasticsearch, so
 * they can never come back through `templates.getAll`; showing them needs a
 * genuinely different endpoint, not a filter applied to the shop result.
 *
 * `getCategories` reads the template taxonomy — the same list the save dialog
 * files a template under, which is what the panel's rows are built from.
 */

/** Which list a section row draws from: local definitions, or the store. */

/**
 * A remote template library. Both feed the same category rows; which of them a
 * mode may read is `getTemplateSources`.
 */

/**
 * A category row of the Templates panel.
 *
 * `uuid` is null on the one row that is not a category at all: the remainder
 * holding every template filed under none.
 */

/**
 * Which of the two panels this instance is. Built-in components and saved
 * templates each own a rail button and a panel, so one instance only ever
 * builds and renders one of the two lists.
 */

// Accumulated remote templates for one entry plus its paging cursor.

/**
 * Where a section picked from the drawer lands in the root collection: directly after the
 * selected section, which is where the user is looking. With nothing selected there is no
 * such position, so it goes to the end.
 *
 * `focussedField` can point deep inside a section (`data.2.Cards.0`); only the top level
 * index matters, because the drawer always inserts into the root `data` collection.
 */
function getSectionInsertionIndex(focussedField, sectionCount) {
  const rootSectionIndex = focussedField[focussedField.length - 1]?.match(/^data\.(\d+)/)?.[1];
  if (rootSectionIndex === undefined) {
    return sectionCount;
  }
  return Math.min(Number(rootSectionIndex) + 1, sectionCount);
}

/**
 * The template libraries a mode may read.
 *
 * Admin edits the system library directly, so its own shop path already holds
 * exactly those templates and a second public read would be a duplicate.
 */
function getTemplateSources(mode) {
  return mode === "user" ? ["public", "shop"] : ["shop"];
}

/** Categories A→Z, uncategorized last because it is the remainder, not a name. */
function sortTemplateCategories(categories) {
  return [...categories].sort((a, b) => {
    if (a.uuid === null) return b.uuid === null ? 0 : 1;
    if (b.uuid === null) return -1;
    return (a.name ?? "").localeCompare(b.name ?? "", "vi");
  });
}

/**
 * The entries of one panel, and only that panel.
 *
 * The two kinds are built from separate sources and never merged, which is the
 * whole point: the previous `[...new Set([...localGroups, ...remoteGroups])]`
 * put a shop's own group called "Layout" into the same row as the built-in
 * Layout category, so a saved template looked like a stock component.
 *
 * The Templates panel lists the template taxonomy — the very categories the
 * save dialog files a template under — rather than the free-text `group`
 * column it used to read. `group` is whatever anybody once typed, so it grew
 * near-duplicates ("product" beside "Product") that are not categories at all.
 * The rows carry no library heading: which library a template came from is not
 * how the user looks for one, and both libraries file into the same taxonomy,
 * so a category holds whatever the caller is allowed to see under that name.
 */
function buildSectionEntries({
  panel,
  localGroups,
  templateCategories,
  t
}) {
  if (panel === "components") {
    return [...localGroups].sort().map(group => ({
      id: `builtin:${group}`,
      label: getCategoryLabel(t, group),
      group,
      source: "builtin",
      kind: "builtin"
    }));
  }
  return sortTemplateCategories(templateCategories ?? []).map(category => ({
    id: `category:${category.uuid ?? UNCATEGORIZED_LABEL_KEY}`,
    // A category name is data somebody typed, so it is shown verbatim. The
    // remainder row is this editor's own construct, so it is localized.
    label: category.uuid === null ? getCategoryLabel(t, UNCATEGORIZED_LABEL_KEY) : category.name ?? "",
    categoryUuid: category.uuid ?? undefined,
    source: "template",
    kind: "template"
  }));
}

/** Total matched documents across every group bucket of a count response. */
function sumMatchedCount(count) {
  return Object.values(count ?? {}).reduce((sum, bucket) => sum + (bucket?.matchedCount ?? 0), 0);
}

/**
 * Reads one page of one template source. Returns null when the source has no
 * reader on this host, which is how a missing implementation ends up as an
 * empty library instead of an error.
 */

/**
 * Whether one category holds at least one template the caller may see.
 *
 * Asked of every library at once and answered by the smallest page the list
 * route will serve, because only the existence of a row matters here. A
 * category the caller cannot fill is left out rather than shown as a row whose
 * drawer opens empty.
 */
async function categoryHasTemplates(fetchPage, sources, categoryUuid) {
  // Never rejects: discovery waits on all of these at once, so one library
  // throwing — even synchronously, before its promise exists — must not strand
  // the panel behind a skeleton that has nothing left to resolve it.
  const results = await Promise.all(sources.map(async source => {
    try {
      const request = fetchPage(source, 1, {
        categoryUuid,
        limit: CATEGORY_PROBE_LIMIT
      });

      // No reader for this source on this host: it contributes nothing,
      // which is not a failure and must not raise an error toast.
      if (!request) return {
        found: false,
        failed: false
      };
      return {
        found: ((await request).items ?? []).length > 0,
        failed: false
      };
    } catch {
      return {
        found: false,
        failed: true
      };
    }
  }));
  return {
    hasTemplates: results.some(result => result.found),
    failed: results.some(result => result.failed)
  };
}

/**
 * The category rows the Templates panel shows.
 *
 * The taxonomy comes from the host backend, which is the same list the save
 * dialog offers, so a row exists for a category exactly when somebody could
 * have filed a template under it. The uncategorized remainder is appended
 * because it is not part of the taxonomy but still has to be reachable —
 * without it every template saved before the taxonomy existed would be
 * invisible.
 */
async function discoverTemplateCategories(fetchPage, listCategories, sources) {
  let taxonomy = [];
  let failed = false;
  if (listCategories) {
    try {
      taxonomy = await listCategories();
    } catch {
      failed = true;
    }
  }
  const candidates = [...taxonomy.map(({
    id,
    name
  }) => ({
    uuid: id,
    name
  })), {
    uuid: null,
    name: null
  }];
  const probed = await Promise.all(candidates.map(async candidate => ({
    candidate,
    ...(await categoryHasTemplates(fetchPage, sources, candidate.uuid))
  })));
  return {
    categories: probed.filter(result => result.hasTemplates).map(result => result.candidate),
    failed: failed || probed.some(result => result.failed)
  };
}
const StyledEditorSectionGroup = styled__default["default"].div.withConfig({
  displayName: "EditorSections__StyledEditorSectionGroup",
  componentId: "sc-1nr6ndr-0"
})(["padding-left:12px;padding-right:12px;overflow-y:auto;max-height:calc( 100vh - ", "px );"], TOP_BAR_HEIGHT + TITLE_HEIGHT + PADDING_TOP_HEIGHT);
const EditorSections = ({
  panel
}) => {
  const editorContext = useEditorContext();
  const toaster = Toaster.useToaster();
  const {
    t
  } = useTranslation();
  const [hoveredSection, setHoveredSection] = React.useState("");
  // Drawer is closed until the user hovers a section; click-outside closes it.
  const [isOpen, setIsOpen] = React.useState(false);
  const sectionListRef = React.useRef(null);
  const drawerRef = React.useRef(null);
  // Remote templates fetched per entry (paged), cached so a re-hover doesn't
  // refetch. `isFetching` = first page; `isLoadingMore` = subsequent pages.
  const [remoteByEntry, setRemoteByEntry] = React.useState({});
  const [isFetching, setIsFetching] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  // The category rows. `null` while the discovery read is still in flight,
  // which is what tells the Templates panel to show its skeleton.
  const [templateCategories, setTemplateCategories] = React.useState(null);

  // The host backend, widened with the optional template readers. An
  // intersection rather than a cast: every added member is optional, so the
  // plain contract still satisfies it and a missing implementation stays a
  // runtime-checkable `undefined` instead of a lie to the type checker.
  const templatesApi = editorContext.backend.templates;

  // Map raw API templates to the shape the drawer/card consume.
  const mapRemoteItems = React.useCallback(items => items.map(tpl => {
    const definition = _internals.findComponentDefinitionById(tpl.entry._component, editorContext);
    return {
      ...definition,
      ...tpl,
      group: tpl.group,
      template: tpl
    };
  }), [editorContext]);

  // Local components: the components the root "data" field accepts. Sync.
  const localComponents = React.useMemo(() => getLocalComponents(editorContext), [editorContext.form.values, editorContext.definitions]);

  // Local groups: the .group values of the accepted components.
  const localGroups = React.useMemo(() => getLocalGroups(localComponents), [localComponents]);
  const entries = React.useMemo(() => buildSectionEntries({
    panel,
    localGroups,
    templateCategories,
    t
  }), [panel, localGroups, templateCategories, t]);
  const entriesById = React.useMemo(() => {
    const map = {};
    entries.forEach(entry => {
      map[entry.id] = entry;
    });
    return map;
  }, [entries]);
  const hoveredEntry = entriesById[hoveredSection];

  // Local-definition templates for the hovered built-in category (the default
  // "Empty X" templates built from the accepted components). Synchronous.
  const localTemplates = React.useMemo(() => {
    if (!hoveredEntry || hoveredEntry.source !== "builtin") return [];
    return localComponents.filter(component => component.visible !== false && (component.group || "others") === hoveredEntry.group).map(component => {
      const template = getDefaultTemplateForDefinition(component, editorContext);
      return {
        ...component,
        group: component.group,
        template
      };
    });
  }, [hoveredEntry, localComponents]);

  /**
   * One page of one remote library. Returns null when the library is not
   * reachable, which is how a host without the public reader ends up with an
   * empty system section rather than an error.
   *
   * `categoryUuid` narrows the page to one category; `null` asks for the
   * templates filed under none, which the list route expresses as "the column
   * does not exist" rather than as a value to match.
   */
  const fetchRemotePage = React.useCallback((source, page, options) => {
    const query = {
      page,
      limit: options?.limit ?? TEMPLATES_LIMIT
    };
    if (options?.categoryUuid) {
      query.filters = `category_uuid:eq:${options.categoryUuid}`;
    } else if (options?.categoryUuid === null) {
      query.filters = "category_uuid:isnull";
    }
    if (source === "shop") {
      return templatesApi.getAll(query);
    }
    return templatesApi.getAllPublic?.(query) ?? null;
  }, [templatesApi]);

  /**
   * One page of a category row, across every library the mode may read.
   *
   * The libraries are paged in lockstep rather than one after the other: they
   * file into the same taxonomy, so a category row is their union, and asking
   * each for the same page number keeps that union growing until every library
   * is exhausted — at which point the accumulated item count reaches the summed
   * total and paging stops on its own.
   */
  const fetchCategoryPage = React.useCallback((entry, page) => {
    const requests = getTemplateSources(editorContext.mode).map(source => fetchRemotePage(source, page, {
      categoryUuid: entry.categoryUuid ?? null
    })).filter(request => !!request);
    if (requests.length === 0) return null;
    return Promise.all(requests).then(results => ({
      items: results.flatMap(result => result.items ?? []),
      total: results.reduce((sum, result) => sum + sumMatchedCount(result.count), 0)
    }));
  }, [editorContext.mode, fetchRemotePage]);

  // Held in a ref so the discovery effect below can depend on the panel and the
  // mode alone. The host rebuilds its backend object freely, and a fetcher in
  // the dependency array would restart the discovery read on every such render.
  const fetchRemotePageRef = React.useRef(fetchRemotePage);
  fetchRemotePageRef.current = fetchRemotePage;

  // Same reason: the taxonomy reader is a member of that same rebuilt object.
  const listCategoriesRef = React.useRef(templatesApi.getCategories);
  listCategoriesRef.current = templatesApi.getCategories;

  // Smoothly scroll the editor canvas to a component by its config id. The
  // canvas renders asynchronously after insert, so poll briefly for the node.
  const scrollCanvasToComponent = React.useCallback(id => {
    let attempts = 0;
    const maxAttempts = 20;
    const tryScroll = () => {
      const iframe = document.getElementById("editor-canvas");
      const node = iframe?.contentDocument?.getElementById(id);
      if (node && iframe?.contentWindow) {
        const top = node.getBoundingClientRect().top + iframe.contentWindow.scrollY;
        iframe.contentWindow.scrollTo({
          top,
          behavior: "smooth"
        });
        return;
      }
      if (attempts < maxAttempts) {
        attempts += 1;
        setTimeout(tryScroll, 50);
      }
    };
    tryScroll();
  }, []);

  // Insert the picked template into the root "data" collection, right after the
  // selected section. No keepId, so fresh ids are generated and a template can be
  // added multiple times. Used by the drawer cards only.
  const onAddTemplate = React.useCallback(template => {
    const entry = template.template?.entry;
    if (!entry) {
      toaster.error(t("editor.sidebar.sections.add.error"));
      return;
    }

    // Raw API entries aren't normalized; normalize the picked entry before insert.
    const normalizedEntry = _internals.normalize({
      ...entry,
      _itemProps: {}
    }, editorContext);
    const insertionIndex = getSectionInsertionIndex(editorContext.focussedField, editorContext.compiledComponentConfig?.components.data.length ?? 0);
    editorContext.actions.insertItem({
      name: "data",
      index: insertionIndex,
      block: normalizedEntry
    });
    toaster.success(t("editor.sidebar.sections.add.success"));

    // Scroll the canvas to wherever the new section landed.
    const data = editorContext.form.values?.data ?? [];
    const newId = data[insertionIndex]?._id;
    if (newId) scrollCanvasToComponent(newId);
  }, [editorContext, scrollCanvasToComponent]);

  // The category rows, discovered once per panel and mode. The templates
  // themselves come later, on hover.
  React.useEffect(() => {
    if (panel !== "templates") return;
    let cancelled = false;
    setTemplateCategories(null);
    discoverTemplateCategories(fetchRemotePageRef.current, listCategoriesRef.current, getTemplateSources(editorContext.mode)).then(({
      categories,
      failed
    }) => {
      if (cancelled) return;

      // One message however many reads failed: the user can only retry the
      // panel as a whole, so a toast per read would just repeat itself.
      setTemplateCategories(categories);
      if (failed) {
        toaster.error(t("editor.sidebar.sections.load.error"));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [panel, editorContext.mode]);

  // Preselect this panel's first entry so the drawer has something to show.
  // Re-runs when the entries arrive, and also when a panel switch leaves the
  // selection pointing at a row this panel does not have.
  React.useEffect(() => {
    if (entries.some(entry => entry.id === hoveredSection)) return;
    const first = entries[0]?.id;
    if (first) setHoveredSection(first);
  }, [entries, hoveredSection]);

  // Hovering a section selects it and opens the drawer.
  const handleHoverSection = React.useCallback(id => {
    setHoveredSection(id);
    setIsOpen(true);
  }, []);

  // Close the drawer when clicking outside both the section list and the drawer.
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = event => {
      const target = event.target;
      const insideList = sectionListRef.current?.contains(target);
      const insideDrawer = drawerRef.current?.contains(target);
      if (!insideList && !insideDrawer) {
        setIsOpen(false);
      }
    };

    // Clicks inside the editor canvas (an iframe) don't bubble to the parent
    // document, so listen inside it too. Any canvas click closes the drawer.
    const closeOnIframeClick = () => setIsOpen(false);
    const canvasIframe = document.getElementById("editor-canvas");
    const canvasDoc = canvasIframe?.contentDocument;
    document.addEventListener("mousedown", handleClickOutside);
    canvasDoc?.addEventListener("mousedown", closeOnIframeClick, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      canvasDoc?.removeEventListener("mousedown", closeOnIframeClick, true);
    };
  }, [isOpen]);

  // First page for the hovered template entry. Cached per entry so re-hovering
  // is instant; built-in entries never reach here.
  React.useEffect(() => {
    if (!hoveredEntry || hoveredEntry.source === "builtin") return;
    if (remoteByEntry[hoveredEntry.id]) return;
    const entryId = hoveredEntry.id;
    const request = fetchCategoryPage(hoveredEntry, 1);
    if (!request) {
      // No reader for this source: record an empty, complete page so the
      // drawer settles on "no data" instead of retrying on every hover.
      setRemoteByEntry(prev => ({
        ...prev,
        [entryId]: {
          items: [],
          page: 1,
          total: 0
        }
      }));
      return;
    }
    let cancelled = false;
    setIsFetching(true);
    request.then(res => {
      if (cancelled) return;
      const items = mapRemoteItems(res.items);
      setRemoteByEntry(prev => ({
        ...prev,
        [entryId]: {
          items,
          page: 1,
          total: res.total || items.length
        }
      }));
    }).catch(() => {
      if (cancelled) return;
      // A failed listing must not leave the drawer spinning forever.
      setRemoteByEntry(prev => ({
        ...prev,
        [entryId]: {
          items: [],
          page: 1,
          total: 0
        }
      }));
      toaster.error(t("editor.sidebar.sections.load.error"));
    }).finally(() => {
      if (!cancelled) setIsFetching(false);
    });
    return () => {
      cancelled = true;
    };
  }, [hoveredEntry, fetchCategoryPage]);

  // Whether the hovered entry has more remote templates to load (remote only;
  // local templates aren't paginated).
  const hasMore = React.useMemo(() => {
    const state = remoteByEntry[hoveredSection];
    return !!state && state.items.length < state.total;
  }, [remoteByEntry, hoveredSection]);

  // Load the next page of remote templates for the hovered entry (infinite
  // scroll). Appends to the existing items.
  const onLoadMore = React.useCallback(() => {
    const entry = hoveredEntry;
    const state = entry ? remoteByEntry[entry.id] : undefined;
    if (!entry || !state || isFetching || isLoadingMore) return;
    if (entry.source === "builtin") return;
    if (state.items.length >= state.total) return;
    const nextPage = state.page + 1;
    const request = fetchCategoryPage(entry, nextPage);
    if (!request) return;
    setIsLoadingMore(true);
    request.then(res => {
      const more = mapRemoteItems(res.items);
      setRemoteByEntry(prev => {
        const existing = prev[entry.id]?.items ?? [];
        return {
          ...prev,
          [entry.id]: {
            items: [...existing, ...more],
            page: nextPage,
            total: res.total || prev[entry.id]?.total || 0
          }
        };
      });
    }).catch(() => {
      toaster.error(t("editor.sidebar.sections.load.error"));
    }).finally(() => setIsLoadingMore(false));
  }, [hoveredEntry, remoteByEntry, isFetching, isLoadingMore, mapRemoteItems, fetchCategoryPage]);

  // Drawer content for the hovered entry: built-in entries show the local
  // "Empty X" templates, template entries show what their source returned.
  // The two are never combined — that is the separation this phase is about.
  const drawerTemplates = React.useMemo(() => {
    if (!hoveredEntry) return [];
    const source = hoveredEntry.source === "builtin" ? localTemplates : remoteByEntry[hoveredEntry.id]?.items ?? [];
    const seen = new Set();
    const result = [];
    source.forEach(template => {
      const id = template.template?.id ?? template.id;
      if (id && !seen.has(id)) {
        seen.add(id);
        result.push(template);
      }
    });
    return result;
  }, [hoveredEntry, localTemplates, remoteByEntry]);
  const drawerTitle = hoveredEntry?.label;

  // Built-in categories are derived from the form, which is still empty on the
  // first paint, so an empty components list means "not ready yet". Template
  // categories come from the discovery read, so there the skeleton runs until
  // that read answers — an empty list afterwards is genuinely "nothing here".
  const isLoadingList = panel === "components" ? entries.length === 0 : templateCategories === null;
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(StyledEditorSectionGroup, {
    ref: sectionListRef
  }, isLoadingList && /*#__PURE__*/React__default["default"].createElement(EditorSectionsSkeleton, null), !isLoadingList && entries.length === 0 && /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
    variant: "body",
    style: {
      paddingLeft: 4
    }
  }, t("noData"), "!"), !isLoadingList && entries.map(entry => /*#__PURE__*/React__default["default"].createElement(EditorSectionItem, {
    key: entry.id,
    id: entry.id,
    name: entry.label,
    hovered: hoveredSection === entry.id,
    onHoverSection: handleHoverSection
  }))), isOpen && hoveredEntry ? /*#__PURE__*/React__default["default"].createElement(EditorSectionDrawer, {
    templates: drawerTemplates,
    isFetching: isFetching && drawerTemplates.length === 0,
    isLoadingMore: isLoadingMore,
    hasMore: hasMore,
    onLoadMore: onLoadMore,
    onAddTemplate: onAddTemplate,
    containerRef: drawerRef,
    title: drawerTitle,
    onClose: () => setIsOpen(false)
  }) : null);
};

const EMPTY_SIDEBAR_CONFIG = {
  id: "no-config",
  title: "",
  enableScroll: true,
  width: "280px",
  Component: null
};
const StyledEditorLeftSidebarRoot = styled__default["default"].div.withConfig({
  displayName: "EditorLeftSidebar__StyledEditorLeftSidebarRoot",
  componentId: "sc-16mpetx-0"
})(["", " position:relative;background:", ";border-left:1px solid ", ";border-right:1px solid ", ";box-sizing:border-box;", " > *{box-sizing:border-box;}"], ({
  width = "240px"
}) =>
// max-width is what actually pins the size: it clamps a flex item's
// automatic minimum, so a wide child can no longer stretch the panel and
// move the canvas. No overflow clipping here — the section drawer is
// absolutely positioned outside this box and would be cut off.
`flex: 0 0 ${width}; width: ${width}; min-width: 0; max-width: ${width};`, easyblocksDesignSystem.Colors.white, easyblocksDesignSystem.Colors.black100, easyblocksDesignSystem.Colors.black100, ({
  enableScroll = true
}) => enableScroll ? `overflow-y: auto;` : "");
const StyledEditorLeftSidebarTitle = styled__default["default"](Typography.Typography).withConfig({
  displayName: "EditorLeftSidebar__StyledEditorLeftSidebarTitle",
  componentId: "sc-16mpetx-1"
})(["line-height:14px;font-weight:700;padding:17px 12px;"]);
const HorizontalLine = styled__default["default"].div.withConfig({
  displayName: "EditorLeftSidebar__HorizontalLine",
  componentId: "sc-16mpetx-2"
})(["height:1px;margin-top:-1px;background-color:", ";"], easyblocksDesignSystem.Colors.black10);
const StyledEditorLeftSidebarGroup = styled__default["default"].div.withConfig({
  displayName: "EditorLeftSidebar__StyledEditorLeftSidebarGroup",
  componentId: "sc-16mpetx-3"
})(["padding-top:20px;padding-bottom:20px;> div{min-height:0;}"]);
const EditorLeftSidebar = ({
  showLeftSidebar,
  globalSections,
  sidebarNodeRef,
  editorMode
}) => {
  const {
    t
  } = useTranslation();
  const sidebarConfig = React.useMemo(() => {
    switch (showLeftSidebar) {
      case "global-sections":
        {
          if (editorMode === "user") {
            return EMPTY_SIDEBAR_CONFIG;
          }
          return {
            id: "editor-global-sections",
            title: t("editor.sidebar.globalSections"),
            width: "280px",
            enableScroll: true,
            Component: /*#__PURE__*/React__default["default"].createElement(EditorGlobalSections, {
              globalSections: globalSections
            })
          };
        }
      case "layers":
        {
          return {
            id: "editor-layers",
            title: t("editor.sidebar.layers"),
            width: "280px",
            enableScroll: true,
            Component: /*#__PURE__*/React__default["default"].createElement(EditorLayer, null)
          };
        }
      case "components":
        {
          return {
            id: "editor-components",
            title: t("editor.sidebar.sections.components"),
            width: "200px",
            enableScroll: false,
            Component: /*#__PURE__*/React__default["default"].createElement(EditorSections, {
              panel: "components"
            })
          };
        }
      case "templates":
        {
          return {
            id: "editor-templates",
            title: t("editor.sidebar.sections.templates"),
            width: "200px",
            enableScroll: false,
            Component: /*#__PURE__*/React__default["default"].createElement(EditorSections, {
              panel: "templates"
            })
          };
        }
      default:
        {
          return EMPTY_SIDEBAR_CONFIG;
        }
    }
  }, [showLeftSidebar, globalSections, editorMode]);
  return /*#__PURE__*/React__default["default"].createElement(StyledEditorLeftSidebarRoot, {
    id: sidebarConfig.id,
    width: sidebarConfig.width,
    enableScroll: sidebarConfig.enableScroll,
    ref: sidebarNodeRef
  }, /*#__PURE__*/React__default["default"].createElement(StyledEditorLeftSidebarTitle, null, sidebarConfig.title), /*#__PURE__*/React__default["default"].createElement(HorizontalLine, null), /*#__PURE__*/React__default["default"].createElement(StyledEditorLeftSidebarGroup, null, sidebarConfig.Component));
};

function includesAny(a, b) {
  return a.some(i => b.includes(i));
}

function reconcile({
  context,
  templateId,
  fieldName
}) {
  return item => {
    if (!fieldName || !templateId) {
      return item;
    }
    const contextMatches = item._itemProps?.[templateId]?.[fieldName] !== undefined;
    if (contextMatches) {
      return item;
    }
    return _internals.normalize({
      ...item,
      _itemProps: {
        [templateId]: {
          [fieldName]: {}
        }
      }
    }, context);
  };
}

const getTypes = schema => {
  if (schema?.type === "component-collection" || schema?.type === "component") {
    return schema.accepts;
  }
  return [];
};
const insertCommand = ({
  context,
  form,
  schema,
  templateId
}) => {
  const types = getTypes(schema);
  const reconcileItem = reconcile({
    context,
    templateId,
    fieldName: schema?.prop
  });
  return (path, index, item) => {
    const itemDefinition = _internals.findComponentDefinition(item, context);
    if (!itemDefinition) {
      return null;
    }
    const itemTypes = [itemDefinition.id, ...normalizeToStringArray(itemDefinition.type)];
    if (!includesAny(types, itemTypes)) {
      return null;
    }
    const reconciledItem = reconcileItem(item);
    const duplicatedItem = _internals.duplicateConfig(reconciledItem, context);
    form.mutators.insert(path, index, duplicatedItem);
    return `${path}.${index}`;
  };
};

function getSchema(path, context) {
  const parentDefinition = _internals.findComponentDefinitionById(path.parent?.templateId ?? "", context);
  const schema = (parentDefinition?.schema ?? []).find(s => s.prop === path.parent?.fieldName);
  return schema;
}
const toName = destination => [destination.parent?.path, destination.parent?.fieldName].filter(Boolean).join(".");
const fixIndexInCollection = (index = 0, schema) => {
  if (schema?.type === "component-collection") {
    return index + 1;
  }
  return index;
};
function destinationResolver({
  form,
  context
}) {
  return function (initialDestinationPath) {
    const resolvedDestinations = [];
    const resolvedPaths = new Set();
    const pathsQueue = [initialDestinationPath];
    while (pathsQueue.length > 0) {
      const path = pathsQueue.shift();
      if (!path) {
        continue;
      }
      if (resolvedPaths.has(path)) {
        continue;
      }
      if (!dotNotationGet(form.values, path)) {
        continue;
      }
      const parsed = _internals.parsePath(path, form);
      const definition = _internals.findComponentDefinitionById(parsed.templateId ?? "", context);
      if (!definition) {
        continue;
      }
      const schema = getSchema(parsed, context);
      resolvedDestinations.push({
        index: fixIndexInCollection(parsed.index, schema),
        name: toName(parsed),
        insert: insertCommand({
          context,
          form,
          schema,
          templateId: parsed.parent?.templateId
        })
      });
      for (const slot of definition.pasteSlots ?? []) {
        const slotSchema = definition.schema.find(({
          prop
        }) => prop === slot);
        if (!slotSchema) {
          continue;
        }
        const slotPath = `${path}.${slot}`;
        const slotValues = dotNotationGet(form.values, slotPath) ?? [];
        if (slotValues.length === 0) {
          resolvedDestinations.push({
            name: slotPath,
            index: 0,
            insert: insertCommand({
              context,
              form,
              schema: slotSchema,
              templateId: definition.id
            })
          });
        } else if (slotSchema.type === "component") {
          pathsQueue.push(`${slotPath}.0`);
        } else if (slotSchema.type === "component-collection") {
          pathsQueue.push(...Array.from(Array(slotValues.length).keys()).map(idx => `${slotPath}.${idx}`).reverse());
        }
      }
    }
    return resolvedDestinations;
  };
}

function pasteManager() {
  const inserts = new Map();
  return destinations => item => {
    let i = 0;
    while (i < destinations.length) {
      const {
        index,
        name,
        insert
      } = destinations[i];
      const path = `${name}.${index}`;
      const latestDestinationInserts = inserts.get(path) ?? 0;
      const result = insert(name, index + latestDestinationInserts, item);
      if (result) {
        inserts.set(path, latestDestinationInserts + 1);
        return result;
      }
      i++;
    }
    return null;
  };
}

/**
 * A selected rich text part is framed by its $richText component, so moving the
 * selection around starts from that component.
 */
function getFramedPath(path) {
  return isConfigPathRichTextPart(path) ? path.replace(RICH_TEXT_PART_CONFIG_PATH_REGEXP, "") : path;
}

/**
 * A path that no longer points at a component entry (e.g. the item was just removed)
 * resolves to its closest existing ancestor with a leftover field name.
 */
function isComponentPath(path, editorContext) {
  return _internals.parsePath(path, editorContext.form).fieldName === undefined;
}

/**
 * Whether the component at `path` renders inside a selection frame on the canvas.
 * Mirrors rendering: the page root has no frame, children of `noInline` slots are built
 * without EditableComponentBuilder, and BlocksControls skips the frame for compiled
 * components marked `noInline` (`selectable: false` in editing info).
 */
function hasSelectionFrame(path, editorContext) {
  const {
    parent
  } = _internals.parsePath(path, editorContext.form);
  if (!parent) {
    return false;
  }
  const schemaProp = _internals.findComponentDefinitionById(parent.templateId, editorContext)?.schema.find(schemaProp => schemaProp.prop === parent.fieldName);
  if (!schemaProp || "noInline" in schemaProp && schemaProp.noInline) {
    return false;
  }
  const compiledComponent = dotNotationGet(editorContext.compiledComponentConfig, pathToCompiledPath(path, editorContext));
  return compiledComponent !== undefined && !compiledComponent.__editing?.noInline;
}

/**
 * Framed components that contain `path`, nearest first: the layers a user can move the
 * selection up to from the canvas.
 */
function getSelectableAncestorPaths(path, editorContext) {
  const ancestorPaths = [];
  try {
    const framedPath = getFramedPath(path);
    if (!isComponentPath(framedPath, editorContext)) {
      return [];
    }
    if (framedPath !== path && hasSelectionFrame(framedPath, editorContext)) {
      ancestorPaths.push(framedPath);
    }
    let parent = _internals.parsePath(framedPath, editorContext.form).parent;
    while (parent) {
      if (hasSelectionFrame(parent.path, editorContext)) {
        ancestorPaths.push(parent.path);
      }
      parent = _internals.parsePath(parent.path, editorContext.form).parent;
    }
  } catch {
    return [];
  }
  return ancestorPaths;
}

/**
 * Focus after "select parent": the nearest framed ancestor of every focused item, once
 * each. Top-level sections have no framed parent, so selecting their parent clears focus.
 */
function getParentFocusedFields(focusedFields, editorContext) {
  const parentPaths = focusedFields.flatMap(focusedField => getSelectableAncestorPaths(focusedField, editorContext).slice(0, 1));
  return Array.from(new Set(parentPaths));
}

/**
 * Component name shown by canvas selection UI (hover label, breadcrumb). Falls back to
 * the component id when its definition has no label.
 */
function getComponentLabel(templateId, editorContext, translate) {
  const definition = _internals.findComponentDefinitionById(templateId, editorContext);
  return translate(definition?.label ?? templateId);
}

/**
 * Breadcrumb for a focused path: framed ancestors outermost first, then the framed
 * selection itself. Empty when the path no longer points at a component.
 */
function getSelectionBreadcrumb(path, editorContext, translate) {
  try {
    const framedPath = getFramedPath(path);
    if (!isComponentPath(framedPath, editorContext)) {
      return [];
    }
    return getSelectableAncestorPaths(framedPath, editorContext).reverse().concat(framedPath).map(crumbPath => ({
      path: crumbPath,
      label: getComponentLabel(_internals.parsePath(crumbPath, editorContext.form).templateId, editorContext, translate)
    }));
  } catch {
    return [];
  }
}

// Fixed height, rendered even without a selection, so selecting never resizes the canvas.
const BreadcrumbBar = styled.styled.nav.withConfig({
  displayName: "SelectionBreadcrumb__BreadcrumbBar",
  componentId: "sc-1hwunmc-0"
})(["flex:0 0 36px;display:flex;align-items:center;gap:2px;padding:0 12px;overflow-x:auto;border-top:1px solid ", ";background:", ";white-space:nowrap;"], easyblocksDesignSystem.Colors.black10, easyblocksDesignSystem.Colors.white);
const Crumb = styled.styled.button.withConfig({
  displayName: "SelectionBreadcrumb__Crumb",
  componentId: "sc-1hwunmc-1"
})(["flex-shrink:0;padding:2px 6px;border:0;border-radius:4px;background:transparent;cursor:pointer;&:hover{background:", ";}"], easyblocksDesignSystem.Colors.black10);
const CrumbLabel = styled.styled(Typography.Typography).withConfig({
  displayName: "SelectionBreadcrumb__CrumbLabel",
  componentId: "sc-1hwunmc-2"
})(["cursor:pointer;font-weight:", ";"], ({
  $isCurrent
}) => $isCurrent ? 700 : 400);

/**
 * Strip under the canvas with the selection's framed ancestors, outermost first. Lets
 * users reach containers that their children cover on the canvas.
 */
function SelectionBreadcrumb() {
  const editorContext = useEditorContext();
  const {
    t
  } = useTranslation();
  const {
    focussedField,
    setFocussedField
  } = editorContext;
  const crumbs = focussedField.length === 1 ? getSelectionBreadcrumb(focussedField[0], editorContext, t) : [];
  return /*#__PURE__*/React__default["default"].createElement(BreadcrumbBar, {
    "aria-label": t("selectionBreadcrumb")
  }, crumbs.map((crumb, index) => {
    const isCurrent = index === crumbs.length - 1;
    return /*#__PURE__*/React__default["default"].createElement(React.Fragment, {
      key: crumb.path
    }, index > 0 && /*#__PURE__*/React__default["default"].createElement(icons.Icons.ChevronRight, {
      size: 14
    }), /*#__PURE__*/React__default["default"].createElement(Crumb, {
      type: "button",
      "aria-current": isCurrent ? "location" : undefined,
      onClick: () => setFocussedField(crumb.path)
    }, /*#__PURE__*/React__default["default"].createElement(CrumbLabel, {
      $isCurrent: isCurrent,
      variant: "body",
      component: "span"
    }, crumb.label)));
  }));
}

function editorVariable(name) {
  return `--shopstory-editor-${name}`;
}
const BEFORE_ADD_BUTTON_DISPLAY = editorVariable("before-add-button-display");
const BEFORE_ADD_BUTTON_TOP = editorVariable("before-add-button-top");
const BEFORE_ADD_BUTTON_LEFT = editorVariable("before-add-button-left");
const AFTER_ADD_BUTTON_DISPLAY = editorVariable("after-add-button-display");
const AFTER_ADD_BUTTON_TOP = editorVariable("after-add-button-top");
const AFTER_ADD_BUTTON_LEFT = editorVariable("after-add-button-left");

/**
 * Moving a block is an insert followed by a remove, and each of those shifts the indices of
 * everything after it in the same collection. Replaying those shifts is what makes the block
 * that gets removed the original one rather than a neighbour that slid into its place.
 *
 * The insert happens first on purpose: if no collection in the chosen section accepts the
 * block the document is simply left alone, whereas removing first would destroy it.
 */
function planMoveAfterInsert(sourcePath, insertedPath) {
  const sourceToRemove = shiftPath(sourcePath, insertedPath, "downward");
  return {
    sourceToRemove,
    pathToFocus: shiftPath(insertedPath, sourceToRemove, "upward")
  };
}
const SelectionFrameActionsContainer = styled__default["default"].div.withConfig({
  displayName: "SelectionFrameActions__SelectionFrameActionsContainer",
  componentId: "sc-1fta8jo-0"
})(["position:absolute;top:calc(var(", ") - 42px);left:var(", ");border-radius:4px;box-shadow:var(--tina-shadow-big);display:var(", ",none);padding:5px 10px;width:max-content;background:", ";pointer-events:all;"], BEFORE_ADD_BUTTON_TOP, BEFORE_ADD_BUTTON_LEFT, BEFORE_ADD_BUTTON_DISPLAY, easyblocksDesignSystem.Colors.white);
const SelectionFrameActionsGroupButtons = styled__default["default"].div.withConfig({
  displayName: "SelectionFrameActions__SelectionFrameActionsGroupButtons",
  componentId: "sc-1fta8jo-1"
})(["display:flex;gap:2px;"]);
const StyledButtonGroup = styled__default["default"].div.withConfig({
  displayName: "SelectionFrameActions__StyledButtonGroup",
  componentId: "sc-1fta8jo-2"
})(["display:flex;flex-direction:row;justify-content:flex-end;margin-top:14px;gap:12px;"]);
const StyledMenu = styled__default["default"].div.withConfig({
  displayName: "SelectionFrameActions__StyledMenu",
  componentId: "sc-1fta8jo-3"
})(["display:var(", ",none);"], BEFORE_ADD_BUTTON_DISPLAY);
const SelectionMoreActions = ({
  t
}) => {
  const editorContext = useEditorContext();
  const router = new URLSearchParams(window.location.search);
  const currentDocument = router.get("document") ?? "";
  const toaster = Toaster.useToaster();
  const [openConfirmGlobalSection, setOpenConfirmGlobalSection] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef(null);
  const currentEntry = dotNotationGet(editorContext.form.values, editorContext.focussedField[editorContext.focussedField.length - 1]);
  const isAddedToPage = Object.values(editorContext?.globalSections ?? {}).some(globalSections => Object.keys(globalSections?.entities ?? {}).includes(currentEntry._id));
  const onRemoveGlobalSection = () => {
    const currentSection = Object.entries(editorContext?.globalSections ?? {}).find(([_, groupValue]) => Object.keys(groupValue?.entities ?? {}).includes(currentEntry._id));
    const groupName = currentSection?.[0];
    if (groupName) {
      setIsLoading(true);
      editorContext.onGlobalSectionChange?.({
        mode: "update",
        pages: currentSection?.[1].entities[currentEntry._id].pages.filter(page => page !== currentDocument),
        label: currentSection?.[1].entities[currentEntry._id].label,
        groupName,
        entry: currentEntry
      }).then(() => {
        toaster.success(`${t("editor.sidebar.globalSections.removeGlobal.success")} ${t("saveBeforeExit")}`, {
          duration: 5000
        });
        editorContext.actions.replaceItems([editorContext.focussedField[editorContext.focussedField.length - 1]], {
          ...currentEntry,
          _id: uniqueId()
        });
      }).catch(reason => {
        toaster.error(reason);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };
  const menus = [{
    id: "set-global",
    label: t("editor.sidebar.globalSections.setGlobal"),
    children: easyblocksCore.globalSectionGroups.map(globalSectionGroup => ({
      id: globalSectionGroup.id,
      label: globalSectionGroup.name,
      onClick: () => setOpenConfirmGlobalSection({
        groupName: globalSectionGroup.name
      })
    })),
    isHidden: isAddedToPage
  }, {
    id: "remove-global",
    label: t("editor.sidebar.globalSections.removeGlobal"),
    isLoading,
    isHidden: !isAddedToPage,
    onClick: onRemoveGlobalSection
  }];
  const onClose = () => {
    if (!isLoading) {
      setOpenConfirmGlobalSection(null);
    }
  };
  const onConfirmSetGlobalSection = () => {
    if (!inputRef?.current?.value) {
      toaster.error(t("editor.sidebar.globalSections.setGlobal.validName"));
      return;
    }
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    editorContext.onGlobalSectionChange?.({
      mode: "update",
      groupName: openConfirmGlobalSection?.groupName ?? "",
      label: inputRef?.current?.value,
      entry: currentEntry
    }).then(() => {
      setIsLoading(false);
      toaster.success(`${t("editor.sidebar.globalSections.setGlobal.success")} ${t("saveBeforeExit")}`, {
        duration: 5000
      });
      onClose();
    }).catch(reason => {
      setIsLoading(false);
      toaster.error(reason);
    });
  };
  const onEnter = e => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault();
      e.stopPropagation();
      onConfirmSetGlobalSection();
    }
  };
  React.useEffect(() => {
    if (openConfirmGlobalSection?.groupName) {
      queueMicrotask(() => {
        inputRef.current?.focus();
      });
    }
  }, [openConfirmGlobalSection]);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(StyledMenu, null, /*#__PURE__*/React__default["default"].createElement(Menu, {
    menus: menus,
    styles: {
      top: "40px",
      left: "80%"
    }
  })), /*#__PURE__*/React__default["default"].createElement(modals.Modal, {
    title: t("editor.sidebar.globalSections.setGlobal.enterName"),
    isOpen: !!openConfirmGlobalSection,
    onRequestClose: onClose,
    mode: "fit",
    height: "auto",
    endAdornment: /*#__PURE__*/React__default["default"].createElement(StyledButtonGroup, null, /*#__PURE__*/React__default["default"].createElement(buttons.ButtonSecondary, {
      onClick: onClose
    }, t("cancel")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonPrimary, {
      isLoading: isLoading,
      disabled: isLoading,
      onClick: onConfirmSetGlobalSection
    }, t("template.save.default")))
  }, /*#__PURE__*/React__default["default"].createElement(Input.Input, {
    ref: inputRef,
    withBorder: true,
    style: {
      width: 300
    },
    onKeyDown: onEnter
  })));
};
const SelectionFrameActions = ({
  focussedField,
  actions,
  translationFiles,
  contextParams,
  editorMode
}) => {
  const {
    t
  } = getTranslation({
    translationFiles,
    contextParams
  });
  const [showMore, setShowMore] = React.useState(false);
  const [showMoveTo, setShowMoveTo] = React.useState(false);
  const editorContext = useEditorContext();
  const toaster = Toaster.useToaster();
  const parentFocusedFields = getParentFocusedFields(focussedField, editorContext);

  // Moving carries one block: the block is inserted into the chosen section and removed from
  // where it was, and a multi-selection has no single source path to remove. Several blocks
  // are still moved together with cut and paste.
  const sourcePath = focussedField.length === 1 ? focussedField[0] : undefined;
  const moveTo = destinationPath => {
    setShowMoveTo(false);
    if (!sourcePath) {
      return;
    }
    const sourceEntry = dotNotationGet(editorContext.form.values, sourcePath);
    if (!sourceEntry) {
      return;
    }
    const block = _internals.duplicateConfig(sourceEntry, editorContext);
    let wasRejected = false;
    editorContext.actions.runChange(() => {
      const insertedPath = pasteManager()(destinationResolver({
        form: editorContext.form,
        context: editorContext
      })(destinationPath))(block);
      if (!insertedPath) {
        // Nothing in the chosen section accepts this block, so the document is untouched.
        wasRejected = true;
        return [sourcePath];
      }
      const {
        sourceToRemove,
        pathToFocus
      } = planMoveAfterInsert(sourcePath, insertedPath);
      editorContext.actions.removeItems([sourceToRemove]);
      return [pathToFocus];
    });
    if (wasRejected) {
      toaster.error(t("editor.canvas.action.moveTo.rejected"));
    }
  };

  // Every other top level section is offered as a destination. The section the block is
  // already in, and any section inside the block itself, are not destinations.
  const moveDestinations = React.useMemo(() => {
    if (!sourcePath) {
      return [];
    }
    const sections = editorContext.form.values?.data ?? [];
    return sections.map((_, index) => `data.${index}`).filter(destinationPath => destinationPath !== sourcePath && !destinationPath.startsWith(`${sourcePath}.`) && !sourcePath.startsWith(`${destinationPath}.`)).map((destinationPath, _, all) => ({
      id: destinationPath,
      // Sections repeat, so the position disambiguates two blocks with the same name.
      label: `${all.indexOf(destinationPath) + 1}. ${getComponentLabel(_internals.parsePath(destinationPath, editorContext.form).templateId, editorContext, t)}`,
      onClick: () => moveTo(destinationPath)
    }));
  }, [sourcePath, editorContext.form.values, t]);
  return /*#__PURE__*/React__default["default"].createElement(SelectionFrameActionsContainer, {
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React__default["default"].createElement(SelectionFrameActionsGroupButtons, null, parentFocusedFields.length > 0 && /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.LayerGroup,
    hideLabel: true,
    onClick: () => editorContext.setFocussedField(parentFocusedFields)
  }, t("selectParent")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.Duplicate,
    hideLabel: true,
    onClick: () => actions.duplicateItems(focussedField)
  }, t("duplicate")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.Trash,
    hideLabel: true,
    onClick: () => actions.removeItems(focussedField)
  }, t("delete")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.ArrowUp,
    hideLabel: true,
    onClick: () => actions.moveItems(focussedField, "top")
  }, t("editor.canvas.action.moveUp")), /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.ArrowDown,
    hideLabel: true,
    onClick: () => actions.moveItems(focussedField, "bottom")
  }, t("editor.canvas.action.moveDown")), moveDestinations.length > 0 && /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.Drag,
    hideLabel: true,
    onClick: () => setShowMoveTo(prev => !prev)
  }, t("editor.canvas.action.moveTo")), editorMode !== "admin-template" && /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhost, {
    icon: icons.Icons.ThreeDotsHorizontal,
    showTooltip: false,
    hideLabel: true,
    onClick: () => setShowMore(prev => !prev)
  })), showMoveTo && moveDestinations.length > 0 ? /*#__PURE__*/React__default["default"].createElement(StyledMenu, null, /*#__PURE__*/React__default["default"].createElement(Menu, {
    menus: moveDestinations,
    styles: {
      top: "40px",
      left: "0%"
    }
  })) : null, editorMode !== "admin-template" && showMore ? /*#__PURE__*/React__default["default"].createElement(SelectionMoreActions, {
    t: t
  }) : null);
};

function AddButton({
  position,
  index,
  offset,
  onClick
}) {
  const [isOpen, setIsOpen] = React__default["default"].useState(false);
  const addBlockButtonRef = React__default["default"].useRef(null);
  const {
    isOpen: isOpenTooltip,
    tooltipProps,
    triggerProps,
    arrowProps
  } = useTooltip();
  const {
    t
  } = useTranslation();
  const handleOpenBlockMenu = event => {
    event.stopPropagation();
    event.preventDefault();

    // Custom add action
    if (onClick) {
      onClick();
      return;
    }
  };
  React__default["default"].useEffect(() => {
    const inactivateBlockMenu = () => setIsOpen(false);
    document.addEventListener("mouseup", inactivateBlockMenu, false);
    return () => document.removeEventListener("mouseup", inactivateBlockMenu);
  }, []);
  return /*#__PURE__*/React__default["default"].createElement(AddButtonWrapper, _extends__default["default"]({
    index: index,
    offset: offset,
    position: position,
    isOpen: isOpen
  }, triggerProps), isOpenTooltip && /*#__PURE__*/React__default["default"].createElement(Tooltip, tooltipProps, /*#__PURE__*/React__default["default"].createElement(TooltipArrow, arrowProps), /*#__PURE__*/React__default["default"].createElement(TooltipBody, null, t("tooltip.add.section.blocks"))), /*#__PURE__*/React__default["default"].createElement(AddIconButton, {
    ref: addBlockButtonRef,
    onClick: handleOpenBlockMenu,
    isOpen: isOpen,
    primary: true,
    small: true
  }, /*#__PURE__*/React__default["default"].createElement("svg", {
    strokeWidth: "3",
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 23 23",
    fill: "none"
  }, /*#__PURE__*/React__default["default"].createElement("line", {
    x1: "11.5",
    y1: "4",
    x2: "11.5",
    y2: "19",
    stroke: "currentColor"
  }), /*#__PURE__*/React__default["default"].createElement("line", {
    x1: "4",
    y1: "11.5",
    x2: "19",
    y2: "11.5",
    stroke: "currentColor"
  }))));
}
const AddIconButton = styled.styled(IconButton).withConfig({
  displayName: "AddButton__AddIconButton",
  componentId: "sc-79bcl2-0"
})(["display:flex;align-items:center;&:focus{outline:none !important;}", ";"], props => props.isOpen && styled.css`
      pointer-events: none;
    `);
const AddButtonWrapper = styled.styled.div.withConfig({
  displayName: "AddButton__AddButtonWrapper",
  componentId: "sc-79bcl2-1"
})(["position:absolute;top:var( ", " );left:var( ", " );display:var( ", ",none );pointer-events:all;&:hover{transform:scale(1.2);transition:transform 0.1s ease-in-out;}"], ({
  position
}) => position === "before" ? BEFORE_ADD_BUTTON_TOP : AFTER_ADD_BUTTON_TOP, ({
  position
}) => position === "before" ? BEFORE_ADD_BUTTON_LEFT : AFTER_ADD_BUTTON_LEFT, ({
  position
}) => position === "before" ? BEFORE_ADD_BUTTON_DISPLAY : AFTER_ADD_BUTTON_DISPLAY);

const Wrapper = styled.styled.div.withConfig({
  displayName: "SelectionFramestyles__Wrapper",
  componentId: "sc-xqih8j-0"
})(["position:absolute;top:0;left:0;bottom:0;right:0;display:grid;place-items:center;pointer-events:none;"]);
const FrameWrapper = styled.styled.div.attrs(({
  width,
  height,
  transform
}) => {
  return {
    style: {
      width,
      height,
      transform
    }
  };
}).withConfig({
  displayName: "SelectionFramestyles__FrameWrapper",
  componentId: "sc-xqih8j-1"
})(["position:relative;z-index:1;display:grid;place-items:center;transform-origin:left;"]);

function calculateAddButtonsProperties(direction, targetElementRect, viewport, containerElementRect) {
  const halfButtonSize = Math.floor(ICON_BUTTON_SIZE / 2);
  if (direction === "vertical") {
    const beforeButtonTopOffset = Math.floor(targetElementRect.top - halfButtonSize);
    const afterButtonTopOffset = Math.floor(targetElementRect.top + targetElementRect.height - halfButtonSize);
    const buttonsLeftOffset = Math.floor(targetElementRect.left + targetElementRect.width / 2 - halfButtonSize);
    const isBeforeButtonWithinViewport = isButtonWithinViewport({
      top: beforeButtonTopOffset + halfButtonSize,
      left: buttonsLeftOffset + halfButtonSize
    }, viewport);
    const isAfterButtonWithinViewport = isButtonWithinViewport({
      top: afterButtonTopOffset + halfButtonSize,
      left: buttonsLeftOffset + halfButtonSize
    }, viewport);
    if (containerElementRect) {
      return {
        before: {
          top: beforeButtonTopOffset,
          left: buttonsLeftOffset,
          display: isBeforeButtonWithinViewport ? "block" : "none"
        },
        after: {
          top: afterButtonTopOffset,
          left: buttonsLeftOffset,
          display: isAfterButtonWithinViewport ? "block" : "none"
        }
      };
    } else {
      return {
        before: {
          top: beforeButtonTopOffset,
          left: buttonsLeftOffset,
          display: isBeforeButtonWithinViewport ? "block" : "none"
        },
        after: {
          top: afterButtonTopOffset,
          left: buttonsLeftOffset,
          display: isAfterButtonWithinViewport ? "block" : "none"
        }
      };
    }
  } else {
    const buttonsTopOffset = Math.floor(targetElementRect.top + targetElementRect.height / 2 - halfButtonSize);
    const beforeButtonLeftOffset = Math.floor(targetElementRect.left - halfButtonSize);
    const afterButtonLeftOffset = Math.floor(targetElementRect.left + targetElementRect.width - halfButtonSize);
    const isBeforeButtonWithinViewport = isButtonWithinViewport({
      top: buttonsTopOffset + halfButtonSize,
      left: beforeButtonLeftOffset + halfButtonSize
    }, viewport);
    const isAfterButtonWithinViewport = isButtonWithinViewport({
      top: buttonsTopOffset + halfButtonSize,
      left: afterButtonLeftOffset + halfButtonSize
    }, viewport);
    if (containerElementRect) {
      return {
        before: {
          top: buttonsTopOffset,
          left: beforeButtonLeftOffset,
          display: isBeforeButtonWithinViewport ? "block" : "none"
        },
        after: {
          top: buttonsTopOffset,
          left: afterButtonLeftOffset,
          display: isAfterButtonWithinViewport ? "block" : "none"
        }
      };
    } else {
      return {
        before: {
          top: buttonsTopOffset,
          left: beforeButtonLeftOffset,
          display: isBeforeButtonWithinViewport ? "block" : "none"
        },
        after: {
          top: buttonsTopOffset,
          left: afterButtonLeftOffset,
          display: isAfterButtonWithinViewport ? "block" : "none"
        }
      };
    }
  }
}
function isButtonWithinViewport(target, viewport) {
  return target.top >= 0 && target.top <= viewport.height && target.left >= 0 && target.left <= viewport.width;
}

function SelectionFrame({
  width,
  height,
  transform,
  editorMode
}) {
  const editorContext = useEditorContext();
  const {
    focussedField,
    form,
    actions,
    translationFiles = {},
    contextParams
  } = editorContext;
  const compiledFocusedField = focussedField.length === 1 ? pathToCompiledPath(focussedField[0], editorContext) : undefined;
  const compiledComponentConfig = compiledFocusedField ? dotNotationGet(editorContext.compiledComponentConfig, compiledFocusedField) : undefined;
  const {
    direction = "vertical"
  } = compiledComponentConfig?.__editing ?? {};
  const isAddingEnabled = isAddingEnabledForSelectedFields(focussedField, editorContext);
  React.useLayoutEffect(() => {
    if (focussedField.length === 0) {
      hideAddButtons();
    }
  }, [focussedField]);
  React.useLayoutEffect(() => {
    function handleSelectionFrameMessages(event) {
      if (!isAddingEnabled) {
        hideAddButtons();
        return;
      }
      if (event.data.type === "@easyblocks-editor/selection-frame-position-changed") {
        updateAddButtons(direction, event.data.payload.target, {
          width,
          height
        }, event.data.payload.container);
      }
    }
    window.addEventListener("message", handleSelectionFrameMessages);
    return () => {
      window.removeEventListener("message", handleSelectionFrameMessages);
    };
  }, [direction, height, isAddingEnabled, width]);
  async function handleAddButtonClick(which) {
    let path = focussedField.length === 1 ? focussedField[0] : undefined;
    if (!path) {
      return;
    }
    if (isConfigPathRichTextPart(path)) {
      path = path.replace(RICH_TEXT_PART_CONFIG_PATH_REGEXP, "");
    }
    const {
      parent,
      index
    } = _internals.parsePath(path, form);
    if (!parent || index === undefined) {
      return;
    }
    const definition = _internals.findComponentDefinitionById(parent.templateId, editorContext);
    const schemaProp = definition?.schema.find(schemaProp => schemaProp.prop === parent.fieldName);
    if (!schemaProp) {
      return;
    }
    const parentPath = parent.path + (parent.path === "" ? "" : ".") + parent.fieldName;
    const config = await actions.openComponentPicker({
      path: parentPath
    });
    if (config) {
      actions.insertItem({
        name: schemaProp.type === "component-collection-localised" ? `${parentPath}.${editorContext.contextParams.locale}` : parentPath,
        index: which === "before" ? index : index + 1,
        block: config
      });
    }
  }
  return /*#__PURE__*/React__default["default"].createElement(Wrapper, null, /*#__PURE__*/React__default["default"].createElement(FrameWrapper, {
    width: width,
    height: height,
    transform: transform
  }, /*#__PURE__*/React__default["default"].createElement(AddButton, {
    position: "before",
    onClick: () => handleAddButtonClick("before")
  }), /*#__PURE__*/React__default["default"].createElement(AddButton, {
    position: "after",
    onClick: () => handleAddButtonClick("after")
  }), isAddingEnabled ? /*#__PURE__*/React__default["default"].createElement(SelectionFrameActions, {
    actions: actions,
    focussedField: focussedField,
    translationFiles: translationFiles,
    contextParams: contextParams,
    editorMode: editorMode
  }) : null));
}
function updateAddButtons(direction, targetElementRect, viewport, containerElementRect) {
  const {
    after,
    before
  } = calculateAddButtonsProperties(direction, targetElementRect, viewport, containerElementRect);
  setCssVariable(BEFORE_ADD_BUTTON_TOP, before.top + "px");
  setCssVariable(BEFORE_ADD_BUTTON_LEFT, before.left + "px");
  setCssVariable(AFTER_ADD_BUTTON_TOP, after.top + "px");
  setCssVariable(AFTER_ADD_BUTTON_LEFT, after.left + "px");
  setCssVariable(BEFORE_ADD_BUTTON_DISPLAY, before.display);
  setCssVariable(AFTER_ADD_BUTTON_DISPLAY, after.display);
}
function hideAddButtons() {
  setCssVariable(BEFORE_ADD_BUTTON_DISPLAY, "none");
  setCssVariable(AFTER_ADD_BUTTON_DISPLAY, "none");
}
function setCssVariable(name, value) {
  document.documentElement.style.setProperty(name, value.toString());
}
function isAddingEnabledForSelectedFields(focusedFields, editorContext) {
  if (focusedFields.length === 0) {
    return false;
  } else if (focusedFields.length === 1) {
    if (isConfigPathRichTextPart(focusedFields[0])) {
      return false;
    }
    const {
      parent
    } = _internals.parsePath(focusedFields[0], editorContext.form);
    if (!parent) return false;
    const parentDefinition = _internals.findComponentDefinitionById(parent.templateId, editorContext);
    const schemaProp = parentDefinition?.schema.find(schemaProp => schemaProp.prop === parent.fieldName);
    if (!schemaProp) return false;
    return _internals.isSchemaPropCollection(schemaProp);
  } else {
    return false;
  }
}

class Form {
  loading = false;
  constructor({
    id,
    label,
    fields,
    actions,
    buttons,
    reset,
    loadInitialValues,
    onChange,
    ...options
  }) {
    const initialValues = options.initialValues || {};
    this.__type = options.__type || "form";
    this.id = id;
    this.label = label;
    this.fields = fields || [];
    this.onSubmit = options.onSubmit;
    this.finalForm = finalForm.createForm({
      ...options,
      initialValues,
      onSubmit: this.handleSubmit,
      mutators: {
        ...arrayMutators__default["default"],
        ...options.mutators
      }
    });
    this._reset = reset;
    this.actions = actions || [];
    this.buttons = buttons || {
      save: "Save",
      reset: "Reset"
    };
    this.updateFields(this.fields);
    if (loadInitialValues) {
      this.loading = true;
      loadInitialValues().then(initialValues => {
        this.updateInitialValues(initialValues);
      }).finally(() => {
        this.loading = false;
      });
    }
    if (onChange) {
      let firstUpdate = true;
      this.subscribe(formState => {
        if (firstUpdate) {
          firstUpdate = false;
        } else {
          onChange(formState);
        }
      }, {
        values: true
      });
    }
  }

  /**
   * Returns the current values of the form.
   *
   * if the form is still loading it returns `undefined`.
   */
  get values() {
    if (this.loading) {
      return undefined;
    }
    return this.finalForm.getState().values || this.initialValues;
  }

  /**
   * The values the form was initialized with.
   */
  get initialValues() {
    return this.finalForm.getState().initialValues;
  }

  /**
   * @deprecated Unnecessary indirection
   */
  updateFields(fields) {
    this.fields = fields;
  }

  /**
   * Subscribes to changes to the form. The subscriber will only be called when
   * values specified in subscription change. A form can have many subscribers.
   */
  subscribe = (cb, options) => {
    return this.finalForm.subscribe(cb, options);
  };
  handleSubmit = async (values, form, cb) => {
    try {
      const response = await this.onSubmit(values, form, cb);
      form.initialize(values);
      return response;
    } catch (error) {
      return {
        [finalForm.FORM_ERROR]: error
      };
    }
  };

  /**
   * Changes the value of the given field.
   *
   * @param name
   * @param value
   */
  change(name, value) {
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed("Change to", name === "" ? '""' : `"${name}"`);
      console.log("Old config", this.values);
      console.log("Old value", dotNotationGet(this.values, name));
      this.finalForm.change(name, value);
      console.log("New config", this.values);
      console.log("New value", value);
      console.groupEnd();
      return;
    }
    return this.finalForm.change(name, value);
  }
  get mutators() {
    return this.finalForm.mutators;
  }

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
  updateValues(values) {
    this.finalForm.batch(() => {
      const activePath = this.finalForm.getState().active;
      if (!activePath) {
        updateEverything(this.finalForm, values);
      } else {
        updateSelectively(this.finalForm, values);
      }
    });
  }

  /**
   * Replaces the initialValues of the form without deleting the current values.
   *
   * This function is helpful when the initialValues are loaded asynchronously.
   *
   * @param initialValues
   */
  updateInitialValues(initialValues) {
    this.finalForm.batch(() => {
      const values = this.values || {};
      this.finalForm.initialize(initialValues);
      const activePath = this.finalForm.getState().active;
      if (!activePath) {
        updateEverything(this.finalForm, values);
      } else {
        updateSelectively(this.finalForm, values);
      }
    });
  }
}
function updateEverything(form, values) {
  Object.entries(values).forEach(([path, value]) => {
    form.change(path, value);
  });
}
function updateSelectively(form, values, prefix) {
  const activePath = form.getState().active;
  Object.entries(values).forEach(([name, value]) => {
    const path = prefix ? `${prefix}.${name}` : name;
    if (typeof value === "object") {
      if (activePath.startsWith(path)) {
        updateSelectively(form, value, path);
      } else {
        form.change(path, value);
      }
    } else if (path !== activePath) {
      form.change(path, value);
    }
  });
}

/**
 * A hook that creates a form and updates it's watched properties.
 */
function useForm({
  loadInitialValues,
  ...options
}, watch = {}) {
  /**
   * `initialValues` will be usually be undefined if `loadInitialValues` is used.
   *
   * If the form helper is using `watch.values`, which would contain
   * the current state of the form, then we set that to the `initialValues`
   * so the form is initialized with some state.
   *
   * This is beneficial for SSR and will hopefully not be noticeable
   * when editing the site as the actual `initialValues` will be set
   * behind the scenes.
   */
  options.initialValues = options.initialValues || watch.values;
  const [, setValues] = React__default["default"].useState(options.initialValues);
  const [form, setForm] = React__default["default"].useState(() => {
    return createForm(options, form => {
      setValues(form.values);
    });
  });
  React__default["default"].useEffect(function () {
    if (form.id === options.id) return;
    setForm(createForm(options, form => {
      setValues(form.values);
    }));
  }, [options.id]);
  const [formIsLoading, setFormIsLoading] = React__default["default"].useState(() => loadInitialValues ? true : false);
  const loadFormData = React__default["default"].useCallback(async () => {
    if (loadInitialValues) {
      setFormIsLoading(true);
      await loadInitialValues().then(values => {
        form.updateInitialValues(values);
      }).finally(() => {
        setFormIsLoading(false);
      });
    }
  }, [form, setFormIsLoading]);
  React__default["default"].useEffect(() => {
    loadFormData();
  }, [form, loadFormData]);
  useUpdateFormFields(form, watch.fields);
  useUpdateFormLabel(form, watch.label);
  useUpdateFormValues(form, watch.values);
  return [form ? form.values : options.initialValues, form, formIsLoading];
}
function createForm(options, handleChange) {
  const form = new Form(options);
  form.subscribe(handleChange, {
    values: true
  });
  return form;
}

/**
 * A React Hook that update's the `Form` if `fields` are changed.
 *
 * This hook is useful when dynamically creating fields, or updating
 * them via hot module replacement.
 */
function useUpdateFormFields(form, fields) {
  React__default["default"].useEffect(() => {
    if (typeof fields === "undefined") return;
    form.updateFields(fields);
  }, [form, fields]);
}

/**
 * A React Hook that update's the `Form` if the `label` is changed.
 *
 * This hook is useful when dynamically creating creating the label,
 * or updating it via hot module replacement.
 */
function useUpdateFormLabel(form, label) {
  React__default["default"].useEffect(() => {
    if (typeof label === "undefined") return;
    form.label = label;
  }, [form, label]);
}

/**
 * Updates the Form with new values.
 *
 * Only updates fields that are:
 *
 * 1. registered with the form
 * 2. not currently [active](https://final-form.org/docs/final-form/types/FieldState#active)
 *
 * This hook is useful when the form must be kept in sync with the data source.
 */
function useUpdateFormValues(form, values) {
  React__default["default"].useEffect(() => {
    if (typeof values === "undefined") return;
    form.updateValues(values);
  }, [form, values]);
}

function addLocalizedFlag(config, context) {
  return configMap(config, context, ({
    value,
    schemaProp
  }) => {
    if (schemaProp.type === "text" && value.id?.startsWith("local.") || schemaProp.type === "component-collection-localised") {
      return {
        __localized: true,
        ...value
      };
    }
    return value;
  });
}

/**
 * useDataSaver works in a realm of SINGLE CONFIG.
 * @param initialDocument
 * Data saver will use this document as a starting point. It can be `null` if there is no document yet.
 * Data saver will perform first save when any local change is detected.
 */
function useDataSaver(initialDocument, editorContext, editorMode) {
  const editorContextRef = React.useRef(editorContext);
  const initialGlobalConfigs = React.useRef(null);
  const remoteDocument = React.useRef(initialDocument);
  const toaster = Toaster.useToaster();
  const [isSaving, setIsSaving] = React.useState(false);
  const {
    t
  } = getTranslation(editorContextRef.current);
  const router = new URLSearchParams(window.location.search);
  const themeId = router.get("themeId") ?? "";

  /**
   * This state variable is going to be used ONLY for comparison with local config in case of missing document.
   * It's not going to change at any time during the lifecycle of this hook.
   */
  const [initialConfigInCaseOfMissingDocument] = React.useState(deepClone(editorContextRef.current.form.values));
  const onTickRef = React.useRef(() => Promise.resolve());
  const isConfigTheSame = () => {
    const localConfig = editorContextRef.current.form.values;
    const localConfigSnapshot = getConfigSnapshot(localConfig);
    const previousConfig = remoteDocument.current ? remoteDocument.current.entry : initialConfigInCaseOfMissingDocument;
    const previousConfigSnapshot = getConfigSnapshot(previousConfig);
    const isSnapshotSame = deepCompare(localConfigSnapshot, previousConfigSnapshot);
    if (editorMode === "admin-template") {
      return isSnapshotSame;
    }
    const isGlobalSectionsSame = initialGlobalConfigs?.current !== null ? deepCompare(initialGlobalConfigs?.current ?? {}, editorContextRef.current.globalSections ?? {}) : true;
    return isSnapshotSame && isGlobalSectionsSame;
  };

  /**
   * Saved-status flag mirrored into React state so the parent window gets a
   * fresh "content-saved-status" message whenever it actually flips.
   * `isConfigTheSame` reads from refs, so we cannot rely on render timing to
   * recompute it — we drive it from real config changes instead (see effects below).
   */
  const [isSaved, setIsSaved] = React.useState(() => isConfigTheSame());
  const onTick = async ({
    mode
  }) => {
    // Playground mode is a special case, we don't want to save anything
    if (editorContextRef.current.readOnly) {
      return;
    }
    if (mode === "force") {
      setIsSaving(true);
    }
    const localConfig = editorContextRef.current.form.values;
    const localConfigSnapshot = getConfigSnapshot(localConfig);
    const configToSaveWithLocalisedFlag = addLocalizedFlag(localConfigSnapshot, editorContextRef.current);
    async function runSaveCallback() {
      await editorContextRef.current.save(remoteDocument.current);
    }

    // New document
    if (remoteDocument.current === null) {
      console.debug("New document");

      // There must be at least one change in order to create a new document, we're not storing empty temporary documents
      if (isConfigTheSame()) {
        console.debug("no change -> bye");
        setIsSaving(false);
        return;
      }
      console.debug("change detected! -> create");
      const newDocument = await editorContextRef.current.backend.documents.create({
        entry: configToSaveWithLocalisedFlag
      });
      remoteDocument.current = {
        ...newDocument,
        // @ts-ignore
        config: {
          config: configToSaveWithLocalisedFlag
        }
      };
      await runSaveCallback();
      setIsSaving(false);
    }
    // Document update
    else {
      console.debug("Existing document");
      try {
        const latestDocument = await editorContextRef.current.backend.documents.get({
          id: remoteDocument.current.id,
          themeId
        });
        const latestRemoteDocumentVersion = latestDocument.version ?? -1;
        const isNewerDocumentVersionAvailable = remoteDocument.current.version < latestRemoteDocumentVersion;

        // Newer version of document is available
        if (isNewerDocumentVersionAvailable) {
          console.debug("new remote version detected, updating");
          if (!latestDocument) {
            throw new Error("unexpected error");
          }
          const latestConfig = removeLocalizedFlag(latestDocument.entry, editorContextRef.current);
          editorContextRef.current.actions.runChange(() => {
            editorContextRef.current.form.change("", latestConfig);
            return [];
          });
          remoteDocument.current = latestDocument;

          // Notify when local config was modified
          if (!isConfigTheSame()) {
            console.debug("there were local changes -> notify");
            editorContextRef.current.actions.notify("Remote changes detected, local changes have been overwritten.");
          }
          return;
        }
        // No remote change occurred
        else {
          if (isConfigTheSame()) {
            console.debug("no local changes -> bye");
            if (mode === "force") {
              toaster.success(t("topBar.noLocalChange"));
            }
            // Let's do nothing, no remote and local change
          } else {
            console.debug("updating the document", remoteDocument.current.id);
            const updatedPromises = [];
            updatedPromises.push(editorContextRef.current.backend.documents.update({
              id: remoteDocument.current.id,
              entry: configToSaveWithLocalisedFlag,
              version: remoteDocument.current.version
            }, themeId));
            if (mode === "force" && editorContextRef.current.backend.themes) {
              if (editorMode !== "admin-template") {
                updatedPromises.push(editorContextRef.current.backend.themes?.syncConfig({
                  themeId
                }));
              }
              initialGlobalConfigs.current = deepClone(editorContextRef.current.globalSections);
            }
            const [_updatedDocument, _updateThemeSuccess] = await Promise.all(updatedPromises);
            const updatedDocument = _updatedDocument;
            const updateThemeSuccess = _updateThemeSuccess;
            if (updatedDocument?.id) {
              remoteDocument.current.version = updatedDocument.version;
              toaster.success(t("topBar.saved"));
            } else if (!updatedDocument?.id) {
              toaster.error(t("topBar.save.error"));
            }
            if (editorMode !== "admin-template") {
              if (mode === "force" && updateThemeSuccess) {
                toaster.success(t("editor.sidebar.globalSections.save.success"));
              } else if (mode === "force" && !updateThemeSuccess) {
                toaster.error(t("editor.sidebar.globalSections.save.error"));
              }
            }
            remoteDocument.current.entry = localConfigSnapshot;
            await runSaveCallback();
          }
        }
      } catch (error) {
        toaster.error(t("topBar.save.error"));
      } finally {
        setIsSaving(false);
      }
    }
  };

  // We're keeping this in ref, because of setInterval keeping initial closure
  onTickRef.current = () => onTick({
    mode: "auto"
  });
  const inProgress = React.useRef(false);
  const wasSaveNowCalled = React.useRef(false);
  const messageHandler = async event => {
    const {
      id,
      type
    } = event.data;
    if (type === "@easyblocks/content-saved-status") {
      event.source.postMessage({
        id,
        type: "@easyblocks/content-saved-status",
        payload: {
          isSavedDocument: isConfigTheSame()
        }
      }, "*");
    }
  };
  React.useEffect(() => {
    const interval = setInterval(() => {
      // We ignore ticks when previous requests are in progress
      if (inProgress.current || wasSaveNowCalled.current) {
        return;
      }
      inProgress.current = true;
      onTickRef.current().finally(() => {
        inProgress.current = false;
      });
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  React.useEffect(() => {
    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);
  React.useEffect(() => {
    editorContextRef.current = editorContext;
    if (initialGlobalConfigs.current === null && editorContextRef.current.globalSections !== null) {
      initialGlobalConfigs.current = deepClone(editorContextRef.current.globalSections);
    }
    setIsSaved(isConfigTheSame());
  }, [editorContext]);
  React.useEffect(() => {
    const recompute = () => setIsSaved(isConfigTheSame());
    recompute();
    return editorContext.form.subscribe(recompute, {
      values: true
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorContext.form]);

  // Notify the parent window only when the saved status actually flips.
  React.useEffect(() => {
    window?.top?.postMessage({
      type: "@easyblocks/content-saved-status",
      payload: {
        isSavedDocument: isSaved
      }
    }, "*");
  }, [isSaved]);
  return {
    isSaving,
    isDirty: isConfigTheSame,
    saveNow: async () => {
      wasSaveNowCalled.current = true;

      // Wait until inProgress is false
      while (true) {
        if (inProgress.current) {
          console.debug("waiting...");
          await sleep(500);
        } else {
          break;
        }
      }
      console.debug("Last save!");
      await onTick({
        mode: "force"
      });
    }
  };
}

const GLOBAL_SHORTCUTS_KEYS = ["Escape", "Delete", "Backspace", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "l", "L"
// "s",
// "S",
];
const DATA_TRANSFER_FORMAT = "text/x-shopstory";
function useEditorGlobalKeyboardShortcuts(editorContext) {
  let isDeleting = false;
  let pasteId;
  const debouncedMoveItemsRef = React.useRef(lodash.debounce((actions, fields, direction) => {
    actions.moveItems(fields, direction);
  }, 100, {
    leading: true,
    trailing: false
  }));
  React.useEffect(() => {
    const {
      focussedField: focusedFields,
      actions
    } = editorContext;
    const debouncedMoveItems = debouncedMoveItemsRef.current;
    function handleKeydown(event) {
      if (isTargetInputElement(event.target)) {
        return;
      }
      if (!isGlobalShortcut(event)) {
        return;
      }
      if (isAnyFieldSelected(focusedFields)) {
        if ((event.key === "Delete" || event.key === "Backspace") && !isDeleting) {
          isDeleting = true;
          actions.removeItems(focusedFields);
          setTimeout(() => {
            isDeleting = false;
          }, 2000);
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          debouncedMoveItems(actions, focusedFields, "top");
        } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          debouncedMoveItems(actions, focusedFields, "bottom");
        } else if (event.key === "Escape") {
          // A popup (select, menu, tooltip) that closed on this Escape has already
          // prevented its default; it must not also move the selection.
          if (!event.defaultPrevented) {
            editorContext.setFocussedField(getParentFocusedFields(focusedFields, editorContext));
          }
        } else if (event.key.toUpperCase() === "L") {
          actions.logSelectedItems();
        }
      }

      // if ((event.ctrlKey || event.metaKey) && event.key.toUpperCase() === "S") {
      //   event.preventDefault();
      //   saveNow?.();
      // }
    }
    function handleCopy(event) {
      if (!canHandleCopyPaste(focusedFields, event)) {
        return;
      }
      const configs = getConfigsToCopy(focusedFields, editorContext);
      const json = JSON.stringify(configs);
      event.preventDefault();
      // Custom MIME for in-editor paste fidelity; text/plain so OS clipboard
      // surfaces the JSON to external apps.
      event.clipboardData?.setData(DATA_TRANSFER_FORMAT, json);
      event.clipboardData?.setData("text/plain", json);
    }
    function handleCut(event) {
      if (!canHandleCopyPaste(focusedFields, event)) {
        return;
      }
      const configs = getConfigsToCopy(focusedFields, editorContext);
      const json = JSON.stringify(configs);
      event.preventDefault();
      event.clipboardData?.setData(DATA_TRANSFER_FORMAT, json);
      event.clipboardData?.setData("text/plain", json);
      actions.removeItems(focusedFields);
    }
    function handlePaste(event) {
      const rawData = event.clipboardData?.getData(DATA_TRANSFER_FORMAT);
      clearTimeout(pasteId);
      pasteId = setTimeout(() => {
        if (!canHandleCopyPaste(focusedFields, event)) {
          return;
        }
        if (!rawData || rawData === "") {
          return;
        }
        try {
          const parsedData = JSON.parse(rawData);
          const data = Array.isArray(parsedData) ? parsedData : [parsedData];
          actions.pasteItems(data);
          event.preventDefault();
        } catch (e) {
          console.error(e);
          return;
        }
      }, 200);
    }
    window.document.addEventListener("keydown", handleKeydown);
    window.document.addEventListener("copy", handleCopy);
    window.document.addEventListener("cut", handleCut);
    window.document.addEventListener("paste", handlePaste);
    return () => {
      window.document.removeEventListener("keydown", handleKeydown);
      window.document.removeEventListener("copy", handleCopy);
      window.document.removeEventListener("cut", handleCut);
      window.document.removeEventListener("paste", handlePaste);
    };
  });
  React.useEffect(() => {
    return () => {
      debouncedMoveItemsRef.current.cancel();
    };
  }, []);
}
function isTargetInputElement(target) {
  return isTargetHtmlElement(target) && (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.tagName === "DIV" && target.getAttribute("role") === "textbox");
}
function isTargetHtmlElement(element) {
  return element !== null;
}
function getConfigsToCopy(paths, editorContext) {
  const sortedPaths = [...paths].sort(preOrderPathComparator("ascending"));
  return sortedPaths.map(path => {
    const config = dotNotationGet(editorContext.form.values, path);
    return _internals.duplicateConfig(config, editorContext);
  });
}
function canHandleCopyPaste(focusedFields, event) {
  const notInsideInputElement = !(isTargetInputElement(event.target) || isTargetInputElement(document.activeElement));
  const insideEditorIFrame = window.frameElement;
  const focusedFieldsSelected = isAnyFieldSelected(focusedFields);
  return notInsideInputElement && insideEditorIFrame && focusedFieldsSelected;
}
function isGlobalShortcut(event) {
  return GLOBAL_SHORTCUTS_KEYS.includes(event.key);
}

// FIXME: This is my mistake, because I was lazy at the beginning and it was easier for me to introduce changes
// by assuming that non empty array with empty string means no fields selected.
// IMO this is stupid and can lead to confusion.
function isAnyFieldSelected(focusedFields) {
  return focusedFields.length > 0 && focusedFields[0] !== "";
}

const HISTORY_SIZE = 50;
class EditorHistory {
  constructor() {
    this.values = [];
    this.currentIndex = -1;
  }
  push(value) {
    const isCurrentIndexLastEntry = this.values.length - 1 === this.currentIndex;

    // If we push to history while `currentIndex` is not set on latest history entry
    // our history would me messed up. We need to rewrite our history by removing all
    // entries after the current index.
    if (!isCurrentIndexLastEntry) {
      this.values.splice(this.currentIndex + 1, this.values.length - 1 - this.currentIndex);
    }
    const isAboutToReachSizeLimit = this.values.length + 1 > HISTORY_SIZE;
    if (isAboutToReachSizeLimit) {
      this.values.shift();
    }
    this.values.push(value);
    this.currentIndex = this.values.length - 1;
  }
  replace(value) {
    this.values[this.currentIndex] = value;
  }
  replaceAt(oldValue, newValue) {
    const entryIndex = this.values.findIndex(value => value.config === oldValue.config);
    if (entryIndex !== -1) {
      this.values[entryIndex] = newValue;
    }
  }
  forward() {
    if (!this.canGoForward()) {
      this.currentIndex = this.values.length - 1;
      return null;
    }
    const currentEntry = this.values[this.currentIndex];
    while (this.canGoForward()) {
      this.currentIndex += 1;
      const nextEntry = this.values[this.currentIndex];
      if (!deepCompare(nextEntry.config, currentEntry.config)) {
        return nextEntry;
      }
    }
    return null;
  }
  back() {
    if (!this.canGoBack()) {
      return null;
    }
    const currentEntry = this.values[this.currentIndex];
    while (this.canGoBack()) {
      this.currentIndex -= 1;
      const previousEntry = this.values[this.currentIndex];
      if (!deepCompare(previousEntry.config, currentEntry.config)) {
        return previousEntry;
      }
    }
    return null;
  }
  getEntries() {
    return this.values.map(value => ({
      ...value
    }));
  }
  canGoForward() {
    return this.currentIndex < this.values.length - 1;
  }
  canGoBack() {
    return this.currentIndex > 0;
  }
  isNewest() {
    return this.values.length === this.currentIndex + 1;
  }
  isOldest() {
    return this.currentIndex === 0;
  }
}

function useEditorHistory({
  onChange
}) {
  const editorHistory = React.useRef(new EditorHistory()).current;
  function undo() {
    ReactDOM__default["default"].unstable_batchedUpdates(() => {
      const entry = editorHistory.back();
      if (entry === null) {
        return;
      }
      const {
        focussedField,
        ...rest
      } = entry;
      onChange({
        focusedField: focussedField,
        ...rest,
        type: "undo"
      });
    });
  }
  function redo() {
    ReactDOM__default["default"].unstable_batchedUpdates(() => {
      const entry = editorHistory.forward();
      if (!entry) {
        return null;
      }
      const {
        focussedField,
        ...rest
      } = entry;
      onChange({
        focusedField: focussedField,
        ...rest,
        type: "redo"
      });
    });
  }
  function push(entry) {
    editorHistory.push(entry);
  }
  return {
    push,
    redo,
    undo,
    editorHistoryInstance: editorHistory
  };
}

const debouncedUpdate = debounce__default["default"](fn => fn(), 100);

/** Breathing room so the device frame chrome is not clipped by the container. */
const DEVICE_FRAME_PADDING_PX = 48;

/** A fixed zoom level, or "fit" to always scale the device down to the container. */

const CanvasColumn = styled.styled.div.withConfig({
  displayName: "Editor__CanvasColumn",
  componentId: "sc-t95yuf-0"
})(["flex:1 1 auto;display:flex;flex-direction:column;"]);
const ContentContainer = styled.styled.div.withConfig({
  displayName: "Editor__ContentContainer",
  componentId: "sc-t95yuf-1"
})(["position:relative;flex:1 1 auto;min-height:0;display:flex;flex-direction:column;"]);
const SidebarAndContentContainer = styled.styled.div.withConfig({
  displayName: "Editor__SidebarAndContentContainer",
  componentId: "sc-t95yuf-2"
})(["height:", ";width:100%;background:#fafafa;display:flex;flex-direction:row;align-items:stretch;"], props => `calc(${props.height} - ${TOP_BAR_HEIGHT}px)`);
const SidebarContainer = styled.styled.div.withConfig({
  displayName: "Editor__SidebarContainer",
  componentId: "sc-t95yuf-3"
})(["", " position:relative;background:", ";border-left:1px solid ", ";border-right:1px solid ", ";box-sizing:border-box;> *{box-sizing:border-box;}"], ({
  width = "240px"
}) =>
// A flex item defaults to min-width:auto, which lets a wide field push the
// panel past its basis; different selections carry different fields, so the
// panel would resize on every click and shove the canvas sideways.
// max-width clamps that automatic minimum, which pins the width without
// clipping: overflow here would cut off any popover a field opens.
`flex: 0 0 ${width}; width: ${width}; min-width: 0; max-width: ${width};`, easyblocksDesignSystem.Colors.white, easyblocksDesignSystem.Colors.black100, easyblocksDesignSystem.Colors.black100);
const DataSaverRoot = styled.styled.div.withConfig({
  displayName: "Editor__DataSaverRoot",
  componentId: "sc-t95yuf-4"
})(["position:fixed;width:100%;height:100%;z-index:100000;display:flex;justify-content:center;align-items:center;"]);
const DataSaverOverlay = styled.styled.div.withConfig({
  displayName: "Editor__DataSaverOverlay",
  componentId: "sc-t95yuf-5"
})(["z-index:-1;position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.25);"]);
const DataSaverModal = styled.styled.div.withConfig({
  displayName: "Editor__DataSaverModal",
  componentId: "sc-t95yuf-6"
})(["background:white;padding:32px;border-radius:8px;display:flex;justify-content:center;align-items:center;", " font-size:16px;"], easyblocksDesignSystem.Fonts.body);
const AuthenticationScreen = styled.styled.div.withConfig({
  displayName: "Editor__AuthenticationScreen",
  componentId: "sc-t95yuf-7"
})(["width:100vw;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:24px;text-align:center;", ""], easyblocksDesignSystem.Fonts.bodyLarge);
const Editor = EditorBackendInitializer;
function EditorBackendInitializer(props) {
  const [enabled, setEnabled] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const [document, setDocument] = React.useState(null);
  const router = new URLSearchParams(window.location.search);
  const themeId = router.get("themeId") ?? "";
  React.useEffect(() => {
    async function run() {
      try {
        if (props.documentId) {
          const document = await props.config.backend.documents.get({
            id: props.documentId,
            themeId
          });
          if (!document) {
            throw new Error(`Can't fetch document with id: ${props.documentId}`);
          }
          setDocument(document);
        }
      } catch (error) {
        console.error(error);
        setError(`Backend initialization error, check out console for more details.`);
        return;
      }
      setEnabled(true);
    }
    run();
  }, []);
  if (!enabled) {
    return /*#__PURE__*/React__default["default"].createElement(AuthenticationScreen, null, /*#__PURE__*/React__default["default"].createElement(SkeletonEditor, null));
  }
  if (error) {
    return /*#__PURE__*/React__default["default"].createElement(DataSaverRoot, null, /*#__PURE__*/React__default["default"].createElement(DataSaverOverlay, null), /*#__PURE__*/React__default["default"].createElement(DataSaverModal, null, error));
  }
  return /*#__PURE__*/React__default["default"].createElement(EditorWrapper, _extends__default["default"]({}, props, {
    document: document
  }));
}
const EditorWrapper = /*#__PURE__*/React.memo(props => {
  if (!props.document) {
    if (props.rootTemplateId) {
      if (props.rootComponentId) {
        throw new Error("You can't pass both 'rootContainer' and 'rootTemplate' parameters to the editor");
      }
      const template = props.config.templates?.find(template => template.id === props.rootTemplateId);
      if (!template) {
        throw new Error(`The template given in "rootTemplate" ("${props.rootTemplateId}") doesn't exist in Config.templates`);
      }
    } else {
      if (props.rootComponentId === null) {
        throw new Error("When you create a new document you must pass a 'rootContainer' or 'rootTemplate' parameter to the editor");
      }
      if (!props.config.components?.find(component => component.id === props.rootComponentId)) {
        throw new Error(`The component given in rootContainer ("${props.rootComponentId}") doesn't exist in Config.components`);
      }
    }
  }

  // Locales
  if (!props.config.locales) {
    throw new Error("Required property Config.locales is empty");
  }
  checkLocalesCorrectness(props.config.locales); // very important to check locales correctness, circular references etc. Other functions
  const locale = easyblocksCore.getDefaultLocale(props.config.locales).code ?? props.locale;
  const rootTemplateEntry = props.rootTemplateId ? props.config.templates?.find(t => t.id === props.rootTemplateId)?.entry : null;
  const rootComponentId = props.document ? props.document.entry._component : rootTemplateEntry?._component ?? props.rootComponentId;
  const compilationContext = easyblocksCore.createCompilationContext(props.config, {
    locale: props?.defaultLocale ?? locale
  }, rootComponentId);
  const initialEntry = props.document ? adaptRemoteConfig(props.document.entry, compilationContext) : easyblocksCore.normalize(rootTemplateEntry ?? {
    _id: uniqueId(),
    _component: rootComponentId
  }, compilationContext);
  return /*#__PURE__*/React__default["default"].createElement(EditorContent, _extends__default["default"]({}, props, {
    compilationContext: compilationContext,
    initialDocument: props.document,
    initialEntry: initialEntry
  }));
});
EditorWrapper.displayName = "EditorWrapper";
function parseExternalDataId(externalDataId) {
  const [configId, fieldName, breakpointIndex] = externalDataId.split(".");
  return {
    configId,
    fieldName,
    breakpointIndex
  };
}
function useBuiltContent(editorContext, config, rawContent, externalData, onExternalDataChange) {
  const buildEntryResult = React.useRef();

  // cached inputs (needed to calculated "inputChanged")
  const inputRawContent = React.useRef();
  const inputIsEditing = React.useRef();
  const inputBreakpointIndex = React.useRef();
  const inputConfigTokenFonts = React.useRef(config.tokens?.fonts);
  const inputConfigTokenColors = React.useRef(config.tokens?.colors);
  const inputChanged = inputRawContent.current !== rawContent || inputIsEditing.current !== editorContext.isEditing || inputBreakpointIndex.current !== editorContext.breakpointIndex;
  const configFontsChanged = !deepCompare(inputConfigTokenFonts.current ?? {}, config.tokens?.fonts ?? {});
  const configColorsChanged = !deepCompare(inputConfigTokenColors.current ?? {}, config.tokens?.colors ?? {});
  if (!buildEntryResult.current || inputChanged || configFontsChanged || configColorsChanged) {
    /*
     * Why do we merge meta instead of overriding?
     * It might seem redundant. We could only take the newest meta and re-render, right?
     *
     * The problem is when we have nested Shopstory content.
     * The first call "buildSync" only compiles 1 level deep, doesn't compile deeper nested items.
     * Deeper nested items are compiled only when fetch is finished.
     *
     * Because of that, when we switch isEditing from true to false following thing will happen:
     * 1. We'll get only Metadata from 1 level compile.
     * 2. Shopstory Editor will try to re-render everything.
     * 3. It will remember old RenderableContent in the resources.
     * 4. But the metadata from old RenderableContent is not yet added.
     * 5. This will cause errors because there won't be enough definitions in the metadata.
     *
     * The solution is merging. Metadata code + definitions is growing incrementally in the editor.
     * There is no performance overhead of this operation and we might be sure that any definitions
     * that were added at any point will be available later.
     *
     */

    buildEntryResult.current = easyblocksCore.buildEntry({
      entry: rawContent,
      config,
      locale: editorContext.contextParams.locale,
      externalData,
      compiler: {
        findExternals: easyblocksCore.findExternals,
        validate: easyblocksCore.validate,
        compile: content => {
          let resultMeta = {
            vars: {
              devices: editorContext.devices,
              locale: editorContext.contextParams.locale,
              definitions: {
                actions: [],
                components: [],
                links: [],
                textModifiers: []
              }
            }
          };
          const normalizedContent = easyblocksCore.normalizeInput(content);
          const {
            meta,
            ...rest
          } = easyblocksCore.compileInternal(normalizedContent, editorContext, editorContext.compilationCache);
          resultMeta = easyblocksCore.mergeCompilationMeta(resultMeta, meta);
          return {
            ...rest,
            meta: resultMeta
          };
        }
      },
      isExternalDataChanged(externalDataValue, defaultIsExternalDataChanged) {
        // When editing, we consider external data to be changed in more ways.
        const storedExternalData = externalData[externalDataValue.id];

        // If external data for given id is already stored, but now the external id is empty it means that the user
        // has removed that external value and thus the user of editor has to remove it from its external data.
        if (storedExternalData && externalDataValue.externalId === null) {
          return true;
        }

        // If external data for given is is already stored, but now the external id is different it means that the user
        // has changed the selected external value and thus the user of editor has to update it in its external data.
        if (storedExternalData && externalDataValue.externalId && inputRawContent.current) {
          const {
            breakpointIndex,
            configId,
            fieldName
          } = parseExternalDataId(externalDataValue.id);
          const config = findConfigById(inputRawContent.current, editorContext, configId === "$" ? inputRawContent.current._id : configId);
          if (!config) {
            return false;
          }
          const value = breakpointIndex ? easyblocksCore.responsiveValueGet(config[fieldName], breakpointIndex) : config[fieldName];
          const hasExternalIdChanged = value === undefined || value.id !== externalDataValue.externalId;
          return hasExternalIdChanged;
        }
        return defaultIsExternalDataChanged(externalDataValue);
      }
    });
    inputConfigTokenFonts.current = config.tokens?.fonts;
    inputConfigTokenColors.current = config.tokens?.colors;
    if (Object.keys(buildEntryResult.current.externalData).length > 0) {
      onExternalDataChange(buildEntryResult.current.externalData, editorContext.contextParams);
    }
  }
  inputRawContent.current = rawContent;
  inputIsEditing.current = editorContext.isEditing;
  inputBreakpointIndex.current = editorContext.breakpointIndex;
  return {
    renderableContent: buildEntryResult.current.renderableContent,
    configAfterAuto: buildEntryResult.current.configAfterAuto,
    meta: buildEntryResult.current.meta
  };
}
function calculateViewportRelatedStuff(viewport, devices, mainBreakpointIndex, availableSize, showDeviceFrame, zoom = "fit") {
  let activeDevice;

  // Calculate active device
  if (viewport === "fit-screen") {
    if (!availableSize) {
      activeDevice = devices.find(device => device.id === mainBreakpointIndex);
    } else {
      const matchingDevice = getMatchingDevice(devices, availableSize.width);
      if (!matchingDevice) {
        throw new Error("can't find matching device");
      }
      activeDevice = matchingDevice;
    }
  } else {
    activeDevice = devices.find(device => device.id === viewport);
  }

  // Calculate width, height and scale
  let width, height;
  let scaleFactor = null;
  let offsetY = 0;
  if (!availableSize) {
    // lack of available size (first render) should wait until size is available to perform calculations
    width = 0;
    height = 0;
  } else {
    if (viewport === "fit-screen") {
      width = availableSize.width;
      height = availableSize.height;
    } else {
      const isMobile = viewport === "xs" || viewport === "sm";
      // Leave room for the device frame chrome so it is not clipped.
      const frameInset = showDeviceFrame && !isMobile ? DEVICE_FRAME_PADDING_PX * 2 : 0;
      const widthBudget = Math.max(availableSize.width - frameInset, 1);

      // The page always keeps the width the device declares. When it does not
      // fit we shrink it proportionally; we never stretch the device to the
      // container, which is what used to reflow the page on selection.
      width = activeDevice.w;
      const fitScale = Math.min(1, widthBudget / activeDevice.w);

      // A zoom above fit-screen would overflow a container that cannot scroll,
      // so fitScale is a hard ceiling.
      const appliedScale = zoom === "fit" ? fitScale : Math.min(zoom, fitScale);
      if (appliedScale < 1) {
        scaleFactor = appliedScale;
        height = activeDevice.h === null ? availableSize.height / appliedScale : Math.min(activeDevice.h, availableSize.height / appliedScale);
        offsetY = (availableSize.height - height) / 2;
      } else {
        height = activeDevice.h === null ? availableSize.height : Math.min(activeDevice.h, availableSize.height);
      }
    }
  }
  return {
    breakpointIndex: activeDevice.id,
    iframeSize: {
      width,
      height,
      transform: scaleFactor === null ? "none" : `translateY(${offsetY}px) scale(${scaleFactor})`
    }
  };
}
function useRerenderOnIframeResize(iframe) {
  const {
    forceRerender
  } = useForceRerender();
  const resizeObserver = React.useRef(new ResizeObserver(throttle__default["default"](() => {
    forceRerender();
  }, 100)));
  React.useEffect(() => {
    if (!iframe) {
      return;
    }
    resizeObserver.current.observe(iframe);
    return () => {
      resizeObserver.current.unobserve(iframe);
    };
  }, [iframe]);
}
const EditorContent = ({
  compilationContext,
  heightMode = "viewport",
  initialDocument,
  initialEntry,
  externalData,
  mode,
  defaultLocale,
  onConfigChange,
  SaveAsPicker,
  ...props
}) => {
  const [currentViewport, setCurrentViewport] = React.useState(compilationContext.mainBreakpointIndex); // "{ breakpoint }" or "fit-screen"
  const router = new URLSearchParams(window.location.search);
  const currentDocument = router.get("document") ?? "";
  const iframeContainerRef = React.useRef(null);
  const configAfterAutoRef = React.useRef();
  const availableSize = iframeContainerRef.current ? {
    width: iframeContainerRef.current.clientWidth,
    height: iframeContainerRef.current.clientHeight
  } : undefined;

  // Off in every mode: Layers is the only control active when the editor opens.
  const [showDeviceFrame, setShowDeviceFrame] = React.useState(false);
  const [zoom, setZoom] = React.useState("fit");
  const {
    breakpointIndex,
    iframeSize
  } = calculateViewportRelatedStuff(currentViewport, compilationContext.devices, compilationContext.mainBreakpointIndex, availableSize, showDeviceFrame, zoom);
  useRerenderOnIframeResize(iframeContainerRef.current); // re-render on resize (recalculates viewport size, active breakpoint for fit-screen etc);

  const compilationCache = React.useRef(new easyblocksCore.CompilationCache());
  const [isEditing, setEditing] = React.useState(true);
  // Every editor opens on Layers, in all three modes.
  const [showLeftSidebar, setShowLeftSidebar] = React.useState("layers");
  const [isRightSidebarOpen, setRightSidebarOpen] = React.useState(false);
  const [currentLocale, setCurrentLocale] = React.useState(compilationContext.contextParams.locale);
  const prevLocale = React.useRef("");
  const [componentPickerData, setComponentPickerData] = React.useState(undefined);
  const [focussedField, setFocussedField] = React.useState([]);
  const handleSetFocussedField = React__default["default"].useRef(field => {
    const nextFocusedField = Array.isArray(field) ? field : [field];
    setFocussedField(nextFocusedField);
  }).current;
  const isEditMode = React.useMemo(() => {
    if (!prevLocale.current || prevLocale.current === currentLocale) {
      return isEditing;
    }
    return !isEditing;
  }, [currentLocale, isEditing]);
  const handleSetEditing = React.useCallback(() => {
    compilationCache.current.clear();
    if (isEditing) setRightSidebarOpen(false);
    setEditing(!isEditing);
  }, [isEditing]);
  const closeComponentPickerModal = config => {
    setComponentPickerData(undefined);
    componentPickerData.promiseResolve(config);
  };
  const sidebarNodeRef = React.useRef(null);
  // Separate ref for the left sidebar so it doesn't collide with the right
  // sidebar (both can be mounted at the same time).
  const leftSidebarNodeRef = React.useRef(null);
  const [editableData, form] = useForm({
    id: "easyblocks-editor",
    label: "Edit entry",
    fields: [],
    initialValues: initialEntry,
    onSubmit: async () => {}
  });
  const {
    undo,
    redo,
    push,
    editorHistoryInstance
  } = useEditorHistory({
    onChange: ({
      config,
      focusedField
    }) => {
      setFocussedField(focusedField);
      form.finalForm.change("", config);
    }
  });
  const [templates, setTemplates] = React.useState();
  const [templateQuery, setTemplateQuery] = React.useState();
  const [isFetchingTemplates, setIsFetchingTemplates] = React.useState(false);
  const [openTemplateModalAction, setOpenTemplateModalAction] = React.useState(undefined);
  const {
    notify
  } = Toaster.useToaster();
  const actions = {
    openTemplateModal: setOpenTemplateModalAction,
    notify: message => {
      notify(message);
    },
    openComponentPicker: function (config) {
      return new Promise(resolve => {
        setComponentPickerData({
          promiseResolve: resolve,
          config
        });
      });
    },
    replaceItems: (paths, newConfig) => {
      actions.runChange(() => {
        replaceItems(paths, newConfig, editorContext);
      });
    },
    moveItems: (fieldNames, direction) => {
      actions.runChange(() => {
        return moveItems(form, fieldNames, direction);
      });
    },
    removeItems: fieldNames => {
      actions.runChange(() => {
        return removeItems(form, fieldNames, editorContext);
      });
    },
    insertItem: ({
      name,
      index,
      block,
      keepId
    }) => {
      actions.runChange(() => {
        form.mutators.insert(name, index, keepId ? block : _internals.duplicateConfig(block, compilationContext));
        return [`${name}.${index}`];
      });
    },
    duplicateItems: fieldNames => {
      actions.runChange(() => {
        return duplicateItems(form, fieldNames, compilationContext);
      });
    },
    pasteItems: what => {
      actions.runChange(() => pasteItems({
        what,
        where: focussedField,
        resolveDestination: destinationResolver({
          form,
          context: compilationContext
        }),
        pasteCommand: pasteManager()
      }));
    },
    runChange: configChangeCallback => {
      let fieldsToFocus;

      // When multiple fields are selected, the update could probably invoke `form.change` multiple times.
      // To avoid multiple rerenders, we batch them to trigger single update.
      form.finalForm.batch(() => {
        // This shallow copy of `focussedField` array is SUPER IMPORTANT!
        // Here is why...
        //
        // We invoke `configChangeCallback`, but since we are in batch, changes made to form state won't notify
        // any listeners that there were any changes. This means `window.editorWindowAPI.onUpdate` won't be invoked.
        //
        // Next, update of `focussedField` is going to be queued up. React's heuristics will treat this update
        // as update with high priority and synchronously rerender. `EditorContent` is going to rerender with updated
        // `focussedField` state, but also with updated `editableData` because it's a result of **getter**!
        // `useEffect` that is responsible for invoking `window.editorWindowAPI.onUpdate` will receive new dependencies,
        // save them as the the latest, but it won't be immediately invoked after component have returned.
        // Then the batch ends and all form listeners are going to be notified. `EditorContent` will rerender again,
        // but `editableData` and `focussedField` are the same! `useEffect` will be invoked again, it will compare its dependencies
        // and finds that the haven't changed.
        //
        // Making a shallow copy of `focussedField` will make the second invocation of `useEffect` different from the first
        // triggered by calling `setFocussedField`.
        fieldsToFocus = configChangeCallback() ?? [...focussedField];
        push({
          config: form.values,
          focussedField: fieldsToFocus
        });
        setFocussedField(fieldsToFocus);
      });
    },
    logSelectedItems: () => {
      logItems(editorContext.form, focussedField);
    }
  };
  const loadTemplates = ({
    mode = "replace",
    query
  }) => {
    setIsFetchingTemplates(true);
    getTemplates(editorContext, props.config.templates ?? [], query ?? {}).then(newTemplates => {
      switch (mode) {
        case "append":
          {
            setTemplates(prevTemplates => ({
              query: prevTemplates?.query ?? templateQuery ?? {},
              count: newTemplates?.count ?? {},
              items: [...(prevTemplates?.items ?? []), ...newTemplates.items]
            }));
            break;
          }
        default:
          {
            setTemplates(prevTemplates => ({
              query: prevTemplates?.query ?? templateQuery ?? {},
              count: newTemplates?.count ?? {},
              items: newTemplates.items
            }));
            break;
          }
      }
    }).finally(() => {
      setIsFetchingTemplates(false);
    });
  };
  const syncTemplates = props => {
    const {
      mode,
      template,
      getAllMode = "replace"
    } = props ?? {};
    let templateDefined;
    if (template) {
      templateDefined = {
        ...template,
        isUserDefined: true
      };
    }
    switch (mode) {
      case "create":
        {
          if (templateDefined) {
            setTemplates(prev => {
              if (!prev) {
                return {
                  items: [templateDefined],
                  count: {},
                  query: {}
                };
              }
              return {
                query: prev.query ?? {},
                items: [...prev.items, templateDefined],
                count: prev.count ?? {}
              };
            });
          }
          break;
        }
      case "edit":
        {
          if (templateDefined) {
            setTemplates(prev => {
              if (!prev) {
                return {
                  items: [templateDefined],
                  count: {},
                  query: {}
                };
              }
              const templateIndex = prev.items.findIndex(t => t.id === templateDefined.id);
              if (templateIndex === -1) {
                return prev;
              }
              const newTemplates = [...prev.items];
              newTemplates[templateIndex] = templateDefined;
              return {
                ...prev,
                items: newTemplates
              };
            });
          }
          break;
        }
      case "delete":
        {
          if (templateDefined) {
            setTemplates(prev => {
              if (!prev) {
                return;
              }
              const templateIndex = prev.items.findIndex(t => t.id === templateDefined.id);
              if (templateIndex === -1) {
                return prev;
              }
              const newTemplates = [...prev.items];
              newTemplates.splice(templateIndex, 1);
              return {
                ...prev,
                items: newTemplates
              };
            });
          }
          break;
        }
      default:
        {
          loadTemplates({
            mode: getAllMode,
            query: templateQuery
          });
          break;
        }
    }
  };
  const syncTemplateQuery = query => {
    setTemplateQuery(prevQuery => ({
      ...prevQuery,
      ...query
    }));
  };
  React.useEffect(() => {
    prevLocale.current = currentLocale;
  }, [currentLocale]);
  React.useEffect(() => {
    syncTemplates({
      getAllMode: templateQuery?.mode ?? "replace"
    });
  }, [props.config.components, props.config.templates, templateQuery]);
  const editorTypes = Object.fromEntries(Object.entries(compilationContext.types).map(([typeName, typeDefinition]) => {
    return [typeName, {
      ...typeDefinition,
      ...(typeDefinition.type === "external" ? {
        widgets: typeDefinition.widgets.map(w => {
          return {
            ...w,
            component: props.widgets?.[w.id]
          };
        })
      } : typeDefinition.widget ? {
        widget: {
          ...typeDefinition.widget,
          component: props.widgets?.[typeDefinition.widget.id]
        }
      } : {})
    }];
  }));
  const editorContext = {
    ...compilationContext,
    contextParams: {
      ...compilationContext.contextParams,
      locale: currentLocale
    },
    backend: props.config.backend,
    types: editorTypes,
    mode,
    isFetchingTemplates,
    templates,
    syncTemplateQuery,
    syncTemplates,
    breakpointIndex,
    focussedField,
    form,
    setFocussedField: handleSetFocussedField,
    translationFiles: props.config?.translationFiles ?? {},
    isEditing,
    globalSections: props.config?.globalSections ?? null,
    onGlobalSectionChange: props.onGlobalSectionChange,
    actions,
    save: async documentData => {
      window.postMessage({
        type: "@easyblocks/content-saved",
        document: documentData
      });
    },
    compilationCache: compilationCache.current,
    readOnly: props.readOnly,
    disableCustomTemplates: props.config.disableCustomTemplates ?? false,
    rootComponent: _internals.findComponentDefinitionById(initialEntry._component, compilationContext),
    components: props.components ?? {}
  };
  const {
    configAfterAuto,
    renderableContent,
    meta
  } = useBuiltContent(editorContext, props.config, editableData, externalData, props.onExternalDataChange);
  editorContext.compiledComponentConfig = renderableContent;
  editorContext.configAfterAuto = configAfterAuto;
  console.debug("editable data", editableData);
  console.debug("focused field", focussedField);
  console.debug("meta", meta);
  console.debug("compiled config", {
    configAfterAuto,
    renderableContent
  });
  console.debug("external data", externalData);
  window.editorWindowAPI = window.editorWindowAPI || {};
  window.editorWindowAPI.editorContext = editorContext;
  window.editorWindowAPI.currentDocument = initialDocument;
  window.editorWindowAPI.meta = meta;
  window.editorWindowAPI.compiled = renderableContent;
  window.editorWindowAPI.externalData = externalData;
  const onLocaleChange = async newLocale => {
    compilationCache.current.clear();
    editorContext.contextParams.locale = newLocale;
    setCurrentLocale(newLocale);
    compilationCache.current.clear();
    setEditing(prev => !prev);
    await sleep(1);
    compilationCache.current.clear();
    setEditing(prev => !prev);
  };
  const onShowLeftSidebar = sidebarName => {
    setShowLeftSidebar(prevSidebarName => prevSidebarName === sidebarName ? null : sidebarName);
  };
  const onUpdateGlobalSections = () => {
    const {
      globalSections
    } = editorContext ?? {};
    if (!Object.keys(globalSections ?? {}).length) {
      return;
    }

    // 2 groups
    for (const groupName in globalSections) {
      // Each section in group
      for (const globalSectionEntryId in globalSections[groupName].entities) {
        const sectionValue = globalSections[groupName].entities[globalSectionEntryId];
        const entry = configAfterAutoRef?.current?.data.find(entryData => entryData._id === globalSectionEntryId);
        let payload = {
          label: sectionValue.label,
          mode: "update",
          pages: sectionValue.pages,
          groupName,
          entry: sectionValue.entry ?? {
            _id: globalSectionEntryId,
            _component: ""
          }
        };
        if (entry) {
          payload = {
            ...payload,
            pages: sectionValue.pages.includes(currentDocument) ? sectionValue.pages : [...sectionValue.pages, currentDocument]
          };
        } else {
          payload = {
            ...payload,
            pages: sectionValue.pages.filter(page => page !== currentDocument)
          };
        }
        editorContext.onGlobalSectionChange?.(payload);
      }
    }
  };
  React.useEffect(() => {
    push({
      config: initialEntry,
      focussedField: []
    });
  }, []);
  React.useEffect(() => {
    if (window.editorWindowAPI?.onUpdate) {
      window.editorWindowAPI.onUpdate();
    }
  }, [renderableContent, focussedField, isEditing, currentViewport, externalData]);
  React.useEffect(() => {
    function handleEditorEvents(event) {
      if (event.data.type === "@easyblocks-editor/component-picker-opened") {
        actions.openComponentPicker({
          path: event.data.payload.path
        }).then(config => {
          const editorCanvasIframe = window.document.getElementById("editor-canvas");
          editorCanvasIframe?.contentWindow?.postMessage(_internals.componentPickerClosed(config));
        });
      }
      if (event.data.type === "@easyblocks-editor/item-inserted") {
        actions.insertItem(event.data.payload);
      }
      if (event.data.type === "@easyblocks-editor/item-moved") {
        const {
          fromPath,
          toPath,
          placement
        } = event.data.payload;
        const fromPathParseResult = _internals.parsePath(fromPath, editorContext.form);
        const toPathParseResult = _internals.parsePath(toPath, editorContext.form);
        if (!fromPathParseResult.parent || !toPathParseResult.parent || fromPathParseResult.index === undefined || toPathParseResult === undefined) {
          return;
        }
        if (fromPathParseResult.parent.path === toPathParseResult.parent.path) {
          const pathToMove = `${fromPathParseResult.parent.path ? fromPathParseResult.parent.path + "." : ""}${fromPathParseResult.parent.fieldName}`;
          actions.runChange(() => {
            form.mutators.move(pathToMove, fromPathParseResult.index, toPathParseResult.index);
            return [toPath];
          });
        } else {
          // TODO: We should reuse logic of pasting items here, but we need to handle the case of pasting into placeholder (empty array)
          const isToPathPlaceholder = toPathParseResult.fieldName !== undefined;
          const insertionPath = `${toPathParseResult.parent.path === "" ? "" : toPathParseResult.parent.path + "."}${toPathParseResult.parent.fieldName}${isToPathPlaceholder ? `.${toPathParseResult.index}.${toPathParseResult.fieldName}` : ""}`;
          actions.runChange(() => {
            const newConfig = _internals.duplicateConfig(dotNotationGet(form.values, fromPath), editorContext);
            const insertionIndex = calculateInsertionIndex(fromPath, toPath, placement, form);
            form.mutators.insert(insertionPath, insertionIndex, newConfig);
            actions.removeItems([fromPath]);
            return [isToPathPlaceholder ? `${insertionPath}.0` : `${insertionPath}.${insertionIndex}`];
          });
        }
      }
    }
    window.addEventListener("message", handleEditorEvents);
    return () => window.removeEventListener("message", handleEditorEvents);
  }, []);
  React.useEffect(() => {
    const isSameConfig = deepCompare(configAfterAutoRef.current ?? {}, configAfterAuto);
    if (!isSameConfig && configAfterAuto?._component === "StandardPage") {
      configAfterAutoRef.current = deepClone(configAfterAuto);
      debouncedUpdate(onUpdateGlobalSections);
    }
  }, [configAfterAuto, editorContext?.globalSections]);
  const [isDataSaverOverlayOpen, setDataSaverOverlayOpen] = React.useState(false);
  useEditorGlobalKeyboardShortcuts(editorContext);
  const {
    saveNow,
    isSaving,
    isDirty
  } = useDataSaver(initialDocument, editorContext, mode);
  const appHeight = heightMode === "viewport" ? "100vh" : "100%";
  React.useEffect(() => {
    Modal__default["default"].setAppElement("#shopstory-app");
  }, []);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    id: "shopstory-app",
    style: {
      height: appHeight,
      overflow: "hidden"
    }
  }, isDataSaverOverlayOpen && /*#__PURE__*/React__default["default"].createElement(DataSaverRoot, null, /*#__PURE__*/React__default["default"].createElement(DataSaverOverlay, null), /*#__PURE__*/React__default["default"].createElement(DataSaverModal, null, "Saving data, please do not close the window...")), /*#__PURE__*/React__default["default"].createElement(EditorContext.Provider, {
    value: editorContext
  }, /*#__PURE__*/React__default["default"].createElement(ConfigAfterAutoContext.Provider, {
    value: configAfterAuto
  }, /*#__PURE__*/React__default["default"].createElement(EditorExternalDataProvider, {
    externalData: externalData
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    id: "rootContainer"
  }), /*#__PURE__*/React__default["default"].createElement(EditorTopBar, {
    onUndo: undo,
    onRedo: redo,
    editorHistoryInstance: editorHistoryInstance,
    onSaveDocument: saveNow,
    isSaving: isSaving,
    onClose: () => {
      setDataSaverOverlayOpen(true);
      saveNow().finally(() => {
        setDataSaverOverlayOpen(false);
        window.postMessage({
          type: "@easyblocks/closed"
        }, "*");
        if (props.onClose) {
          props.onClose();
        }
      });
    },
    devices: compilationContext.devices,
    viewport: currentViewport,
    onViewportChange: setCurrentViewport,
    onIsEditingChange: handleSetEditing,
    onConfigChange: onConfigChange,
    isEditing: isEditMode,
    saveLabel: "Save",
    locale: currentLocale,
    locales: editorContext.locales,
    onLocaleChange: onLocaleChange,
    hideCloseButton: props.config.hideCloseButton ?? false,
    readOnly: editorContext.readOnly,
    showLeftSidebar: showLeftSidebar,
    onShowLeftSidebar: onShowLeftSidebar,
    showRightSidebar: isRightSidebarOpen || focussedField.length > 0,
    onShowRightSidebar: () => {
      if (focussedField.length > 0) {
        setFocussedField([]);
      } else {
        setRightSidebarOpen(prev => !prev);
      }
    },
    editorMode: mode,
    showDeviceFrame: showDeviceFrame,
    onToggleDeviceFrame: () => setShowDeviceFrame(p => !p),
    zoom: zoom,
    onZoomChange: setZoom
  }), /*#__PURE__*/React__default["default"].createElement(SidebarAndContentContainer, {
    height: appHeight
  }, showLeftSidebar && isEditMode && /*#__PURE__*/React__default["default"].createElement(EditorLeftSidebar, {
    showLeftSidebar: showLeftSidebar,
    globalSections: props.config.globalSections,
    sidebarNodeRef: leftSidebarNodeRef,
    editorMode: mode
  }), /*#__PURE__*/React__default["default"].createElement(CanvasColumn, null, /*#__PURE__*/React__default["default"].createElement(ContentContainer, {
    onClick: () => {
      setFocussedField([]);
    }
  }, /*#__PURE__*/React__default["default"].createElement(EditorIframe, {
    onEditorHistoryUndo: undo,
    onEditorHistoryRedo: redo,
    onSave: saveNow,
    isSaving: isSaving,
    width: iframeSize.width,
    height: iframeSize.height,
    transform: iframeSize.transform,
    containerRef: iframeContainerRef,
    showDeviceFrame: showDeviceFrame,
    viewport: currentViewport
  }), isEditMode && /*#__PURE__*/React__default["default"].createElement(SelectionFrame, {
    width: iframeSize.width,
    height: iframeSize.height,
    transform: iframeSize.transform,
    editorMode: mode
  })), isEditMode && /*#__PURE__*/React__default["default"].createElement(SelectionBreadcrumb, null)), isEditMode && /*#__PURE__*/React__default["default"].createElement(SidebarContainer, {
    ref: sidebarNodeRef
  }, /*#__PURE__*/React__default["default"].createElement(EditorSidebar, {
    focussedField: focussedField,
    form: form,
    SaveAsPicker: SaveAsPicker,
    isCollapsed: !isRightSidebarOpen && focussedField.length === 0
  })), componentPickerData && /*#__PURE__*/React__default["default"].createElement(ModalPicker, {
    onClose: closeComponentPickerModal,
    config: componentPickerData.config,
    pickers: props.pickers,
    editorMode: mode
  })), openTemplateModalAction && /*#__PURE__*/React__default["default"].createElement(TemplateModal, {
    mode: mode,
    action: openTemplateModalAction,
    onClose: () => {
      setOpenTemplateModalAction(undefined);
    },
    backend: editorContext.backend
  })))));
};
function adaptRemoteConfig(config, compilationContext) {
  const withoutLocalizedFlag = removeLocalizedFlag(config, compilationContext);
  const normalized = easyblocksCore.normalize(withoutLocalizedFlag, compilationContext);
  return normalized;
}
function calculateInsertionIndex(fromPath, toPath, placement, form) {
  const mostCommonPath = getMostCommonSubPath(fromPath, toPath);
  const mostCommonPathParseResult = _internals.parsePath(mostCommonPath ?? "", form);
  const toPathParseResult = _internals.parsePath(toPath, form);
  const toPathNoCodeEntry = dotNotationGet(form.values, toPath);
  if (toPathNoCodeEntry.length === 0) {
    return 0;
  }

  // If there is no index in common path, it means that we're moving items between two sections
  if (mostCommonPathParseResult.index === undefined) {
    const fromPathRootSectionIndex = +fromPath.split(".")[1];
    const toPathRootSectionIndex = +toPath.split(".")[1];
    if (fromPathRootSectionIndex > toPathRootSectionIndex) {
      if (placement) {
        if (placement === "before") {
          return toPathParseResult.index;
        }
        return toPathParseResult.index + 1;
      }
      return toPathParseResult.index;
    }
    if (placement) {
      if (placement === "before") {
        return toPathParseResult.index;
      }
      return toPathParseResult.index + 1;
    }
    return toPathParseResult.index + 1;
  }
  return toPathParseResult.index + 1;
}
function getMostCommonSubPath(path1, path2) {
  const fromPathParts = path1.split(".");
  const toPathParts = path2.split(".");
  let mostCommonPathParts = undefined;
  for (let i = 0; i < Math.min(fromPathParts.length, toPathParts.length); i++) {
    const currentFromPathPart = fromPathParts[i];
    const currentToPathPart = toPathParts[i];
    if (currentFromPathPart !== currentToPathPart) {
      break;
    }
    if (!mostCommonPathParts) {
      mostCommonPathParts = [currentFromPathPart];
      continue;
    }
    mostCommonPathParts.push(currentFromPathPart);
  }
  return mostCommonPathParts?.join(".");
}
function findConfigById(config, context, configId) {
  let foundConfig;
  _internals.traverseComponents(config, context, ({
    componentConfig
  }) => {
    if (foundConfig) {
      return;
    }
    if (componentConfig._id === configId) {
      foundConfig = componentConfig;
    }
  });
  return foundConfig;
}
function getMatchingDevice(devices, width) {
  const highestDevice = devices.find(d => d.breakpoint === null);
  const visibleDevices = devices.filter(d => !d.hidden && d.breakpoint !== null);
  for (let i = 0; i < visibleDevices.length; i++) {
    const currentDevice = visibleDevices[i];
    if (currentDevice.breakpoint > width) {
      return currentDevice;
    }
  }
  if (highestDevice) {
    return highestDevice;
  }
  return null;
}

function parseQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const readOnly = searchParams.get("readOnly") === "true" ? true : searchParams.get("readOnly") === "false" ? false : null;
  const documentId = searchParams.get("document");
  const templateId = searchParams.get("template");
  const rootComponentId = searchParams.get("rootComponent");
  const rootTemplateId = searchParams.get("rootTemplate");
  const locale = searchParams.get("locale");
  const debug = searchParams.get("debug") === "true";
  const preview = searchParams.get("preview") === "true";
  const editorSearchParams = {
    readOnly,
    documentId,
    templateId,
    rootComponentId,
    rootTemplateId,
    locale,
    preview,
    debug
  };
  return editorSearchParams;
}

function checkQueryForTemplate(query, template, component) {
  return `${template.label ?? ""}${component.label ?? component.id}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}
const SearchableSmallPickerModal = ({
  onClose,
  templates,
  isOpen
}) => {
  const editorContext = useEditorContext();
  const templatesDict = templates;
  const [query, setQuery] = React.useState("");
  const trimmedQuery = query.trim().toLocaleLowerCase();
  const filteredTemplatesDict = {};
  if (templatesDict) {
    Object.values(templatesDict).forEach(({
      templates,
      component
    }) => {
      const filteredTemplates = trimmedQuery === "" ? templates : templates.filter(template => checkQueryForTemplate(trimmedQuery, template, component));
      if (filteredTemplates.length > 0) {
        filteredTemplatesDict[component.id] = {
          component,
          templates: filteredTemplates
        };
      }
    });
  }
  const close = template => {
    setQuery("");
    if (!template) {
      onClose();
    } else {
      // @ts-expect-error
      onClose(template);
    }
  };
  return /*#__PURE__*/React__default["default"].createElement(modals.Modal, {
    mode: "center-small",
    isOpen: isOpen,
    onRequestClose: () => {
      close(undefined);
    },
    noPadding: true,
    headerLine: true,
    searchProps: {
      value: query,
      placeholder: "Search...",
      onChange: e => {
        setQuery(e.target.value);
      }
    },
    headerSymbol: "S"
  }, templatesDict === undefined && "Loading...", templatesDict !== undefined && Object.entries(filteredTemplatesDict).map(([, {
    templates,
    component
  }]) => {
    const isOnlyOne = templates.length === 1;
    const componentLabel = component.label ?? component.id;
    return templates.map(template => {
      const templateLabel = template.label ?? template.id;
      const title = isOnlyOne ? componentLabel : templateLabel;
      const thumbnail = template.thumbnail ?? component.thumbnail;
      const description = isOnlyOne ? undefined : componentLabel;
      return /*#__PURE__*/React__default["default"].createElement(rows.BasicRow, {
        key: template.id,
        title: title,
        description: description,
        onClick: () => {
          close(template);
        },
        image: thumbnail,
        tinyDescription: true,
        onEdit: template.isUserDefined ? () => {
          editorContext.actions.openTemplateModal({
            mode: "edit",
            template: template
          });
        } : undefined
      });
    });
  }));
};

/**
 * CARD
 */

const CardRoot = styled.styled.div.withConfig({
  displayName: "SectionPicker__CardRoot",
  componentId: "sc-5szert-0"
})(["&:hover{outline:1px solid ", ";outline-offset:8px;}.editButton{opacity:0;}&:hover{.editButton{opacity:1;}}"], easyblocksDesignSystem.Colors.black10);
const ImageContainer = styled.styled.div.withConfig({
  displayName: "SectionPicker__ImageContainer",
  componentId: "sc-5szert-1"
})(["position:relative;background-color:", ";margin-bottom:8px;padding-bottom:", ";cursor:pointer;"], easyblocksDesignSystem.Colors.black10, p => p.mode === "large-3" ? "90%" : "60%");
const CardImg = styled.styled.img.withConfig({
  displayName: "SectionPicker__CardImg",
  componentId: "sc-5szert-2"
})(["position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;padding:24px;box-sizing:border-box;"]);
const CardImgPlaceholder = styled.styled.div.withConfig({
  displayName: "SectionPicker__CardImgPlaceholder",
  componentId: "sc-5szert-3"
})(["position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;"]);
const CardFooter = styled.styled.div.withConfig({
  displayName: "SectionPicker__CardFooter",
  componentId: "sc-5szert-4"
})(["display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-top:8px;"]);
const CardLabelContainer = styled.styled.div.withConfig({
  displayName: "SectionPicker__CardLabelContainer",
  componentId: "sc-5szert-5"
})(["display:flex;flex-direction:row;align-items:center;"]);
const CardLabelTemplateName = styled.styled.div.withConfig({
  displayName: "SectionPicker__CardLabelTemplateName",
  componentId: "sc-5szert-6"
})(["", ";color:black;"], easyblocksDesignSystem.Fonts.body);
const Title = styled.styled.div.withConfig({
  displayName: "SectionPicker__Title",
  componentId: "sc-5szert-7"
})(["", ""], easyblocksDesignSystem.Fonts.label);
const TitleContainer = styled.styled.div.withConfig({
  displayName: "SectionPicker__TitleContainer",
  componentId: "sc-5szert-8"
})(["display:flex;flex-direction:row;gap:8px;align-items:center;margin-bottom:24px;"]);
const Message = styled.styled.div.withConfig({
  displayName: "SectionPicker__Message",
  componentId: "sc-5szert-9"
})(["padding-top:32px;", ";"], easyblocksDesignSystem.Fonts.body);
function getTemplatePreviewImage(template, editorContext) {
  // template.previewImage is always most important and overrides other sources of preview
  if (template.thumbnail) {
    return template.thumbnail;
  }
  return;

  // if (template.configId) {
  //   return getComponentConfigPreviewImageURL({
  //     configId: template.configId,
  //     contextParams: editorContext.contextParams,
  //     locales: editorContext.locales,
  //     project: editorContext.project,
  //   });
  // }
}
const SectionCard = ({
  template,
  onSelect,
  mode
}) => {
  const imageRef = React.useRef(null);
  const editorContext = useEditorContext();
  const previewImage = getTemplatePreviewImage(template);
  return /*#__PURE__*/React__default["default"].createElement(CardRoot, null, /*#__PURE__*/React__default["default"].createElement(ImageContainer, {
    ref: imageRef,
    onClick: onSelect,
    mode: mode
  }, previewImage && /*#__PURE__*/React__default["default"].createElement(CardImg, {
    src: previewImage
  }), !previewImage && template.thumbnailLabel && /*#__PURE__*/React__default["default"].createElement(CardImgPlaceholder, null, /*#__PURE__*/React__default["default"].createElement("span", {
    style: {
      color: "#6c6c6c"
    }
  }, template.thumbnailLabel)), !previewImage && !template.thumbnailLabel && /*#__PURE__*/React__default["default"].createElement(CardImgPlaceholder, null, /*#__PURE__*/React__default["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "64",
    height: "64",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M8.18102 5.39789L6.89683 10.3512L7.86482 10.6022L9.14901 5.64885L8.18102 5.39789Z",
    fill: easyblocksDesignSystem.Colors.black20
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M9.38171 6.1215L11.1837 7.92352L9.38172 9.72549L10.0888 10.4326L12.5979 7.92353L10.0888 5.4144L9.38171 6.1215Z",
    fill: easyblocksDesignSystem.Colors.black20
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M6.54828 6.11507L4.80393 7.92352L6.54828 9.73192L5.82854 10.4262L3.41455 7.92353L5.82853 5.42083L6.54828 6.11507Z",
    fill: easyblocksDesignSystem.Colors.black20
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3ZM3 3H13V13H3L3 3Z",
    fill: easyblocksDesignSystem.Colors.black20
  })))), /*#__PURE__*/React__default["default"].createElement(CardFooter, null, /*#__PURE__*/React__default["default"].createElement(CardLabelContainer, null, /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, template.label && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(CardLabelTemplateName, null, template.label)))), /*#__PURE__*/React__default["default"].createElement("div", null), template.isUserDefined && !editorContext.readOnly && /*#__PURE__*/React__default["default"].createElement(buttons.ButtonGhostColor, {
    className: "editButton",
    onClick: () => {
      editorContext.actions.openTemplateModal({
        mode: "edit",
        template: template
      });
    }
  }, "Edit")));
};

/**
 * MODAL
 */

const ModalRoot = styled.styled.div.withConfig({
  displayName: "SectionPicker__ModalRoot",
  componentId: "sc-5szert-10"
})(["position:absolute;top:0;left:0;width:100%;height:100%;display:grid;grid-template-columns:200px 1fr;"]);
const ModalGridRoot = styled.styled.div.withConfig({
  displayName: "SectionPicker__ModalGridRoot",
  componentId: "sc-5szert-11"
})(["display:grid;grid-template-columns:", ";grid-column-gap:16px;grid-row-gap:30px;"], p => p.mode === "large-3" ? "1fr 1fr 1fr" : "1fr 1fr");
const Sidebar = styled.styled.div.withConfig({
  displayName: "SectionPicker__Sidebar",
  componentId: "sc-5szert-12"
})(["overflow-y:hidden;overflow-x:hidden;border-right:1px solid ", ";height:100%;"], easyblocksDesignSystem.Colors.black5);
const SidebarContent = styled.styled.div.withConfig({
  displayName: "SectionPicker__SidebarContent",
  componentId: "sc-5szert-13"
})(["padding:24px 4px;display:flex;flex-direction:column;gap:8px;"]);
const SidebarButton = styled.styled.button.withConfig({
  displayName: "SectionPicker__SidebarButton",
  componentId: "sc-5szert-14"
})(["all:unset;height:38px;", " display:flex;padding-left:16px;align-items:center;&:hover{background:", ";}cursor:pointer;"], easyblocksDesignSystem.Fonts.body, easyblocksDesignSystem.Colors.black5);
const GridRoot = styled.styled.div.withConfig({
  displayName: "SectionPicker__GridRoot",
  componentId: "sc-5szert-15"
})(["padding:0px 16px;height:100%;overflow-x:hidden;overflow-y:auto;"]);
const SectionPickerModal = ({
  isOpen,
  onClose,
  templates,
  mode = "large"
}) => {
  const templateGroups = templates;
  const gridRootRef = React.useRef(null);
  const templateSelected = template => {
    if (onClose) {
      onClose(template);
    }
  };
  return /*#__PURE__*/React__default["default"].createElement(modals.Modal, {
    noPadding: true,
    title: "Pick section",
    isOpen: isOpen,
    onRequestClose: () => {
      if (onClose) {
        onClose();
      }
    },
    mode: "center-huge",
    headerLine: true
  }, /*#__PURE__*/React__default["default"].createElement(ModalRoot, null, /*#__PURE__*/React__default["default"].createElement(Sidebar, null, templateGroups && /*#__PURE__*/React__default["default"].createElement(SidebarContent, null, Object.entries(templateGroups).map(([componentId, {
    component: {
      label
    }
  }]) => /*#__PURE__*/React__default["default"].createElement(SidebarButton, {
    key: `sectionPicker__group__${componentId}`,
    onClick: () => {
      const groupNode = document.getElementById(`sectionPicker__group__${componentId}`);
      const groupOffsetTop = groupNode.offsetTop;
      gridRootRef.current.scrollTo({
        top: groupOffsetTop,
        behavior: "smooth"
      });
    }
  }, label ?? componentId)))), /*#__PURE__*/React__default["default"].createElement(GridRoot, {
    ref: gridRootRef
  }, templates === undefined && /*#__PURE__*/React__default["default"].createElement(Message, null, "Loading..."), templateGroups && Object.entries(templateGroups).map(([componentId, {
    component: {
      label
    },
    templates
  }], index) => /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      paddingTop: "32px",
      paddingBottom: "32px"
    },
    id: `sectionPicker__group__${componentId}`,
    key: `sectionPicker__group__${componentId}`
  }, /*#__PURE__*/React__default["default"].createElement(TitleContainer, null, /*#__PURE__*/React__default["default"].createElement(Title, null, label ?? componentId)), /*#__PURE__*/React__default["default"].createElement(ModalGridRoot, {
    mode: mode
  }, templates.map((template, index) => /*#__PURE__*/React__default["default"].createElement(SectionCard, {
    key: index,
    template: template,
    onSelect: () => {
      templateSelected(template);
    },
    mode: mode
  }))))))));
};

function ColorTokenWidget(props) {
  const [inputValue, setInputValue] = React.useState(props.value);
  return /*#__PURE__*/React__default["default"].createElement(Input.Input, {
    value: inputValue,
    onChange: e => {
      setInputValue(e.target.value);
    },
    onBlur: () => {
      if (easyblocksCore.validateColor(inputValue)) {
        props.onChange(inputValue);
        return;
      }
      if (easyblocksCore.validateColor("#" + inputValue)) {
        props.onChange("#" + inputValue);
        return;
      }
      props.onChange(props.value);
    },
    align: "right"
  });
}

function assertDefined(value, message) {
  if (value === undefined) {
    throw new Error(message ?? "Value is undefined");
  }
  return value;
}

function DocumentDataWidgetComponent({
  id,
  onChange,
  resourceKey,
  path
}) {
  if (id !== null && typeof id !== "string") {
    return /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
      style: {
        whiteSpace: "normal"
      }
    }, "Unsupported type of identifier for document data widget. Expected \"string\", but got \"", typeof id, "\".");
  }
  const {
    editorContext,
    externalData
  } = window.editorWindowAPI ?? {};
  const schema = editorContext.rootComponent.rootParams;
  const documentExternalLocationKeys = assertDefined(schema).map(s => easyblocksCore.getExternalReferenceLocationKey("$", s.prop));
  const documentCompoundResources = Object.entries(externalData).filter(r => {
    const [externalId, externalDataValue] = r;
    return documentExternalLocationKeys.includes(externalId) && easyblocksCore.isResolvedCompoundExternalDataValue(externalDataValue);
  });
  const entry = dotNotationGet(editorContext.form.values, path.slice(0, path.lastIndexOf(".")));
  const definition = _internals.findComponentDefinitionById(entry._component, editorContext);
  const schemaProp = definition.schema.find(s => s.prop === path.split(".").pop());
  const options = documentCompoundResources.flatMap(([externalId, externalDataValue]) => getBasicResourcesOfType(externalDataValue.value, schemaProp.type).map(r => {
    const resourceSchemaProp = assertDefined(schema?.find(s => s.prop === externalId.split(".")[1]));
    return {
      id: externalId,
      key: r.key,
      label: `${resourceSchemaProp.label ?? resourceSchemaProp.prop} > ${r.label ?? r.key}`
    };
  }));
  if (options.length === 1 && !id && path) {
    // We perform form change manually to avoid storing this change in editor's history
    editorContext.form.change(path, {
      id: options[0].id,
      key: options[0].key,
      widgetId: "@easyblocks/document-data"
    });
  }
  if (!documentCompoundResources.length) {
    return /*#__PURE__*/React__default["default"].createElement(Typography.Typography, {
      style: {
        whiteSpace: "normal"
      }
    }, "Please select at least one non optional external data for document.");
  }
  return /*#__PURE__*/React__default["default"].createElement(CompoundResourceValueSelect, {
    options: options,
    resource: id === null ? {
      id,
      key: undefined
    } : {
      id,
      key: resourceKey
    },
    onResourceKeyChange: (newId, newKey) => {
      onChange(newId, newKey);
    }
  });
}

function SpaceTokenWidget(props) {
  const [inputValue, setInputValue] = React.useState(props.value);
  return /*#__PURE__*/React__default["default"].createElement(Input.Input, {
    value: inputValue,
    onChange: e => {
      setInputValue(e.target.value);
    },
    onBlur: () => {
      const int = Math.round(parseInt(inputValue));
      if (isNaN(int) || int < 0) {
        props.onChange("0px");
        return;
      }
      props.onChange(`${int}px`);
    },
    align: "right"
  });
}

const shouldForwardProp = (propName, target) => {
  if (typeof target === "string") {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid__default["default"](propName);
  }
  // For other elements, forward all props
  return true;
};
const builtinWidgets = {
  color: ColorTokenWidget,
  space: SpaceTokenWidget,
  "@easyblocks/document-data": DocumentDataWidgetComponent
};
const builinPickers = {
  large: SectionPickerModal,
  compact: SearchableSmallPickerModal,
  "large-3": SectionPickerModal
};
function EasyblocksParent(props) {
  const editorSearchParams = parseQueryParams();
  return /*#__PURE__*/React__default["default"].createElement(styled.StyleSheetManager, {
    shouldForwardProp: shouldForwardProp,
    enableVendorPrefixes: true
  }, /*#__PURE__*/React__default["default"].createElement(modals.ModalContext.Provider, {
    value: () => {
      return document.querySelector("#modalContainer");
    }
  }, /*#__PURE__*/React__default["default"].createElement(GlobalStyles, null), /*#__PURE__*/React__default["default"].createElement(modals.GlobalModalStyles, null), /*#__PURE__*/React__default["default"].createElement(Tooltip$1.TooltipProvider, null, /*#__PURE__*/React__default["default"].createElement("div", {
    id: "modalContainer",
    style: {
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 100000
    }
  }), /*#__PURE__*/React__default["default"].createElement(Editor, {
    config: props.config,
    locale: editorSearchParams.locale ?? undefined,
    readOnly: editorSearchParams.readOnly ?? true,
    documentId: editorSearchParams.documentId,
    rootComponentId: editorSearchParams.rootComponentId ?? null,
    rootTemplateId: editorSearchParams.rootTemplateId,
    externalData: props.externalData,
    onExternalDataChange: props.onExternalDataChange,
    onConfigChange: props.onConfigChange,
    onGlobalSectionChange: props.onGlobalSectionChange,
    widgets: {
      ...builtinWidgets,
      ...props.widgets
    },
    components: props.components,
    pickers: {
      ...builinPickers,
      ...props.pickers
    },
    mode: props.mode,
    defaultLocale: props.defaultLocale,
    SaveAsPicker: props.SaveAsPicker
  })), /*#__PURE__*/React__default["default"].createElement(Toaster.Toaster, {
    position: "bottom-left",
    containerStyle: {
      zIndex: 100100
    }
  })));
}

/**
 * Attributes set on every canvas selection frame. Hover styles and the layer context
 * menu read them straight from the DOM, without tracking component state.
 */
const CANVAS_FRAME_PATH_ATTRIBUTE = "data-easyblocks-path";
const CANVAS_FRAME_LABEL_ATTRIBUTE = "data-easyblocks-label";
/**
 * Selection frames among hit-tested elements (e.g. `document.elementsFromPoint`), kept
 * in the given order so the topmost layer under the pointer comes first.
 */
function getCanvasLayers(elements) {
  return elements.flatMap(element => {
    const path = element.getAttribute(CANVAS_FRAME_PATH_ATTRIBUTE);
    if (path === null) {
      return [];
    }
    return [{
      path,
      label: element.getAttribute(CANVAS_FRAME_LABEL_ATTRIBUTE) ?? path
    }];
  });
}

// Inline styles: the menu renders inside the site page, so it must not depend on page CSS.

const menuStyles = {
  position: "fixed",
  zIndex: 2147483647,
  minWidth: 180,
  maxWidth: 320,
  maxHeight: "60vh",
  overflowY: "auto",
  padding: "4px 0",
  borderRadius: 4,
  background: "#fff",
  boxShadow: "var(--tina-shadow-big)",
  color: "var(--tina-color-grey-10)",
  fontFamily: "var(--tina-font-family)",
  fontSize: 13,
  lineHeight: "20px"
};
const titleStyles = {
  padding: "4px 12px",
  color: "var(--tina-color-grey-6)",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 0.4
};
const itemStyles = {
  display: "block",
  width: "100%",
  padding: "6px 12px",
  border: 0,
  cursor: "pointer",
  color: "inherit",
  font: "inherit",
  textAlign: "left",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};

const VIEWPORT_MARGIN = 8;
function clampToViewport(start, size, viewportSize) {
  return Math.max(VIEWPORT_MARGIN, Math.min(start, viewportSize - size - VIEWPORT_MARGIN));
}

/**
 * Right-click menu listing every selection frame under the pointer, topmost first, so
 * layers covered by their children or by overlapping elements stay selectable from the
 * canvas.
 */
function CanvasLayerContextMenu({
  editorContext
}) {
  const [openedMenu, setOpenedMenu] = React.useState(null);
  const [hoveredPath, setHoveredPath] = React.useState(null);
  const menuRef = React.useRef(null);
  const {
    t
  } = getTranslation(editorContext);
  function close() {
    setOpenedMenu(null);
    setHoveredPath(null);
  }
  React.useEffect(() => {
    function handleContextMenu(event) {
      const target = event.target;
      if (menuRef.current?.contains(target)) {
        return;
      }

      // Text editing keeps the native menu (copy, paste, spellcheck).
      if (target?.closest?.('input, textarea, [contenteditable="true"]')) {
        return;
      }
      const layers = getCanvasLayers(document.elementsFromPoint(event.clientX, event.clientY));
      if (layers.length === 0) {
        return;
      }
      event.preventDefault();
      setOpenedMenu({
        x: event.clientX,
        y: event.clientY,
        layers
      });
    }
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  React.useEffect(() => {
    if (!openedMenu) {
      return;
    }
    function closeWhenOutsideMenu(event) {
      if (!menuRef.current?.contains(event.target)) {
        close();
      }
    }

    // Any key closes the menu: its layers were read from the DOM when it opened, and
    // editing shortcuts (delete, move) change them. Escape must not also select the parent.
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
      }
      close();
    }
    window.addEventListener("pointerdown", closeWhenOutsideMenu, true);
    window.addEventListener("scroll", closeWhenOutsideMenu, true);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("resize", close);
    window.addEventListener("blur", close);
    return () => {
      window.removeEventListener("pointerdown", closeWhenOutsideMenu, true);
      window.removeEventListener("scroll", closeWhenOutsideMenu, true);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("blur", close);
    };
  }, [openedMenu]);

  // Keep the whole menu inside the canvas viewport, measured before paint.
  React.useLayoutEffect(() => {
    const menuElement = menuRef.current;
    if (!openedMenu || !menuElement) {
      return;
    }
    const {
      width,
      height
    } = menuElement.getBoundingClientRect();
    menuElement.style.left = `${clampToViewport(openedMenu.x, width, window.innerWidth)}px`;
    menuElement.style.top = `${clampToViewport(openedMenu.y, height, window.innerHeight)}px`;
  }, [openedMenu]);
  if (!openedMenu) {
    return null;
  }
  return /*#__PURE__*/React__default["default"].createElement("div", {
    ref: menuRef,
    role: "menu",
    "aria-label": t("selectLayer"),
    style: menuStyles
    // The canvas root clears the selection on click.
    ,
    onClick: event => event.stopPropagation(),
    onContextMenu: event => event.preventDefault()
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: titleStyles
  }, t("selectLayer")), openedMenu.layers.map(layer => /*#__PURE__*/React__default["default"].createElement("button", {
    key: layer.path,
    type: "button",
    role: "menuitem",
    style: {
      ...itemStyles,
      background: hoveredPath === layer.path ? "var(--tina-color-grey-2)" : "transparent",
      fontWeight: editorContext.focussedField.includes(layer.path) ? 600 : 400
    },
    onMouseEnter: () => setHoveredPath(layer.path),
    onMouseLeave: () => setHoveredPath(null),
    onClick: () => {
      editorContext.setFocussedField(layer.path);
      close();
    }
  }, layer.label)));
}

function CanvasRoot(props) {
  const editorContext = window.parent.editorWindowAPI?.editorContext;
  if (!editorContext) {
    throw new Error("editorContext is not available.");
  }
  useEditorGlobalKeyboardShortcuts(editorContext);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    onClick: () => {
      if (editorContext.isEditing) {
        editorContext.setFocussedField([]);
      }
    }
  }, editorContext.isEditing && /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      minHeight: "100vh"
    }
  }, /*#__PURE__*/React__default["default"].createElement("style", {
    dangerouslySetInnerHTML: {
      __html: globalEditorRendererStyles
    }
  }), props.children, /*#__PURE__*/React__default["default"].createElement(CanvasLayerContextMenu, {
    editorContext: editorContext
  })), !editorContext.isEditing && props.children);
}
const globalEditorRendererStyles = `
    /*
        We don't use Tina native blocksmenu and they make page higher than document height (on the last section). So this is quick fix
    */
    [class^=BlocksMenu] {
        display: none !important;
    }
    
    body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    }
      
  :root {
    --tina-color-primary-light: #2296fe;
    --tina-color-primary: #2296fe;
    --tina-color-primary-dark: #0574e4;
    --tina-color-error-light: #eb6337;
    --tina-color-error: #ec4815;
    --tina-color-error-dark: #dc4419;
    --tina-color-warning-light: #f5e06e;
    --tina-color-warning: #e9d050;
    --tina-color-warning-dark: #d3ba38;
    --tina-color-success-light: #57c355;
    --tina-color-success: #3cad3a;
    --tina-color-success-dark: #249a21;
    --tina-color-grey-0: #ffffff;
    --tina-color-grey-1: #f6f6f9;
    --tina-color-grey-2: #edecf3;
    --tina-color-grey-3: #e1ddec;
    --tina-color-grey-4: #b2adbe;
    --tina-color-grey-5: #918c9e;
    --tina-color-grey-6: #716c7f;
    --tina-color-grey-7: #565165;
    --tina-color-grey-8: #433e52;
    --tina-color-grey-9: #363145;
    --tina-color-grey-10: #282828;
    --tina-radius-small: 5px;
    --tina-radius-big: 24px;
    --tina-padding-small: 12px;
    --tina-padding-big: 20px;
    --tina-font-size-0: 12px;
    --tina-font-size-1: 13px;
    --tina-font-size-2: 15px;
    --tina-font-size-3: 16px;
    --tina-font-size-4: 18px;
    --tina-font-size-5: 20px;
    --tina-font-size-6: 22px;
    --tina-font-size-7: 26px;
    --tina-font-size-8: 32px;
    --tina-font-family: 'Roboto', sans-serif;
    --tina-font-weight-regular: 400;
    --tina-font-weight-bold: 600;
    --tina-shadow-big: 0px 2px 3px rgba(0, 0, 0, 0.05),
      0 4px 12px rgba(0, 0, 0, 0.1);
    --tina-shadow-small: 0px 2px 3px rgba(0, 0, 0, 0.12);
    --tina-timing-short: 85ms;
    --tina-timing-medium: 150ms;
    --tina-timing-long: 250ms;
    --tina-z-index-0: 500;
    --tina-z-index-1: 1000;
    --tina-z-index-2: 1500;
    --tina-z-index-3: 2000;
    --tina-z-index-4: 2500;
    --tina-z-index-5: 3000;
    --tina-sidebar-width: 340px;
    --tina-sidebar-header-height: 60px;
    --tina-toolbar-height: 62px;
    
    
  }
  
  .Shopstory__ReactModal__Overlay {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    
  }
  
  .Shopstory__ReactModal__Overlay::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.2;
      z-index: -1;
      /* background-color: black; */
  }
  
  .Shopstory__ReactModal__Overlay.background-shade::before {
      background-color: black;
  }
  
  .Shopstory__ReactModal__Content::focus {
    border: none;
    outline: none;
  }
  
  
  .Shopstory__ReactModal__Content__Left {
    height: 100vh;
    width: 70vw;
    
    transition: all 350ms cubic-bezier(0.16, 1, 0.3, 1);
    transform: translateX(-100%);
  }
  
  
  .Shopstory__ReactModal__Content__Left::focus {
    border: none;
    outline: none;
  }
  
  .Shopstory__ReactModal__Content__Left.Shopstory__ReactModal__Content__Left--after-open {
      transform: none;
  }
  
  .Shopstory__ReactModal__Content__Left.Shopstory__ReactModal__Content__Left--before-close{
      transform: translateX(-100%);
  }
`;

/**
 * Which edge of a block the insertion line is drawn on while a drag is in progress.
 *
 * `before` is the leading edge of the block — its top in a collection that stacks
 * vertically, its left in one that flows horizontally — and `after` the trailing edge.
 * `null` means the dragged block would not land next to this block at all.
 */

/**
 * Suffixes of the extra droppables that mark the outer edges of a collection. They are the
 * only way to express "put it before the first item" or "after the last one", because a
 * plain block id leaves the placement to be worked out from the order of the two paths.
 */
const EDGE_DROPPABLE_SUFFIX = {
  before: ".before",
  after: ".after"
};
/**
 * Where the block being dragged would land, seen from a single block.
 *
 * Every block runs this against the one droppable `@dnd-kit` reports as hovered, so exactly
 * one line is on screen at a time and it sits on the boundary the block will land on —
 * including a reorder inside one collection and a gap between two middle items, neither of
 * which used to be marked at all.
 *
 * When the hovered droppable is a block rather than a collection edge, the landing side
 * follows the order of the two blocks, which is what the document itself does with the drop:
 * a reorder inside one collection takes the block out and puts it back at the target's
 * index, so dragging downwards lands after the target and dragging upwards lands before it.
 */
function resolveDropIndicatorEdge({
  id,
  overId,
  activeIndex,
  index,
  isDroppableDisabled,
  isBeingDragged
}) {
  if (overId === null || isDroppableDisabled) {
    return null;
  }

  // Dropping a block onto itself changes nothing, so it gets no line.
  if (isBeingDragged) {
    return null;
  }
  if (overId === `${id}${EDGE_DROPPABLE_SUFFIX.before}`) {
    return "before";
  }
  if (overId === `${id}${EDGE_DROPPABLE_SUFFIX.after}`) {
    return "after";
  }

  // Another block is hovered: its own line is the one to show.
  if (overId !== id) {
    return null;
  }

  // A block missing from the sortable list, or hovering itself, gives no usable order.
  if (activeIndex === -1 || index === -1 || activeIndex === index) {
    return null;
  }
  return activeIndex > index ? "before" : "after";
}

/**
 * Thickness of the insertion line, in canvas pixels. The canvas is scaled down by the zoom
 * control, so the line is drawn thinner than this wherever the device does not fit the
 * viewport at 1:1, which is what made a hairline unreadable.
 */
const DROP_INDICATOR_THICKNESS = 6;

/** Innermost hovered frame: the one a click selects, since clicks select deepest-first. */
const HOVERED_TARGET_FRAME = `:hover:not(:has([${CANVAS_FRAME_PATH_ATTRIBUTE}]:hover))`;

/** Marks the refusal bubble so the frame around it can reveal it on hover. */
const DROP_REJECTION_ATTRIBUTE = "data-easyblocks-drop-rejection";
function SelectionFrameController({
  isActive,
  children,
  onSelect,
  stitches,
  sortable,
  id,
  direction,
  path,
  label,
  isDraggable,
  dropRejectionMessage,
  dropIndicatorEdge,
  edgeDropTargets
}) {
  const [node, setNode] = React.useState(null);
  useUpdateFramePosition({
    node,
    isDisabled: !isActive
  });

  // The line straddles the boundary the block will land on, so half of it sits outside this
  // frame and half inside: it reads as a gap between two blocks rather than a border of one.
  const dropIndicatorBar = {
    content: `''`,
    display: "block",
    position: "absolute",
    zIndex: 9999999,
    pointerEvents: "none",
    userSelect: "none",
    borderRadius: "2px",
    backgroundColor: easyblocksDesignSystem.Colors.purple,
    // Purple is the one accent the canvas does not already use: the selection and hover
    // frames, the add-block placeholders and the sidebar are all the same blue, which is
    // what made the insertion line indistinguishable from the rest of the drag feedback.
    // The double ring carries it over customer content: the white one holds up on a dark
    // section, the dark one on a light section.
    boxShadow: `0 0 0 2px ${easyblocksDesignSystem.Colors.white}, 0 0 0 3px ${easyblocksDesignSystem.Colors.black900}`,
    ...(direction === "horizontal" ? {
      top: 0,
      bottom: 0,
      width: `${DROP_INDICATOR_THICKNESS}px`
    } : {
      left: 0,
      right: 0,
      height: `${DROP_INDICATOR_THICKNESS}px`
    })
  };
  const leadingEdge = direction === "horizontal" ? "left" : "top";
  const trailingEdge = direction === "horizontal" ? "right" : "bottom";
  const dropIndicatorOffset = `-${DROP_INDICATOR_THICKNESS / 2}px`;
  const wrapperClassName = stitches.css({
    position: "relative",
    display: "grid",
    // Selection is deepest-first: a click selects the innermost frame under the pointer,
    // so children stay clickable. Ancestors are reached with Esc, the action bar parent
    // button, the breadcrumb under the canvas or the right-click layer menu.

    "&[data-draggable-active=false]::after": {
      content: `''`,
      boxSizing: "border-box",
      display: "block",
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      border: "1px solid var(--tina-color-primary)",
      opacity: 0,
      pointerEvents: "none",
      userSelect: "none",
      transition: "all 100ms",
      boxShadow: "var(--tina-shadow-big)"
    },
    "&[data-active=true]::after": {
      opacity: 1
    },
    // `:hover` also matches every ancestor frame, so only the click target gets feedback.
    [`&[data-active=false]${HOVERED_TARGET_FRAME}::after`]: {
      opacity: 0.5
    },
    // Name of the click target, unless it is already selected: the sidebar shows its name
    // and the label would cover text being edited. While dragging, `::before` is the drop
    // indicator instead.
    [`&[data-active=false][data-draggable-dragging=false]${HOVERED_TARGET_FRAME}::before`]: {
      content: `attr(${CANVAS_FRAME_LABEL_ATTRIBUTE})`,
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: "var(--tina-z-index-2)",
      padding: "0 6px",
      borderBottomRightRadius: "4px",
      backgroundColor: "var(--tina-color-primary)",
      color: "#fff",
      fontFamily: "var(--tina-font-family)",
      fontSize: "11px",
      fontWeight: 600,
      lineHeight: "18px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      userSelect: "none"
    },
    "&[data-drop-indicator=before]::before": {
      ...dropIndicatorBar,
      [leadingEdge]: dropIndicatorOffset
    },
    "&[data-drop-indicator=after]::before": {
      ...dropIndicatorBar,
      [trailingEdge]: dropIndicatorOffset
    },
    "&[data-draggable-active=true]": {
      opacity: 0.5
    },
    "&[data-draggable-dragging=true]": {
      cursor: "grabbing"
    },
    // Any block can be picked up without being selected first, so the click target
    // advertises it while nothing is being dragged yet.
    [`&[data-draggable-enabled=true][data-draggable-dragging=false]${HOVERED_TARGET_FRAME}`]: {
      cursor: "grab"
    },
    "&[data-drop-rejected=true]": {
      cursor: "no-drop"
    },
    // The refusal only concerns the block actually under the pointer.
    [`&${HOVERED_TARGET_FRAME} [${DROP_REJECTION_ATTRIBUTE}]`]: {
      opacity: 1
    }
  });
  const dropRejectionClassName = stitches.css({
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999999,
    maxWidth: "280px",
    padding: "2px 6px",
    borderRadius: "4px",
    backgroundColor: easyblocksDesignSystem.Colors.black900,
    color: easyblocksDesignSystem.Colors.white,
    fontFamily: "var(--tina-font-family)",
    fontSize: "11px",
    fontWeight: 500,
    lineHeight: "18px",
    opacity: 0,
    pointerEvents: "none",
    userSelect: "none"
  });
  React.useEffect(() => {
    return () => {
      // If the the node of active element is not in the DOM anymore we want to deselect it to prevent showing
      // add buttons on the not existing element.
      if (isActive && node && !window.document.contains(node) && path === window.parent.editorWindowAPI?.editorContext?.focussedField[0]) {
        window.parent.editorWindowAPI.editorContext.setFocussedField([]);
      }
    };
  });
  return /*#__PURE__*/React__default["default"].createElement("div", _extends__default["default"]({
    [CANVAS_FRAME_PATH_ATTRIBUTE]: path,
    [CANVAS_FRAME_LABEL_ATTRIBUTE]: label,
    "data-active": isActive,
    "data-draggable-enabled": isDraggable,
    "data-drop-rejected": dropRejectionMessage !== undefined,
    "data-draggable-dragging": sortable.active !== null,
    "data-drop-indicator": dropIndicatorEdge ?? "none",
    "data-draggable-active": sortable.active !== null && sortable.active?.id === id,
    className: wrapperClassName().className,
    ref: node => {
      setNode(node);
      sortable.setNodeRef(node);
    },
    onClick: onSelect
  }, sortable.attributes, sortable.listeners), edgeDropTargets, dropRejectionMessage !== undefined && /*#__PURE__*/React__default["default"].createElement("div", {
    [DROP_REJECTION_ATTRIBUTE]: "",
    role: "tooltip",
    className: dropRejectionClassName().className
  }, dropRejectionMessage), children);
}
function useUpdateFramePosition({
  node,
  isDisabled
}) {
  const dispatch = window.parent.postMessage;
  React.useEffect(() => {
    if (isDisabled || !node) {
      return;
    }
    const updateSelectionFramePosition = createThrottledHandler(() => {
      const nodeRect = node.getBoundingClientRect();
      dispatch(_internals.selectionFramePositionChanged(nodeRect, window.document.documentElement.getBoundingClientRect()));
    });
    window.addEventListener("scroll", updateSelectionFramePosition, {
      passive: true
    });
    const handleResize = createThrottledHandler(() => {
      const nodeRect = node.getBoundingClientRect();
      dispatch(_internals.selectionFramePositionChanged(nodeRect));
    });
    window.addEventListener("resize", handleResize, {
      passive: true
    });
    const updateSelectionFramePositionInScrollableContainer = createThrottledHandler(event => {
      const nodeRect = node.getBoundingClientRect();
      const containerRect = event.target.getBoundingClientRect();
      dispatch(_internals.selectionFramePositionChanged(nodeRect, containerRect));
    });
    const closestScrollableElement = node.closest("[data-easyblocks-scrollable-root]");
    closestScrollableElement?.addEventListener("scroll", updateSelectionFramePositionInScrollableContainer, {
      passive: true
    });
    dispatch(_internals.selectionFramePositionChanged(node.getBoundingClientRect(), closestScrollableElement?.getBoundingClientRect()));
    return () => {
      window.removeEventListener("scroll", updateSelectionFramePosition);
      window.removeEventListener("resize", handleResize);
      closestScrollableElement?.removeEventListener("scroll", updateSelectionFramePositionInScrollableContainer);
    };
  });
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event#scroll_event_throttling
 */
function createThrottledHandler(callback) {
  let isTicking = false;
  return event => {
    if (isTicking) {
      return;
    }
    requestAnimationFrame(() => {
      callback(event);
      isTicking = false;
    });
    isTicking = true;
  };
}

function BlocksControls({
  children,
  path,
  disabled,
  direction,
  id,
  templateId,
  index,
  length
}) {
  const editorContext = window.parent.editorWindowAPI?.editorContext ?? {};
  const {
    focussedField = [],
    setFocussedField,
    form
  } = editorContext;
  const meta = _internals.useEasyblocksMetadata();
  const dndContext = core.useDndContext();
  const {
    t
  } = getTranslation(editorContext);
  const isActive = focussedField.map(focusedField => {
    // If the focused field is rich text part path, we want to show the frame around rich text parent component.
    if (isConfigPathRichTextPart(focusedField)) {
      return focusedField.replace(RICH_TEXT_PART_CONFIG_PATH_REGEXP, "");
    }
    return focusedField;
  }).includes(path);
  const entryPathParseResult = _internals.parsePath(path, form);
  const entryComponentDefinition = meta.vars.definitions.components.find(c => c.id === entryPathParseResult.parent.templateId);

  // component` could be draggable, but right now we only support collections.
  const isEntryComponentOrComponentFixed = entryComponentDefinition.schema.some(s => s.prop === entryPathParseResult.parent.fieldName && s.type === "component");
  const isMultiSelection = focussedField.length > 1;
  const draggedEntryPathParseResult = dndContext.active ? _internals.parsePath(dndContext.active.data.current.path, form) : null;
  const draggedComponentDefinition = draggedEntryPathParseResult ? meta.vars.definitions.components.find(c => c.id === draggedEntryPathParseResult.templateId) : null;
  const canDraggedComponentBeDropped = entryComponentDefinition && draggedComponentDefinition ? getAllowedComponentTypes(entryComponentDefinition).some(type => {
    return toArray(draggedComponentDefinition.type ?? []).includes(type) || draggedComponentDefinition.id === type;
  }) : true;
  const sortableDisabledState = getSortableDisabledState({
    isEditingDisabled: disabled === true,
    isFixedSlot: isEntryComponentOrComponentFixed,
    isMultiSelection,
    canAcceptDraggedComponent: canDraggedComponentBeDropped
  });
  const isDroppableDisabled = sortableDisabledState.droppable;
  const sortable$1 = sortable.useSortable({
    id,
    data: {
      path
    },
    disabled: sortableDisabledState,
    strategy: direction === "horizontal" ? sortable.horizontalListSortingStrategy : sortable.verticalListSortingStrategy
  });
  if (disabled) {
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, children);
  }
  const focusOnBlock = event => {
    event.stopPropagation();
    if (isActive) {
      return;
    } else {
      event.preventDefault();
    }
    const closestEditableElementFromTarget = event.target.closest('[contenteditable="true"]');
    const isActiveElementContentEditable = document.activeElement?.getAttribute("contenteditable") === "true";

    // If target of event is within a content editable element we don't want to focus block.
    // If active element is a content editable element, we also don't want to focus block.
    // The latter is helpful when we start text selection within the content editable element
    // and end selection outside of anchor element.
    if (closestEditableElementFromTarget || isActiveElementContentEditable) {
      return;
    }
    const isMultipleSelection = event.shiftKey;
    function getNextFocusedField() {
      if (isMultipleSelection) {
        if (focussedField.includes(path)) {
          const result = focussedField.filter(fieldName => fieldName !== path);
          if (result.length > 0) {
            return result;
          }
          return [];
        }
        return [...focussedField, path];
      }
      return path;
    }
    const nextFocusedField = getNextFocusedField();
    setFocussedField(nextFocusedField);
    if (isMultipleSelection) {
      document.getSelection()?.removeAllRanges();
    }
  };
  const isBlockBeingDragged = sortable$1.active?.data.current?.path === path;
  const dropRejectionMessage = sortable$1.active && !isBlockBeingDragged ? getDropRejectionMessage({
    isFixedSlot: isEntryComponentOrComponentFixed,
    canAcceptDraggedComponent: canDraggedComponentBeDropped,
    targetLabel: getComponentLabel(entryPathParseResult.parent.templateId, editorContext, t),
    acceptedTypes: entryComponentDefinition ? getAllowedComponentTypes(entryComponentDefinition) : [],
    t
  }) : undefined;
  const isActivePathInDifferentCollection = sortable$1.active && !isPathsParentEqual(sortable$1.active.data.current.path, path);

  // A drag coming from another collection is the only one that cannot reach the outer edges
  // of this one by hovering a block: the order of the two paths already decides that side.
  const hasCollectionStartTarget = !isDroppableDisabled && isActivePathInDifferentCollection && sortable$1.activeIndex < sortable$1.index && index === 0;
  const hasCollectionEndTarget = !isDroppableDisabled && isActivePathInDifferentCollection && sortable$1.activeIndex > sortable$1.index && index === length - 1;
  const dropIndicatorEdge = resolveDropIndicatorEdge({
    id,
    overId: dndContext.over ? String(dndContext.over.id) : null,
    activeIndex: sortable$1.activeIndex,
    index: sortable$1.index,
    isDroppableDisabled,
    isBeingDragged: isBlockBeingDragged
  });
  return /*#__PURE__*/React__default["default"].createElement(SelectionFrameController, {
    isActive: isActive,
    onSelect: focusOnBlock,
    stitches: meta.stitches,
    sortable: sortable$1,
    id: id,
    direction: direction,
    path: path,
    label: getComponentLabel(templateId, editorContext, t),
    isDraggable: !sortableDisabledState.draggable,
    dropRejectionMessage: dropRejectionMessage,
    dropIndicatorEdge: dropIndicatorEdge,
    edgeDropTargets: /*#__PURE__*/React__default["default"].createElement(React.Fragment, null, hasCollectionStartTarget && /*#__PURE__*/React__default["default"].createElement(CollectionEdgeDropTarget, {
      id: id,
      direction: direction,
      path: path,
      position: "before"
    }), hasCollectionEndTarget && /*#__PURE__*/React__default["default"].createElement(CollectionEdgeDropTarget, {
      id: id,
      direction: direction,
      path: path,
      position: "after"
    }))
  }, children);
}

/** `@dnd-kit` reads both flags as *disabled*: `true` switches the capability off. */

/**
 * Which blocks may be picked up and which may receive a drop.
 *
 * Dragging deliberately does not depend on what is selected. It used to: a block could only
 * be picked up when it was the selection, or its parent, sibling or descendant. A freshly
 * opened editor has no selection, so no block could be dragged at all and drag and drop read
 * as broken.
 */
function getSortableDisabledState({
  isEditingDisabled,
  isFixedSlot,
  isMultiSelection,
  canAcceptDraggedComponent
}) {
  return {
    // Group drag stays off on purpose: the cross-frame move event carries a single
    // `fromPath`, so a multi-selection cannot be expressed without changing that contract.
    // Multiple blocks are still moved together with cut and paste.
    draggable: isEditingDisabled || isFixedSlot || isMultiSelection,
    droppable: isEditingDisabled || isFixedSlot || !canAcceptDraggedComponent
  };
}
/**
 * Why this block refuses the block being dragged, or `undefined` when it accepts it.
 *
 * A refused target used to just stay inert, which left no way to tell "nothing happens here"
 * apart from "drag and drop is broken".
 */
function getDropRejectionMessage({
  isFixedSlot,
  canAcceptDraggedComponent,
  targetLabel,
  acceptedTypes,
  t
}) {
  if (!isFixedSlot && canAcceptDraggedComponent) {
    return undefined;
  }

  // A fixed slot, or a collection that lists no accepted type, can never take the block,
  // so naming the types would say nothing.
  if (isFixedSlot || acceptedTypes.length === 0) {
    return t("editor.canvas.drop.rejected.fixed").replace("{target}", targetLabel);
  }
  return t("editor.canvas.drop.rejected.type").replace("{target}", targetLabel).replace("{types}", acceptedTypes.join(", "));
}

/**
 * Component types a block accepts into its collections. A drop is refused when the dragged
 * block matches none of them, which is what keeps a block from landing in a parent that
 * cannot hold it.
 */
function getAllowedComponentTypes(componentDefinition) {
  const collectionSchemaProps = componentDefinition.schema.filter(s => s.type === "component-collection");
  const allowedComponentTypes = collectionSchemaProps.flatMap(s => s.accepts);
  return Array.from(new Set(allowedComponentTypes));
}

/**
 * Whether two block paths sit in the same collection. Drops into a *different* collection are
 * the move-to-another-parent case: they need the extra before/after placeholders, and the
 * parent window resolves them through insert + remove instead of a plain reorder.
 */
function isPathsParentEqual(path1, path2) {
  const activePathParts = path1.split(".");
  const currentPathParts = path2.split(".");
  return activePathParts.slice(0, -1).join(".") === currentPathParts.slice(0, -1).join(".");
}

/**
 * How wide the band straddling a collection edge is, in canvas pixels. Wide enough to aim at,
 * narrow enough that the middle of the block still means "drop next to this block".
 */
const EDGE_DROP_TARGET_SIZE = 24;

/**
 * Hit area for the outer edge of a collection, registered as `<id>.before` / `<id>.after` so
 * a finished drag carries an explicit placement.
 *
 * It draws nothing: the frame around the block owns the insertion line, because the frame is
 * the box whose edge the block will land on. This element used to place itself with
 * `top`/`left: -100%`, which resolves against the nearest positioned ancestor rather than the
 * block — with an unpositioned collection container that put the hit area, and the line it
 * used to draw, an arbitrary distance away from the edge it stands for.
 */
function CollectionEdgeDropTarget({
  id,
  direction,
  path,
  position
}) {
  const meta = _internals.useEasyblocksMetadata();
  const sortable$1 = sortable.useSortable({
    id: `${id}.${position}`,
    data: {
      path
    },
    disabled: {
      draggable: true,
      droppable: false
    }
  });
  const isHorizontal = direction === "horizontal";
  const edge = position === "before" ? isHorizontal ? "left" : "top" : isHorizontal ? "right" : "bottom";
  const wrapperStyles = meta.stitches.css({
    position: "absolute",
    [edge]: `-${EDGE_DROP_TARGET_SIZE / 2}px`,
    ...(isHorizontal ? {
      top: 0,
      bottom: 0,
      width: `${EDGE_DROP_TARGET_SIZE}px`
    } : {
      left: 0,
      right: 0,
      height: `${EDGE_DROP_TARGET_SIZE}px`
    }),
    // Collisions are resolved from measured rectangles, not from hit testing, so the band
    // still catches the drag while staying out of the way of clicks on the block itself.
    pointerEvents: "none"
  });
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: wrapperStyles().className,
    ref: sortable$1.setDroppableNodeRef
  });
}

function EditableComponentBuilder(props) {
  const {
    path,
    compiled,
    index,
    length,
    components,
    ...restPassedProps
  } = props;
  const content = /*#__PURE__*/React__default["default"].createElement(BlocksControls, {
    path: path,
    id: compiled._id,
    templateId: compiled._component,
    disabled: compiled.__editing?.noInline,
    direction: compiled.__editing?.direction ?? "vertical",
    compiled: compiled,
    index: index,
    length: length
  }, /*#__PURE__*/React__default["default"].createElement(_internals.ComponentBuilder, {
    compiled: compiled,
    path: path,
    passedProps: restPassedProps,
    components: components
  }));
  return content;
}

function Placeholder(props) {
  const {
    stitches
  } = _internals.useEasyblocksMetadata();
  const styles = {};
  const {
    aspectRatio,
    width,
    height,
    label
  } = props.appearance;
  if (height) {
    styles.height = `${height}px`;
  } else if (aspectRatio) {
    styles.paddingBottom = `${1 / aspectRatio * 100}%`;
  }
  const rootClassName = stitches.css({
    border: `1px dashed ${easyblocksDesignSystem.Colors.blue50}`,
    position: "relative",
    width: `${width ? `${width}px` : "auto"}`,
    height: "auto",
    transition: "all 0.1s"
  });
  const contentClassName = stitches.css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    color: easyblocksDesignSystem.Colors.blue50,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    ...easyblocksDesignSystem.Fonts.body,
    "&:hover": {
      backgroundColor: easyblocksDesignSystem.Colors.blue10
    },
    "&[data-draggable-over=true]": {
      backgroundColor: easyblocksDesignSystem.Colors.blue10
    },
    "&[data-draggable-dragging=true]": {
      cursor: "grabbing"
    }
  });
  const content = /*#__PURE__*/React__default["default"].createElement("div", {
    className: contentClassName(),
    onClick: event => {
      event.stopPropagation();
      props.onClick();
    },
    "data-draggable-over": props.sortable.isOver,
    "data-draggable-dragging": props.sortable.active !== null
  }, /*#__PURE__*/React__default["default"].createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      color: easyblocksDesignSystem.Colors.blue50
    }
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z",
    fill: "currentColor",
    fillRule: "evenodd",
    clipRule: "evenodd"
  })), label && /*#__PURE__*/React__default["default"].createElement("span", null, "\xA0\xA0", label));
  return /*#__PURE__*/React__default["default"].createElement("div", _extends__default["default"]({
    className: rootClassName(),
    ref: props.sortable.setDroppableNodeRef
  }, props.sortable.attributes, props.sortable.listeners), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      ...styles
    }
  }), content);
}
function TypePlaceholder(props) {
  const {
    form
  } = window.parent.editorWindowAPI?.editorContext || {};
  const meta = _internals.useEasyblocksMetadata();
  const dndContext = core.useDndContext();
  const draggedEntryPathParseResult = dndContext.active ? _internals.parsePath(dndContext.active.data.current.path, form) : null;
  const draggedComponentDefinition = draggedEntryPathParseResult ? meta.vars.definitions.components.find(c => c.id === draggedEntryPathParseResult.templateId) : null;
  const canDraggedComponentBeDropped = draggedComponentDefinition ? toArray(draggedComponentDefinition.type ?? []).includes(props.type) : true;
  const sortable$1 = sortable.useSortable({
    id: `placeholder.${props.id}`,
    data: {
      path: props.path
    },
    disabled: {
      draggable: true,
      droppable: !canDraggedComponentBeDropped
    }
  });
  const {
    type
  } = props;
  let appearance;
  if (props.appearance) {
    appearance = props.appearance;
  } else {
    if (type === "section") {
      appearance = {
        label: "Add section",
        aspectRatio: 3.2
      };
    } else if (type === "card") {
      appearance = {
        label: "Add card",
        aspectRatio: 0.7
      };
    } else if (type === "button") {
      appearance = {
        label: "Add button",
        width: 250,
        height: 50
      };
    } else if (type === "item") {
      appearance = {
        label: "Add item",
        // width: 250,
        height: 50
      };
    } else if (type === "image") {
      appearance = {
        label: "Add image",
        aspectRatio: 1
      };
    } else if (type === "icon") {
      appearance = {
        label: "Pick icon",
        width: 50,
        height: 50
      };
    } else {
      appearance = {
        label: "Add",
        width: 50,
        aspectRatio: 1
      };
    }
  }
  return /*#__PURE__*/React__default["default"].createElement(Placeholder, {
    appearance: appearance,
    onClick: props.onClick,
    meta: props.meta,
    sortable: sortable$1
  });
}

const dragDataSchema = zod.z.object({
  path: zod.z.string(),
  sortable: zod.z.object({
    index: zod.z.number()
  })
});

/**
 * Minimal structural view of a `@dnd-kit` drag end event. `data.current` is `unknown`
 * on purpose: it is untrusted input that `dragDataSchema` validates at this boundary.
 */

/**
 * What a finished drag means. `move` carries the cross-frame event that the parent
 * window turns into a reorder or a move to a different parent; `refocus` reselects
 * the dragged block because nothing changed.
 */

/**
 * Decides what a finished drag means. Kept pure and separate from the React tree so the
 * move-to-a-different-parent path stays covered by tests: the parent window relies on
 * `fromPath` and `toPath` pointing at different collections to take its insert/remove
 * branch, so any change here silently breaks moving a block out of its parent.
 */
function resolveDragEndOutcome(event) {
  const activeData = dragDataSchema.parse(event.active.data.current);
  if (!event.over) {
    // No drop target under the pointer: nothing moved, so reselect the dragged block.
    return {
      type: "refocus",
      path: activeData.path
    };
  }
  if (event.over.id === event.active.id) {
    // Dropped onto itself: nothing moved either.
    return {
      type: "refocus",
      path: activeData.path
    };
  }
  const overData = dragDataSchema.parse(event.over.data.current);
  return {
    type: "move",
    event: _internals.itemMoved({
      fromPath: activeData.path,
      toPath: overData.path,
      // Placeholder droppables are registered as `<id>.before` / `<id>.after`; a plain
      // block id has no suffix and leaves the placement for the parent to work out.
      placement: ifValidPlacement(event.over.id.toString().split(".")[1])
    })
  };
}
function customCollisionDetection(args) {
  // First, let's see if there are any collisions with the pointer
  const pointerCollisions = core.pointerWithin(args);

  // Collision detection algorithms return an array of collisions
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // If there are no collisions with the pointer, return rectangle intersections
  return core.rectIntersection(args);
}
function EasyblocksCanvas({
  components
}) {
  const {
    meta,
    compiled,
    externalData,
    editorContext
  } = window.parent.editorWindowAPI;
  const [enabled, setEnabled] = React.useState(false);
  const activeDraggedEntryPath = React.useRef(null);
  const {
    forceRerender
  } = useForceRerender();
  const mouseSensor = core.useSensor(core.MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  });
  // Touch needs a hold instead of a distance: on a touch screen a short drag is how the
  // page is scrolled, so a block is only picked up once the finger has stayed put.
  const touchSensor = core.useSensor(core.TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 8
    }
  });
  React.useEffect(() => {
    if (window.self === window.top) {
      throw new Error("No host");
    } else {
      setEnabled(true);
    }
  }, []);
  React.useEffect(() => {
    if (window.parent && window.parent.editorWindowAPI) {
      window.parent.editorWindowAPI.onUpdate = () => {
        // Force re-render when child gets info from parent that data changed
        forceRerender();
      };
    }
  });
  const shouldNotRender = !enabled || !meta || !compiled || !externalData;
  if (shouldNotRender) {
    return /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement(SkeletonEditorCanvasArea$1, null));
  }
  const sortableItems = getSortableItems(editorContext.form.values, editorContext);
  return /*#__PURE__*/ /* EasyblocksMetadataProvider must be defined in case of nested <Easyblocks /> components are used! */React__default["default"].createElement(_internals.EasyblocksMetadataProvider, {
    meta: meta
  }, /*#__PURE__*/React__default["default"].createElement(Tooltip$1.TooltipProvider, null, /*#__PURE__*/React__default["default"].createElement(CanvasRoot, null, /*#__PURE__*/React__default["default"].createElement(core.DndContext, {
    sensors: [mouseSensor, touchSensor],
    collisionDetection: customCollisionDetection,
    onDragStart: event => {
      document.documentElement.style.cursor = "grabbing";
      activeDraggedEntryPath.current = dragDataSchema.parse(event.active.data.current).path;
      window.parent.editorWindowAPI?.editorContext?.setFocussedField([]);
    },
    onDragEnd: event => {
      document.documentElement.style.cursor = "";
      const outcome = resolveDragEndOutcome(event);
      if (outcome.type === "refocus") {
        window.parent.editorWindowAPI?.editorContext?.setFocussedField(outcome.path);
        return;
      }
      requestAnimationFrame(() => {
        window.parent.postMessage(outcome.event);
      });
    },
    onDragCancel: event => {
      document.documentElement.style.cursor = "";
      // If the drag was canceled, we want to refocus dragged item.
      window.parent.editorWindowAPI?.editorContext?.setFocussedField(dragDataSchema.parse(event.active.data.current).path);
    }
  }, /*#__PURE__*/React__default["default"].createElement(sortable.SortableContext, {
    items: sortableItems
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksCore.Easyblocks, {
    renderableDocument: {
      renderableContent: compiled,
      meta
    },
    externalData: externalData,
    components: {
      ...components,
      "@easyblocks/rich-text.editor": _internals.RichTextEditor,
      "@easyblocks/text.editor": _internals.TextEditor,
      "EditableComponentBuilder.editor": EditableComponentBuilder,
      Placeholder: TypePlaceholder
    }
  }))))));
}

/**
 * Every `component-collection` in the tree, at every depth, contributes its items plus a
 * `.before` / `.after` droppable. Those extra ids are what make a collection reachable from
 * a drag that started in a *different* collection, so dropping the last/first slot of another
 * parent keeps working.
 */
function getSortableItems(rootNoCodeEntry, editorContext) {
  const sortableItems = [];
  _internals.configTraverse(rootNoCodeEntry, editorContext, ({
    value,
    schemaProp,
    config
  }) => {
    if (schemaProp.type === "component-collection") {
      if (value.length === 0) {
        sortableItems.push(`placeholder.${config._id}`);
        return;
      }
      sortableItems.push(`${value[0]._id}.before`);
      sortableItems.push(...value.map(v => v._id));
      sortableItems.push(`${value.at(-1)._id}.after`);
    }
  });
  return sortableItems;
}
function ifValidPlacement(value) {
  if (value === "before" || value === "after") {
    return value;
  }
  return;
}

function serialize(value) {
  if (value instanceof Error) {
    return JSON.parse(JSON.stringify(value, Object.getOwnPropertyNames(value)));
  }
  return JSON.parse(JSON.stringify(value));
}

const PreviewRenderer = props => {
  const config = props.config;
  const [data, setData] = React.useState(null);
  const [width, setWidth] = React.useState(-1);
  const [widthAuto, setWidthAuto] = React.useState(false);
  React.useEffect(() => {
    const {
      documentId,
      templateId,
      locale
    } = parseQueryParams();
    let mode;
    if (documentId && templateId) {
      console.warn(`'template' parameter ignored because 'document' parameter is specified`);
      mode = "document";
    } else if (!documentId && templateId) {
      mode = "template";
    } else if (documentId && !templateId) {
      mode = "document";
    } else {
      throw new Error("You must specify 'document' or 'template' parameter in preview mode");
    }
    const localeWithDefault = locale ?? easyblocksCore.getDefaultLocale(config.locales ?? []).code;
    (async () => {
      const {
        buildDocument,
        buildEntry
      } = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('@redsun-vn/easyblocks-core')); });
      if (mode === "document") {
        const {
          renderableDocument,
          externalData
        } = await buildDocument({
          documentId: documentId,
          config,
          locale: localeWithDefault
        });
        props.onExternalDataChange?.(externalData, {
          locale: localeWithDefault
        });
        setData({
          renderableDocument,
          externalData
        });
      } else {
        const template = await config.backend.templates.get({
          id: templateId
        });
        const {
          renderableContent,
          meta,
          externalData
        } = buildEntry({
          entry: {
            ...template.entry,
            _itemProps: {}
          },
          config,
          locale: localeWithDefault
        });
        props.onExternalDataChange?.(externalData, {
          locale: localeWithDefault
        });
        setWidth(template.width ?? -1);
        setWidthAuto(template.widthAuto ?? false);
        setData({
          renderableDocument: {
            renderableContent,
            meta: serialize(meta)
          },
          externalData
        });
      }
    })();
  }, []);
  if (!data) {
    return null;
  }
  const requestedExternalDataLength = Object.keys(data.externalData).length;
  const givenExternalDataLength = Object.keys(props.externalData ?? {}).length;
  if (requestedExternalDataLength !== givenExternalDataLength) {
    return null;
  }
  return /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      position: "relative",
      display: widthAuto ? "inline-flex" : "block",
      maxWidth: width === -1 ? "auto" : `${width}px`
    },
    id: "__easyblocks-preview-container"
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksCore.Easyblocks, {
    renderableDocument: data.renderableDocument,
    externalData: props.externalData,
    components: props.components
  }));
};

const validate = value => {
  return typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"));
};
const debugTypes = {
  debug_url_inline_never: {
    type: "inline",
    defaultValue: "https://google.com",
    responsiveness: "never",
    widget: {
      id: "debug_url",
      label: "Debug URL"
    },
    validate
  },
  debug_url_inline_optional: {
    type: "inline",
    defaultValue: "https://google.com",
    responsiveness: "optional",
    widget: {
      id: "debug_url",
      label: "Debug URL"
    },
    validate
  },
  debug_url_inline_always: {
    type: "inline",
    defaultValue: "https://google.com",
    responsiveness: "always",
    widget: {
      id: "debug_url",
      label: "Debug URL"
    },
    validate
  },
  debug_url_token_never: {
    type: "token",
    token: "debug_urls",
    responsiveness: "never",
    defaultValue: {
      tokenId: "google"
    },
    widget: {
      id: "debug_url",
      label: "Debug URL"
    },
    allowCustom: false,
    validate
  },
  debug_url_token_optional_no_custom: {
    type: "token",
    token: "debug_urls",
    responsiveness: "optional",
    defaultValue: {
      tokenId: "google"
    },
    widget: {
      id: "debug_url",
      label: "Debug URL"
    },
    allowCustom: false,
    validate
  },
  debug_url_token_optional_custom: {
    type: "token",
    token: "debug_urls",
    responsiveness: "optional",
    defaultValue: {
      tokenId: "google"
    },
    widget: {
      id: "debug_url",
      label: "Debug URL"
    },
    allowCustom: true,
    validate
  },
  debug_url_token_always_no_custom: {
    type: "token",
    token: "debug_urls",
    responsiveness: "always",
    defaultValue: {
      tokenId: "google"
    },
    widget: {
      id: "debug_url",
      label: "Debug URL"
    },
    allowCustom: false,
    validate
  },
  debug_url_token_always_custom: {
    type: "token",
    token: "debug_urls",
    responsiveness: "always",
    defaultValue: {
      tokenId: "google"
    },
    widget: {
      id: "debug_url",
      label: "Debug URL"
    },
    allowCustom: true,
    validate
  }
};

const debugSectionDefinition = {
  id: "DebugSection",
  schema: [{
    prop: "inline_never",
    label: "Never",
    type: "debug_url_inline_never",
    group: "Inline"
  }, {
    prop: "inline_optional_disabled",
    label: "Optional (off)",
    type: "debug_url_inline_optional",
    responsive: false,
    group: "Inline"
  }, {
    prop: "inline_optional_enabled",
    label: "Optional (on)",
    type: "debug_url_inline_optional",
    responsive: true,
    group: "Inline"
  }, {
    prop: "inline_always",
    label: "Always",
    type: "debug_url_inline_always",
    group: "Inline"
  }, {
    prop: "token_never",
    label: "Never",
    type: "debug_url_token_never",
    group: "Token - custom"
  }, {
    prop: "token_optional_disabled_custom",
    label: "Optional (off)",
    type: "debug_url_token_optional_custom",
    responsive: false,
    group: "Token - custom"
  }, {
    prop: "token_optional_enabled_custom",
    label: "Optional (on)",
    type: "debug_url_token_optional_custom",
    responsive: true,
    group: "Token - custom"
  }, {
    prop: "token_always_custom",
    label: "Always",
    type: "debug_url_token_always_custom",
    group: "Token - custom"
  }, {
    prop: "token_optional_disabled_no_custom",
    label: "Optional (off)",
    type: "debug_url_token_optional_no_custom",
    responsive: false,
    group: "Token - no custom"
  }, {
    prop: "token_optional_enabled_no_custom",
    label: "Optional (on)",
    type: "debug_url_token_optional_no_custom",
    responsive: true,
    group: "Token - no custom"
  }, {
    prop: "token_always_no_custom",
    label: "Always",
    type: "debug_url_token_always_no_custom",
    group: "Token - no custom"
  }],
  type: "section"
};

const debugTokens = {
  debug_urls: [{
    id: "google",
    value: "https://google.com"
  }, {
    id: "bing",
    value: "https://bing.com"
  }]
};

function DebugSection({
  inline_never,
  inline_optional_disabled,
  inline_optional_enabled,
  inline_always,
  token_never,
  token_optional_disabled_no_custom,
  token_optional_enabled_no_custom,
  token_optional_disabled_custom,
  token_optional_enabled_custom,
  token_always_no_custom,
  token_always_custom
}) {
  return /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("pre", null, JSON.stringify({
    inline_never,
    inline_optional_disabled,
    inline_optional_enabled,
    inline_always,
    token_never,
    token_optional_disabled_no_custom,
    token_optional_enabled_no_custom,
    token_optional_disabled_custom,
    token_optional_enabled_custom,
    token_always_no_custom,
    token_always_custom
  }, null, 2)));
}

function DebugUrlWidget(props) {
  const [active, setActive] = React.useState(false);
  const [value, setValue] = React.useState(props.value);
  React.useEffect(() => {
    if (!active) {
      setValue(props.value);
    }
  });
  return /*#__PURE__*/React__default["default"].createElement(Input.Input, {
    value: value,
    onChange: event => {
      setActive(true);
      setValue(event.target.value);
    },
    onBlur: () => {
      setActive(false);
      props.onChange(value);
    },
    align: "right"
  });
}

function addDebugToEditorProps(props) {
  return {
    ...props,
    config: {
      ...props.config,
      types: {
        ...props.config.types,
        ...debugTypes
      },
      components: [...(props.config.components ?? []), debugSectionDefinition],
      tokens: {
        ...props.config.tokens,
        ...debugTokens
      }
    },
    components: {
      ...props.components,
      DebugSection
    },
    widgets: {
      ...props.widgets,
      debug_url: DebugUrlWidget
    }
  };
}

// Extend the Window interface to include isShopstoryEditor

function EasyblocksEditor(props) {
  const [selectedWindow, setSelectedWindow] = React.useState(null);
  const setSelectedWindowToParent = () => {
    window.isShopstoryEditor = true;
    setSelectedWindow("parent");
  };
  React.useEffect(() => {
    easyblocksCore.loadGoogleFonts({
      editor: true
    });
    if (parseQueryParams().preview) {
      setSelectedWindow("preview");
      return;
    }
    const setSelectedWindowToChild = () => {
      setSelectedWindow("child");
    };
    if (selectedWindow === null) {
      /**
       * Why try catch?
       *
       * It's because window.parent.isShopstoryEditor might throw if window.parent is cross origin (when editor Launcher is run in iframe of CMS - like Contentful); In that case we're sure it's a parent window, not a child.
       */
      try {
        // Parent window is always rendered first so `window.isShopstoryEditor` will always be set when <iframe /> with child is loading
        if (window.parent !== window.self && window.parent.isShopstoryEditor) {
          setSelectedWindowToChild();
        } else {
          setSelectedWindowToParent();
        }
      } catch (error) {
        setSelectedWindowToParent();
      }
    }
  }, []);
  if (!selectedWindow) {
    return null;
  }
  if (parseQueryParams().debug) {
    props = addDebugToEditorProps(props);
  }
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, selectedWindow === "parent" && /*#__PURE__*/React__default["default"].createElement(EasyblocksParent, {
    config: props.config,
    externalData: props.externalData ?? {},
    onExternalDataChange: props.onExternalDataChange ?? (() => ({})),
    onConfigChange: props.onConfigChange,
    onGlobalSectionChange: props.onGlobalSectionChange,
    widgets: props.widgets,
    components: props.components,
    pickers: props.pickers,
    mode: props.mode,
    defaultLocale: props.defaultLocale,
    SaveAsPicker: props.SaveAsPicker
  }), selectedWindow === "child" && /*#__PURE__*/React__default["default"].createElement(EasyblocksCanvas, {
    components: props.components
  }), selectedWindow === "preview" && /*#__PURE__*/React__default["default"].createElement(PreviewRenderer, props));
}

exports.EasyblocksEditor = EasyblocksEditor;
exports.EditorContext = EditorContext;
exports.useEditorContext = useEditorContext;
