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

export const sGetFromState = state => state.dashboards;

// selectors level 2

export const sGetDashboardById = (state, id) => sGetFromState(state).find(dashboard => dashboard.id === id);

// api

export const getPersistedState = state => ({ //TODO
    dashboards: state.dashboards
});