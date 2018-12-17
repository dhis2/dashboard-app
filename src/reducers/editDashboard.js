/** @module reducers/editDashboard */
import update from 'immutability-helper';
import isEmpty from 'lodash/isEmpty';
import { orArray, orObject } from '../modules/util';

export const RECEIVED_EDIT_DASHBOARD = 'RECEIVED_EDIT_DASHBOARD';
export const RECEIVED_NOT_EDITING = 'RECEIVED_NOT_EDITING';
export const START_NEW_DASHBOARD = 'START_NEW_DASHBOARD';
export const RECEIVED_TITLE = 'RECEIVED_TITLE';
export const RECEIVED_DESCRIPTION = 'RECEIVED_DESCRIPTION';
export const ADD_DASHBOARD_ITEM = 'ADD_DASHBOARD_ITEM';
export const REMOVE_DASHBOARD_ITEM = 'REMOVE_DASHBOARD_ITEM';
export const UPDATE_DASHBOARD_ITEM = 'UPDATE_DASHBOARD_ITEM';
export const RECEIVED_DASHBOARD_LAYOUT = 'RECEIVED_DASHBOARD_LAYOUT';

export const DEFAULT_STATE_EDIT_DASHBOARD = {};
export const NEW_DASHBOARD_STATE = {
    id: '',
    name: '',
    access: {},
    description: '',
    dashboardItems: [],
};

export default (state = DEFAULT_STATE_EDIT_DASHBOARD, action) => {
    switch (action.type) {
        case RECEIVED_EDIT_DASHBOARD:
            const newState = {};
            Object.keys(NEW_DASHBOARD_STATE).map(
                k => (newState[k] = action.value[k])
            );
            return newState;
        case RECEIVED_NOT_EDITING:
            return DEFAULT_STATE_EDIT_DASHBOARD;
        case START_NEW_DASHBOARD:
            return NEW_DASHBOARD_STATE;
        case RECEIVED_TITLE: {
            return Object.assign({}, state, { name: action.value });
        }
        case RECEIVED_DESCRIPTION: {
            return Object.assign({}, state, {
                description: action.value,
            });
        }
        case ADD_DASHBOARD_ITEM:
            return update(state, {
                dashboardItems: { $unshift: [action.value] },
            });
        case REMOVE_DASHBOARD_ITEM: {
            const idToRemove = action.value;

            const dashboardItemIndex = state.dashboardItems.findIndex(
                item => item.id === idToRemove
            );

            if (dashboardItemIndex > -1) {
                return update(state, {
                    dashboardItems: {
                        $splice: [[dashboardItemIndex, 1]],
                    },
                });
            }

            return state;
        }
        case RECEIVED_DASHBOARD_LAYOUT: {
            const stateItems = orArray(state.dashboardItems);

            const newStateItems = action.value.map(({ x, y, w, h, i }) => {
                const stateItem = stateItems.find(si => si.id === i);

                return Object.assign({}, stateItem, { w, h, x, y });
            });

            return update(state, {
                dashboardItems: { $set: newStateItems },
            });
        }
        case UPDATE_DASHBOARD_ITEM: {
            const dashboardItem = action.value;

            const dashboardItemIndex = state.dashboardItems.findIndex(
                item => item.id === dashboardItem.id
            );

            if (dashboardItemIndex > -1) {
                const newState = update(state, {
                    dashboardItems: {
                        $splice: [[dashboardItemIndex, 1, dashboardItem]],
                    },
                });

                return newState;
            }

            return state;
        }
        default:
            return state;
    }
};

// root selector

export const sGetEditDashboardRoot = state => state.editDashboard;

// selectors

export const sGetIsEditing = state => !isEmpty(state.editDashboard);

export const sGetIsNewDashboard = state => {
    return (
        !isEmpty(state.editDashboard) && sGetEditDashboardRoot(state).id === ''
    );
};

export const sGetEditDashboardItems = state =>
    orObject(sGetEditDashboardRoot(state)).dashboardItems;
