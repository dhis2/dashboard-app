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

// Render pivot, chart, map favorites
// TODO
export function renderFavorites(items) {
    const url = '//localhost:8080';
    const username = 'admin';
    const password = 'district';

    const plugins = [global.reportTablePlugin, global.chartPlugin];
    let filteredItems;

    // pivot/chart plugins
    plugins.forEach(plugin => {
        plugin.url = url;
        plugin.username = username;
        plugin.password = password;
        plugin.loadingIndicator = true;
        plugin.dashboard = true;

        filteredItems = items
            .filter(item => item.type === plugin.type)
            .map(item => getPluginItemConfig(item));

        filteredItems.forEach(item => plugin.add(item));

        plugin.load();
    });

    // map plugin

    let favorite;

    filteredItems = items.filter(item => item.type === 'MAP').map(item => {
        favorite = getFavoriteObjectFromItem(item);

        return {
            id: favorite.id,
            el: `plugin-${favorite.id}`,
            type: item.type,
            url,
            username,
            password,
        };
    });

    // TODO
    if (filteredItems.length) {
        setTimeout(() => {
            filteredItems.forEach(item => global.DHIS.getMap(item));
        }, 200);
    }
}

export function onPluginItemResize(id) {
    const el = orObject(document.querySelector(`#plugin-${id}`));
    const fn = el.setViewportWidth;

    if (isFunction(fn)) {
        setTimeout(() => el.setViewportWidth(el.clientWidth - 5), 100);
    }
}
