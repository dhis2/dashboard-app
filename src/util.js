import isObject from 'd2-utilizr/lib/isObject';

// validation
export function orNull(param) {
    return param === undefined ? null : param;
}

export function orArray(param) {
    return Array.isArray(param) ? param : [];
}

export function orObject(param) {
    return isObject(param) ? param : {};
}

// array
export function arrayGetById(array, id) {
    return array.find(item => item.id === id);
}

// object
export function arrayToIdMap(array) {
    return array.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});
}

// date
export function getDate() {
    const y = Math.floor(Math.random() * 3) + 2015;
    const M = Math.floor(Math.random() * 12) + 1;
    const d = Math.floor(Math.random() * 28) + 1;
    // const h = Math.floor(Math.random() * 23) + 1;
    // const m = Math.floor(Math.random() * 59) + 1;
    // const s = Math.floor(Math.random() * 59) + 1;

    return new Date(`${y}-${M}-${d}`)
        .toJSON()
        .replace('T', ' ')
        .substr(0, 10);
}

// reducer validator
export const validateReducer = (value, defaultValue) =>
    value === undefined || value === null ? defaultValue : value;

// dashboard item
export const getDashboardItemFavorite = item =>
    item.reportTable ||
    item.chart ||
    item.map ||
    item.eventReport ||
    item.eventChart;

// favorite type url map
export const favoriteTypeUrlMap = {
    REPORT_TABLE: {
        endPointName: 'reportTables',
        propName: 'reportTable',
    },
    CHART: {
        endPointName: 'charts',
        propName: 'chart',
    },
    MAP: {
        endPointName: 'maps',
        propName: 'map',
    },
    EVENT_REPORT: {
        endPointName: 'eventReports',
        propName: 'eventReport',
    },
    EVENT_CHART: {
        endPointName: 'eventCharts',
        propName: 'eventChart',
    },
};
