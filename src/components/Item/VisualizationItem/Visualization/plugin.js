import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    itemTypeMap,
} from '../../../../modules/itemTypes'
import { getVisualizationId } from '../../../../modules/item'
import getGridItemDomId from '../../../../modules/getGridItemDomId'

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

export const pluginIsAvailable = type => !!getPlugin(type)

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

export const getLink = (item, baseUrl) => {
    const appUrl = itemTypeMap[item.type].appUrl(getVisualizationId(item))

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
