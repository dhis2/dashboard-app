import i18n from 'd2-i18n';
import TableIcon from '@material-ui/icons/ViewList';
import ChartIcon from '@material-ui/icons/InsertChart';
import MapIcon from '@material-ui/icons/Public';
import ExtensionIcon from '@material-ui/icons/Extension';
import DescriptionIcon from '@material-ui/icons/Description';
import PersonIcon from '@material-ui/icons/Person';
import FontDownloadIcon from '@material-ui/icons/FontDownload';
import EmailIcon from '@material-ui/icons/Email';
import CropFreeIcon from '@material-ui/icons/CropFree';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

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
        pluralTitle: i18n.t('Pivot tables'),
        plugin: global.reportTablePlugin,
        domainType: DOMAIN_TYPE_AGGREGATE,
        visualizationType: VISUALIZATION_TYPE_TABLE,
        appUrl: id => `dhis-web-pivot/?id=${id}`,
        appName: i18n.t('Pivot Tables'),
    },
    [CHART]: {
        id: CHART,
        endPointName: 'charts',
        propName: 'chart',
        countName: 'chartCount',
        pluralTitle: i18n.t('Charts'),
        plugin: global.chartPlugin,
        domainType: DOMAIN_TYPE_AGGREGATE,
        visualizationType: VISUALIZATION_TYPE_CHART,
        appUrl: id => `dhis-web-data-visualizer/#/${id}`,
        appName: i18n.t('Visualizer'),
    },
    [MAP]: {
        id: MAP,
        endPointName: 'maps',
        propName: 'map',
        countName: 'mapCount',
        pluralTitle: i18n.t('Maps'),
        plugin: global.mapPlugin,
        domainType: DOMAIN_TYPE_AGGREGATE,
        visualizationType: VISUALIZATION_TYPE_MAP,
        appUrl: id => `dhis-web-maps/?id=${id}`,
        appName: i18n.t('Maps'),
    },
    [EVENT_REPORT]: {
        id: EVENT_REPORT,
        endPointName: 'eventReports',
        propName: 'eventReport',
        countName: 'eventReportCount',
        pluralTitle: i18n.t('Event reports'),
        plugin: global.eventReportPlugin,
        domainType: DOMAIN_TYPE_TRACKER,
        visualizationType: VISUALIZATION_TYPE_TABLE,
        appUrl: id => `dhis-web-event-reports/?id=${id}`,
        appName: i18n.t('Event Reports'),
    },
    [EVENT_CHART]: {
        id: EVENT_CHART,
        endPointName: 'eventCharts',
        propName: 'eventChart',
        countName: 'eventChartCount',
        pluralTitle: i18n.t('Event charts'),
        plugin: global.eventChartPlugin,
        domainType: DOMAIN_TYPE_TRACKER,
        visualizationType: VISUALIZATION_TYPE_CHART,
        appUrl: id => `dhis-web-event-visualizer/?id=${id}`,
        appName: i18n.t('Event Visualizer'),
    },
    [APP]: {
        endPointName: 'apps',
        propName: 'appKey',
        countName: 'appCount',
        pluralTitle: 'Apps',
    },
    [REPORTS]: {
        id: REPORTS,
        endPointName: 'reports',
        propName: 'reports',
        countName: 'reportCount',
        pluralTitle: i18n.t('Reports'),
        appUrl: id =>
            `dhis-web-reporting/getReportParams.action?mode=report&uid=${id}`,
    },
    [RESOURCES]: {
        id: RESOURCES,
        endPointName: 'resources',
        propName: 'resources',
        countName: 'resourceCount',
        pluralTitle: i18n.t('Resources'),
        appUrl: id => `api/documents/${id}/data`,
    },
    [USERS]: {
        id: USERS,
        endPointName: 'users',
        propName: 'users',
        countName: 'userCount',
        pluralTitle: i18n.t('Users'),
        appUrl: id => `dhis-web-dashboard-integration/profile.action?id=${id}`,
    },
    [TEXT]: {
        id: TEXT,
        propName: 'text',
    },
    [MESSAGES]: {
        propName: 'messages',
    },
    [SPACER]: {
        propName: 'text',
    },
};

export const getItemUrl = (type, item, d2) => {
    let url;

    if (type === APP) {
        url = item.launchUrl;
    }

    if (itemTypeMap[type] && itemTypeMap[type].appUrl) {
        url = `${getBaseUrl(d2)}/${itemTypeMap[type].appUrl(item.id)}`;
    }

    return url;
};

export const getItemIcon = type => {
    switch (type) {
        case REPORT_TABLE:
        case EVENT_REPORT:
        case REPORTS:
            return TableIcon;
        case CHART:
        case EVENT_CHART:
            return ChartIcon;
        case MAP:
            return MapIcon;
        case APP:
            return ExtensionIcon;
        case RESOURCES:
            return DescriptionIcon;
        case USERS:
            return PersonIcon;
        case TEXT:
            return FontDownloadIcon;
        case MESSAGES:
            return EmailIcon;
        case SPACER:
            return CropFreeIcon;
        default:
            return NotInterestedIcon;
    }
};
