import isObject from 'd2-utilizr/lib/isObject';
import { apiFetchFavorite, getMapFields } from '../../api/metadata';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';
import { FILTER_USER_ORG_UNIT } from '../../actions/itemFilter';
import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    itemTypeMap,
} from '../../itemTypes';
import { getBaseUrl, orObject } from '../../util';

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

export const extractMapView = map =>
    map.mapViews && map.mapViews.find(mv => mv.layer.includes('thematic'));

const loadPlugin = (plugin, config, credentials) => {
    plugin.url = credentials.baseUrl;
    plugin.loadingIndicator = true;
    plugin.dashboard = true;
    if (credentials.auth) {
        plugin.auth = credentials.auth;
    }

    plugin.load(config);
};

export const getId = item => extractFavorite(item).id;
export const getName = item => extractFavorite(item).name;
export const getDescription = item => extractFavorite(item).description;
export const getLink = (item, d2) => {
    const baseUrl = getBaseUrl(d2);
    const appUrl = itemTypeMap[item.type].appUrl(getId(item));

    return `${baseUrl}/${appUrl}`;
};

const getUserOrgUnitIds = (ouPaths = []) => {
    return ouPaths.map(ouPath => ouPath.split('/').slice(-1)[0]);
};

// if original visualisation, set id and let the plugin handle it
// otherwise fetch and pass the correct config to the plugin
const configureFavorite = async (item, activeType) => {
    const isOriginalVisualisation = item.type === activeType;
    let favorite;

    if (isOriginalVisualisation) {
        favorite = {
            id: getId(item),
        };
    } else {
        const fetchedFavorite = await apiFetchFavorite(getId(item), item.type, {
            fields: item.type === MAP ? getMapFields() : null,
        });

        favorite =
            item.type === MAP
                ? orObject(extractMapView(fetchedFavorite))
                : fetchedFavorite;

        favorite.id = null;
        favorite.hideTitle = !favorite.hideTitle;
    }

    return favorite;
};

const configureFilter = (filter = {}) => {
    const ouIds = getUserOrgUnitIds(filter[FILTER_USER_ORG_UNIT]);
    const userOrgUnitFilter = ouIds.length
        ? { [FILTER_USER_ORG_UNIT]: ouIds }
        : {};

    return Object.assign({}, ...filter, userOrgUnitFilter);
};

export const reload = async (item, activeType, credentials, filter) => {
    const config = {
        ...(await configureFavorite(item, activeType)),
        ...configureFilter(filter),
        el: getGridItemDomId(item.id),
    };

    const plugin = itemTypeMap[activeType].plugin;

    loadPlugin(plugin, config, credentials);
};

export const load = (item, credentials, filter) => {
    let plugin = itemTypeMap[item.type].plugin;

    const configuredFilter = configureFilter(filter);
    const favorite = extractFavorite(item);
    const itemConfig = {
        id: favorite.id,
        el: getGridItemDomId(item.id),
        hideTitle: !favorite.title,
        ...configuredFilter,
    };

    loadPlugin(plugin, itemConfig, credentials);
};

export const resize = item => {
    const plugin = itemTypeMap[item.type].plugin;

    if (plugin && plugin.resize) {
        plugin.resize(getGridItemDomId(item.id));
    }
};

export const unmount = (item, activeType) => {
    const plugin = itemTypeMap[activeType].plugin;

    if (plugin && plugin.unmount) {
        plugin.unmount(getGridItemDomId(item.id));
    }
};
