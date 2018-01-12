import isObject from 'd2-utilizr/lib/isObject';

// Plugin type map
const pluginTypeMap = {
    REPORT_TABLE: global.reportTablePlugin,
    CHART: global.chartPlugin,
};

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
export function loadFavorite(item) {
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
