import { AppActions, FormActions } from "./actionTypes";
import { combineReducers } from 'redux';

const initialAppState : object = {
    name: "",
    email: ""
};

const dfltAction : object = { type : null };

function appStoreReducer(state : any = initialAppState, action : any = dfltAction): object {
    switch(action.type){
        case AppActions.ADD_EVENT:
            return Object.assign({}, state, { name : action.name, email : action.email });
        default:
            return state;
    }
}

function formStoreReducer(state : any = {}, action : any = dfltAction): object {
    switch(action.type){
        case FormActions.SET_VALUE:
            return Object.assign({}, state, action.values);
        default:
            return state;
    }
}

export default combineReducers({
    appState : appStoreReducer,
    formState : formStoreReducer
});