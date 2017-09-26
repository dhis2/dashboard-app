import isNumber from 'd2-utilizr/lib/isNumber';

import { validateReducer } from './index';

import { getDate } from '../util';

import data, { description } from '../data';

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

export const getDashboards = (textFilter, showFilter, ownerFilter) => {
    let date;

    // getInstance().then(d2 => d2.models.dashboard.list().then(dashboardCollection => {
    //
    //     console.log(dashboardCollection.toArray());
    // }));

    return data.map((d) => {
        date = getDate();

        return {
            id: d.id,
            name: d.name,
            description,
            starred: d.starred,
            owner: d.owner,
            created: date,
            lastModified: date,
            numberOfItems: d.dashboardItems.length,
        };
    });
};

const hasPosition = item => isNumber(item.x) && isNumber(item.y) && isNumber(item.w) && isNumber(item.h);

const getPosition = (i) => {
    const numberOfCols = 3;
    const itemWidth = 9;
    const itemHeight = 10;

    const col = i % numberOfCols;
    const row = Math.floor(i / numberOfCols);

    return {
        x: col * itemWidth,
        y: row * itemHeight,
        w: itemWidth,
        h: itemHeight,
    };
};

export const getDashboardItems = (dashboardId) => {
    const items = ((data.find(d => d.id === dashboardId) || {}).dashboardItems || []);

    items.forEach((di, i) => {
        if (!hasPosition(di)) {
            Object.assign(di, getPosition(i));
        }
    });

    return items;
};


// api

export const getPersistedState = state => ({ // TODO
    dashboards: state.dashboards,
});
