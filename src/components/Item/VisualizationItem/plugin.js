import isObject from 'lodash/isObject';

import { apiFetchFavorite, getMapFields } from '../../../api/metadata';
import { FILTER_USER_ORG_UNIT } from '../../../actions/itemFilter';
import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    itemTypeMap,
} from '../../../modules/itemTypes';
import { getBaseUrl, orObject } from '../../../modules/util';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';

export const pluginIsAvailable = (item = {}, visualization = {}) => {
    const type = visualization.activeType || item.type;
    return !!itemTypeMap[type].plugin;
};

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
    if (!(plugin && plugin.load)) {
        return;
    }

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
    const isOriginalVisualisation = activeType
        ? item.type === activeType
        : true;
    let favorite;

    if (isOriginalVisualisation) {
        const fullFavorite = extractFavorite(item);

        favorite = {
            id: fullFavorite.id,
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

export const load = async (item, credentials, activeType, filter = {}) => {
    const config = {
        ...(await configureFavorite(item, activeType)),
        ...configureFilter(filter),
        el: getGridItemDomId(item.id),
    };

    const type = activeType || item.type;
    const plugin = itemTypeMap[type].plugin;

    loadPlugin(plugin, config, credentials);
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
