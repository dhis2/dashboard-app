import { VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    IconApps24,
    IconEmptyFrame24,
    IconFileDocument24,
    IconLink24,
    IconMail24,
    IconQuestion24,
    IconTable24,
    IconTextBox24,
    IconUser24,
    IconVisualizationColumn24,
    IconWorld24,
} from '@dhis2/ui'

// Item types
export const VISUALIZATION = 'VISUALIZATION'
export const REPORT_TABLE = 'REPORT_TABLE'
export const CHART = 'CHART'
export const MAP = 'MAP'
export const EVENT_REPORT = 'EVENT_REPORT'
export const EVENT_CHART = 'EVENT_CHART'
export const EVENT_VISUALIZATION = 'EVENT_VISUALIZATION'
export const APP = 'APP'
export const REPORTS = 'REPORTS'
export const RESOURCES = 'RESOURCES'
export const USERS = 'USERS'
export const MESSAGES = 'MESSAGES'
export const TEXT = 'TEXT'
export const SPACER = 'SPACER'
export const PAGEBREAK = 'PAGEBREAK'
export const PRINT_TITLE_PAGE = 'PRINT_TITLE_PAGE'

const DOMAIN_TYPE_AGGREGATE = 'AGGREGATE'
const DOMAIN_TYPE_TRACKER = 'TRACKER'

// Dashboard helpers
export const isVisualizationType = (item) =>
    !!itemTypeMap[item.type]?.isVisualizationType
export const hasMapView = (itemType) =>
    itemTypeMap[itemType].domainType === DOMAIN_TYPE_AGGREGATE
export const isTrackerDomainType = (itemType) =>
    itemTypeMap[itemType].domainType === DOMAIN_TYPE_TRACKER
export const getDefaultItemCount = (itemType) =>
    itemTypeMap[itemType].defaultItemCount || 5
export const getAppName = (itemType) => itemTypeMap[itemType].appName || ''

export const getItemTypeForVis = (item) => {
    if (item.type === VISUALIZATION) {
        if (item.visualization.type === VIS_TYPE_PIVOT_TABLE) {
            return REPORT_TABLE
        } else {
            return CHART
        }
    }
    return item.type
}

// Item type map
export const itemTypeMap = {
    [VISUALIZATION]: {
        id: VISUALIZATION,
        endPointName: 'visualizations',
        dataStatisticsName: 'VISUALIZATION_VIEW',
        propName: 'visualization',
        pluralTitle: i18n.t('Visualizations'),
        domainType: DOMAIN_TYPE_AGGREGATE,
        isVisualizationType: true,
        appUrl: (id) => `dhis-web-data-visualizer/#/${id}`,
        appName: 'Data Visualizer',
        appKey: 'data-visualizer',
        defaultItemCount: 10,
        supportsFullscreen: true,
    },
    [REPORT_TABLE]: {
        id: REPORT_TABLE,
        endPointName: 'visualizations',
        dataStatisticsName: 'REPORT_TABLE_VIEW',
        propName: 'visualization',
        pluralTitle: i18n.t('Pivot tables'),
        domainType: DOMAIN_TYPE_AGGREGATE,
        isVisualizationType: true,
        appUrl: (id) => `dhis-web-data-visualizer/#/${id}`,
        appName: 'Data Visualizer',
        supportsFullscreen: true,
    },
    [CHART]: {
        id: CHART,
        endPointName: 'visualizations',
        propName: 'visualization',
        dataStatisticsName: 'CHART_VIEW',
        pluralTitle: i18n.t('Charts'),
        domainType: DOMAIN_TYPE_AGGREGATE,
        isVisualizationType: true,
        appUrl: (id) => `dhis-web-data-visualizer/#/${id}`,
        appName: 'Data Visualizer',
        supportsFullscreen: true,
    },
    [MAP]: {
        id: MAP,
        endPointName: 'maps',
        dataStatisticsName: 'MAP_VIEW',
        propName: 'map',
        pluralTitle: i18n.t('Maps'),
        domainType: DOMAIN_TYPE_AGGREGATE,
        isVisualizationType: true,
        appUrl: (id) => `dhis-web-maps/?id=${id}`,
        appName: 'Maps',
        supportsFullscreen: true,
    },
    [EVENT_REPORT]: {
        id: EVENT_REPORT,
        endPointName: 'eventReports',
        propName: 'eventReport',
        pluralTitle: i18n.t('Event reports'),
        domainType: DOMAIN_TYPE_TRACKER,
        isVisualizationType: true,
        appUrl: (id) => `dhis-web-event-reports/?id=${id}`,
        appName: 'Event Reports',
        supportsFullscreen: true,
    },
    [EVENT_CHART]: {
        id: EVENT_CHART,
        endPointName: 'eventCharts',
        propName: 'eventChart',
        pluralTitle: i18n.t('Event charts'),
        domainType: DOMAIN_TYPE_TRACKER,
        isVisualizationType: true,
        appUrl: (id) => `dhis-web-event-visualizer/?id=${id}`,
        appName: 'Event Visualizer',
        supportsFullscreen: true,
    },
    [EVENT_VISUALIZATION]: {
        id: EVENT_VISUALIZATION,
        endPointName: 'eventVisualizations',
        propName: 'eventVisualization',
        pluralTitle: i18n.t('Line lists'),
        domainType: DOMAIN_TYPE_TRACKER,
        isVisualizationType: true,
        // TODO change to the path for the bundled app
        appUrl: (id) => `api/apps/line-listing/index.html#/${id}`,
        appName: 'Line Listing',
        appKey: 'line-listing',
        supportsFullscreen: true,
    },
    [APP]: {
        id: APP,
        endPointName: 'apps',
        propName: 'appKey',
        pluralTitle: i18n.t('Apps'),
        supportsFullscreen: true,
    },
    [REPORTS]: {
        id: REPORTS,
        endPointName: 'reports',
        propName: 'reports',
        pluralTitle: i18n.t('Reports'),
        appUrl: (id, type) => {
            switch (type) {
                case 'HTML':
                    return `dhis-web-reports/#/standard-report/view/${id}`

                case 'JASPER_REPORT_TABLE':
                case 'JASPER_JDBC':
                default:
                    return `api/reports/${id}/data.pdf?t=${new Date().getTime()}`
            }
        },
        supportsFullscreen: true,
    },
    [RESOURCES]: {
        id: RESOURCES,
        endPointName: 'resources',
        propName: 'resources',
        pluralTitle: i18n.t('Resources'),
        appUrl: (id) => `api/documents/${id}/data`,
        supportsFullscreen: true,
    },
    [USERS]: {
        id: USERS,
        endPointName: 'users',
        propName: 'users',
        pluralTitle: i18n.t('Users'),
        appUrl: (id) =>
            `dhis-web-dashboard-integration/profile.action?id=${id}`,
        supportsFullscreen: false,
    },
    [TEXT]: {
        id: TEXT,
        propName: 'text',
        supportsFullscreen: true,
    },
    [MESSAGES]: {
        propName: 'messages',
        supportsFullscreen: false,
    },
    [SPACER]: {
        propName: 'text',
        supportsFullscreen: false,
    },
    [PAGEBREAK]: {
        propName: 'text',
        supportsFullscreen: false,
    },
    [PRINT_TITLE_PAGE]: {
        propName: 'text',
        supportsFullscreen: false,
    },
}

export const getEndPointName = (type) => itemTypeMap[type].endPointName

export const getDataStatisticsName = (type) =>
    itemTypeMap[type].dataStatisticsName || null

export const getItemUrl = (type, item, baseUrl) => {
    let url

    if (type === APP) {
        url = item.launchUrl
    }

    if (itemTypeMap[type] && itemTypeMap[type].appUrl) {
        url = `${baseUrl}/${itemTypeMap[type].appUrl(item.id, item.type)}`
    }

    return url
}

export const itemTypeSupportsFullscreen = (type) =>
    itemTypeMap[type]?.supportsFullscreen

export const getItemIcon = (type) => {
    switch (type) {
        case REPORT_TABLE:
        case EVENT_REPORT:
            return IconTable24
        case REPORTS:
            return IconFileDocument24
        case CHART:
        case EVENT_CHART:
        case EVENT_VISUALIZATION:
            return IconVisualizationColumn24
        case MAP:
            return IconWorld24
        case APP:
            return IconApps24
        case RESOURCES:
            return IconLink24
        case USERS:
            return IconUser24
        case TEXT:
            return IconTextBox24
        case MESSAGES:
            return IconMail24
        case SPACER:
            return IconEmptyFrame24
        default:
            return IconQuestion24
    }
}
