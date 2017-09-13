import { validateReducer } from './index';

export const actionTypes = {
    SET_DASHBOARDS: 'SET_DASHBOARDS',
};

export const DEFAULT_DASHBOARDS = [];

export default (state = [], action) => {
    switch (action.type) {
    case actionTypes.SET_DASHBOARDS:
        return validateReducer(action.dashboards, DEFAULT_DASHBOARDS);
    default:
        return state;
    }
};

// root selector

export const sGetFromState = state => state.dashboards;

// selectors level 1

export const sGetDashboardById = (state, id) => sGetFromState(state).find(dashboard => dashboard.id === id);

// util

// export const filterChangedDashboardItems = (state, itemsConfig) =>

// api

export const getPersistedState = state => ({ // TODO
    dashboards: state.dashboards,
});
