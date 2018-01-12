import isFunction from 'd2-utilizr/lib/isFunction';
import isObject from 'd2-utilizr/lib/isObject';

import { orObject } from '../../util';

// Plugin type map
const pluginTypeMap = {
    REPORT_TABLE: global.reportTablePlugin,
    CHART: global.chartPlugin,
};

// Get plugin by type
export const getPluginByType = type => pluginTypeMap[type];

// Get favorite object from plugin item
export function getFavoriteObjectFromItem(item) {
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
}

// Get plugin configuration from item
export function getPluginItemConfig(item, isReload) {
    const favorite = getFavoriteObjectFromItem(item) || item;
    let config;

    if (isReload) {
        config = {
            ...favorite,
            id: null,
        };
    } else {
        config = { id: favorite.id };
    }

    config.el = `plugin-${favorite.id}`;
    config.hideTitle = !favorite.title;

    return config;
}

const url = '//localhost:8080';
const username = 'admin';
const password = 'district';

// pivot/chart plugins
const renderChart = item => {
    const itemConfig = getPluginItemConfig(item);
    let plugin = pluginTypeMap[item.type];

    plugin.url = url;
    plugin.username = username;
    plugin.password = password;
    plugin.loadingIndicator = true;
    plugin.dashboard = true;

    plugin.add(itemConfig);
    plugin.load();
};

const renderMap = item => {
    const favorite = getFavoriteObjectFromItem(item);
    const mapItem = {
        id: favorite.id,
        el: `plugin-${favorite.id}`,
        type: item.type,
        url,
        username,
        password,
    };

    setTimeout(() => {
        return global.DHIS.getMap(mapItem);
    }, 200);
};

// Render pivot, chart, map favorites
// TODO
export function renderFavorite(item) {
    switch (item.type) {
        case 'CHART':
        case 'REPORT_TABLE':
            return renderChart(item);
        case 'MAP':
            return renderMap(item);
        default:
            return;
    }
}
