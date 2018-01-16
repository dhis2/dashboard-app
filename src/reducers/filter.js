import { combineReducers } from 'redux';
import { validateReducer } from '../util';

export const actionTypes = {
    SET_FILTER_NAME: 'SET_FILTER_NAME',
    SET_FILTER_OWNER: 'SET_FILTER_OWNER',
    SET_FILTER_ORDER: 'SET_FILTER_ORDER',
};

export const ownerData = [
    { id: 'ALL', value: 'All users' },
    { id: 'ME', value: 'Created by me' },
    { id: 'OTHERS', value: 'Created by others' },
];

export const orderData = [
    { id: 'NAME:ASC', value: 'Name (asc)' },
    { id: 'NAME:ASC', value: 'Name (desc)' },
    { id: 'ITEMS:ASC', value: 'Number of items (asc)' },
    { id: 'ITEMS:ASC', value: 'Number of items (desc)' },
    { id: 'CREATED:ASC', value: 'Created date (asc)' },
    { id: 'CREATED:ASC', value: 'Created date (desc)' },
];

export const DEFAULT_NAME = '';
export const DEFAULT_OWNER = ownerData[0].id;
export const DEFAULT_ORDER = orderData[0].id;

const name = (state = DEFAULT_NAME, action) => {
    switch (action.type) {
        case actionTypes.SET_FILTER_NAME:
            return validateReducer(action.value, DEFAULT_NAME);
        default:
            return state;
    }
};

const owner = (state = DEFAULT_OWNER, action) => {
    switch (action.type) {
        case actionTypes.SET_FILTER_OWNER:
            return validateReducer(action.value, DEFAULT_NAME);
        default:
            return state;
    }
};

const order = (state = DEFAULT_ORDER, action) => {
    switch (action.type) {
        case actionTypes.SET_FILTER_ORDER:
            return validateReducer(action.value, DEFAULT_ORDER);
        default:
            return state;
    }
};

export default combineReducers({
    name,
    owner,
    order,
});

// selectors

export const sGetFromState = state => state.filter;

// selector dependency level 2

export const sGetFilterName = state => sGetFromState(state).name;
export const sGetFilterOwner = state => sGetFromState(state).owner;
export const sGetFilterOrder = state => sGetFromState(state).order;
