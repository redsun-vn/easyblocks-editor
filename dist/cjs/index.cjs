"use client";
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var easyblocksDesignSystem = require('@redsun-vn/easyblocks-design-system');
var isPropValid = require('@emotion/is-prop-valid');
var styledComponents = require('styled-components');
var _extends = require('@babel/runtime/helpers/extends');
var easyblocksCore = require('@redsun-vn/easyblocks-core');
var _internals = require('@redsun-vn/easyblocks-core/_internals');
var throttle = require('lodash.throttle');
var Modal = require('react-modal');
var ReactDOM = require('react-dom');
var tooltip = require('@react-aria/tooltip');
var reactPopper = require('react-popper');
var RadixRadioGroup = require('@radix-ui/react-radio-group');
var finalForm = require('final-form');
var arrayMutators = require('final-form-arrays');
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
var _extends__default = /*#__PURE__*/_interopDefaultLegacy(_extends);
var throttle__default = /*#__PURE__*/_interopDefaultLegacy(throttle);
var Modal__default = /*#__PURE__*/_interopDefaultLegacy(Modal);
var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
var RadixRadioGroup__namespace = /*#__PURE__*/_interopNamespace(RadixRadioGroup);
var arrayMutators__default = /*#__PURE__*/_interopDefaultLegacy(arrayMutators);

const EditorContext = /*#__PURE__*/React__default["default"].createContext(null);
function useEditorContext() {
  const context = React.useContext(EditorContext);
  if (!context) {
    throw new Error("EditorContext not defined");
  }
  return context;
}

function last(collection) {
  return collection[collection.length - 1];
}

// eslint-disable-next-line @typescript-eslint/ban-types
function toArray(scalarOrCollection) {
  if (Array.isArray(scalarOrCollection)) {
    return scalarOrCollection;
  }
  return [scalarOrCollection];
}

const takeNumbers = path => path.split(".").map(x => parseInt(x, 10)).filter(x => !Number.isNaN(x));
const preOrderPathComparator = function () {
  let direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ascending";
  return (pathA, pathB) => {
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
};

function includesAny(a, b) {
  return a.some(i => b.includes(i));
}

function deepClone(source) {
  return JSON.parse(JSON.stringify(source));
}

function deepCompare() {
  for (let index = 0; index < arguments.length - 1; index++) {
    const currentObject = sortObject(index < 0 || arguments.length <= index ? undefined : arguments[index]);
    const nextObject = sortObject(index + 1 < 0 || arguments.length <= index + 1 ? undefined : arguments[index + 1]);
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

function dotNotationGet(obj, path) {
  if (path === "") {
    return obj;
  }
  return path.split(".").reduce((acc, curVal) => acc && acc[curVal], obj);
}

function serialize(value) {
  if (value instanceof Error) {
    return JSON.parse(JSON.stringify(value, Object.getOwnPropertyNames(value)));
  }
  return JSON.parse(JSON.stringify(value));
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

function assertDefined(value, message) {
  if (value === undefined) {
    throw new Error(message ?? "Value is undefined");
  }
  return value;
}

const ConfigAfterAutoContext = /*#__PURE__*/React__default["default"].createContext(null);
function useConfigAfterAuto() {
  const configAfterAutoContext = React.useContext(ConfigAfterAutoContext);
  if (!configAfterAutoContext) {
    throw new Error("CompiledConfigContext is required for Responsive field");
  }
  return configAfterAutoContext;
}

const ExternalDataContext = /*#__PURE__*/React.createContext({});
function EditorExternalDataProvider(_ref) {
  let {
    children,
    externalData
  } = _ref;
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
const useWindowKeyDown = function (key, callback) {
  let {
    extraKeys,
    isDisabled
  } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    extraKeys: [],
    isDisabled: false
  };
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

function EditorIframe(_ref) {
  let {
    onEditorHistoryRedo,
    onEditorHistoryUndo,
    width,
    height,
    transform,
    containerRef
  } = _ref;
  const [isIframeReady, setIframeReady] = React.useState(false);
  const handleIframeLoaded = () => {
    setIframeReady(true);
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
  return /*#__PURE__*/React__default["default"].createElement(IframeContainer, {
    ref: containerRef
  }, /*#__PURE__*/React__default["default"].createElement(IframeInnerContainer, null, /*#__PURE__*/React__default["default"].createElement(Iframe, {
    id: "shopstory-canvas",
    src: window.location.href,
    onLoad: handleIframeLoaded,
    style: {
      // These properties will change a lot during resizing, so we don't pass it to styled component to prevent
      // class name recalculations
      width,
      height,
      transform
    }
  })));
}
const IframeContainer = styledComponents.styled.div.withConfig({
  displayName: "EditorIframe__IframeContainer",
  componentId: "sc-1k2h6r-0"
})(["position:relative;flex:1 1 auto;background:", ";"], easyblocksDesignSystem.Colors.black100);
const IframeInnerContainer = styledComponents.styled.div.withConfig({
  displayName: "EditorIframe__IframeInnerContainer",
  componentId: "sc-1k2h6r-1"
})(["position:absolute;top:0;left:0;width:100%;height:100%;display:grid;justify-content:center;align-items:center;"]);
const Iframe = styledComponents.styled.iframe.withConfig({
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
  (compiledComponent.__editing?.fields ?? []).filter(field => fieldsFilter ? fieldsFilter(field) : true).forEach(item => {
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

const IdWrapper = styledComponents.styled.div.withConfig({
  displayName: "SidebarFooter__IdWrapper",
  componentId: "sc-17xf0ak-0"
})(["display:block;padding:16px;", " color:", ";"], easyblocksDesignSystem.Fonts.body, easyblocksDesignSystem.Colors.black40);
function SidebarFooter(props) {
  const editorContext = useEditorContext();
  const toaster = easyblocksDesignSystem.useToaster();
  const {
    form,
    isAdminMode
  } = editorContext;
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
  return /*#__PURE__*/React__namespace.createElement("div", null, /*#__PURE__*/React__namespace.createElement(IdWrapper, null, /*#__PURE__*/React__namespace.createElement("div", null, "Id: ", value._id), /*#__PURE__*/React__namespace.createElement("br", null), showSaveAsTemplate && /*#__PURE__*/React__namespace.createElement(easyblocksDesignSystem.ButtonSecondary, {
    onClick: () => {
      editorContext.actions.openTemplateModal({
        mode: "create",
        config: value,
        width,
        widthAuto
      });
    }
  }, "Save as template"), isAdminMode && /*#__PURE__*/React__namespace.createElement("div", {
    style: {
      paddingTop: 16
    }
  }, /*#__PURE__*/React__namespace.createElement("div", null, /*#__PURE__*/React__namespace.createElement(easyblocksDesignSystem.ButtonPrimary, {
    onClick: async () => {
      try {
        await copyToClipboard(JSON.stringify(value));
        toaster.success("Copied");
      } catch (error) {
        toaster.error("Copy Entry Error!");
      }
    }
  }, "Copy entry")), value._master && /*#__PURE__*/React__namespace.createElement("div", {
    style: {
      paddingTop: 16
    }
  }, "Master: ", value._master))));
}

const Toggle = _ref => {
  let {
    input,
    field,
    disabled = false
  } = _ref;
  const checked = !!(input.value || input.checked);
  const toggleProps = {
    ...input,
    labels: null,
    name: field.name,
    disabled,
    value: checked,
    checked
  };
  return /*#__PURE__*/React__default["default"].createElement(ToggleFieldWrapper, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Toggle, toggleProps));
};
const ToggleFieldWrapper = styledComponents.styled.div.withConfig({
  displayName: "Toggle__ToggleFieldWrapper",
  componentId: "sc-1ldymt4-0"
})(["display:flex;justify-content:flex-end;"]);

const MIXED_VALUE = "__MIXED__";
const COMPONENTS_SUPPORTING_MIXED_VALUES = ["block", "radio-group", "select", "token"];

function isMixedFieldValue(value) {
  return typeof value === "object" && value !== null && "__mixed__" in value && value.__mixed__;
}

const SelectFieldComponent = _ref => {
  let {
    input,
    field,
    options
  } = _ref;
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
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Select, {
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
    return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectSeparator, {
      key: "divider"
    });
  }
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectItem, {
    key: option.value,
    value: option.value,
    isDisabled: option.value === MIXED_VALUE
  }, option.label);
}

const RadioGroup = _ref => {
  let {
    input,
    field,
    options
  } = _ref;
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
  return radioOptionsMapped && /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectInline, _extends__default["default"]({}, input, {
    value: toggleButtonValue
  }), radioOptionsMapped.map(option => {
    let Icon = undefined;
    if (typeof option.icon === "string" && option.icon in easyblocksDesignSystem.Icons) {
      Icon = easyblocksDesignSystem.Icons[option.icon];
    }
    if (typeof option.icon === "function") {
      Icon = option.icon;
    }
    return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ToggleButton, {
      key: option.value,
      icon: Icon,
      value: option.value,
      hideLabel: option.hideLabel
    }, option.label ?? option.value);
  }));
};

const NumberInput = _ref => {
  let {
    onChange,
    value,
    step,
    min,
    max
  } = _ref;
  return /*#__PURE__*/React__namespace.createElement(easyblocksDesignSystem.Input, {
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
};

const Tooltip = /*#__PURE__*/React.forwardRef((_ref, ref) => {
  let {
    children,
    style = {},
    ...rest
  } = _ref;
  return /*#__PURE__*/ReactDOM.createPortal(/*#__PURE__*/React__default["default"].createElement("div", _extends__default["default"]({
    style: {
      ...style,
      zIndex: 100100
    },
    ref: ref
  }, rest), children), document.body);
});
const TooltipBody = styledComponents.styled.div.withConfig({
  displayName: "Tooltip__TooltipBody",
  componentId: "sc-tkogle-0"
})(["position:relative;top:6px;display:flex;flex-direction:row;justify-content:center;align-items:center;padding:6px 4px;background:#333333;border-radius:2px;", " color:#fff;"], easyblocksDesignSystem.Fonts.body);
const TooltipArrow = styledComponents.styled.div.withConfig({
  displayName: "Tooltip__TooltipArrow",
  componentId: "sc-tkogle-1"
})(["width:12px;height:6px;margin:0 auto;background:#333333;clip-path:polygon(50% 0%,0% 100%,100% 100%);"]);

function useTooltip() {
  let {
    isDisabled,
    onClick
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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

function FieldMetaWrapper(_ref) {
  let {
    children,
    field,
    input,
    noWrap,
    layout = "row",
    renderLabel,
    isLabelHidden
  } = _ref;
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
  return /*#__PURE__*/React__default["default"].createElement(FieldWrapper$1, {
    margin: false,
    layout: resolvedLayout
  }, !isLabelHidden && /*#__PURE__*/React__default["default"].createElement(FieldLabelWrapper, {
    isFullWidth: resolvedLayout === "column"
  }, renderLabel?.({
    label
  }) ?? /*#__PURE__*/React__default["default"].createElement(FieldLabel, _extends__default["default"]({
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
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Loader, null)), resolvedLayout === "column" && (_internals.isExternalSchemaProp(schemaProp, editorContext.types) || schemaProp.type === "text") && !isMixedValue && /*#__PURE__*/React__default["default"].createElement(WidgetsSelect, {
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
    layout: resolvedLayout
  }, content), !isMixedFieldValue && isExternalField && externalValues.length > 0 && "error" in externalValues[0] && /*#__PURE__*/React__default["default"].createElement(FieldError, null, externalValues[0].error.message));
}
function WidgetsSelect(_ref2) {
  let {
    value,
    onChange,
    schemaProp,
    isRootComponent
  } = _ref2;
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
  return /*#__PURE__*/React__default["default"].createElement(FieldLabelIconWrapper, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Select, {
    value: selectedWidgetId,
    onChange: widgetId => {
      setSelectedWidgetId(widgetId);
      onChange(widgetId);
    }
  }, availableWidgets.map(widget => {
    return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectItem, {
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
const TextButton = styledComponents.styled(easyblocksDesignSystem.Typography).withConfig({
  displayName: "wrapFieldWithMeta__TextButton",
  componentId: "sc-1asy4oy-0"
})(["padding:0;margin:0;background:transparent;border:0;font-weight:500;&:hover{color:black;cursor:pointer;text-decoration:underline;}"]);
function wrapFieldsWithMeta(Field, extraProps) {
  return props => {
    return /*#__PURE__*/React__default["default"].createElement(FieldMetaWrapper, _extends__default["default"]({}, props, extraProps), /*#__PURE__*/React__default["default"].createElement(Field, props));
  };
}
const FieldWrapper$1 = styledComponents.styled.div.withConfig({
  displayName: "wrapFieldWithMeta__FieldWrapper",
  componentId: "sc-1asy4oy-1"
})(["display:flex;flex-direction:", ";gap:", ";justify-content:space-between;align-items:flex-start;", " position:relative;padding:4px 16px;"], _ref3 => {
  let {
    layout
  } = _ref3;
  return layout;
}, _ref4 => {
  let {
    layout
  } = _ref4;
  return layout === "row" ? "10px" : "4px";
}, _ref5 => {
  let {
    layout
  } = _ref5;
  return layout === "column" && styledComponents.css(["flex-grow:1;"]);
});
const FieldLabelWrapper = styledComponents.styled.div.withConfig({
  displayName: "wrapFieldWithMeta__FieldLabelWrapper",
  componentId: "sc-1asy4oy-2"
})(["all:unset;position:relative;display:flex;flex-direction:row;align-items:center;", " min-height:28px;overflow:hidden;"], _ref6 => {
  let {
    isFullWidth
  } = _ref6;
  return isFullWidth && {
    width: "100%"
  };
});
const FieldLabel = styledComponents.styled.label.withConfig({
  displayName: "wrapFieldWithMeta__FieldLabel",
  componentId: "sc-1asy4oy-3"
})(["all:unset;", ";color:", ";text-overflow:ellipsis;overflow:hidden;cursor:default;"], easyblocksDesignSystem.Fonts.body, _ref7 => {
  let {
    isError
  } = _ref7;
  return isError ? "red" : "#000";
});
const FieldLabelIconWrapper = styledComponents.styled.span.withConfig({
  displayName: "wrapFieldWithMeta__FieldLabelIconWrapper",
  componentId: "sc-1asy4oy-4"
})(["display:flex;font-size:14px;line-height:1;margin-left:auto;padding-left:8px;svg{width:14px;height:14px;flex-shrink:0;}"]);
const FieldError = styledComponents.styled.span.withConfig({
  displayName: "wrapFieldWithMeta__FieldError",
  componentId: "sc-1asy4oy-5"
})(["display:block;color:red;font-size:var(--tina-font-size-1);margin-top:8px;font-weight:var(--tina-font-weight-regular);"]);
const FieldInputWrapper = styledComponents.styled.div.withConfig({
  displayName: "wrapFieldWithMeta__FieldInputWrapper",
  componentId: "sc-1asy4oy-6"
})(["display:flex;justify-content:flex-end;align-items:center;", ";min-height:28px;"], _ref8 => {
  let {
    layout
  } = _ref8;
  return layout === "row" ? styledComponents.css(["flex-grow:1;"]) : styledComponents.css(["width:100%;"]);
});

const parse$1 = value => value && +value;

const NumberField = wrapFieldsWithMeta(_ref => {
  let {
    input,
    field
  } = _ref;
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

function TextField(_ref) {
  let {
    input,
    field,
    noWrap
  } = _ref;
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
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Input, _extends__default["default"]({}, restInputProperties, inputProps, {
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

const CUSTOM_OPTION_VALUE = "__custom__";
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
function useTokenTypes() {
  const editorContext = useEditorContext();
  const tokenTypes = Object.fromEntries(Object.entries(editorContext.types).filter(typeDefinitionEntry => {
    return typeDefinitionEntry[1].type === "token";
  }));
  return tokenTypes;
}
function TokenFieldComponent(_ref) {
  let {
    input,
    field
  } = _ref;
  const editorContext = useEditorContext();
  const tokenTypes = useTokenTypes();
  const tokenTypeDefinition = tokenTypes[field.schemaProp.type];
  const normalizeCustomValue = field.normalizeCustomValue || (x => x);
  const allowCustom = field.allowCustom ?? false;
  const extraValues = field.extraValues ?? [];
  const [inputValue, setInputValue] = React.useState(isMixedFieldValue(input.value) ? "" : input.value?.value.toString() ?? "");
  const customValueTextFieldRef = React.useRef(null);
  const options = Object.entries(field.tokens).map(_ref2 => {
    let [tokenId, tokenValue] = _ref2;
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
  if (!isMixedFieldValue(input.value) && typeof input.value.tokenId === "string" && !field.tokens[input.value.tokenId]) {
    options.unshift({
      id: input.value.tokenId,
      label: `(removed) ${input.value.tokenId}`
    });
  }
  const isExtraValueSelected = !isMixedFieldValue(input.value) && !input.value.tokenId && extraValuesIncludes(extraValues, easyblocksCore.responsiveValueGetDefinedValue(input.value.value, editorContext.breakpointIndex, editorContext.devices, easyblocksCore.getDevicesWidths(editorContext.devices) /** FOR NOW TOKENS ARE RELATIVE TO SCREEN **/));
  const shouldShowCustomValueInput = !isMixedFieldValue(input.value) && !(input.value.tokenId || isExtraValueSelected) && allowCustom;
  const selectValue = isMixedFieldValue(input.value) ? MIXED_VALUE : input.value.tokenId ?? (isExtraValueSelected ? input.value.value : CUSTOM_OPTION_VALUE);
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
      setInputValue(value);
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
  const customInputElement = shouldShowCustomValueInput ? /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
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
  }) : /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Input, {
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
    align: "right"
  })) : null;
  if (tokenTypeDefinition.token === "colors") {
    return /*#__PURE__*/React__default["default"].createElement(React.Fragment, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Select, {
      value: selectValue,
      onChange: onSelectChange
    }, isMixedFieldValue(input.value) && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(SelectColorTokenItem, {
      value: MIXED_VALUE,
      isDisabled: true
    }, "Mixed"), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectSeparator, null)), /*#__PURE__*/React__default["default"].createElement(React.Fragment, null, options.map(o => {
      return /*#__PURE__*/React__default["default"].createElement(SelectColorTokenItem, {
        key: o.id,
        value: o.id
        // Color tokens are always strings
        ,
        previewColor: field.tokens[o.id]?.value ?? o.id
      }, o.label);
    }), allowCustom && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectSeparator, null), /*#__PURE__*/React__default["default"].createElement(SelectColorTokenItem, {
      value: CUSTOM_OPTION_VALUE,
      previewColor: selectValue === CUSTOM_OPTION_VALUE ? input.value.value : undefined
    }, "Custom")))), customInputElement);
  }
  return /*#__PURE__*/React__default["default"].createElement(Root, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Select, {
    value: selectValue,
    onChange: onSelectChange
  }, isMixedFieldValue(input.value) && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectItem, {
    value: MIXED_VALUE,
    isDisabled: true
  }, "Mixed"), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectSeparator, null)), selectValue === CUSTOM_OPTION_VALUE && !allowCustom && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectItem, {
    value: CUSTOM_OPTION_VALUE,
    isDisabled: true
  }, "Custom"), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectSeparator, null)), /*#__PURE__*/React__default["default"].createElement(React.Fragment, null, options.map(o => {
    return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectItem, {
      key: o.id,
      value: o.id
    }, o.label);
  }), allowCustom && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectSeparator, null), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectItem, {
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
const Root = styledComponents.styled.div.withConfig({
  displayName: "TokenFieldPlugin__Root",
  componentId: "sc-1hbwipe-0"
})(["display:flex;flex-direction:column;align-items:flex-end;"]);
const TokenFieldPlugin = {
  name: "token",
  type: "token",
  Component: wrapFieldsWithMeta(TokenFieldComponent)
};
const SelectColorTokenItem = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectItem, {
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

const RICH_TEXT_PART_CONFIG_PATH_REGEXP = /\.elements\.[a-z(\-_A-Z)?]+\.\d+(\.elements\.\d+){2,3}(\.\{\d+,\d+\})?$/;
function isConfigPathRichTextPart(configPath) {
  return RICH_TEXT_PART_CONFIG_PATH_REGEXP.test(configPath);
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

function mergeCommonFields(_ref) {
  let {
    fields
  } = _ref;
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

const BlockField = _ref => {
  let {
    field,
    input,
    isLabelHidden
  } = _ref;
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
      minHeight: "28px"
    }
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Typography, null, field.label || field.name)), /*#__PURE__*/React__default["default"].createElement("div", {
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
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonGhost, {
    onClick: () => {
      if (editorContext.focussedField.some(isConfigPathRichTextPart)) {
        input.onChange([]);
      } else {
        actions.removeItems(paths);
      }
    },
    icon: easyblocksDesignSystem.Icons.Remove,
    "aria-label": "Remove"
  }))), config === null && (isMixed ? /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ThumbnailButton, {
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
function AddButton$1(_ref2) {
  let {
    onAdd
  } = _ref2;
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonGhost, {
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
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Icons.Add, {
    size: 16
  })), "Add"));
}
const SubComponentPanelButton = _ref3 => {
  let {
    paths,
    isExpanded,
    onExpand,
    onCollapse
  } = _ref3;
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
  return showError ? /*#__PURE__*/React__default["default"].createElement(Error$2, null, label) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ThumbnailButton, {
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
const Error$2 = styledComponents.styled.div.withConfig({
  displayName: "BlockFieldPlugin__Error",
  componentId: "sc-5mryxt-0"
})(["", " padding:7px 6px 7px;color:hsl(0deg 0% 50% / 0.8);white-space:normal;background:hsl(0deg 100% 50% / 0.2);margin-right:10px;border-radius:2px;"], easyblocksDesignSystem.Fonts.body);
const PanelContext = /*#__PURE__*/React__default["default"].createContext(undefined);
function Panel(_ref4) {
  let {
    onCollapse,
    isExpanded,
    paths
  } = _ref4;
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
const PanelBody = styledComponents.styled.div.withConfig({
  displayName: "BlockFieldPlugin__PanelBody",
  componentId: "sc-5mryxt-1"
})(["background:white;position:relative;height:100%;overflow-y:auto;"]);
const GroupPanelKeyframes = styledComponents.keyframes(["0%{transform:translate3d( 100%,0,0 );}100%{transform:translate3d( 0,0,0 );}"]);
const GroupPanel = styledComponents.styled.div.withConfig({
  displayName: "BlockFieldPlugin__GroupPanel",
  componentId: "sc-5mryxt-2"
})(["position:absolute;width:100%;top:0;bottom:0;left:0;overflow:hidden;pointer-events:", ";> *{", ";", ";}"], p => p.isExpanded ? "all" : "none", p => p.isExpanded && styledComponents.css(["animation-name:", ";animation-duration:150ms;animation-delay:0ms;animation-iteration-count:1;animation-timing-function:ease-out;animation-fill-mode:backwards;"], GroupPanelKeyframes), p => !p.isExpanded && styledComponents.css(["transition:transform 150ms ease-out;transform:translate3d(100%,0,0);"]));

function IdentityField(_ref) {
  let {
    input,
    field
  } = _ref;
  const editorContext = useEditorContext();
  const panelContext = React.useContext(PanelContext);
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
  function handleRemove() {
    if (isNonRemovable) {
      return;
    }
    editorContext.actions.removeItems(configPaths);
  }
  const titleContent = /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "2px"
    }
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Typography, {
    style: {
      lineHeight: "14px",
      fontWeight: "700"
    }
  }, componentDefinition?.label ?? componentDefinition?.id), !isNonChangable && /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Icons.ChevronDown, {
    size: 16
  }));
  return /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      minHeight: "28px",
      padding: "10px"
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      flex: "1 0"
    }
  }, isWithinNestedPanel && /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonGhost, {
    icon: easyblocksDesignSystem.Icons.ChevronLeft,
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
  }, titleContent), !isNonChangable && /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonGhost, {
    onClick: handleChangeComponentType
  }, titleContent), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonGhost, {
    "aria-label": "Remove component",
    icon: easyblocksDesignSystem.Icons.Remove,
    onClick: handleRemove,
    style: {
      marginLeft: "auto",
      opacity: isNonRemovable ? 0 : 1,
      pointerEvents: isNonRemovable ? "none" : "auto"
    }
  })));
}
const IdentityFieldPlugin = {
  name: "identity",
  Component: IdentityField
};

function MissingWidget(props) {
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Typography, null, "Missing widget for type \"", props.type, "\".");
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
  return Object.entries(compoundResourceValues).filter(_ref => {
    let [, r] = _ref;
    return r.type === type;
  }).map(_ref2 => {
    let [key, r] = _ref2;
    return {
      key,
      ...r
    };
  });
}
function CompoundResourceValueSelect(props) {
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Select, {
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
    return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectItem, {
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
    renderLabel: isValueDifferentFromMainBreakpoint ? _ref => {
      let {
        label
      } = _ref;
      return /*#__PURE__*/React__default["default"].createElement(ResetButton, _extends__default["default"]({
        "aria-label": "Revert to auto"
      }, triggerProps), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Icons.Reset, null), /*#__PURE__*/React__default["default"].createElement(ResetButtonLabel, null, label), isOpen && /*#__PURE__*/React__default["default"].createElement(Tooltip, tooltipProps, /*#__PURE__*/React__default["default"].createElement(TooltipArrow, arrowProps), /*#__PURE__*/React__default["default"].createElement(TooltipBody, null, "Revert to auto")));
    } : undefined
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
const AutoLabel = styledComponents.styled.div.withConfig({
  displayName: "ResponsiveFieldPlugin__AutoLabel",
  componentId: "sc-1m7fdh0-0"
})(["", ";color:", ";text-align:", ";&:hover{color:black;cursor:pointer;text-decoration:underline;}"], easyblocksDesignSystem.Fonts.body, easyblocksDesignSystem.Colors.black40, props => props.align);
const ResetButton = styledComponents.styled.button.withConfig({
  displayName: "ResponsiveFieldPlugin__ResetButton",
  componentId: "sc-1m7fdh0-1"
})(["display:flex;align-items:center;gap:4px;background-color:transparent;border:0;padding:0;color:", ";cursor:pointer;"], easyblocksDesignSystem.Colors.purple);
const ResetButtonLabel = styledComponents.styled.span.withConfig({
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
      return `auto: ${typeof value.value === "number" ? Math.round(value.value * 100) / 100 : value.value}`;
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
const SVGPicker = wrapFieldsWithMeta(_ref => {
  let {
    input,
    meta,
    field
  } = _ref;
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

const Slider = wrapFieldsWithMeta(_ref => {
  let {
    input,
    field
  } = _ref;
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.RangeSlider, _extends__default["default"]({}, input, {
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
  Component: wrapFieldsWithMeta(function LocalField(_ref) {
    let {
      field,
      input
    } = _ref;
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

const StyledRadioItem = styledComponents.styled(RadixRadioGroup__namespace.Item).withConfig({
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
function PositionPickerInput(_ref) {
  let {
    position,
    onPositionChange
  } = _ref;
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
const PositionIndicator = styledComponents.styled.div.withConfig({
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

function createFieldController(_ref) {
  let {
    field,
    editorContext,
    format = v => v,
    parse = v => v
  } = _ref;
  const {
    actions,
    contextParams,
    form,
    locales,
    focussedField
  } = editorContext;
  const normalizedFieldName = toArray(field.name);
  return {
    onChange(mainNewValue) {
      for (var _len = arguments.length, extraNewValues = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        extraNewValues[_key - 1] = arguments[_key];
      }
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
          const canvasIframe = document.getElementById("shopstory-canvas");
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
    _internals.traverseComponents(richTextConfig, context, _ref2 => {
      let {
        componentConfig
      } = _ref2;
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
function FieldBuilder(_ref) {
  let {
    form,
    field,
    noWrap,
    isLabelHidden
  } = _ref;
  const editorContext = useEditorContext();
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
    if (typeof field.label === "object") {
      field.label = field.label?.[editorContext.contextParams.locale] ?? field.label;
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
    console.log("not a string");
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
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Typography, null, "Unrecognized field type"));
}
const HorizontalLine = styledComponents.styled.div.withConfig({
  displayName: "fields-builder__HorizontalLine",
  componentId: "sc-ignixa-0"
})(["height:1px;margin-top:-1px;background-color:", ";"], easyblocksDesignSystem.Colors.black10);
function FieldsBuilder(_ref2) {
  let {
    form,
    fields
  } = _ref2;
  const editorContext = useEditorContext();
  const panelContext = React.useContext(PanelContext);
  const grouped = {};
  const ungrouped = [];
  fields.forEach(field => {
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
  const horizontalLine = /*#__PURE__*/React__default["default"].createElement(HorizontalLine, null);
  const identityField = fields.find(field => field.component === "identity");
  const breakpointIndex = panelContext ? editorContext.breakpointIndex : undefined;
  return /*#__PURE__*/React__default["default"].createElement(FieldsGroup, null, identityField !== undefined && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(FieldBuilder, {
    field: identityField,
    form: form
  }), horizontalLine), Object.keys(grouped).map(groupName => /*#__PURE__*/React__default["default"].createElement("div", {
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
  }))), horizontalLine);
}
function generateFieldKey(field, breakpointIndex) {
  const key = `${toArray(field.name).join("_")}_${field.schemaProp.type}${breakpointIndex ? `_${breakpointIndex}` : ""}`;
  return key;
}
const FieldWrapper = styledComponents.styled.div.withConfig({
  displayName: "fields-builder__FieldWrapper",
  componentId: "sc-ignixa-1"
})(["margin-bottom:", ";"], props => props.isLast ? "8px" : 0);
const FieldsGroupLabel = styledComponents.styled.div.withConfig({
  displayName: "fields-builder__FieldsGroupLabel",
  componentId: "sc-ignixa-2"
})(["display:flex;align-items:center;padding:20px 16px 10px 16px;", ";color:#000;"], easyblocksDesignSystem.Fonts.label);
const FieldsGroup = styledComponents.styled.div.withConfig({
  displayName: "fields-builder__FieldsGroup",
  componentId: "sc-ignixa-3"
})(["position:relative;display:block;width:100%;padding:0;white-space:nowrap;overflow-x:hidden;overflow-y:auto !important;"]);

const theme = styledComponents.css([":root{--tina-color-primary-light:#2296fe;--tina-color-primary:#2296fe;--tina-color-primary-dark:#0574e4;--tina-color-error-light:#eb6337;--tina-color-error:#ec4815;--tina-color-error-dark:#dc4419;--tina-color-warning-light:#f5e06e;--tina-color-warning:#e9d050;--tina-color-warning-dark:#d3ba38;--tina-color-success-light:#57c355;--tina-color-success:#3cad3a;--tina-color-success-dark:#249a21;--tina-color-grey-0:#ffffff;--tina-color-grey-1:#f6f6f9;--tina-color-grey-2:#edecf3;--tina-color-grey-3:#e1ddec;--tina-color-grey-4:#b2adbe;--tina-color-grey-5:#918c9e;--tina-color-grey-6:#716c7f;--tina-color-grey-7:#565165;--tina-color-grey-8:#433e52;--tina-color-grey-9:#363145;--tina-color-grey-10:#282828;--tina-radius-small:5px;--tina-radius-big:24px;--tina-padding-small:12px;--tina-padding-big:20px;--tina-font-size-0:12px;--tina-font-size-1:13px;--tina-font-size-2:15px;--tina-font-size-3:16px;--tina-font-size-4:18px;--tina-font-size-5:20px;--tina-font-size-6:22px;--tina-font-size-7:26px;--tina-font-size-8:32px;--tina-font-family:\"Inter\",sans-serif;--tina-font-weight-regular:400;--tina-font-weight-bold:600;--tina-shadow-big:0px 2px 3px rgba(0,0,0,0.05),0 4px 12px rgba(0,0,0,0.1);--tina-shadow-small:0px 2px 3px rgba(0,0,0,0.12);--tina-timing-short:85ms;--tina-timing-medium:150ms;--tina-timing-long:250ms;--tina-z-index-0:500;--tina-z-index-1:1000;--tina-z-index-2:1500;--tina-z-index-3:2000;--tina-z-index-4:2500;--tina-z-index-5:3000;--tina-sidebar-width:340px;--tina-sidebar-header-height:60px;--tina-toolbar-height:62px;}"]);
const GlobalStyles = styledComponents.createGlobalStyle(["", ";"], theme);
const tina_reset_styles = styledComponents.css(["*{font-family:\"Inter\",sans-serif;&::-webkit-scrollbar{width:8px;}::-webkit-scrollbar-track{background:transparent;border-left:1px solid var(--tina-color-grey-2);}&::-webkit-scrollbar-thumb{background-color:var(--tina-color-grey-3);border-radius:0;border:none;}}*,*:before,*:after{box-sizing:border-box;}hr{border-color:var(--tina-color-grey-2);color:var(--tina-color-grey-2);margin-bottom:var(--tina-padding-big);margin-left:calc(var(--tina-padding-big) * -1);margin-right:calc(var(--tina-padding-big) * -1);border-top:1px solid var(--tina-color-grey-2);border-bottom:none;height:0;box-sizing:content-box;}h1,h2,h3,h4,h5,h6,p{:not([class]){font-family:\"Inter\",sans-serif;&:first-child{margin-top:0;}&:last-child{margin-bottom:0;}}}td,th{padding:0;width:auto;height:auto;border:inherit;margin:0;}h1,h2,h3,h4,h5,h6{:not([class]){font-weight:var(--tina-font-weight-bold);}}h1:not([class]){font-size:var(--tina-font-size-8);}h2:not([class]){font-size:var(--tina-font-size-7);}h3:not([class]){font-size:var(--tina-font-size-5);}h4:not([class]){font-size:var(--tina-font-size-4);}h5:not([class]){font-size:var(--tina-font-size-3);}h6:not([class]){font-size:var(--tina-font-size-2);}"]);
const StyleReset = styledComponents.styled.div.withConfig({
  displayName: "Styles__StyleReset",
  componentId: "sc-1igvyu7-0"
})(["", ""], tina_reset_styles);

const Button = styledComponents.styled.button.withConfig({
  displayName: "Button",
  componentId: "sc-qplww2-0"
})(["text-align:center;border:0;border-radius:var(--tina-radius-big);box-shadow:var(--tina-shadow-small);background-color:var(--tina-color-grey-0);border:1px solid var(--tina-color-grey-2);color:var(--tina-color-primary);fill:var(--tina-color-primary);font-weight:var(--tina-font-weight-regular);cursor:pointer;font-size:var(--tina-font-size-1);height:40px;padding:0 var(--tina-padding-big);transition:all 85ms ease-out;&:hover{background-color:var(--tina-color-grey-1);}&:active{background-color:var(--tina-color-grey-2);outline:none;}", ";", ";", ";", ";", ";", ";"], p => p.disabled && styledComponents.css(["opacity:0.3;pointer:not-allowed;pointer-events:none;"]), p => p.primary && styledComponents.css(["background-color:var(--tina-color-primary);color:var(--tina-color-grey-0);fill:var(--tina-color-grey-0);border:none;&:hover{background-color:var(--tina-color-primary-light);}&:active{background-color:var(--tina-color-primary-dark);}"]), p => p.small && styledComponents.css(["height:32px;font-size:var(--tina-font-size-0);padding:0 var(--tina-padding-big);"]), p => p.margin && styledComponents.css(["&:not(:first-child){margin-left:8px;}"]), p => p.grow && styledComponents.css(["flex-grow:1;"]), p => p.busy && styledComponents.css(["cursor:wait;"]));
const ICON_BUTTON_SIZE = 18;
const ICON_SIZE = 18;
const IconButton = styledComponents.styled(Button).withConfig({
  displayName: "Button__IconButton",
  componentId: "sc-qplww2-1"
})(["padding:0;width:", "px;height:", "px;margin:0;position:relative;transform-origin:50% 50%;transition:all 150ms ease-out;padding:0;display:flex;flex-shrink:0;justify-content:center;align-items:center;svg{width:", "px;height:", "px;transition:all 150ms ease-out;}", ";"], ICON_BUTTON_SIZE, ICON_BUTTON_SIZE, ICON_SIZE, ICON_SIZE, props => props.open && styledComponents.css(["background-color:var(--tina-color-grey-0);border-color:var(--tina-color-grey-2);outline:none;fill:var(--tina-color-primary);svg{transform:rotate(45deg);}&:hover{background-color:var(--tina-color-grey-1);}&:active{background-color:var(--tina-color-grey-2);}"]));

function InlineSettings(_ref) {
  let {
    fields
  } = _ref;
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
    fields: fields
  }));
}
function SettingsContent(_ref2) {
  let {
    fields
  } = _ref2;
  const {
    form,
    focussedField
  } = useEditorContext();
  return /*#__PURE__*/React__default["default"].createElement(FormBody, {
    id: "sidebar-panels-root"
  }, /*#__PURE__*/React__default["default"].createElement(Wrapper$1, null, /*#__PURE__*/React__default["default"].createElement(FieldsBuilder, {
    form: form,
    fields: fields
  }), /*#__PURE__*/React__default["default"].createElement(SidebarFooter, {
    paths: focussedField
  })));
}
const FormBody = styledComponents.styled.div.withConfig({
  displayName: "inline-settings__FormBody",
  componentId: "sc-fe5cee-0"
})(["position:relative;flex:1 1 auto;display:flex;flex-direction:column;width:100%;height:100%;border-top:1px solid var(--tina-color-grey-2);background-color:white;"]);
const Wrapper$1 = styledComponents.styled.div.withConfig({
  displayName: "inline-settings__Wrapper",
  componentId: "sc-fe5cee-1"
})(["display:block;margin:0 auto;width:100%;height:100%;overflow-y:auto;"]);

const Error$1 = styledComponents.styled.div.withConfig({
  displayName: "EditorSidebar__Error",
  componentId: "sc-xkxfa3-0"
})(["", " padding:7px 6px 7px;color:hsl(0deg 0% 50% / 0.8);white-space:normal;background:hsl(0deg 100% 50% / 0.2);margin-right:10px;border-radius:2px;margin:16px;"], easyblocksDesignSystem.Fonts.body);
const EditorSidebar = props => {
  const {
    focussedField,
    form
  } = props;
  const editorContext = useEditorContext();
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
    fields: mergedFields
  }));
};

const TOP_BAR_HEIGHT = 40;
const TopBar = styledComponents.styled.div.withConfig({
  displayName: "EditorTopBar__TopBar",
  componentId: "sc-726nw9-0"
})(["position:relative;box-sizing:border-box;background-color:white;border-bottom:1px solid #eaeaea;padding:0 64px;min-height:", "px;display:flex;flex-direction:row;justify-content:center;align-items:center;"], TOP_BAR_HEIGHT);
const Label = styledComponents.styled.div.withConfig({
  displayName: "EditorTopBar__Label",
  componentId: "sc-726nw9-1"
})(["background:", ";height:24px;", " display:flex;justify-content:center;align-items:center;padding-left:12px;padding-right:12px;border-radius:12px;color:white;"], easyblocksDesignSystem.Colors.purple, easyblocksDesignSystem.Fonts.label);
const TopBarLeft = styledComponents.styled.div.withConfig({
  displayName: "EditorTopBar__TopBarLeft",
  componentId: "sc-726nw9-2"
})(["position:absolute;top:0;left:4px;height:100%;display:flex;flex-direction:row;align-items:center;gap:4px;"]);
const TopBarRight = styledComponents.styled.div.withConfig({
  displayName: "EditorTopBar__TopBarRight",
  componentId: "sc-726nw9-3"
})(["position:absolute;top:0;right:8px;height:100%;display:flex;flex-direction:row;align-items:center;gap:16px;"]);
const TopBarCenter = styledComponents.styled.div.withConfig({
  displayName: "EditorTopBar__TopBarCenter",
  componentId: "sc-726nw9-4"
})(["position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"]);
const ImageContainer$1 = styledComponents.styled.div.withConfig({
  displayName: "EditorTopBar__ImageContainer",
  componentId: "sc-726nw9-5"
})(["position:relative;width:20px;height:20px;"]);
const Image = styledComponents.styled.img.withConfig({
  displayName: "EditorTopBar__Image",
  componentId: "sc-726nw9-6"
})(["width:100%;height:100%;object-fit:contain;"]);
const EditorTopBar = _ref => {
  let {
    onClose,
    onSaveDocument,
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
    readOnly
  } = _ref;
  const headingRef = React.useRef(null);
  const router = new URLSearchParams(window.location.search);
  const themeId = router.get("themeId");
  const shopId = router.get("shopId");
  return /*#__PURE__*/React__default["default"].createElement(TopBar, {
    ref: headingRef
  }, /*#__PURE__*/React__default["default"].createElement(TopBarLeft, null, !hideCloseButton && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonGhost, {
    icon: easyblocksDesignSystem.Icons.Close,
    hideLabel: true,
    onClick: onClose
  }, "Close"), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      height: "100%",
      background: easyblocksDesignSystem.Colors.black10,
      width: 1
    }
  })), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonGhost, {
    icon: easyblocksDesignSystem.Icons.Undo,
    hideLabel: true,
    onClick: () => {
      onUndo();
    }
  }, "Undo"), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonGhost, {
    icon: easyblocksDesignSystem.Icons.Redo,
    hideLabel: true,
    onClick: () => {
      onRedo();
    }
  }, "Redo"), readOnly && /*#__PURE__*/React__default["default"].createElement(Label, null, "Read-Only"), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonDanger, {
    className: "cursor-pointer",
    component: "label",
    onClick: () => onSaveDocument?.()
  }, "Save")), /*#__PURE__*/React__default["default"].createElement(TopBarCenter, null, /*#__PURE__*/React__default["default"].createElement(DeviceSwitch, {
    devices: devices,
    deviceId: viewport,
    onDeviceChange: onViewportChange
  })), /*#__PURE__*/React__default["default"].createElement(TopBarRight, null, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      gap: "6px",
      alignItems: "center"
    }
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Select, {
    value: locale,
    onChange: onLocaleChange
  }, locales.map(l => /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.SelectItem, {
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
  }, l.icon ? /*#__PURE__*/React__default["default"].createElement(ImageContainer$1, null, /*#__PURE__*/React__default["default"].createElement(Image, {
    src: l.icon,
    alt: l.name
  })) : null, l.name)))), /*#__PURE__*/React__default["default"].createElement("a", {
    href: `/?previewId=${themeId}&shopId=${shopId}`,
    target: "_blank"
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonPrimary, {
    component: "label",
    className: "cursor-pointer"
  }, "Preview")), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Typography, {
    variant: "body",
    component: "label",
    htmlFor: "easyblocks-edit-mode-button"
  }, "Edit mode"), " ", /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Toggle, {
    name: "easyblocks-edit-mode-button",
    checked: isEditing,
    onChange: () => {
      onIsEditingChange();
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
function DeviceSwitch(_ref2) {
  let {
    deviceId,
    devices,
    onDeviceChange
  } = _ref2;
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ToggleGroup, {
    value: deviceId,
    onChange: deviceId => {
      if (deviceId === "") {
        return;
      }
      onDeviceChange(deviceId);
    }
  }, devices.map(d => {
    if (d.hidden) {
      return null;
    }
    return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Tooltip, {
      key: d.id
    }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.TooltipTrigger, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ToggleGroupItem, {
      value: d.id
    }, DEVICE_ID_TO_ICON[d.id])), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.TooltipContent, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Typography, {
      color: "white"
    }, d.label ?? d.id)));
  }), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Tooltip, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.TooltipTrigger, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ToggleGroupItem, {
    value: "fit-screen"
  }, DEVICE_ID_TO_ICON["fit-screen"])), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.TooltipContent, null, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Typography, {
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
  definitions.forEach(_ref => {
    let {
      type
    } = _ref;
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

const ModalPicker = _ref => {
  let {
    config,
    onClose,
    pickers
  } = _ref;
  const editorContext = useEditorContext();
  const {
    form
  } = editorContext;
  const split = config.path.split("."); // TODO: right now only for collections
  const parentPath = split.slice(0, split.length - 1).join(".");
  const fieldName = split[split.length - 1];
  const parentData = dotNotationGet(form.values, parentPath);
  const schemaProp = _internals.findComponentDefinition(parentData, editorContext).schema.find(x => x.prop === fieldName);
  const componentTypes = config.componentTypes ?? schemaProp.accepts;
  const components = unrollAcceptsFieldIntoComponents(componentTypes, editorContext);
  let templatesDictionary = undefined;
  if (editorContext.templates) {
    templatesDictionary = {};
    components.forEach(component => {
      templatesDictionary[component.id] = {
        component,
        templates: []
      };
      editorContext.templates.forEach(template => {
        if (component.id === template.entry._component) {
          templatesDictionary[component.id].templates.push(template);
        }
      });
      if (templatesDictionary[component.id].templates.length === 0) {
        delete templatesDictionary[component.id];
      }
    });
  }
  const picker = schemaProp.picker ?? "compact";

  // const defaultPickerMode =
  //   accepts.includes("section") || componentTypes.includes("card")
  //     ? "big"
  //     : "small";
  //
  // const pickerMode = schemaProp.picker || defaultPickerMode;

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
  return pickers?.[picker] ? pickers[picker]({
    isOpen: true,
    onClose: onModalClose,
    templates: templatesDictionary,
    mode: picker
  }) : /*#__PURE__*/React__default["default"].createElement("div", null, "Unknown picker: ", picker);
};

const TemplateModal = props => {
  const [error, setError] = React.useState(null);
  const mode = props.action.mode;
  const backend = props.backend;
  const editorContext = useEditorContext();
  const [isLoadingEdit, setLoadingEdit] = React.useState(false);
  const [isLoadingDelete, setLoadingDelete] = React.useState(false);
  const toaster = easyblocksDesignSystem.useToaster();
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
  const canSend = label.trim() !== "";
  const ctaLabel = "Save";
  React.useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Modal, {
    title: `Template details`,
    isOpen: true,
    onRequestClose: () => {
      props.onClose();
    },
    mode: "center-small",
    headerLine: true
  }, /*#__PURE__*/React__default["default"].createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setError(null);
      if (!canSend) {
        return;
      }
      setLoadingEdit(true);
      if (mode === "create") {
        const createAction = props.action;
        backend.templates.create({
          label,
          group,
          thumbnail,
          thumbnailLabel,
          entry: createAction.config,
          width: createAction.width,
          widthAuto: createAction.widthAuto
        }).then(newTemplate => {
          editorContext.syncTemplates({
            mode: "create",
            template: {
              id: newTemplate.id,
              ...template
            }
          });
          toaster.success("Template created!");
          props.onClose();
        }).catch(() => {
          toaster.error("Couldn't save template");
        }).finally(() => {
          setLoadingEdit(false);
        });
      } else {
        backend.templates.update({
          label,
          group,
          thumbnail,
          thumbnailLabel,
          id: template.id
        }).then(() => {
          editorContext.syncTemplates({
            mode: "edit",
            template: template
          });
          toaster.success("Template updated!");
          props.onClose();
        }).catch(() => {
          toaster.error("Couldn't update template");
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
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.FormElement, {
    name: "label",
    label: "Name"
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Input, {
    placeholder: "My template name",
    required: true,
    value: label,
    onChange: e => {
      setTemplate({
        ...template,
        label: e.target.value
      });
    },
    withBorder: true,
    autoFocus: true
  })), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.FormElement, {
    name: "group",
    label: "Group"
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Input, {
    placeholder: "My template group",
    value: group,
    onChange: e => {
      setTemplate({
        ...template,
        group: e.target.value
      });
    },
    withBorder: true,
    autoFocus: true
  })), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.FormElement, {
    name: "thumbnail",
    label: "Thumbnail url"
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Input, {
    placeholder: "My template thumbnail url",
    value: thumbnail,
    onChange: e => {
      setTemplate({
        ...template,
        thumbnail: e.target.value
      });
    },
    withBorder: true,
    autoFocus: true
  })), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.FormElement, {
    name: "thumbnailLabel",
    label: "Thumbnail label"
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Input, {
    placeholder: "My template thumbnail label",
    value: thumbnailLabel,
    onChange: e => {
      setTemplate({
        ...template,
        thumbnailLabel: e.target.value
      });
    },
    withBorder: true,
    autoFocus: true
  })), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", null, mode === "edit" && /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonDanger, {
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
        toaster.success("Template deleted");
        props.onClose();
      }).catch(() => {
        toaster.error("Couldn't delete template");
      }).finally(() => {
        setLoadingDelete(false);
      });
    },
    isLoading: isLoadingDelete
  }, "Delete")), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonPrimary, {
    type: "submit",
    disabled: !canSend,
    isLoading: isLoadingEdit
  }, ctaLabel)))));
};

function duplicateItem(form, _ref, compilationContext) {
  let {
    name,
    sourceIndex,
    targetIndex
  } = _ref;
  // Placeholders are not copyable
  if (isPlaceholder(name + "." + sourceIndex, form.values)) {
    return;
  }
  const configToDuplicate = dotNotationGet(form.values, name + "." + sourceIndex);
  form.mutators.insert(name, targetIndex, _internals.duplicateConfig(configToDuplicate, compilationContext));
}
function pasteItems(_ref2) {
  let {
    what,
    where,
    resolveDestination,
    pasteCommand
  } = _ref2;
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
function moveItem(form, _ref3) {
  let {
    from,
    to,
    name
  } = _ref3;
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
function removeItem(form, _ref4) {
  let {
    index,
    name
  } = _ref4;
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
function removeItems(form, fieldNamesToRemove, compilationContext) {
  const removableFieldNames = fieldNamesToRemove.filter(fieldName => isFieldRemovable(fieldName, form, compilationContext));
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
    const definition = _internals.findComponentDefinitionById(templateId, compilationContext);
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
  return Object.fromEntries(Object.entries(fieldsIndicesGroupedByParentPath).map(_ref5 => {
    let [parentPath, indices] = _ref5;
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
const shiftPath = function (originalPath, shiftingPath) {
  let direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "downward";
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
  return Object.entries(lastOfEachParent).map(_ref6 => {
    let [key, value] = _ref6;
    return `${key}.${value}`;
  });
}

function reconcile(_ref) {
  let {
    context,
    templateId,
    fieldName
  } = _ref;
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
const insertCommand = _ref => {
  let {
    context,
    form,
    schema,
    templateId
  } = _ref;
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
const fixIndexInCollection = function () {
  let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  let schema = arguments.length > 1 ? arguments[1] : undefined;
  if (schema?.type === "component-collection") {
    return index + 1;
  }
  return index;
};
function destinationResolver(_ref) {
  let {
    form,
    context
  } = _ref;
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
        const slotSchema = definition.schema.find(_ref2 => {
          let {
            prop
          } = _ref2;
          return prop === slot;
        });
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

function editorVariable(name) {
  return `--shopstory-editor-${name}`;
}
const BEFORE_ADD_BUTTON_DISPLAY = editorVariable("before-add-button-display");
const BEFORE_ADD_BUTTON_TOP = editorVariable("before-add-button-top");
const BEFORE_ADD_BUTTON_LEFT = editorVariable("before-add-button-left");
const AFTER_ADD_BUTTON_DISPLAY = editorVariable("after-add-button-display");
const AFTER_ADD_BUTTON_TOP = editorVariable("after-add-button-top");
const AFTER_ADD_BUTTON_LEFT = editorVariable("after-add-button-left");

function AddButton(_ref) {
  let {
    position,
    index,
    offset,
    onClick
  } = _ref;
  const [isOpen, setIsOpen] = React__default["default"].useState(false);
  const addBlockButtonRef = React__default["default"].useRef(null);
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
  return /*#__PURE__*/React__default["default"].createElement(AddButtonWrapper, {
    index: index,
    offset: offset,
    position: position,
    isOpen: isOpen
  }, /*#__PURE__*/React__default["default"].createElement(AddIconButton, {
    ref: addBlockButtonRef,
    onClick: handleOpenBlockMenu,
    isOpen: isOpen,
    primary: true,
    small: true
  }, /*#__PURE__*/React__default["default"].createElement("svg", {
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
const AddIconButton = styledComponents.styled(IconButton).withConfig({
  displayName: "AddButton__AddIconButton",
  componentId: "sc-79bcl2-0"
})(["display:flex;align-items:center;&:focus{outline:none !important;}", ";"], props => props.isOpen && styledComponents.css(["pointer-events:none;"]));
const AddButtonWrapper = styledComponents.styled.div.withConfig({
  displayName: "AddButton__AddButtonWrapper",
  componentId: "sc-79bcl2-1"
})(["position:absolute;top:var( ", " );left:var( ", " );display:var( ", ",none );pointer-events:all;"], _ref2 => {
  let {
    position
  } = _ref2;
  return position === "before" ? BEFORE_ADD_BUTTON_TOP : AFTER_ADD_BUTTON_TOP;
}, _ref3 => {
  let {
    position
  } = _ref3;
  return position === "before" ? BEFORE_ADD_BUTTON_LEFT : AFTER_ADD_BUTTON_LEFT;
}, _ref4 => {
  let {
    position
  } = _ref4;
  return position === "before" ? BEFORE_ADD_BUTTON_DISPLAY : AFTER_ADD_BUTTON_DISPLAY;
});

const Wrapper = styledComponents.styled.div.withConfig({
  displayName: "SelectionFramestyles__Wrapper",
  componentId: "sc-xqih8j-0"
})(["position:absolute;top:0;left:0;bottom:0;right:0;display:grid;place-items:center;pointer-events:none;"]);
const FrameWrapper = styledComponents.styled.div.attrs(_ref => {
  let {
    width,
    height,
    transform
  } = _ref;
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

function SelectionFrame(_ref) {
  let {
    width,
    height,
    transform
  } = _ref;
  const editorContext = useEditorContext();
  const {
    focussedField,
    form,
    actions
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
  })));
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
    isUserDefined: false
  };
}
function getDefaultTokenId(tokens) {
  return Object.entries(tokens).find(_ref => {
    let [, value] = _ref;
    return value.isDefault;
  })?.[0];
}
async function getTemplates(editorContext) {
  let configTemplates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  const remoteUserDefinedTemplates = !editorContext.disableCustomTemplates ? await editorContext.backend.templates.getAll() : [];
  return getTemplatesInternal(editorContext, configTemplates, remoteUserDefinedTemplates);
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
  return configMap(config, editorContext, _ref2 => {
    let {
      value,
      schemaProp
    } = _ref2;
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

class Form {
  loading = false;
  constructor(_ref) {
    let {
      id,
      label,
      fields,
      actions,
      buttons,
      reset,
      loadInitialValues,
      onChange,
      ...options
    } = _ref;
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
  Object.entries(values).forEach(_ref2 => {
    let [path, value] = _ref2;
    form.change(path, value);
  });
}
function updateSelectively(form, values, prefix) {
  const activePath = form.getState().active;
  Object.entries(values).forEach(_ref3 => {
    let [name, value] = _ref3;
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
function useForm(_ref) {
  let {
    loadInitialValues,
    ...options
  } = _ref;
  let watch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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

/**
 * Outputs comparable config that is FULL COPY of config
 */
function getConfigSnapshot(config) {
  const strippedConfig = deepClone(config);
  return strippedConfig;
}

function addLocalizedFlag(config, context) {
  return configMap(config, context, _ref => {
    let {
      value,
      schemaProp
    } = _ref;
    if (schemaProp.type === "text" && value.id?.startsWith("local.") || schemaProp.type === "component-collection-localised") {
      return {
        __localized: true,
        ...value
      };
    }
    return value;
  });
}

function removeLocalizedFlag(config, context) {
  return configMap(config, context, _ref => {
    let {
      value,
      schemaProp
    } = _ref;
    if (schemaProp.type === "text" && value?.id.startsWith("local.") || schemaProp.type === "component-collection-localised") {
      delete value.__localized;
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
function useDataSaver(initialDocument, editorContext) {
  const remoteDocument = React.useRef(initialDocument);
  const toaster = easyblocksDesignSystem.useToaster();

  /**
   * This state variable is going to be used ONLY for comparison with local config in case of missing document.
   * It's not going to change at any time during the lifecycle of this hook.
   */
  const [initialConfigInCaseOfMissingDocument] = React.useState(deepClone(editorContext.form.values));
  const onTickRef = React.useRef(() => Promise.resolve());
  const onTick = async () => {
    // Playground mode is a special case, we don't want to save anything
    if (editorContext.readOnly) {
      return;
    }
    const localConfig = editorContext.form.values;
    const localConfigSnapshot = getConfigSnapshot(localConfig);
    const previousConfig = remoteDocument.current ? remoteDocument.current.entry : initialConfigInCaseOfMissingDocument;
    const previousConfigSnapshot = getConfigSnapshot(previousConfig);
    const isConfigTheSame = deepCompare(localConfigSnapshot, previousConfigSnapshot);
    const configToSaveWithLocalisedFlag = addLocalizedFlag(localConfigSnapshot, editorContext);
    async function runSaveCallback() {
      await editorContext.save(remoteDocument.current);
    }

    // New document
    if (remoteDocument.current === null) {
      console.debug("New document");

      // There must be at least one change in order to create a new document, we're not storing empty temporary documents
      if (isConfigTheSame) {
        console.debug("no change -> bye");
        return;
      }
      console.debug("change detected! -> create");
      const newDocument = await editorContext.backend.documents.create({
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
    }
    // Document update
    else {
      console.debug("Existing document");
      try {
        const latestDocument = await editorContext.backend.documents.get({
          id: remoteDocument.current.id
        });
        const latestRemoteDocumentVersion = latestDocument.version ?? -1;
        const isNewerDocumentVersionAvailable = remoteDocument.current.version < latestRemoteDocumentVersion;

        // Newer version of document is available
        if (isNewerDocumentVersionAvailable) {
          console.debug("new remote version detected, updating");
          if (!latestDocument) {
            throw new Error("unexpected error");
          }
          const latestConfig = removeLocalizedFlag(latestDocument.entry, editorContext);
          editorContext.actions.runChange(() => {
            editorContext.form.change("", latestConfig);
            return [];
          });
          remoteDocument.current = latestDocument;

          // Notify when local config was modified
          if (!isConfigTheSame) {
            console.debug("there were local changes -> notify");
            editorContext.actions.notify("Remote changes detected, local changes have been overwritten.");
          }
          return;
        }
        // No remote change occurred
        else {
          if (isConfigTheSame) {
            console.debug("no local changes -> bye");
            // Let's do nothing, no remote and local change
          } else {
            console.debug("updating the document", remoteDocument.current.id);
            const updatedDocument = await editorContext.backend.documents.update({
              id: remoteDocument.current.id,
              entry: configToSaveWithLocalisedFlag,
              version: remoteDocument.current.version
            });
            if (updatedDocument?.id) {
              toaster.success("Saved.");
            } else {
              toaster.error("Error saving... Please try again.");
            }
            remoteDocument.current.entry = localConfigSnapshot;
            remoteDocument.current.version = updatedDocument.version;
            await runSaveCallback();
          }
        }
      } catch (error) {
        toaster.error("Error saving... Please try again!");
      }
    }
  };

  // We're keeping this in ref, because of setInterval keeping initial closure
  onTickRef.current = onTick;
  const inProgress = React.useRef(false);
  const wasSaveNowCalled = React.useRef(false);
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
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return {
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
      await onTick();
    }
  };
}

const GLOBAL_SHORTCUTS_KEYS = ["Delete", "Backspace", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "l", "L"];
const DATA_TRANSFER_FORMAT = "text/x-shopstory";
function useEditorGlobalKeyboardShortcuts(editorContext) {
  let isDeleting = false;
  React.useEffect(() => {
    const {
      focussedField: focusedFields,
      actions
    } = editorContext;
    function handleKeydown(event) {
      if (isTargetInputElement(event.target)) {
        return;
      }
      if (!isGlobalShortcut(event) || !isAnyFieldSelected(focusedFields)) {
        return;
      }
      if ((event.key === "Delete" || event.key === "Backspace") && !isDeleting) {
        isDeleting = true;
        actions.removeItems(focusedFields);
        setTimeout(() => {
          isDeleting = false;
        }, 2000);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        actions.moveItems(focusedFields, "top");
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        actions.moveItems(focusedFields, "bottom");
      } else if (event.key.toUpperCase() === "L") {
        actions.logSelectedItems();
      }
    }
    function handleCopy(event) {
      if (!canHandleCopyPaste(focusedFields, event)) {
        return;
      }
      const configs = getConfigsToCopy(focusedFields, editorContext);
      event.preventDefault();
      event.clipboardData?.setData(DATA_TRANSFER_FORMAT, JSON.stringify(configs));
    }
    function handleCut(event) {
      if (!canHandleCopyPaste(focusedFields, event)) {
        return;
      }
      const configs = getConfigsToCopy(focusedFields, editorContext);
      event.preventDefault();
      event.clipboardData?.setData(DATA_TRANSFER_FORMAT, JSON.stringify(configs));
      actions.removeItems(focusedFields);
    }
    function handlePaste(event) {
      if (!canHandleCopyPaste(focusedFields, event)) {
        return;
      }
      const rawData = event.clipboardData?.getData(DATA_TRANSFER_FORMAT);
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
}

function useEditorHistory(_ref) {
  let {
    onChange
  } = _ref;
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

const ContentContainer = styledComponents.styled.div.withConfig({
  displayName: "Editor__ContentContainer",
  componentId: "sc-t95yuf-0"
})(["position:relative;flex:1 1 auto;display:flex;flex-direction:column;"]);
const SidebarAndContentContainer = styledComponents.styled.div.withConfig({
  displayName: "Editor__SidebarAndContentContainer",
  componentId: "sc-t95yuf-1"
})(["height:", ";width:100%;background:#fafafa;display:flex;flex-direction:row;align-items:stretch;"], props => `calc(${props.height} - ${TOP_BAR_HEIGHT}px)`);
const SidebarContainer = styledComponents.styled.div.withConfig({
  displayName: "Editor__SidebarContainer",
  componentId: "sc-t95yuf-2"
})(["flex:0 0 240px;background:", ";border-left:1px solid ", ";box-sizing:border-box;> *{box-sizing:border-box;}overflow-y:auto;"], easyblocksDesignSystem.Colors.white, easyblocksDesignSystem.Colors.black100);
const DataSaverRoot = styledComponents.styled.div.withConfig({
  displayName: "Editor__DataSaverRoot",
  componentId: "sc-t95yuf-3"
})(["position:fixed;width:100%;height:100%;z-index:100000;display:flex;justify-content:center;align-items:center;"]);
const DataSaverOverlay = styledComponents.styled.div.withConfig({
  displayName: "Editor__DataSaverOverlay",
  componentId: "sc-t95yuf-4"
})(["z-index:-1;position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.25);"]);
const DataSaverModal = styledComponents.styled.div.withConfig({
  displayName: "Editor__DataSaverModal",
  componentId: "sc-t95yuf-5"
})(["background:white;padding:32px;border-radius:8px;display:flex;justify-content:center;align-items:center;", " font-size:16px;"], easyblocksDesignSystem.Fonts.body);
const AuthenticationScreen = styledComponents.styled.div.withConfig({
  displayName: "Editor__AuthenticationScreen",
  componentId: "sc-t95yuf-6"
})(["width:100vw;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:24px;text-align:center;", ""], easyblocksDesignSystem.Fonts.bodyLarge);
const Editor = EditorBackendInitializer;
function EditorBackendInitializer(props) {
  const [enabled, setEnabled] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const [document, setDocument] = React.useState(null);
  React.useEffect(() => {
    async function run() {
      try {
        if (props.documentId) {
          const document = await props.config.backend.documents.get({
            id: props.documentId
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
    return /*#__PURE__*/React__default["default"].createElement(AuthenticationScreen, null, "Loading...");
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
  const locale = props.locale ?? easyblocksCore.getDefaultLocale(props.config.locales).code;
  const rootTemplateEntry = props.rootTemplateId ? props.config.templates?.find(t => t.id === props.rootTemplateId)?.entry : null;
  const rootComponentId = props.document ? props.document.entry._component : rootTemplateEntry?._component ?? props.rootComponentId;
  const compilationContext = easyblocksCore.createCompilationContext(props.config, {
    locale
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
  const inputChanged = inputRawContent.current !== rawContent || inputIsEditing.current !== editorContext.isEditing || inputBreakpointIndex.current !== editorContext.breakpointIndex;
  if (!buildEntryResult.current || inputChanged) {
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
function calculateViewportRelatedStuff(viewport, devices, mainBreakpointIndex, availableSize) {
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
  const activeDeviceindex = devices.findIndex(device => device.id === activeDevice.id);

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
      const smallestNonScaledWidth = activeDeviceindex === 0 ? 0 : devices[activeDeviceindex - 1].breakpoint;
      width = activeDevice.w;
      height = activeDevice.h === null ? availableSize.height : Math.min(activeDevice.h, availableSize.height);
      if (activeDevice.w <= availableSize.width) ; else if (smallestNonScaledWidth <= availableSize.width) {
        // fits currently selected device range
        width = availableSize.width;
      } else {
        // we must scale
        scaleFactor = availableSize.width / activeDevice.w;
        if (activeDevice.h === null) {
          height = availableSize.height / scaleFactor;
          offsetY = (availableSize.height - height) / 2;
        }
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
const EditorContent = _ref => {
  let {
    compilationContext,
    heightMode = "viewport",
    initialDocument,
    initialEntry,
    externalData,
    isAdminMode = false,
    ...props
  } = _ref;
  const [currentViewport, setCurrentViewport] = React.useState(compilationContext.mainBreakpointIndex); // "{ breakpoint }" or "fit-screen"

  const iframeContainerRef = React.useRef(null);
  const availableSize = iframeContainerRef.current ? {
    width: iframeContainerRef.current.clientWidth,
    height: iframeContainerRef.current.clientHeight
  } : undefined;
  const {
    breakpointIndex,
    iframeSize
  } = calculateViewportRelatedStuff(currentViewport, compilationContext.devices, compilationContext.mainBreakpointIndex, availableSize);
  useRerenderOnIframeResize(iframeContainerRef.current); // re-render on resize (recalculates viewport size, active breakpoint for fit-screen etc);

  const compilationCache = React.useRef(new easyblocksCore.CompilationCache());
  const [isEditing, setEditing] = React.useState(true);
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
    setEditing(!isEditing);
  }, [isEditing]);
  const closeComponentPickerModal = config => {
    setComponentPickerData(undefined);
    componentPickerData.promiseResolve(config);
  };
  const sidebarNodeRef = React.useRef(null);
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
    push
  } = useEditorHistory({
    onChange: _ref2 => {
      let {
        config,
        focusedField
      } = _ref2;
      setFocussedField(focusedField);
      form.finalForm.change("", config);
    }
  });
  const [templates, setTemplates] = React.useState(undefined);
  const [openTemplateModalAction, setOpenTemplateModalAction] = React.useState(undefined);
  const {
    notify
  } = easyblocksDesignSystem.useToaster();
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
    insertItem: _ref3 => {
      let {
        name,
        index,
        block
      } = _ref3;
      actions.runChange(() => {
        form.mutators.insert(name, index, _internals.duplicateConfig(block, compilationContext));
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
  const syncTemplates = function () {
    let {
      mode,
      template
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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
                return [templateDefined];
              }
              return [...prev, templateDefined];
            });
          }
          break;
        }
      case "edit":
        {
          if (templateDefined) {
            setTemplates(prev => {
              if (!prev) {
                return [templateDefined];
              }
              const templateIndex = prev.findIndex(t => t.id === templateDefined.id);
              if (templateIndex === -1) {
                return prev;
              }
              const newTemplates = [...prev];
              newTemplates[templateIndex] = templateDefined;
              return newTemplates;
            });
          }
          break;
        }
      case "delete":
        {
          if (templateDefined) {
            setTemplates(prev => {
              if (!prev) {
                return [];
              }
              const templateIndex = prev.findIndex(t => t.id === templateDefined.id);
              if (templateIndex === -1) {
                return prev;
              }
              const newTemplates = [...prev];
              newTemplates.splice(templateIndex, 1);
              return newTemplates;
            });
          }
          break;
        }
      default:
        {
          getTemplates(editorContext, props.config.templates ?? []).then(newTemplates => {
            setTemplates(newTemplates);
          });
          break;
        }
    }
  };
  React.useEffect(() => {
    prevLocale.current = currentLocale;
  }, [currentLocale]);
  React.useEffect(() => {
    syncTemplates();
  }, [props.config.components, props.config.templates]);
  const editorTypes = Object.fromEntries(Object.entries(compilationContext.types).map(_ref4 => {
    let [typeName, typeDefinition] = _ref4;
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
    backend: props.config.backend,
    types: editorTypes,
    isAdminMode,
    templates,
    syncTemplates,
    breakpointIndex,
    focussedField,
    form,
    setFocussedField: handleSetFocussedField,
    isEditing,
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
  window.editorWindowAPI.meta = meta;
  window.editorWindowAPI.compiled = renderableContent;
  window.editorWindowAPI.externalData = externalData;
  const onLocaleChange = async localeValue => {
    compilationCache.current.clear();
    compilationContext.contextParams.locale = localeValue;
    setCurrentLocale(localeValue);
    compilationCache.current.clear();
    setEditing(prev => !prev);
    await sleep(1);
    compilationCache.current.clear();
    setEditing(prev => !prev);
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
          const shopstoryCanvasIframe = window.document.getElementById("shopstory-canvas");
          shopstoryCanvasIframe?.contentWindow?.postMessage(_internals.componentPickerClosed(config));
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
  const [isDataSaverOverlayOpen, setDataSaverOverlayOpen] = React.useState(false);
  useEditorGlobalKeyboardShortcuts(editorContext);
  const {
    saveNow
  } = useDataSaver(initialDocument, editorContext);
  const appHeight = heightMode === "viewport" ? "100vh" : "100%";
  React.useEffect(() => {
    Modal__default["default"].setAppElement("#shopstory-app");
  }, []);
  const EditorSidebarRight = _ref5 => {
    let {
      sidebarNodeRef,
      focussedField,
      form
    } = _ref5;
    return /*#__PURE__*/React__default["default"].createElement(SidebarContainer, {
      ref: sidebarNodeRef
    }, /*#__PURE__*/React__default["default"].createElement(EditorSidebar, {
      focussedField: focussedField,
      form: form
    }));
  };
  const MemoEditorSidebarRight = /*#__PURE__*/React__default["default"].memo(EditorSidebarRight);
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
    onSaveDocument: saveNow,
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
    isEditing: isEditMode,
    saveLabel: "Save",
    locale: currentLocale,
    locales: editorContext.locales,
    onLocaleChange: onLocaleChange,
    hideCloseButton: props.config.hideCloseButton ?? false,
    readOnly: editorContext.readOnly
  }), /*#__PURE__*/React__default["default"].createElement(SidebarAndContentContainer, {
    height: appHeight
  }, /*#__PURE__*/React__default["default"].createElement(ContentContainer, {
    onClick: () => {
      setFocussedField([]);
    }
  }, /*#__PURE__*/React__default["default"].createElement(EditorIframe, {
    onEditorHistoryUndo: undo,
    onEditorHistoryRedo: redo,
    width: iframeSize.width,
    height: iframeSize.height,
    transform: iframeSize.transform,
    containerRef: iframeContainerRef
  }), isEditMode && /*#__PURE__*/React__default["default"].createElement(SelectionFrame, {
    width: iframeSize.width,
    height: iframeSize.height,
    transform: iframeSize.transform
  })), isEditMode && /*#__PURE__*/React__default["default"].createElement(MemoEditorSidebarRight, {
    sidebarNodeRef: sidebarNodeRef,
    focussedField: focussedField,
    form: form
  })
  // <SidebarContainer ref={sidebarNodeRef}>
  //   <EditorSidebar focussedField={focussedField} form={form} />
  // </SidebarContainer>
  , componentPickerData && /*#__PURE__*/React__default["default"].createElement(ModalPicker, {
    onClose: closeComponentPickerModal,
    config: componentPickerData.config,
    pickers: props.pickers
  })), openTemplateModalAction && /*#__PURE__*/React__default["default"].createElement(TemplateModal, {
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
  _internals.traverseComponents(config, context, _ref6 => {
    let {
      componentConfig
    } = _ref6;
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

/**
 * This is a copy of validate-color function from validate-color npm package. This package has problem with bundling, so I copied it here. It was modified 100 years ago anyway and had 32 stars, so nothing fancy really.
 */

// Good article on HTML Colors:
// https://dev.to/alvaromontoro/the-ultimate-guide-to-css-colors-2020-edition-1bh1#hsl

// Check if parameter is defined and a string
const isString = color => color && typeof color === "string";
// All existing HTML color names
const htmlColorNames = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenrod", "DarkGray", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "Goldenrod", "Gray", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenrodYellow", "LightGray", "LightGreen", "LightPink", "LightSalmon", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquamarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenrod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "RebeccaPurple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
// These 3 values are valid, usable color names, which are special in their own way
const htmlColorNamesSpecial = ["currentColor", "inherit", "transparent"];

// Validate HTML color name (red, yellow, etc)
const validateHTMLColorName = color => {
  let status = false;
  if (isString(color)) {
    htmlColorNames.map(c => {
      if (color.toLowerCase() === c.toLowerCase()) {
        status = true;
      }
      return null;
    });
  }
  return status;
};

// Validate HTML color special name (currentColor, inherit, etc)
const validateHTMLColorSpecialName = color => {
  let status = false;
  if (isString(color)) {
    htmlColorNamesSpecial.map(c => {
      if (color.toLowerCase() === c.toLowerCase()) {
        status = true;
      }
      return null;
    });
  }
  return status;
};

// Validate HTML color 'hex'
const validateHTMLColorHex = color => {
  if (isString(color)) {
    const regex = /^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$/i;
    return !!color && regex.test(color);
  }
  return false;
};

// Validate HTML color 'rgb'
// -- legacy notation
// color: rgb(255, 255, 255);
// color: rgba(255, 255, 255, 1);
// -- new notation
// color: rgb(255 255 255);
// color: rgb(255 255 255 / 1);
// Note that 'rgba()' is now merged into 'rgb()'
const validateHTMLColorRgb = color => {
  if (isString(color)) {
    const regex = /(rgb)a?\((\s*\d+%?\s*?,?\s*){2}(\s*\d+%?\s*?,?\s*\)?)(\s*,?\s*\/?\s*(0?\.?\d+%?\s*)?|1|0)?\)$/i;
    return !!color && regex.test(color);
  }
  return false;
};
const optionalCommaOrRequiredSpace = `((\\s*,\\s*)|(\\s+))`;
const optionalDecimals = `(\\.\\d+)?`;
const anyPercentage = `((\\d*${optionalDecimals})%)`;
const hundredPercent = `(([0-9]|[1-9][0-9]|100)%)`;
const alphaPercentage = `(((${hundredPercent}))|(0?${optionalDecimals})|1))?`;
const endingWithAlphaPercentage = `\\s*?\\)?)(\\s*?(\\/?)\\s+${alphaPercentage}\\s*?\\)$`;

// Validate HTML color 'hsl'
// -- These units are valid for the first parameter
// 'deg': degrees | full circle = 360
// 'gra': gradians | full circle = 400
// 'radians': radians | full circle = 2π (approx. 6.28)
// 'turn': turns | full circle = 1
const validateHTMLColorHsl = color => {
  if (isString(color)) {
    // Validate each possible unit value separately, as their values differ
    const degRegex = `(-?([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9]|360)(deg)?)`;
    const graRegex = `(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-9][0-9]|400)gra)`;
    const radRegex = `((([0-5])?\\.\\d+|6\\.([0-9]|1[0-9]|2[0-8])|[0-6])rad)`;
    const turnRegex = `((0?${optionalDecimals}|1)turn)`;
    const regexLogic = `(hsl)a?\\((\\s*?(${degRegex}|${graRegex}|${radRegex}|${turnRegex})${optionalCommaOrRequiredSpace})(\\s*?(0|${hundredPercent})${optionalCommaOrRequiredSpace})(\\s*?(0|${hundredPercent})\\s*?\\)?)(\\s*?(\\/?|,?)\\s*?(((${hundredPercent}))|(0?${optionalDecimals})|1))?\\)$`;
    const regex = new RegExp(regexLogic);
    return !!color && regex.test(color);
  }
  return false;
};

// Validate HTML color 'hwb'
// -- 'hwb' accepts 'deg' as unit in its 1st property, which stands for 'hue'
// 'deg': degrees | full circle = 360
const validateHTMLColorHwb = color => {
  if (isString(color)) {
    const degRegex = `(-?([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9]|360)(deg)?)`;
    const regexLogic = `(hwb\\(\\s*?${degRegex}\\s+)((0|${hundredPercent})\\s+)((0|${hundredPercent})${endingWithAlphaPercentage}`;
    const regex = new RegExp(regexLogic);
    return !!color && regex.test(color);
  }
  return false;
};

// Validate HTML color 'lab'
// -- 'lab' 2nd & 3rd parameters are any number between -160 & 160
const validateHTMLColorLab = color => {
  if (isString(color)) {
    const labParam = `(-?(([0-9]|[1-9][0-9]|1[0-5][0-9])${optionalDecimals}?|160))`;
    const regexLogic = `(lab\\(\\s*?${anyPercentage}\\s+${labParam}\\s+${labParam}${endingWithAlphaPercentage}`;
    const regex = new RegExp(regexLogic);
    return !!color && regex.test(color);
  }
  return false;
};
const validateColor = color => {
  // Former validation - source: https://www.regextester.com/103656
  // if (isString(color)) {
  //   const regex = /^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$|(rgb|hsl)a?\((\s*-?\d+%?\s*,){2}(\s*-?\d+%?\s*,?\s*\)?)(,\s*(0?\.\d+)?|1|0)?\)$/i;
  //   return color && regex.test(color);
  // }
  // New validation
  if (color && validateHTMLColorHex(color) || validateHTMLColorName(color) || validateHTMLColorSpecialName(color) || validateHTMLColorRgb(color) || validateHTMLColorHsl(color) || validateHTMLColorHwb(color) || validateHTMLColorLab(color)) {
    return true;
  }
  return false;
};

function ColorTokenWidget(props) {
  const [inputValue, setInputValue] = React.useState(props.value);
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Input, {
    value: inputValue,
    onChange: e => {
      setInputValue(e.target.value);
    },
    onBlur: () => {
      if (validateColor(inputValue)) {
        props.onChange(inputValue);
        return;
      }
      if (validateColor("#" + inputValue)) {
        props.onChange("#" + inputValue);
        return;
      }
      props.onChange(props.value);
    },
    align: "right"
  });
}

function SpaceTokenWidget(props) {
  const [inputValue, setInputValue] = React.useState(props.value);
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Input, {
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

function DocumentDataWidgetComponent(_ref) {
  let {
    id,
    onChange,
    resourceKey,
    path
  } = _ref;
  if (id !== null && typeof id !== "string") {
    return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Typography, {
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
  const options = documentCompoundResources.flatMap(_ref2 => {
    let [externalId, externalDataValue] = _ref2;
    return getBasicResourcesOfType(externalDataValue.value, schemaProp.type).map(r => {
      const resourceSchemaProp = assertDefined(schema?.find(s => s.prop === externalId.split(".")[1]));
      return {
        id: externalId,
        key: r.key,
        label: `${resourceSchemaProp.label ?? resourceSchemaProp.prop} > ${r.label ?? r.key}`
      };
    });
  });
  if (options.length === 1 && !id && path) {
    // We perform form change manually to avoid storing this change in editor's history
    editorContext.form.change(path, {
      id: options[0].id,
      key: options[0].key,
      widgetId: "@easyblocks/document-data"
    });
  }
  if (!documentCompoundResources.length) {
    return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Typography, {
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

/**
 * CARD
 */

const CardRoot = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__CardRoot",
  componentId: "sc-5szert-0"
})(["&:hover{outline:1px solid ", ";outline-offset:8px;}.editButton{opacity:0;}&:hover{.editButton{opacity:1;}}"], easyblocksDesignSystem.Colors.black10);
const ImageContainer = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__ImageContainer",
  componentId: "sc-5szert-1"
})(["position:relative;background-color:", ";margin-bottom:8px;padding-bottom:", ";cursor:pointer;"], easyblocksDesignSystem.Colors.black10, p => p.mode === "large-3" ? "90%" : "60%");
const CardImg = styledComponents.styled.img.withConfig({
  displayName: "SectionPicker__CardImg",
  componentId: "sc-5szert-2"
})(["position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;padding:24px;box-sizing:border-box;"]);
const CardImgPlaceholder = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__CardImgPlaceholder",
  componentId: "sc-5szert-3"
})(["position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;"]);
const CardFooter = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__CardFooter",
  componentId: "sc-5szert-4"
})(["display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-top:8px;"]);
const CardLabelContainer = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__CardLabelContainer",
  componentId: "sc-5szert-5"
})(["display:flex;flex-direction:row;align-items:center;"]);
const CardLabelTemplateName = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__CardLabelTemplateName",
  componentId: "sc-5szert-6"
})(["", ";color:black;"], easyblocksDesignSystem.Fonts.body);
const Title = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__Title",
  componentId: "sc-5szert-7"
})(["", ""], easyblocksDesignSystem.Fonts.label);
const TitleContainer = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__TitleContainer",
  componentId: "sc-5szert-8"
})(["display:flex;flex-direction:row;gap:8px;align-items:center;margin-bottom:24px;"]);
const Message = styledComponents.styled.div.withConfig({
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
const SectionCard = _ref => {
  let {
    template,
    onSelect,
    mode
  } = _ref;
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
  })))), /*#__PURE__*/React__default["default"].createElement(CardFooter, null, /*#__PURE__*/React__default["default"].createElement(CardLabelContainer, null, /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, template.label && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(CardLabelTemplateName, null, template.label)))), /*#__PURE__*/React__default["default"].createElement("div", null), template.isUserDefined && !editorContext.readOnly && /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ButtonGhostColor, {
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

const ModalRoot = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__ModalRoot",
  componentId: "sc-5szert-10"
})(["position:absolute;top:0;left:0;width:100%;height:100%;display:grid;grid-template-columns:200px 1fr;"]);
const ModalGridRoot = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__ModalGridRoot",
  componentId: "sc-5szert-11"
})(["display:grid;grid-template-columns:", ";grid-column-gap:16px;grid-row-gap:30px;"], p => p.mode === "large-3" ? "1fr 1fr 1fr" : "1fr 1fr");
const Sidebar = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__Sidebar",
  componentId: "sc-5szert-12"
})(["overflow-y:hidden;overflow-x:hidden;border-right:1px solid ", ";height:100%;"], easyblocksDesignSystem.Colors.black5);
const SidebarContent = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__SidebarContent",
  componentId: "sc-5szert-13"
})(["padding:24px 4px;display:flex;flex-direction:column;gap:8px;"]);
const SidebarButton = styledComponents.styled.button.withConfig({
  displayName: "SectionPicker__SidebarButton",
  componentId: "sc-5szert-14"
})(["all:unset;height:38px;", " display:flex;padding-left:16px;align-items:center;&:hover{background:", ";}cursor:pointer;"], easyblocksDesignSystem.Fonts.body, easyblocksDesignSystem.Colors.black5);
const GridRoot = styledComponents.styled.div.withConfig({
  displayName: "SectionPicker__GridRoot",
  componentId: "sc-5szert-15"
})(["padding:0px 16px;height:100%;overflow-x:hidden;overflow-y:auto;"]);
const SectionPickerModal = _ref2 => {
  let {
    isOpen,
    onClose,
    templates,
    mode = "large"
  } = _ref2;
  const templateGroups = templates;
  const gridRootRef = React.useRef(null);
  const templateSelected = template => {
    if (onClose) {
      onClose(template);
    }
  };
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Modal, {
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
  }, /*#__PURE__*/React__default["default"].createElement(ModalRoot, null, /*#__PURE__*/React__default["default"].createElement(Sidebar, null, templateGroups && /*#__PURE__*/React__default["default"].createElement(SidebarContent, null, Object.entries(templateGroups).map(_ref3 => {
    let [componentId, {
      component: {
        label
      }
    }] = _ref3;
    return /*#__PURE__*/React__default["default"].createElement(SidebarButton, {
      key: `sectionPicker__group__${componentId}`,
      onClick: () => {
        const groupNode = document.getElementById(`sectionPicker__group__${componentId}`);
        const groupOffsetTop = groupNode.offsetTop;
        gridRootRef.current.scrollTo({
          top: groupOffsetTop,
          behavior: "smooth"
        });
      }
    }, label ?? componentId);
  }))), /*#__PURE__*/React__default["default"].createElement(GridRoot, {
    ref: gridRootRef
  }, templates === undefined && /*#__PURE__*/React__default["default"].createElement(Message, null, "Loading..."), templateGroups && Object.entries(templateGroups).map((_ref4, index) => {
    let [componentId, {
      component: {
        label
      },
      templates
    }] = _ref4;
    return /*#__PURE__*/React__default["default"].createElement("div", {
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
    }))));
  }))));
};

function checkQueryForTemplate(query, template, component) {
  return `${template.label ?? ""}${component.label ?? component.id}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}
const SearchableSmallPickerModal = _ref => {
  let {
    onClose,
    templates,
    isOpen
  } = _ref;
  const editorContext = useEditorContext();
  const templatesDict = templates;
  const [query, setQuery] = React.useState("");
  const trimmedQuery = query.trim().toLocaleLowerCase();
  const filteredTemplatesDict = {};
  if (templatesDict) {
    Object.values(templatesDict).forEach(_ref2 => {
      let {
        templates,
        component
      } = _ref2;
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
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Modal, {
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
  }, templatesDict === undefined && "Loading...", templatesDict !== undefined && Object.entries(filteredTemplatesDict).map(_ref3 => {
    let [, {
      templates,
      component
    }] = _ref3;
    const isOnlyOne = templates.length === 1;
    const componentLabel = component.label ?? component.id;
    return templates.map(template => {
      const templateLabel = template.label ?? template.id;
      const title = isOnlyOne ? componentLabel : templateLabel;
      const thumbnail = template.thumbnail ?? component.thumbnail;
      const description = isOnlyOne ? undefined : componentLabel;
      return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.BasicRow, {
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
  return /*#__PURE__*/React__default["default"].createElement(styledComponents.StyleSheetManager, {
    shouldForwardProp: shouldForwardProp,
    enableVendorPrefixes: true
  }, /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.ModalContext.Provider, {
    value: () => {
      return document.querySelector("#modalContainer");
    }
  }, /*#__PURE__*/React__default["default"].createElement(GlobalStyles, null), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.GlobalModalStyles, null), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.TooltipProvider, null, /*#__PURE__*/React__default["default"].createElement("div", {
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
    widgets: {
      ...builtinWidgets,
      ...props.widgets
    },
    components: props.components,
    pickers: {
      ...builinPickers,
      ...props.pickers
    },
    isAdminMode: props.isAdminMode
  })), /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Toaster, {
    containerStyle: {
      zIndex: 100100
    }
  })));
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
  }), props.children), !editorContext.isEditing && props.children);
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
    --tina-font-family: 'Inter', sans-serif;
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

function SelectionFrameController(_ref) {
  let {
    isActive,
    isChildrenSelectionDisabled,
    children,
    onSelect,
    stitches,
    sortable,
    id,
    direction,
    path
  } = _ref;
  const [node, setNode] = React.useState(null);
  useUpdateFramePosition({
    node,
    isDisabled: !isActive
  });
  const isInsertingBefore = sortable.activeIndex > sortable.index;
  const wrapperClassName = stitches.css({
    position: "relative",
    display: "grid",
    "&[data-children-selection-disabled=true] *": {
      pointerEvents: "none !important",
      userSelect: "none !important"
    },
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
      boxShadow: "var(--tina-shadow-big)",
      zIndex: "var(--tina-z-index-2)"
    },
    "&[data-active=true]::after": {
      opacity: 1
    },
    "&:hover::after": {
      opacity: 0.5
    },
    "&[data-active=true]:hover::after": {
      opacity: 1
    },
    "&[data-draggable-over=true]::before": {
      position: "absolute",
      ...(direction === "horizontal" ? {
        top: 0,
        bottom: 0,
        [isInsertingBefore ? "left" : "right"]: "0px",
        height: "100%",
        width: "4px"
      } : {
        left: 0,
        right: 0,
        [isInsertingBefore ? "top" : "bottom"]: "0px",
        width: "100%",
        height: "4px"
      }),
      display: "block",
      content: "''",
      backgroundColor: easyblocksDesignSystem.Colors.blue50,
      zIndex: 9999999
    },
    "&[data-draggable-active=true]": {
      opacity: 0.5
    },
    "&[data-draggable-dragging=true]": {
      cursor: "grabbing"
    }
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
    "data-active": isActive,
    "data-children-selection-disabled": isChildrenSelectionDisabled,
    "data-draggable-dragging": sortable.active !== null,
    "data-draggable-over": sortable.isOver,
    "data-draggable-active": sortable.active !== null && sortable.active?.id === id,
    className: wrapperClassName().className,
    ref: node => {
      setNode(node);
      sortable.setNodeRef(node);
    },
    onClick: onSelect
  }, sortable.attributes, sortable.listeners), children);
}
function useUpdateFramePosition(_ref2) {
  let {
    node,
    isDisabled
  } = _ref2;
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

function BlocksControls(_ref) {
  let {
    children,
    path,
    disabled,
    direction,
    id,
    index,
    length
  } = _ref;
  const {
    focussedField,
    setFocussedField,
    form
  } = window.parent.editorWindowAPI?.editorContext;
  const meta = _internals.useEasyblocksMetadata();
  const dndContext = core.useDndContext();
  const isActive = focussedField.map(focusedField => {
    // If the focused field is rich text part path, we want to show the frame around rich text parent component.
    if (isConfigPathRichTextPart(focusedField)) {
      return focusedField.replace(RICH_TEXT_PART_CONFIG_PATH_REGEXP, "");
    }
    return focusedField;
  }).includes(path);
  const isChildComponentActive = focussedField.some(focusedField => focusedField.startsWith(path));
  const entryPathParseResult = _internals.parsePath(path, form);
  const entryComponentDefinition = meta.vars.definitions.components.find(c => c.id === entryPathParseResult.parent.templateId);

  // component` could be draggable, but right now we only support collections.
  const isEntryComponentOrComponentFixed = entryComponentDefinition.schema.some(s => s.prop === entryPathParseResult.parent.fieldName && s.type === "component");
  const isAncestorComponentActive = focussedField.some(f => entryPathParseResult.parent.path.startsWith(f));
  const isMultiSelection = focussedField.length > 1;
  const isSiblingComponentActive = focussedField.some(f => {
    const pathWithoutIndexPart = path.split(".").slice(0, -1).join(".");
    const regexp = new RegExp(`^${pathWithoutIndexPart}\\.\\d+$`);
    return regexp.test(f);
  });
  const draggedEntryPathParseResult = dndContext.active ? _internals.parsePath(dndContext.active.data.current.path, form) : null;
  const draggedComponentDefinition = draggedEntryPathParseResult ? meta.vars.definitions.components.find(c => c.id === draggedEntryPathParseResult.templateId) : null;
  const canDraggedComponentBeDropped = entryComponentDefinition && draggedComponentDefinition ? getAllowedComponentTypes(entryComponentDefinition).some(type => {
    return toArray(draggedComponentDefinition.type ?? []).includes(type) || draggedComponentDefinition.id === type;
  }) : true;
  const isDroppableDisabled = disabled || isEntryComponentOrComponentFixed || !canDraggedComponentBeDropped;
  const sortable$1 = sortable.useSortable({
    id,
    data: {
      path
    },
    disabled: {
      draggable: disabled || isMultiSelection || isEntryComponentOrComponentFixed || !isActive && !isAncestorComponentActive && !isSiblingComponentActive && !isChildComponentActive,
      droppable: isDroppableDisabled
    },
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
  const isActivePathInDifferentCollection = sortable$1.active && !isPathsParentEqual(sortable$1.active.data.current.path, path);
  return /*#__PURE__*/React__default["default"].createElement(React.Fragment, null, !isDroppableDisabled && isActivePathInDifferentCollection && sortable$1.activeIndex < sortable$1.index && index === 0 && /*#__PURE__*/React__default["default"].createElement(DroppablePlaceholder, {
    id: id,
    direction: direction,
    path: path,
    position: "before"
  }), /*#__PURE__*/React__default["default"].createElement(SelectionFrameController, {
    isActive: isActive,
    isChildrenSelectionDisabled: !isActive && !isChildComponentActive,
    onSelect: focusOnBlock,
    stitches: meta.stitches,
    sortable: sortable$1,
    id: id,
    direction: direction,
    path: path
  }, children), !isDroppableDisabled && isActivePathInDifferentCollection && sortable$1.activeIndex > sortable$1.index && index === length - 1 && /*#__PURE__*/React__default["default"].createElement(DroppablePlaceholder, {
    id: id,
    direction: direction,
    path: path,
    position: "after"
  }));
}
function getAllowedComponentTypes(componentDefinition) {
  const collectionSchemaProps = componentDefinition.schema.filter(s => s.type === "component-collection");
  const allowedComponentTypes = collectionSchemaProps.flatMap(s => s.accepts);
  return Array.from(new Set(allowedComponentTypes));
}
function isPathsParentEqual(path1, path2) {
  const activePathParts = path1.split(".");
  const currentPathParts = path2.split(".");
  return activePathParts.slice(0, -1).join(".") === currentPathParts.slice(0, -1).join(".");
}
function DroppablePlaceholder(_ref2) {
  let {
    id,
    direction,
    path,
    position
  } = _ref2;
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
  const isInsertingBefore = sortable$1.activeIndex > sortable$1.index;
  const wrapperStyles = meta.stitches.css({
    position: "absolute",
    [position === "before" ? "top" : "bottom"]: direction === "vertical" ? "-100%" : 0,
    [position === "before" ? "left" : "right"]: direction === "horizontal" ? "-100%" : 0,
    height: "100%",
    background: "transparent",
    width: "100%",
    "&::before": {
      display: "block",
      content: "''",
      backgroundColor: easyblocksDesignSystem.Colors.blue50,
      zIndex: 9999999,
      position: "absolute",
      opacity: 0
    },
    "&[data-draggable-over=true]::before": {
      opacity: 1,
      ...(direction === "horizontal" ? {
        top: 0,
        bottom: 0,
        [isInsertingBefore ? "left" : "right"]: "0px",
        height: "100%",
        width: "4px"
      } : {
        left: 0,
        right: 0,
        [isInsertingBefore ? "top" : "bottom"]: "0px",
        width: "100%",
        height: "4px"
      })
    }
  });
  return /*#__PURE__*/React__default["default"].createElement("div", _extends__default["default"]({
    "data-draggable-over": sortable$1.isOver,
    className: wrapperStyles().className,
    ref: sortable$1.setNodeRef
  }, sortable$1.attributes, sortable$1.listeners));
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
function EasyblocksCanvas(_ref) {
  let {
    components
  } = _ref;
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
    return /*#__PURE__*/React__default["default"].createElement("div", null, "Loading...");
  }
  const sortableItems = getSortableItems(editorContext.form.values, editorContext);
  return /*#__PURE__*/ /* EasyblocksMetadataProvider must be defined in case of nested <Easyblocks /> components are used! */React__default["default"].createElement(_internals.EasyblocksMetadataProvider, {
    meta: meta
  }, /*#__PURE__*/React__default["default"].createElement(CanvasRoot, null, /*#__PURE__*/React__default["default"].createElement(core.DndContext, {
    sensors: [mouseSensor],
    collisionDetection: customCollisionDetection,
    onDragStart: event => {
      document.documentElement.style.cursor = "grabbing";
      activeDraggedEntryPath.current = dragDataSchema.parse(event.active.data.current).path;
      window.parent.editorWindowAPI?.editorContext?.setFocussedField([]);
    },
    onDragEnd: event => {
      document.documentElement.style.cursor = "";
      const activeData = dragDataSchema.parse(event.active.data.current);
      if (event.over) {
        const overData = dragDataSchema.parse(event.over.data.current);
        if (event.over.id === event.active.id) {
          // If the dragged item is dropped on itself, we want to refocus the dragged item.
          window.parent.editorWindowAPI?.editorContext?.setFocussedField(activeData.path);
        } else {
          const itemMovedEvent = _internals.itemMoved({
            fromPath: activeData.path,
            toPath: overData.path,
            placement: ifValidPlacement(event.over.id.toString().split(".")[1])
          });
          requestAnimationFrame(() => {
            window.parent.postMessage(itemMovedEvent);
          });
        }
      } else {
        // If there was no drop target, we want to refocus the dragged item.
        window.parent.editorWindowAPI?.editorContext?.setFocussedField(activeData.path);
      }
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
  })))));
}
function getSortableItems(rootNoCodeEntry, editorContext) {
  const sortableItems = [];
  _internals.configTraverse(rootNoCodeEntry, editorContext, _ref2 => {
    let {
      value,
      schemaProp,
      config
    } = _ref2;
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

function DebugSection(_ref) {
  let {
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
  } = _ref;
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
  return /*#__PURE__*/React__default["default"].createElement(easyblocksDesignSystem.Input, {
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
       * It's because window.parent.isShopstoryEditor might throw if window.parent is cross origin (when shopstory Launcher is run in iframe of CMS - like Contentful); In that case we're sure it's a parent window, not a child.
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
    widgets: props.widgets,
    components: props.components,
    pickers: props.pickers,
    isAdminMode: props.isAdminMode
  }), selectedWindow === "child" && /*#__PURE__*/React__default["default"].createElement(EasyblocksCanvas, {
    components: props.components
  }), selectedWindow === "preview" && /*#__PURE__*/React__default["default"].createElement(PreviewRenderer, props));
}

exports.EasyblocksEditor = EasyblocksEditor;
exports.EditorContext = EditorContext;
exports.useEditorContext = useEditorContext;
//# sourceMappingURL=index.cjs.map
