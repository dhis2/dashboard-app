import { apiFetchFavorite } from '../../api';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';
import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    itemTypeMap,
    extractFavoriteFromDashboardItem,
} from '../../util';

const url = '//localhost:8080';
const username = 'admin';
const password = 'district';

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

    const favorite = extractFavoriteFromDashboardItem(item);
    const itemConfig = {
        id: favorite.id,
        el: getGridItemDomId(item.id),
        hideTitle: !favorite.title,
    };

    loadPlugin(plugin, itemConfig);
};

const loadMap = item => {
    const favorite = extractFavoriteFromDashboardItem(item);
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

export const getId = item => extractFavoriteFromDashboardItem(item).id;
export const getName = item => extractFavoriteFromDashboardItem(item).name;

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
        case EVENT_REPORT:
        case EVENT_CHART:
            return loadChart(item);
        case MAP:
            return loadMap(item);
        default:
            return;
    }
}
