import { combineReducers } from 'redux';

export const actionTypes = {
    SET_DASHBOARDS: 'SET_DASHBOARDS',
    SET_SELECTED_DASHBOARD: 'SET_SELECTED_DASHBOARD'
};

const dashboards = (state = [], action) => {
    switch (action.type) {
        case actionTypes.SET_DASHBOARDS:
            return action.dashboards;
        default:
            return state;
    }
};

const selectedDashboardId = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_DASHBOARD:
            return action.id;
        default:
            return state;
    }
};

export default combineReducers({
    dashboards,
    selectedDashboardId
});

// selectors

export const getDashboardsFromState = (state) => state.dashboards;

export const getSelectedDashboardId = (state) => state.selectedDashboardId;