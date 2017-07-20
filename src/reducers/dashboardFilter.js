export const actionTypes = {
    SET_DASHBOARD_FILTER: 'SET_DASHBOARD_FILTER'
};

export default (state = '', action) => {
    switch (action.type) {
        case actionTypes.SET_DASHBOARD_FILTER:
            return action.text;
        default:
            return state;
    }
};

// selectors level 1

export const getDashboardFilterFromState = state => state.dashboardFilter;
