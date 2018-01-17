import isObject from 'd2-utilizr/lib/isObject';

import { apiFetchFavorite } from '../../api';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';

const url = '//localhost:8080';
const username = 'admin';
const password = 'district';

// Plugin type map
const pluginTypeMap = {
    REPORT_TABLE: global.reportTablePlugin,
    CHART: global.chartPlugin,
};

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

export const getId = item => getFavoriteObjectFromItem(item).id;
export const getName = item => getFavoriteObjectFromItem(item).name;

// Get plugin configuration from item
export const getPluginItemConfig = item => {
    const favorite = getFavoriteObjectFromItem(item);

    return {
        id: favorite.id,
        el: getGridItemDomId(item.id),
        hideTitle: !favorite.title,
    };
};

// pivot/chart plugins
const loadChart = item => {
    let plugin = pluginTypeMap[item.type];

    plugin.url = url;
    plugin.username = username;
    plugin.password = password;
    plugin.loadingIndicator = true;
    plugin.dashboard = true;

    const itemConfig = getPluginItemConfig(item);
    plugin.load(itemConfig);
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

export const reload = (item, targetType) => {
    const favoriteId = getId(item);

    apiFetchFavorite(favoriteId, item.type).then(favorite => {
        const itemConfig = {
            ...favorite,
            id: null,
            el: getGridItemDomId(item.id),
        };

        let plugin = pluginTypeMap[targetType];

        plugin.url = url;
        plugin.username = username;
        plugin.password = password;
        plugin.loadingIndicator = true;
        plugin.dashboard = true;
        plugin.load(itemConfig);
    });
};

// Render pivot, chart, map favorites
// TODO
export function load(item) {
    switch (item.type) {
        case 'CHART':
        case 'REPORT_TABLE':
            return loadChart(item);
        case 'MAP':
            return loadMap(item);
        default:
            return;
    }
}
