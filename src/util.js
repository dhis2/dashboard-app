import isObject from 'd2-utilizr/lib/isObject';

// long text
export const loremIpsum =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';

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
        countName: 'reportTableCount',
    },
    CHART: {
        endPointName: 'charts',
        propName: 'chart',
        countName: 'chartCount',
    },
    MAP: {
        endPointName: 'maps',
        propName: 'map',
        countName: 'mapCount',
    },
    EVENT_REPORT: {
        endPointName: 'eventReports',
        propName: 'eventReport',
        countName: 'eventReportCount',
    },
    EVENT_CHART: {
        endPointName: 'eventCharts',
        propName: 'eventChart',
        countName: 'eventChartCount',
    },
};

export const itemTypeMap = {
    ...favoriteTypeUrlMap,
    APP: {
        endPointName: 'apps',
        propName: 'app',
        countName: 'appCount',
    },
    REPORT: {
        endPointName: 'reports',
        propName: 'report',
        countName: 'reportCount',
    },
    RESOURCE: {
        endPointName: 'resources',
        propName: 'resource',
        countName: 'resourceCount',
    },
    USER: {
        endPointName: 'users',
        propName: 'user',
        countName: 'userCount',
    },
};
