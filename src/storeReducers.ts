import {ADD_EVENT} from "./storeActions";
import { combineReducers } from 'redux';

const initialAppState : object = {
    name: "",
    email: ""
};

const dfltAction : object = { type : null };

function appStoreReducer(state : any = initialAppState, action : any = dfltAction): object {
    switch(action.type){
        case ADD_EVENT:
            return Object.assign({}, state, { name : action.name, email : action.email });
        default:
            return state;
    }
}


export default combineReducers({appState:appStoreReducer});