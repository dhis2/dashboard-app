// Get favorite object from plugin item
export function getFavoriteObjectByItem(item) {
    return (
        item.reportTable ||
        item.chart ||
        item.map ||
        item.eventReport ||
        item.eventChart
    );
}

export function getPluginItemConfig(item, isReload) {
    const favorite = getFavoriteObjectByItem(item) || item;

    const config = {
        el: `plugin-${favorite.id}`,
        hideTitle: !favorite.title,
    };

    if (isReload) {
        config.columns = favorite.columns;
        config.rows = favorite.rows;
        config.filters = favorite.filters;
    } else {
        config.id = favorite.id;
    }

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
    let favorite;

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
    filteredItems = items.filter(item => item.type === 'MAP').map(item => {
        favorite = getFavoriteObjectByItem(item);

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
