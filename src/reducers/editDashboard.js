/** @module reducers/editDashboard */

export const actionTypes = {
    RECEIVED_EDIT_DASHBOARD: 'RECEIVED_EDIT_DASHBOARD',
    RECEIVED_TITLE: 'RECEIVED_TITLE',
};

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.RECEIVED_EDIT_DASHBOARD:
            return action.value;
        case actionTypes.RECEIVED_TITLE: {
            const newState = Object.assign({}, state, { name: action.value });
            return newState;
        }

        default:
            return state;
    }
};

// selectors
export const sGetEditDashboard = state => {
    return state.editDashboard;
};
