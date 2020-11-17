import { FormActions } from "./actionTypes";

export interface FieldValue {
    key: string;
    value: string | number | boolean;
}

export const setFieldValue = (values : Array<FieldValue>): any => {
    return { type : FormActions.SET_VALUE, values };
}