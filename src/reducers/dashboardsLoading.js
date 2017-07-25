import isBoolean from 'd2-utilizr/lib/isBoolean';

export const actionTypes = {
    SET_DASHBOARDS_ISFETCHING: 'SET_DASHBOARDS_ISFETCHING'
};

const DEFAULT_ISFETCHING = false;

export default (state = DEFAULT_ISFETCHING, action) => {
    switch (action.type) {
        case actionTypes.SET_DASHBOARDS_ISFETCHING:
            return isBoolean(action.isFetching) ? action.isFetching : DEFAULT_ISFETCHING;
        default:
            return state;
    }
};

// selectors level 1

export const sGetDashboardsIsFetchingFromState = state => state.dashboardsIsFetching;
