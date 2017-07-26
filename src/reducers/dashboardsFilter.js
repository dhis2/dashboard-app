export const actionTypes = {
    SET_DASHBOARDS_TEXTFILTER: 'SET_DASHBOARDS_TEXTFILTER'
};

export const DEFAULT_VALUE = '';

export default (state = DEFAULT_VALUE, action) => {
    switch (action.type) {
        case actionTypes.SET_DASHBOARDS_FILTER:
            return action.text || DEFAULT_VALUE;
        default:
            return state;
    }
};

// selectors level 1

export const sGetDashboardsFilterFromState = state => state.dashboardsFilter;
