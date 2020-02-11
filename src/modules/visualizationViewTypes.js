import {
    CHART,
    MAP,
    REPORT_TABLE,
    EVENT_CHART,
    EVENT_REPORT,
} from './itemTypes';

// Visualization view types
export const VIEW_TYPE_TABLE = 'VIEW_TYPE_TABLE';
export const VIEW_TYPE_CHART = 'VIEW_TYPE_CHART';
export const VIEW_TYPE_MAP = 'VIEW_TYPE_MAP';
export const VIEW_TYPE_EV_TABLE = 'VIEW_TYPE_EV_TABLE';
export const VIEW_TYPE_EV_CHART = 'VIEW_TYPE_EV_CHART';

const itemTypeToDefaultViewMap = {
    [REPORT_TABLE]: VIEW_TYPE_TABLE,
    [CHART]: VIEW_TYPE_CHART,
    [MAP]: VIEW_TYPE_MAP,
    [EVENT_REPORT]: VIEW_TYPE_EV_TABLE,
    [EVENT_CHART]: VIEW_TYPE_EV_CHART,
};

const veiwToItemTypeMap = {
    [VIEW_TYPE_TABLE]: REPORT_TABLE,
    [VIEW_TYPE_CHART]: CHART,
    [VIEW_TYPE_MAP]: MAP,
    [VIEW_TYPE_EV_TABLE]: EVENT_REPORT,
    [VIEW_TYPE_EV_CHART]: EVENT_CHART,
};

const viewToPluginMap = {
    [VIEW_TYPE_TABLE]: 'reportTablePlugin',
    [VIEW_TYPE_CHART]: 'chartPlugin',
    [VIEW_TYPE_MAP]: 'mapPlugin',
    [VIEW_TYPE_EV_TABLE]: 'eventReportPlugin',
    [VIEW_TYPE_EV_CHART]: 'eventChartPlugin',
};
export const getDefaultView = itemType => {
    return itemTypeToDefaultViewMap[itemType];
};

export const getPlugin = viewType => {
    // console.log('getPlugin', viewType);
    const pluginName = viewToPluginMap[viewType];

    if (viewType === VIEW_TYPE_CHART || viewType === VIEW_TYPE_TABLE) {
        return true;
    }

    return global[pluginName];
};

export const hasMapView = itemType =>
    [REPORT_TABLE, CHART, MAP].includes(itemType);

export const getViewTypeId = viewType => {
    return veiwToItemTypeMap[viewType];
};
