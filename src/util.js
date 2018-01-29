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

// event handler wrapper
export const eventHandlerWrapper = (handler, ...params) => () =>
    handler(...params);

// reducer validator
export const validateReducer = (value, defaultValue) =>
    value === undefined || value === null ? defaultValue : value;

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

export const DOMAIN_TYPE_AGGREGATE = 'AGGREGATE';
export const DOMAIN_TYPE_TRACKER = 'TRACKER';

export const VISUALIZATION_TYPE_TABLE = 'TABLE';
export const VISUALIZATION_TYPE_CHART = 'CHART';
export const VISUALIZATION_TYPE_MAP = 'MAP';

export const itemTypeMap = {
    [REPORT_TABLE]: {
        id: REPORT_TABLE,
        endPointName: 'reportTables',
        propName: 'reportTable',
        countName: 'reportTableCount',
        pluralTitle: 'Report tables',
        plugin: global.reportTablePlugin,
        domainType: DOMAIN_TYPE_AGGREGATE,
        visualizationType: VISUALIZATION_TYPE_TABLE,
    },
    [CHART]: {
        id: CHART,
        endPointName: 'charts',
        propName: 'chart',
        countName: 'chartCount',
        pluralTitle: 'Charts',
        plugin: global.chartPlugin,
        domainType: DOMAIN_TYPE_AGGREGATE,
        visualizationType: VISUALIZATION_TYPE_CHART,
    },
    [MAP]: {
        id: MAP,
        endPointName: 'maps',
        propName: 'map',
        countName: 'mapCount',
        pluralTitle: 'Maps',
        plugin: global.mapPlugin,
        domainType: DOMAIN_TYPE_AGGREGATE,
        visualizationType: VISUALIZATION_TYPE_MAP,
    },
    [EVENT_REPORT]: {
        id: EVENT_REPORT,
        endPointName: 'eventReports',
        propName: 'eventReport',
        countName: 'eventReportCount',
        pluralTitle: 'Event reports',
        plugin: global.eventReportPlugin,
        domainType: DOMAIN_TYPE_TRACKER,
        visualizationType: VISUALIZATION_TYPE_TABLE,
    },
    [EVENT_CHART]: {
        id: EVENT_CHART,
        endPointName: 'eventCharts',
        propName: 'eventChart',
        countName: 'eventChartCount',
        pluralTitle: 'Event charts',
        plugin: global.eventChartPlugin,
        domainType: DOMAIN_TYPE_TRACKER,
        visualizationType: VISUALIZATION_TYPE_CHART,
    },
    [APP]: {
        endPointName: 'apps',
        propName: 'app',
        countName: 'appCount',
        pluralTitle: 'Apps',
    },
    [REPORTS]: {
        id: REPORTS,
        endPointName: 'reports',
        propName: 'reports',
        countName: 'reportCount',
        pluralTitle: 'Reports',
    },
    [RESOURCES]: {
        id: RESOURCES,
        endPointName: 'resources',
        propName: 'resources',
        countName: 'resourceCount',
        pluralTitle: 'Resources',
    },
    [USERS]: {
        id: USERS,
        endPointName: 'users',
        propName: 'users',
        countName: 'userCount',
        pluralTitle: 'Users',
    },
    [TEXT]: {
        id: TEXT,
        propName: 'text',
    },
    [MESSAGES]: {
        propName: 'messages',
    },
};

export const getItemTypeIdByVisualizationTypeAndDomainType = (
    visualizationType,
    domainType
) =>
    Object.values(itemTypeMap)
        .filter(
            item =>
                item.visualizationType === visualizationType &&
                item.domainType === domainType
        )
        .map(item => item.id);

export const extractFavoriteFromDashboardItem = item => {
    if (!isObject(item)) {
        return null;
    }

    switch (item.type) {
        case REPORT_TABLE:
            return item.reportTable;
        case CHART:
            return item.chart;
        case MAP:
            return item.map;
        case EVENT_REPORT:
            return item.eventReport;
        case EVENT_CHART:
            return item.eventChart;
        default:
            return (
                item.reportTable ||
                item.chart ||
                item.map ||
                item.eventReport ||
                item.eventChart ||
                {}
            );
    }
};
