/** @module reducers/editDashboard */
import update from 'immutability-helper';

export const actionTypes = {
    RECEIVED_EDIT_DASHBOARD: 'RECEIVED_EDIT_DASHBOARD',
    RECEIVED_TITLE: 'RECEIVED_TITLE',
    ADD_DASHBOARD_ITEM: 'ADD_DASHBOARD_ITEM',
    REMOVE_DASHBOARD_ITEM: 'REMOVE_DASHBOARD_ITEM',
    UPDATE_DASHBOARD_ITEM: 'UPDATE_DASHBOARD_ITEM',
};

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.RECEIVED_EDIT_DASHBOARD:
            return action.value;
        case actionTypes.RECEIVED_TITLE: {
            const newState = Object.assign({}, state, { name: action.value });
            return newState;
        }
        case actionTypes.ADD_DASHBOARD_ITEM:
            return update(state, {
                dashboardItems: { $push: [action.value] },
            });
        case actionTypes.REMOVE_DASHBOARD_ITEM: {
            const dashboardItem = action.value;

            const dashboardItemIndex = state.dashboardItems.findIndex(
                item => item.id === dashboardItem.id
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
        case actionTypes.UPDATE_DASHBOARD_ITEM: {
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

// selectors
export const sGetEditDashboard = state => {
    return state.editDashboard;
};
