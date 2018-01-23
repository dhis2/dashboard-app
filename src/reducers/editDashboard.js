/** @module reducers/editDashboard */

export const actionTypes = {
    RECEIVED_EDIT_DASHBOARD: 'RECEIVED_EDIT_DASHBOARD',
    RECEIVED_TITLE: 'RECEIVED_TITLE',
    RECEIVED_DESCRIPTION: 'RECEIVED_DESCRIPTION',
};

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.RECEIVED_EDIT_DASHBOARD:
            return action.value;
        case actionTypes.RECEIVED_TITLE: {
            return Object.assign({}, state, { name: action.value });
        }
        case actionTypes.RECEIVED_DESCRIPTION: {
            return Object.assign({}, state, {
                description: action.value,
            });
        }

        default:
            return state;
    }
};

// selectors
export const sGetEditDashboard = state => {
    return state.editDashboard;
};
