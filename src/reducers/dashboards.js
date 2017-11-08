import { validateReducer } from '../util';

export const actionTypes = {
    SET_DASHBOARDS: 'SET_DASHBOARDS',
};

export const DEFAULT_DASHBOARDS = [];

export default (state = DEFAULT_DASHBOARDS, action) => {
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

export const getDashboards = data => data.map(d => ({
    id: d.id,
    name: d.name,
    description: d.description,
    starred: Math.random() > 0.7,
    owner: d.user.name,
    created: d.created.split('T').join(' ').substr(0, 16),
    lastUpdated: d.lastUpdated.split('T').join(' ').substr(0, 16),
    numberOfItems: d.dashboardItems,
}));

// api

export const getPersistedState = state => ({ // TODO
    dashboards: state.dashboards,
});
