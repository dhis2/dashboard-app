export const actionTypes = {
    SET_DASHBOARDS: 'SET_DASHBOARDS'
};

export default (state = [], action) => {
    switch (action.type) {
        case actionTypes.SET_DASHBOARDS:
            return action.dashboards;
        default:
            return state;
    }
};

// selectors level 1

export const getDashboardsFromState = state => state.dashboards;

// selectors level 2

export const getDashboardById = (state, id) => getDashboardsFromState(state).find(dashboard => dashboard.id === id);
