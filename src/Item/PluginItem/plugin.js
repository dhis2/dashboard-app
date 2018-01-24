import { apiFetchFavorite } from '../../api';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';
import { itemTypeMap, extractFavoriteFromDashboardItem } from '../../util';

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

const loadItem = item => {
    let plugin = itemTypeMap[item.type].plugin;

    const favorite = extractFavoriteFromDashboardItem(item);
    const itemConfig = {
        id: favorite.id,
        el: getGridItemDomId(item.id),
        hideTitle: !favorite.title,
    };

    loadPlugin(plugin, itemConfig);
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

export const load = item => loadItem(item);
