import { getBaseUrl } from './util';

// Item types
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
export const SPACER = 'SPACER';

// Domain types
export const DOMAIN_TYPE_AGGREGATE = 'AGGREGATE';
export const DOMAIN_TYPE_TRACKER = 'TRACKER';

// Visualization types
export const VISUALIZATION_TYPE_TABLE = 'TABLE';
export const VISUALIZATION_TYPE_CHART = 'CHART';
export const VISUALIZATION_TYPE_MAP = 'MAP';

export const spacerContent = 'SPACER_ITEM_FOR_DASHBOARD_LAYOUT_CONVENIENCE';
export const emptyTextItemContent = 'TEXT_ITEM_WITH_NO_CONTENT';
export const isSpacerType = item =>
    item.type === TEXT && item.text === spacerContent;
export const isTextType = item =>
    item.type === TEXT && item.text !== spacerContent;
export const isPluginType = item =>
    itemTypeMap[item.type].hasOwnProperty('plugin');

// Item type map
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
        appUrl: id => `dhis-web-pivot/?id=${id}`,
        icon: 'ViewList',
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
        appUrl: id => `dhis-web-visualizer/?id=${id}`,
        icon: 'InsertChart',
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
        appUrl: id => `dhis-web-maps/?id=${id}`,
        icon: 'Public',
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
        appUrl: id => `dhis-web-event-reports/?id=${id}`,
        icon: 'ViewList',
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
        appUrl: id => `dhis-web-event-visualizer/?id=${id}`,
        icon: 'InsertChart',
    },
    [APP]: {
        endPointName: 'apps',
        propName: 'app',
        countName: 'appCount',
        pluralTitle: 'Apps',
        icon: 'Extension',
    },
    [REPORTS]: {
        id: REPORTS,
        endPointName: 'reports',
        propName: 'reports',
        countName: 'reportCount',
        pluralTitle: 'Reports',
        appUrl: id =>
            `dhis-web-reporting/getReportParams.action?mode=report&uid=${id}`,
        icon: 'ViewList',
    },
    [RESOURCES]: {
        id: RESOURCES,
        endPointName: 'resources',
        propName: 'resources',
        countName: 'resourceCount',
        pluralTitle: 'Resources',
        appUrl: id => `api/documents/${id}`,
        icon: 'Description',
    },
    [USERS]: {
        id: USERS,
        endPointName: 'users',
        propName: 'users',
        countName: 'userCount',
        pluralTitle: 'Users',
        appUrl: id => `dhis-web-dashboard-integration/profile.action?id=${id}`,
        icon: 'Person',
    },
    [TEXT]: {
        id: TEXT,
        propName: 'text',
        icon: 'FontDownload',
    },
    [MESSAGES]: {
        propName: 'messages',
        icon: 'Email',
    },
    [SPACER]: {
        propName: 'text',
        icon: 'CropFree',
    },
};

export const getItemUrl = (type, id, d2) => {
    if (itemTypeMap[type] && itemTypeMap[type].appUrl) {
        return `${getBaseUrl(d2)}/${itemTypeMap[type].appUrl(id)}`;
    }
};
