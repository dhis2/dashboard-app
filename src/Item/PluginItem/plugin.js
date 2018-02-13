import isObject from 'd2-utilizr/lib/isObject';
import { apiFetchFavorite } from '../../api/dashboards';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';
import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    itemTypeMap,
} from '../../itemTypes';
import { getBaseUrl } from '../../util';

export const extractFavorite = item => {
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

const loadPlugin = (plugin, itemConfig, credentials) => {
    plugin.url = credentials.baseUrl;
    plugin.loadingIndicator = true;
    plugin.dashboard = true;
    if (credentials.auth) {
        plugin.auth = credentials.auth;
    }

    plugin.load(itemConfig);
};

export const getId = item => extractFavorite(item).id;
export const getName = item => extractFavorite(item).name;
export const getDescription = item => extractFavorite(item).description;
export const getLink = (item, d2) => {
    const baseUrl = getBaseUrl(d2);
    const appUrl = itemTypeMap[item.type].appUrl(getId(item));

    return `${baseUrl}/${appUrl}`;
};

export const reload = async (item, targetType, credentials) => {
    const favorite = await apiFetchFavorite(getId(item), item.type);
    const itemConfig = {
        ...favorite,
        id: null,
        el: getGridItemDomId(item.id),
        hideTitle: !favorite.title,
    };

    let plugin = itemTypeMap[targetType].plugin;

    loadPlugin(plugin, itemConfig, credentials);
};

export const load = (item, credentials) => {
    let plugin = itemTypeMap[item.type].plugin;

    const favorite = extractFavorite(item);
    const itemConfig = {
        id: favorite.id,
        el: getGridItemDomId(item.id),
        hideTitle: !favorite.title,
    };

    loadPlugin(plugin, itemConfig, credentials);
};

export const resize = item => {
    const plugin = itemTypeMap[item.type].plugin;

    if (plugin && plugin.resize) {
        plugin.resize(getGridItemDomId(item.id));
    }
};

export const unmount = (item, targetType) => {
    const plugin = itemTypeMap[targetType].plugin;

    if (plugin && plugin.unmount) {
        plugin.unmount(getGridItemDomId(item.id));
    }
};
