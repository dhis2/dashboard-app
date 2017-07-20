export const actionTypes = {
    SET_SELECTED_DASHBOARD: 'SET_SELECTED_DASHBOARD'
};

export default (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_DASHBOARD:
            return action.id;
        default:
            return state;
    }
};

// selectors level 1

export const getSelectedDashboardIdFromState = state => state.selectedDashboardId;
