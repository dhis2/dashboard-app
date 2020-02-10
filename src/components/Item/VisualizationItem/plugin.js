import isObject from 'lodash/isObject';
import { apiFetchFavorite, getMapFields } from '../../../api/metadata';
import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    itemTypeMap,
    // getPlugin,
} from '../../../modules/itemTypes';
import {
    getDefaultView,
    getPlugin,
    VIEW_TYPE_MAP,
} from '../../../modules/visualizationViewTypes';
import { getBaseUrl, getWithoutId } from '../../../modules/util';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';

export const THEMATIC_LAYER = 'thematic';

export const pluginIsAvailable = (item = {}, visualization = {}) => {
    const view = visualization.activeType || getDefaultView(item.type);

    return !!getPlugin(view);
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
    map.mapViews && map.mapViews.find(mv => mv.layer.includes(THEMATIC_LAYER));

export const loadPlugin = (plugin, config, credentials) => {
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

export const load = async (
    item,
    visualization,
    { credentials, activeType }
) => {
    const config = {
        ...visualization,
        el: getGridItemDomId(item.id),
    };

    const type = activeType || item.type;
    const plugin = getPlugin(type);

    loadPlugin(plugin, config, credentials);
};

export const fetch = async item => {
    const fetchedFavorite = await apiFetchFavorite(getId(item), item.type, {
        fields: item.type === MAP ? getMapFields() : null,
    });

    return fetchedFavorite;
};

export const resize = item => {
    const plugin = getPlugin(item.type);

    if (plugin && plugin.resize) {
        plugin.resize(getGridItemDomId(item.id));
    }
};

export const unmount = (item, activeType) => {
    const plugin = getPlugin(activeType);

    if (plugin && plugin.unmount) {
        plugin.unmount(getGridItemDomId(item.id));
    }
};

export const getVisualizationConfig = (
    visualization,
    originalType,
    activeView
) => {
    //Is a map being displayed as a chart or table?
    if (originalType === MAP && activeView !== VIEW_TYPE_MAP) {
        const extractedMapView = extractMapView(visualization);

        if (extractedMapView === undefined) {
            return null;
        }

        return getWithoutId({
            ...visualization,
            ...extractedMapView,
            mapViews: undefined,
        });
    }

    return getWithoutId(visualization);
};
