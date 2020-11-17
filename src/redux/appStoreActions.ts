import { AppActions } from "./actionTypes";

export const addEvent = (name : string, email: string): any => {
    return { type : AppActions.ADD_EVENT, name, email };
}
