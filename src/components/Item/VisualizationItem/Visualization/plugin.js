import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    itemTypeMap,
} from '../../../../modules/itemTypes'
import { getVisualizationId } from '../../../../modules/item'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId'
import { loadExternalScript } from './loadExternalScript'

//external plugins
const itemTypeToGlobalVariable = {
    [MAP]: 'mapPlugin',
    [EVENT_REPORT]: 'eventReportPlugin',
    [EVENT_CHART]: 'eventChartPlugin',
}

const itemTypeToScriptPath = {
    [MAP]: '/dhis-web-maps/map.js',
    [EVENT_REPORT]: '/dhis-web-event-reports/eventreport.js',
    [EVENT_CHART]: '/dhis-web-event-visualizer/eventchart.js',
}

const hasIntegratedPlugin = type => [CHART, REPORT_TABLE].includes(type)

const getPlugin = async type => {
    if (hasIntegratedPlugin(type)) {
        return true
    }
    const pluginName = itemTypeToGlobalVariable[type]

    return await global[pluginName]
}

const fetchPlugin = async (type, baseUrl) => {
    const globalName = itemTypeToGlobalVariable[type]
    if (global[globalName]) {
        return global[globalName] // Will be a promise if fetch is in progress
    }

    const scripts = []

    if (type === EVENT_REPORT || type === EVENT_CHART) {
        if (process.env.NODE_ENV === 'production') {
            scripts.push('./vendor/babel-polyfill-6.26.0.min.js')
            scripts.push('./vendor/jquery-3.3.1.min.js')
            scripts.push('./vendor/jquery-migrate-3.0.1.min.js')
        } else {
            scripts.push('./vendor/babel-polyfill-6.26.0.js')
            scripts.push('./vendor/jquery-3.3.1.js')
            scripts.push('./vendor/jquery-migrate-3.0.1.js')
        }
    }

    scripts.push(baseUrl + itemTypeToScriptPath[type])

    const scriptsPromise = Promise.all(scripts.map(loadExternalScript)).then(
        () => global[globalName] // At this point, has been replaced with the real thing
    )

    global[globalName] = scriptsPromise
    return await scriptsPromise
}

export const pluginIsAvailable = type =>
    hasIntegratedPlugin(type) || itemTypeToGlobalVariable[type]

export const getLink = (item, baseUrl) => {
    const appUrl = itemTypeMap[item.type].appUrl(getVisualizationId(item))

    return `${baseUrl}/${appUrl}`
}

export const load = async (
    item,
    visualization,
    { credentials, activeType, options = {} }
) => {
    const type = activeType || item.type
    if (!pluginIsAvailable(type)) {
        return
    }

    const plugin = await fetchPlugin(type, credentials.baseUrl)

    if (!(plugin && plugin.load)) {
        return
    }

    plugin.url = credentials.baseUrl
    plugin.loadingIndicator = true
    plugin.dashboard = true
    if (credentials.auth) {
        plugin.auth = credentials.auth
    }

    plugin.load({
        ...visualization,
        ...options,
        el: getVisualizationContainerDomId(item.id),
    })
}

export const resize = async (id, type, isFullscreen = false) => {
    const plugin = await getPlugin(type)

    if (plugin?.resize) {
        plugin.resize(getVisualizationContainerDomId(id), isFullscreen)
    }
}

export const unmount = async (item, activeType) => {
    const plugin = await getPlugin(activeType)

    if (plugin && plugin.unmount) {
        plugin.unmount(getVisualizationContainerDomId(item.id))
    }
}
