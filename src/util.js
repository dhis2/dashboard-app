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

export const formatDate = (value, uiLocale) => {
    if (typeof global.Intl !== 'undefined' && Intl.DateTimeFormat) {
        const locale = uiLocale || 'en';
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(value));
    }

    return value.substr(0, 19).replace('T', ' ');
};

/**
 * Sorts an array of objects based on provided date property
 *
 * @param {Array} items Array of objects
 * @param {String} dateProp Name of the date property to be used for sorting
 * @param {Boolean} ascending Whether to sort ascending or descending
 */
export const sortByDate = (items, dateProp, ascending = true) => {
    const values = Object.values(items);

    values.sort((a, b) => {
        const aDate = new Date(a[dateProp]);
        const bDate = new Date(b[dateProp]);

        return ascending ? aDate - bDate : bDate - aDate;
    });

    return values;
};

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

// item types
export const REPORT_TABLE = 'REPORT_TABLE';
export const CHART = 'CHART';
export const MAP = 'MAP';
export const EVENT_REPORT = 'EVENT_REPORT';
export const EVENT_CHART = 'EVENT_CHART';
export const APP = 'APP';
export const REPORTS = 'REPORTS';
export const RESOURCES = 'RESOURCES';
export const USERS = 'USERS';
export const MESSAGES = 'MESSAGES';
export const TEXT = 'TEXT';

export const itemTypeMap = {
    [REPORT_TABLE]: {
        endPointName: 'reportTables',
        propName: 'reportTable',
        countName: 'reportTableCount',
        plugin: global.reportTablePlugin,
        pluralTitle: 'Report tables',
        appUrl: id => `dhis-web-pivot/?id=${id}`,
    },
    [CHART]: {
        endPointName: 'charts',
        propName: 'chart',
        countName: 'chartCount',
        plugin: global.chartPlugin,
        pluralTitle: 'Charts',
        appUrl: id => `dhis-web-visualizer/?id=${id}`,
    },
    [MAP]: {
        endPointName: 'maps',
        propName: 'map',
        countName: 'mapCount',
        pluralTitle: 'Maps',
        appUrl: id => `dhis-web-mapping/?id=${id}`,
    },
    [EVENT_REPORT]: {
        endPointName: 'eventReports',
        propName: 'eventReport',
        countName: 'eventReportCount',
        pluralTitle: 'Event reports',
        appUrl: id => `dhis-web-event-reports/?id=${id}`,
    },
    [EVENT_CHART]: {
        endPointName: 'eventCharts',
        propName: 'eventChart',
        countName: 'eventChartCount',
        pluralTitle: 'Event charts',
        appUrl: id => `dhis-web-event-visualizer/?id=${id}`,
    },
    [APP]: {
        endPointName: 'apps',
        propName: 'app',
        countName: 'appCount',
        pluralTitle: 'Apps',
    },
    [REPORTS]: {
        endPointName: 'reports',
        propName: 'reports',
        countName: 'reportCount',
        pluralTitle: 'Reports',
        appUrl: id =>
            `dhis-web-reporting/getReportParams.action?mode=report&uid=${id}`,
    },
    [RESOURCES]: {
        endPointName: 'resources',
        propName: 'resources',
        countName: 'resourceCount',
        pluralTitle: 'Resources',
        appUrl: (id, baseUrl) => `${baseUrl}/documents/${id}/data`,
    },
    [USERS]: {
        endPointName: 'users',
        propName: 'users',
        countName: 'userCount',
        pluralTitle: 'Users',
        appUrl: id => `dhis-web-dashboard-integration/profile.action?id=${id}`,
    },
    [TEXT]: {
        propName: 'text',
    },
    [MESSAGES]: {
        propName: 'messages',
    },
};
