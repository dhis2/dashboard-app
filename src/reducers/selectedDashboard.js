import { validateReducer, hasShape, getShape } from '../util';

export const actionTypes = {
    SET_SELECTEDDASHBOARD: 'SET_SELECTEDDASHBOARD',
};

export const DEFAULT_SELECTEDDASHBOARD = null;

export default (state = DEFAULT_SELECTEDDASHBOARD, action) => {
    switch (action.type) {
    case actionTypes.SET_SELECTEDDASHBOARD:
        return validateReducer(action.value, DEFAULT_SELECTEDDASHBOARD);
    default:
        return state;
    }
};

// root selector

export const sGetSelectedDashboardFromState = state => state.selectedDashboard;

// selector level 2

export const sGetSelectedDashboardItems = state => (sGetSelectedDashboardFromState(state) || {}).dashboardItems || [];

// util

export const uGetTransformedItems = items => items.map((item, index) => (hasShape(item) ? item : Object.assign({}, item, getShape(index))));
