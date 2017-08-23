import isNumber from 'd2-utilizr/lib/isNumber';

import data, { description } from '../data';

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
        description: description,
        starred: d.starred,
        created: date,
        lastModified: date,
        numberOfItems: d.dashboardItems.length
    }));
};

const hasPosition = item => isNumber(item.x) && isNumber(item.y) && isNumber(item.w) && isNumber(item.h);

const getPosition = i => {
    const numberOfCols = 3;
    const itemWidth = 9;
    const itemHeight = 10;

    const col = i % numberOfCols;
    const row = Math.floor(i / numberOfCols);

    return {
        x: col * itemWidth,
        y: row * itemHeight,
        w: itemWidth,
        h: itemHeight
    };
};

export const getDashboardItems = dashboardId => {
    const items = ((data.find(d => d.id === dashboardId) || {}).dashboardItems || []);

    items.forEach((di, i) => {
        if (!hasPosition(di)) {
            Object.assign(di, getPosition(i));
        }
    });

    return items;
};

export const apiFetchDashboards = () => {
    //fetch('')



    //return Promise.resolve(getDashboards());

    return new Promise((resolve, reject) => {
        resolve(getDashboards());
    });
};
