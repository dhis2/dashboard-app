import isObject from 'd2-utilizr/lib/isObject';

import { apiFetchFavorite } from '../../api';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';
import { REPORT_TABLE, CHART, MAP, itemTypeMap } from '../../util';

const url = '//localhost:8080';
const username = 'admin';
const password = 'district';

// Get favorite object from plugin item
const getFavoriteObjectFromItem = item => {
    if (!isObject(item)) {
        return null;
    }

    return (
        item.reportTable ||
        item.chart ||
        item.map ||
        item.eventReport ||
        item.eventChart
    );
};

const loadPlugin = (plugin, itemConfig) => {
    plugin.url = url;
    plugin.username = username;
    plugin.password = password;
    plugin.loadingIndicator = true;
    plugin.dashboard = true;
    plugin.load(itemConfig);
};

const loadChart = item => {
    let plugin = itemTypeMap[item.type].plugin;

    const favorite = getFavoriteObjectFromItem(item);
    const itemConfig = {
        id: favorite.id,
        el: getGridItemDomId(item.id),
        hideTitle: !favorite.title,
    };

    loadPlugin(plugin, itemConfig);
};

const loadMap = item => {
    const favorite = getFavoriteObjectFromItem(item);
    const mapItem = {
        id: favorite.id,
        el: getGridItemDomId(item.id),
        type: item.type,
        url,
        username,
        password,
    };

    setTimeout(() => {
        return global.DHIS.getMap(mapItem);
    }, 200);
};

export const getId = item => getFavoriteObjectFromItem(item).id;
export const getName = item => getFavoriteObjectFromItem(item).name;
export const getDescription = item =>
    getFavoriteObjectFromItem(item).description;
export const getLink = item => itemTypeMap[item.type].appUrl(getId(item));

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

// Render pivot, chart, map favorites
// TODO
export function load(item) {
    switch (item.type) {
        case REPORT_TABLE:
        case CHART:
            return loadChart(item);
        case MAP:
            return loadMap(item);
        default:
            return;
    }
}
