import isNumber from 'd2-utilizr/lib/isNumber';

import data from '../data';

export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getDate = () => {
    const y = Math.floor(Math.random() * 3) + 2015;
    const M = Math.floor(Math.random() * 12) + 1;
    const d = Math.floor(Math.random() * 28) + 1;
    const h = Math.floor(Math.random() * 23) + 1;
    const m = Math.floor(Math.random() * 59) + 1;
    const s = Math.floor(Math.random() * 59) + 1;

    return (new Date(y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s)).toJSON().replace('T', ' ').substr(0, 19);
};

export const getDashboards = (textFilter, showFilter, sortFilter) => {
    const date = getDate();

    return data.map(d => ({
        id: d.id,
        name: d.name,
        starred: d.starred,
        created: date,
        lastModified: date,
        numberOfItems: d.dashboardItems.length
    }));
};

const hasPosition = item => isNumber(item.x) && isNumber(item.y) && isNumber(item.w) && isNumber(item.h);

const setPosition = (item, i) => {
    const cols = 4; //TODO
};

export const getDashboardItems = id => {
    return data
        .filter(d => d.id === id)
        .map(d => d.dashboardItems)[0];
};

export const apiFetchDashboards = () => {
    return Promise.resolve(getDashboards());

    // return new Promise((resolve, reject) => {
    //     resolve(getDashboards());
    // });
};
