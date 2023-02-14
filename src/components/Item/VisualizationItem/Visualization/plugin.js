import {
    itemTypeMap,
    REPORT_TABLE,
    CHART,
    VISUALIZATION,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
} from '../../../../modules/itemTypes.js'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId.js'
import { loadExternalScript } from './loadExternalScript.js'

//external plugins
const itemTypeToGlobalVariable = {
    [EVENT_REPORT]: 'eventReportPlugin',
    [EVENT_CHART]: 'eventChartPlugin',
}

const itemTypeToScriptPath = {
    [EVENT_REPORT]: '/dhis-web-event-reports/eventreport.js',
    [EVENT_CHART]: '/dhis-web-event-visualizer/eventchart.js',
}

const hasIntegratedPlugin = (type) =>
    // TODO add MAP here when its new plugin is available
    [CHART, REPORT_TABLE, VISUALIZATION, MAP].includes(type)

export const getPluginLaunchUrl = (type, d2) => {
    // 1. lookup in api/apps for the "manually installed" app, this can be a new version for a core (bundled) app
    // 2. fallback to default hardcoded path for the core (bundled) apps
    const baseUrl = d2.system.configuration.api.baseUrl
    const apps = d2.system.installedApps
    const appKey = itemTypeMap[type].appKey

    const appDetails = appKey && apps.find((app) => app.key === appKey)

    if (appDetails) {
        return appDetails.pluginLaunchUrl
    }

    if (hasIntegratedPlugin(type)) {
        switch (type) {
            case CHART:
            case REPORT_TABLE:
            case VISUALIZATION: {
                return `${baseUrl}/dhis-web-data-visualizer/plugin.html`
            }
        }
    }
}

export const getPlugin = async (type) => {
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

export const pluginIsAvailable = (type, d2) =>
    hasIntegratedPlugin(type) ||
    Boolean(getPluginLaunchUrl(type, d2)) ||
    Boolean(itemTypeToGlobalVariable[type])

const loadPlugin = async ({ type, config, credentials, d2 }) => {
    if (!pluginIsAvailable(type, d2)) {
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
    plugin.load(config)
}

export const load = async (
    item,
    visualization,
    { credentials, activeType, d2, options = {} }
) => {
    const config = {
        ...visualization,
        ...options,
        el: getVisualizationContainerDomId(item.id),
    }

    const type = activeType || item.type
    await loadPlugin({ type, config, credentials, d2 })
}

export const unmount = async (item, activeType) => {
    const plugin = await getPlugin(activeType)

    if (plugin && plugin.unmount) {
        plugin.unmount(getVisualizationContainerDomId(item.id))
    }
}
