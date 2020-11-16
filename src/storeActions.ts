export const ADD_EVENT = "ADD_EVENT";

export const addEvent = (name : string, email: string): any => {
    return { type : ADD_EVENT, name, email };
}