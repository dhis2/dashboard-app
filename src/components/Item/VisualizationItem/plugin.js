import isObject from 'lodash/isObject'
import { apiFetchFavorite, getMapFields } from '../../../api/metadata'
import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    itemTypeMap,
} from '../../../modules/itemTypes'
import { getBaseUrl } from '../../../modules/util'
import { getGridItemDomId } from '../../ItemGrid/gridUtil'

//external plugins
const itemTypeToExternalPlugin = {
    [MAP]: 'mapPlugin',
    [EVENT_REPORT]: 'eventReportPlugin',
    [EVENT_CHART]: 'eventChartPlugin',
}
const hasIntegratedPlugin = type => [CHART, REPORT_TABLE].includes(type)

const getPlugin = type => {
    if (hasIntegratedPlugin(type)) {
        return true
    }
    const pluginName = itemTypeToExternalPlugin[type]

    return global[pluginName]
}

export const pluginIsAvailable = (item = {}, visualization = {}) => {
    const type = visualization.activeType || item.type

    return !!getPlugin(type)
}

export const extractFavorite = item => {
    if (!isObject(item)) {
        return null
    }

    const propName = itemTypeMap[item.type].propName

    return (
        item[propName] ||
        item.reportTable ||
        item.chart ||
        item.map ||
        item.eventReport ||
        item.eventChart ||
        {}
    )
}

export const loadPlugin = (plugin, config, credentials) => {
    if (!(plugin && plugin.load)) {
        return
    }

    plugin.url = credentials.baseUrl
    plugin.loadingIndicator = true
    plugin.dashboard = true
    if (credentials.auth) {
        plugin.auth = credentials.auth
    }
    plugin.load(config)
}

export const getId = item => extractFavorite(item).id
export const getName = item => extractFavorite(item).name
export const getDescription = item => extractFavorite(item).description
export const getLink = (item, d2) => {
    const baseUrl = getBaseUrl(d2)
    const appUrl = itemTypeMap[item.type].appUrl(getId(item))

    return `${baseUrl}/${appUrl}`
}

export const load = async (
    item,
    visualization,
    { credentials, activeType, options = {} }
) => {
    const config = {
        ...visualization,
        ...options,
        el: getGridItemDomId(item.id),
    }

    const type = activeType || item.type
    const plugin = getPlugin(type)

    loadPlugin(plugin, config, credentials)
}

export const fetch = async item => {
    const fetchedFavorite = await apiFetchFavorite(getId(item), item.type, {
        fields: item.type === MAP ? getMapFields() : null,
    })

    return fetchedFavorite
}

export const resize = item => {
    const plugin = getPlugin(item.type)

    if (plugin && plugin.resize) {
        plugin.resize(getGridItemDomId(item.id))
    }
}

export const unmount = (item, activeType) => {
    const plugin = getPlugin(activeType)

    if (plugin && plugin.unmount) {
        plugin.unmount(getGridItemDomId(item.id))
    }
}
