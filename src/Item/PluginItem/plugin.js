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

const url = '//localhost:8080';
const username = 'admin';
const password = 'district';

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

const loadPlugin = (plugin, itemConfig) => {
    plugin.url = url;
    plugin.username = username;
    plugin.password = password;
    plugin.loadingIndicator = true;
    plugin.dashboard = true;
    plugin.load(itemConfig);
};

const loadItem = item => {
    let plugin = itemTypeMap[item.type].plugin;

    const favorite = extractFavorite(item);
    const itemConfig = {
        id: favorite.id,
        el: getGridItemDomId(item.id),
        hideTitle: !favorite.title,
    };

    loadPlugin(plugin, itemConfig);
};

export const getId = item => extractFavorite(item).id;
export const getName = item => extractFavorite(item).name;

export const reload = async (item, targetType) => {
    const favorite = await apiFetchFavorite(getId(item), item.type);
    const itemConfig = {
        ...favorite,
        id: null,
        el: getGridItemDomId(item.id),
        hideTitle: !favorite.title,
    };

    let plugin = itemTypeMap[targetType].plugin;

    loadPlugin(plugin, itemConfig);
};

export const load = item => loadItem(item);
