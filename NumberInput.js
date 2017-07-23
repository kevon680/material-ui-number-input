"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var TextField_1 = require("material-ui/TextField");
var ObjectAssign = require("object-assign");
var bind_decorator_1 = require("bind-decorator");
var errorNames;
(function (errorNames) {
    errorNames.none = 'none';
    errorNames.invalidSymbol = 'invalidSymbol';
    errorNames.incompleteNumber = 'incompleteNumber';
    errorNames.singleMinus = 'singleMinus';
    errorNames.singleFloatingPoint = 'singleFloatingPoint';
    errorNames.singleZero = 'singleZero';
    errorNames.min = 'min';
    errorNames.max = 'max';
    errorNames.required = 'required';
    errorNames.clean = 'clean';
    errorNames.allow = 'allow';
    errorNames.limit = 'limit';
})(errorNames || (errorNames = {}));
var strategies;
(function (strategies) {
    strategies.ignore = 'ignore';
    strategies.warn = 'warn';
    strategies.allow = 'allow';
})(strategies || (strategies = {}));
var typeofs;
(function (typeofs) {
    typeofs.stringType = 'string';
    typeofs.numberType = 'number';
})(typeofs || (typeofs = {}));
var constants;
(function (constants) {
    constants.emptyString = '';
    constants.dash = '-';
    constants.dot = '.';
    constants.zero = 0;
    constants.one = 1;
    constants.text = 'text';
    constants.zeroString = '0';
    constants.minusOne = -1;
    constants.boolTrue = true;
    constants.boolFalse = false;
})(constants || (constants = {}));
var NumberInput = (function (_super) {
    __extends(NumberInput, _super);
    function NumberInput(props) {
        var _this = _super.call(this, props) || this;
        _this.constProps = {
            type: constants.text,
            onChange: _this.onChange,
            onBlur: _this.onBlur,
            ref: _this.refTextField
        };
        return _this;
    }
    NumberInput.getValidValue = function (value) {
        var match = value.match(NumberInput.allowed);
        return match !== null ? (match.index === constants.zero ? match[constants.zero] : match.join(constants.emptyString)) : constants.emptyString;
    };
    NumberInput.deleteOwnProps = function (props) {
        var prop;
        for (var index = 0; index < NumberInput.deleteProps.length; ++index) {
            prop = NumberInput.deleteProps[index];
            if (props.hasOwnProperty(prop)) {
                delete props[prop];
            }
        }
    };
    NumberInput.validateNumberValue = function (value, props) {
        var max = props.max, min = props.min;
        if ((typeof max === typeofs.numberType) && (value > max)) {
            return constants.one;
        }
        if ((typeof min === typeofs.numberType) && (value < min)) {
            return constants.minusOne;
        }
        return constants.zero;
    };
    NumberInput.validateValue = function (value, props) {
        var required = props.required, strategy = props.strategy, min = props.min;
        if (value === constants.emptyString) {
            return required ? errorNames.required : errorNames.clean;
        }
        else {
            if (value.match(NumberInput.validSymbols)) {
                if (value.match(NumberInput.stricAllowed)) {
                    if (value.match(NumberInput.validNumber)) {
                        var numberValue = Number(value);
                        var floatingPoint = value.indexOf(constants.dot);
                        var decimal = floatingPoint > constants.minusOne;
                        var whole = decimal ? Number(value.substring(constants.zero, floatingPoint)) : min;
                        switch (NumberInput.validateNumberValue(numberValue, props)) {
                            case constants.one: return errorNames.max;
                            case constants.minusOne: return ((strategy !== strategies.allow) && (min > constants.zero) && (numberValue > constants.zero) && (!decimal || (decimal && (whole > min)))) ? errorNames.allow : errorNames.min;
                            default: return errorNames.none;
                        }
                    }
                    else {
                        return (strategy !== strategies.allow) && (value === constants.dash) && (min >= constants.zero)
                            ? errorNames.limit : (min < 0 ? errorNames.allow : errorNames.incompleteNumber);
                    }
                }
                else {
                    switch (value[value.length - constants.one]) {
                        case constants.dash: return errorNames.singleMinus;
                        case constants.dot: return errorNames.singleFloatingPoint;
                        case constants.zeroString: return errorNames.singleZero;
                        default: return errorNames.invalidSymbol;
                    }
                }
            }
            else {
                return errorNames.invalidSymbol;
            }
        }
    };
    NumberInput.overrideRequestedValue = function (error, value, props) {
        switch (error) {
            case errorNames.min: return String(props.min);
            case errorNames.max: return String(props.max);
            default: return props.strategy !== strategies.allow && value === constants.dash && props.min >= 0 ? constants.emptyString : value;
        }
    };
    NumberInput.overrideError = function (error, props) {
        switch (error) {
            case errorNames.allow: return errorNames.none;
            case errorNames.limit: return props.required ? errorNames.required : errorNames.clean;
            default: return error;
        }
    };
    NumberInput.revertAllowToMin = function (error) {
        return error === errorNames.allow ? errorNames.min : error;
    };
    NumberInput.emitValid = function (error, overridenError) {
        return (error !== errorNames.allow) && (overridenError === errorNames.none);
    };
    NumberInput.prototype.emitEvents = function (nextError, value, valid, props) {
        var onError = props.onError, onValid = props.onValid;
        if ((this.error !== nextError) && (props.strategy !== strategies.ignore)) {
            if (onError) {
                onError(nextError);
            }
            this.error = nextError;
        }
        if (onValid && valid && (this.lastValid !== value)) {
            onValid(Number(value));
            this.lastValid = value;
        }
    };
    NumberInput.prototype.takeActionForValue = function (value, props) {
        var strategy = props.strategy, onRequestValue = props.onRequestValue, propsValue = props.value;
        var error = NumberInput.validateValue(value, props);
        var valid = NumberInput.overrideRequestedValue(error, NumberInput.getValidValue(value), props);
        var overridenError = NumberInput.overrideError(error, props);
        var emitValid = NumberInput.emitValid(error, overridenError);
        this.emitEvents(overridenError, valid, emitValid, props);
        if ((strategy !== strategies.allow) && (valid !== value)) {
            if (typeof propsValue !== typeofs.stringType) {
                this.getInputNode().value = valid;
            }
            else if (onRequestValue) {
                onRequestValue(valid);
            }
        }
    };
    NumberInput.prototype.shouldTakeActionForValue = function (props) {
        var _a = this.props, min = _a.min, max = _a.max, required = _a.required, strategy = _a.strategy;
        return (min !== props.min) || (max !== props.max) || (required !== props.required) || (strategy !== props.strategy);
    };
    NumberInput.prototype.refTextField = function (textField) {
        this.textField = textField;
    };
    NumberInput.prototype.onChange = function (event) {
        var eventValue = event;
        var value = eventValue.target.value;
        var onChange = this.props.onChange;
        if (onChange) {
            onChange(event, value);
        }
        if (typeof this.props.value !== typeofs.stringType) {
            this.takeActionForValue(value, this.props);
        }
    };
    NumberInput.prototype.onBlur = function (event) {
        var eventValue = event;
        var props = this.props;
        var onBlur = props.onBlur;
        var value = eventValue.target.value;
        var error = NumberInput.overrideError(NumberInput.revertAllowToMin(NumberInput.validateValue(value, props)), props);
        this.emitEvents(error, value, constants.boolFalse, props);
        if (onBlur) {
            onBlur(event);
        }
    };
    NumberInput.prototype.getInputNode = function () {
        return this.textField.getInputNode();
    };
    NumberInput.prototype.getTextField = function () {
        return this.textField;
    };
    NumberInput.prototype.componentDidMount = function () {
        var props = this.props;
        var value = props.value;
        this.takeActionForValue(typeof value === typeofs.stringType ? value : this.getInputNode().value, props);
    };
    NumberInput.prototype.componentWillReceiveProps = function (props) {
        var value = props.value;
        if ((value !== this.props.value) || this.shouldTakeActionForValue(props)) {
            this.takeActionForValue(value, props);
        }
    };
    NumberInput.prototype.render = function () {
        var _a = this, props = _a.props, constProps = _a.constProps;
        var value = props.value, defaultValue = props.defaultValue;
        var inputProps = ObjectAssign({}, props, constProps, {
            defaultValue: typeof defaultValue === typeofs.numberType ? String(defaultValue) : undefined,
            value: value,
        });
        if (typeof inputProps.value !== typeofs.stringType) {
            delete inputProps.value;
        }
        if (inputProps.defaultValue === undefined) {
            delete inputProps.defaultValue;
        }
        NumberInput.deleteOwnProps(inputProps);
        return React.createElement(TextField_1.default, inputProps);
    };
    return NumberInput;
}(React.Component));
NumberInput.validSymbols = /(\-|\.|\d)+/;
NumberInput.stricAllowed = /^-?((0|([1-9]\d{0,}))(\.\d{0,})?)?$/;
NumberInput.validNumber = /^-?((0(\.\d+)?)|([1-9]\d{0,}(\.\d+)?))$/;
NumberInput.allowed = /-?((0|([1-9]\d{0,}))(\.\d{0,})?)?/;
NumberInput.deleteProps = ['strategy', 'onError', 'onValid', 'onRequestValue'];
NumberInput.propTypes = {
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    errorStyle: React.PropTypes.object,
    errorText: React.PropTypes.node,
    floatingLabelFixed: React.PropTypes.bool,
    floatingLabelFocusStyle: React.PropTypes.object,
    floatingLabelStyle: React.PropTypes.object,
    floatingLabelText: React.PropTypes.node,
    fullWidth: React.PropTypes.bool,
    hintStyle: React.PropTypes.object,
    hintText: React.PropTypes.node,
    id: React.PropTypes.string,
    inputMode: React.PropTypes.string,
    inputStyle: React.PropTypes.object,
    name: React.PropTypes.string,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onValid: React.PropTypes.func,
    onError: React.PropTypes.func,
    onRequestValue: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    style: React.PropTypes.object,
    underlineDisabledStyle: React.PropTypes.object,
    underlineFocusStyle: React.PropTypes.object,
    underlineShow: React.PropTypes.bool,
    underlineStyle: React.PropTypes.object,
    defaultValue: React.PropTypes.number,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    required: React.PropTypes.bool,
    strategy: React.PropTypes.oneOf([
        strategies.ignore,
        strategies.warn,
        strategies.allow
    ]),
    value: React.PropTypes.string
};
NumberInput.defaultProps = {
    required: constants.boolFalse,
    strategy: strategies.allow
};
__decorate([
    bind_decorator_1.default
], NumberInput.prototype, "refTextField", null);
__decorate([
    bind_decorator_1.default
], NumberInput.prototype, "onChange", null);
__decorate([
    bind_decorator_1.default
], NumberInput.prototype, "onBlur", null);
exports.NumberInput = NumberInput;
exports.default = NumberInput;
