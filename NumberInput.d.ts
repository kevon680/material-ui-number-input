/// <reference types="react" />
/// <reference types="material-ui" />
import * as React from 'react';
import TextField from 'material-ui/TextField';
export declare type NumberInputError = 'none' | 'invalidSymbol' | 'incompleteNumber' | 'singleMinus' | 'singleFloatingPoint' | 'singleZero' | 'min' | 'max' | 'required' | 'clean';
export declare type NumberInputChangeHandler = (event: React.FormEvent<{}>, value: string) => void;
export declare type NumberInputValidHandler = (valid: number) => void;
export declare type NumberInputErrorHandler = (error: NumberInputError) => void;
export declare type NumberInputReqestValueHandller = (value: string) => void;
export interface EventValue {
    target: {
        value?: string;
    };
}
export interface NumberInputProps {
    className?: string;
    disabled?: boolean;
    floatingLabelFixed?: boolean;
    id?: string;
    inputMode?: string;
    name?: string;
    fullWidth?: boolean;
    underlineShow?: boolean;
    defaultValue?: number;
    min?: number;
    max?: number;
    required?: boolean;
    strategy?: 'ignore' | 'warn' | 'allow';
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
    onBlur?: React.FocusEventHandler<{}>;
    onChange?: NumberInputChangeHandler;
    onError?: NumberInputErrorHandler;
    onValid?: NumberInputValidHandler;
    onRequestValue?: NumberInputReqestValueHandller;
    onFocus?: React.FocusEventHandler<{}>;
    onKeyDown?: React.KeyboardEventHandler<{}>;
}
export declare type NumberInputErrorExtended = NumberInputError | 'limit' | 'allow';
export declare class NumberInput extends React.Component<NumberInputProps, Object> {
    private static getValidValue(value);
    private static deleteOwnProps(props);
    private static validateNumberValue(value, props);
    private static validateValue(value, props);
    private static overrideRequestedValue(error, value, props);
    private static overrideError(error, props);
    private static revertAllowToMin(error);
    private static emitValid(error, overridenError);
    private static validSymbols;
    private static stricAllowed;
    private static validNumber;
    private static allowed;
    private static deleteProps;
    static propTypes: React.ValidationMap<NumberInputProps>;
    static defaultProps: NumberInputProps;
    textField: TextField;
    private error;
    private lastValid;
    private constProps;
    private emitEvents(nextError, value, valid, props);
    private takeActionForValue(value, props);
    private shouldTakeActionForValue(props);
    private refTextField(textField);
    private onChange(event);
    private onBlur(event);
    getInputNode(): HTMLInputElement;
    getTextField(): TextField;
    constructor(props: NumberInputProps);
    componentDidMount(): void;
    componentWillReceiveProps(props: NumberInputProps): void;
    render(): JSX.Element;
}
export default NumberInput;
