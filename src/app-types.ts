export interface Coordinator {
    id: number;
    name: string;
    lastname: string;
    email: string;
}
export interface Category {
    id: number;
    name: string;
}
export interface Section {
    label: string;
    input: Array<FormInput>;
    validation?: Array<Validation>;
}
export interface Validation {
    validationType: ValidationType;
    condition?: number | string | RegExp;
    message: string;
    inputIndex?: number;        // if there are more input fields, it is index of field in an array
}
export interface FormInput {
    fieldType?: FieldType;
    type: string;
    name: string;
    placeholder?: string;
    defaultValue?: string | boolean | number;       // in case you want to prefill the field (it will still be controlled input, but the state will be preset)
    values?: Array<string | boolean | number>;      // for radio buttons
    options?: Array<{ value : string | boolean | number; textValue : string }>;      // for options in select
    className?: string;
    min?: string | number;
    max?: string | number;
    conditional?: Condition;
    prefix?: string;                                // text node before Input
    sufix?: string;                                 // text node after Input
}
export interface Condition {
    conditionType: ConditionType;
    fieldIndex: number;                             // index of field to hide / show
    valueIs: string | number | boolean;             // value to compare
}

//*** ENUMS ***//

export enum ValidationType {
    NOT_EMPTY,
    REG_EXP,
    MIN_LENGTH,
    MAX_LENGTH,
    MIN_VALUE,
    MAX_VALUE
}

export enum ConditionType {
    SHOW_IF,
    HIDE_IF,
}

export enum FieldType {
    INPUT,
    TEXTAREA,
    SELECT
}