import isFunction from 'd2-utilizr/lib/isFunction';
import isObject from 'd2-utilizr/lib/isObject';

import { orObject } from '../util';

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

export function onPluginItemResize(id) {
    const el = orObject(document.querySelector(`#plugin-${id}`));

    if (isFunction(el.setViewportSize)) {
        setTimeout(
            () => el.setViewportSize(el.clientWidth - 5, el.clientHeight),
            100
        );
    }
}
