import * as React from 'react';
import TextField from 'material-ui/TextField';
import * as DeepEqual from 'deep-equal';

export type NumberInputError = 'none' | 'invalidSymbol' | 'incompleteNumber' | 'singleMinus' | 'singleFloatingPoint' | 'singleZero' | 'min' | 'max' | 'required';

export type NumberInputChangeHandler = (event: React.FormEvent, value: string) => void;

export type NumberInputValidHandler = (valid: number) => void;

export type NumberInputErrorHandler = (error: NumberInputError) => void;

export interface EventValue {
    target: {
        value?: string
    }
}

export interface NumberInputProps {
    className?: string;
    disabled?: boolean;
    floatingLabelFixed?: boolean;
    id?: string;
    name?: string;
    fullWidth?: boolean;
    underlineShow?: boolean;
    showDefaultValue?: number;
    min?: number;
    max?: number;
    required?: boolean;
    useStrategy?: 'ignore' | 'warn' | 'allow';
    value?: string;
    errorText?: React.ReactNode;
    errorStyle?: React.CSSProperties;
    floatingLabelFocusStyle?: React.CSSProperties;
    floatingLabelStyle?: React.CSSProperties;
    floatingLabelText?: React.ReactNode;
    hintStyle?: React.CSSProperties;
    hintText?: React.ReactNode;
    inputStyle?: React.CSSProperties;
    style?: React.CSSProperties;
    underlineDisabledStyle?: React.CSSProperties;
    underlineFocusStyle?: React.CSSProperties;
    underlineStyle?: React.CSSProperties;
    onBlur?: React.FocusEventHandler;
    onChange?: NumberInputChangeHandler;
    onError?: NumberInputErrorHandler;
    onValid?: NumberInputValidHandler;
    onFocus?: React.FocusEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
}

export interface NumberInputState {
    error?: NumberInputError;
}

function getChangeEvent<E extends React.SyntheticEvent>(event: E): React.SyntheticEvent {
    return {
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        currentTarget: event.currentTarget,
        defaultPrevented: event.defaultPrevented,
        eventPhase: event.eventPhase,
        isTrusted: event.isTrusted,
        nativeEvent: event.nativeEvent,
        preventDefault: event.preventDefault,
        //isDefaultPrevented: event.isDefaultPrevented,
        stopPropagation: event.stopPropagation,
        //isPropagationStopped: event.isPropagationStopped,
        persist: event.persist,
        target: event.target,
        timeStamp: event.timeStamp,
        type: 'change',
    };
}

function allowedError(error: NumberInputError): boolean {
    return (error === 'none') && (error === 'incompleteNumber');
}

export class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
    public static propTypes: Object = {
        children: React.PropTypes.node,
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
        inputStyle: React.PropTypes.object,
        name: React.PropTypes.string,
        onBlur: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onFocus: React.PropTypes.func,
        onErrro: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        style: React.PropTypes.object,
        underlineDisabledStyle: React.PropTypes.object,
        underlineFocusStyle: React.PropTypes.object,
        underlineShow: React.PropTypes.bool,
        underlineStyle: React.PropTypes.object,
        showDefaultValue: React.PropTypes.number,
        min: React.PropTypes.number,
        max: React.PropTypes.number,
        required: React.PropTypes.bool,
        useStrategy: React.PropTypes.oneOf(['ignore', 'warn', 'allow']),
        value: React.PropTypes.string
    };
    public static defaultProps: NumberInputProps = { required: false, useStrategy: 'allow' };
    public textField: TextField;
    private _onKeyDown: React.KeyboardEventHandler;
    private _onChange: React.FormEventHandler;
    private _onBlur: React.FocusEventHandler;

    private _emitEvents(nextError: NumberInputError, value: string): void {
        const { props, state } = this;
        const { onError, onValid, useStrategy } = props;
        const { error } = state;
        if((error !== nextError)) {
            if((onError !== undefined) && (useStrategy !== 'ignore')) {
                onError(nextError);
            }
            if((nextError === 'none') && (onValid !== undefined)) {
                onValid(Number(value));
            }
            this.setState({ error: nextError });
        }
    }

    private _validateNumberValue(value: number): number {
        const { max, min } = this.props;
        if((max !== undefined) && (value > max)) {
            return 1;
        }
        if((min !== undefined) && (value < min)) {
            return -1;
        }
        return 0;
    }

    private _validateValue(value: string): NumberInputError {
        const { props } = this;
        const { showDefaultValue } = props;
        if(value === undefined) {
            return;
        }
        if(value === '') {
            if(showDefaultValue !== undefined) {
                return 'required';
            }
        } else {
            if(value.match(/^(\-|\.|\d)+$/)) {
                if(value.match(/^-?((0|([1-9]\d{0,}))(\.\d{0,})?)?$/)) {
                    if(value.match(/^-?((0(\.\d+)?)|([1-9]\d{0,}(\.\d+)?))$/)) {
                        switch(this._validateNumberValue(Number(value))) {
                            case 1: return 'max';
                            case -1: return 'min';
                            default: return 'none';
                        }
                    } else {
                        return 'incompleteNumber';
                    }
                } else {
                    const last: string = value[value.length - 1];
                    let error: NumberInputError;
                    switch(last) {
                        case '-':
                            error = 'singleMinus';
                            break;
                        case '.':
                            error = 'singleFloatingPoint';
                            break;
                        default:
                            error = 'singleZero';
                            break;
                    }
                    return error;
                }
            } else {
                return 'invalidSymbol';
            }
        }
    }

    private _validateAndEmit(value: string) {
        this._emitEvents(this._validateValue(value), value);
    }
    
    private _handleKeyDown(event: React.KeyboardEvent): void {
        const { key } = event;
        const { onKeyDown, useStrategy } = this.props;
        const canCallOnKeyDown: boolean = onKeyDown !== undefined;
        const emitKeyDown: () => void = (): void => {
            if(canCallOnKeyDown) {
                onKeyDown(event);
            }
        }
        if(key.length === 1) {
            const eventValue: EventValue = event;
            const { value } = eventValue.target;
            const nextValue: string = key.length === 1 ? value + key : value;
            const error: NumberInputError = this._validateValue(nextValue);
            if((useStrategy !== 'allow') && allowedError(error)) {
                console.log(`prevent ${key}`);
                event.preventDefault();
            } else {
                emitKeyDown();
            }
        } else {
            emitKeyDown();
        }
    }   

    private _handleChange(event: React.FormEvent): void {
        const eventValue: EventValue = event;
        const { props, state } = this;
        const { onChange, useStrategy } = props;
        const { error } = state;
        if(onChange !== undefined) {
            onChange(event,  eventValue.target.value);
        }
    }

    private _handleBlur(event: React.FocusEvent): void {
        const eventValue: EventValue = event;
        const { useStrategy } = this.props;
        if(useStrategy === 'warn') {
            this._validateAndEmit(eventValue.target.value);
        }
    }

    public getInputNode(): Element {
        return this.textField.getInputNode();
    }

    public constructor(props: NumberInputProps) {
        super(props);
        this.state = { error: undefined };
        this._onKeyDown = this._handleKeyDown.bind(this);
        this._onChange = this._handleChange.bind(this);
        this._onBlur = this._handleBlur.bind(this);
    }

    public componentDidMount(): void {
        this._validateAndEmit(this.props.value);
    }

    public componentWillReceiveProps(props: NumberInputProps) {
        const { value } = props;
        if(value !== this.props.value) {
           this._validateAndEmit(value);
        }
    }

    public render(): JSX.Element {
        const { props, state, _onKeyDown, _onChange, _onBlur } = this;
        const { value, showDefaultValue, useStrategy } = props;
        const { error } = state;
        const showValue: string = (!allowedError(error) && (useStrategy === 'ignore') && (value !== undefined)) ? '' : value;
        console.log(error, useStrategy, showValue);
        let clonedProps: NumberInputProps = Object.assign({}, props);
        let newValue: string = error !== 'required' ? showValue : (showDefaultValue !== undefined ? String(showDefaultValue) : showValue);
        console.log(newValue);
        if(clonedProps.useStrategy !== undefined) {
            delete clonedProps.useStrategy;
        }
        if(clonedProps.showDefaultValue !== undefined) {
            delete clonedProps.showDefaultValue;
        }
        if(clonedProps.onError !== undefined) {
            delete clonedProps.onError;
        }
        if(clonedProps.onValid !== undefined) {
            delete clonedProps.onValid;
        }
        return React.cloneElement(<TextField />, Object.assign(clonedProps, {
            type: 'text',
            value: newValue,
            onKeyDown: _onKeyDown,
            onChange: _onChange,
            onBlur: _onBlur,
            ref: (textField: TextField) => {
                this.textField = textField;
            }
        }));
    }
}

export default NumberInput;