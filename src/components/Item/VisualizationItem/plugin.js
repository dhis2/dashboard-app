import isObject from 'lodash/isObject'
import {
    VIS_TYPE_COLUMN,
    VIS_TYPE_PIVOT_TABLE,
    AXIS_ID_ROWS,
    AXIS_ID_COLUMNS,
    AXIS_ID_FILTERS,
} from '@dhis2/analytics'
import { apiFetchFavorite, getMapFields } from '../../../api/metadata'
import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    itemTypeMap,
} from '../../../modules/itemTypes'
import { getBaseUrl, getWithoutId } from '../../../modules/util'
import { loadExternalScript } from '../../../modules/loadExternalScript'
import { getGridItemDomId } from '../../ItemGrid/gridUtil'

//external plugins
const itemTypeToGlobalVariable = {
    [MAP]: 'mapPlugin',
    [EVENT_REPORT]: 'eventReportPlugin',
    [EVENT_CHART]: 'eventChartPlugin',
}
const hasIntegratedPlugin = type => [CHART, REPORT_TABLE].includes(type)

const itemTypeToScriptPath = {
    [MAP]: '/dhis-web-maps/map.js',
    [EVENT_REPORT]: '/dhis-web-event-reports/eventreport.js',
    [EVENT_CHART]: '/dhis-web-event-visualizer/eventchart.js',
}

const getPlugin = async type => {
    if (hasIntegratedPlugin(type)) {
        return true
    }
    const pluginName = itemTypeToGlobalVariable[type]

    return global[pluginName]
}

export const THEMATIC_LAYER = 'thematic'

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

export const extractMapView = map =>
    map.mapViews && map.mapViews.find(mv => mv.layer.includes(THEMATIC_LAYER))

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

export const loadPlugin = async (type, config, credentials) => {
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

    await loadPlugin(type, config, credentials)
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

export const getVisualizationConfig = (
    visualization,
    originalType,
    activeType
) => {
    if (originalType === MAP && originalType !== activeType) {
        const extractedMapView = extractMapView(visualization)

        if (extractedMapView === undefined) {
            return null
        }

        return getWithoutId({
            ...visualization,
            ...extractedMapView,
            mapViews: undefined,
            type: activeType === CHART ? VIS_TYPE_COLUMN : VIS_TYPE_PIVOT_TABLE,
        })
    } else if (originalType === REPORT_TABLE && activeType === CHART) {
        const columns = visualization[AXIS_ID_COLUMNS].slice()
        const rows = visualization[AXIS_ID_ROWS].slice()

        const layout = {}

        if (visualization.rows.length > 1) {
            layout[AXIS_ID_ROWS] =
                rows.length > 2
                    ? rows.splice(0, 2)
                    : rows.splice(0, rows.length)
        } else {
            layout[AXIS_ID_ROWS] = rows.length ? [rows.shift()] : rows
        }

        layout[AXIS_ID_COLUMNS] = columns.length ? [columns.shift()] : columns
        layout[AXIS_ID_FILTERS] = [
            ...visualization[AXIS_ID_FILTERS],
            ...columns,
            ...rows,
        ]

        return getWithoutId({
            ...visualization,
            ...layout,
            type: VIS_TYPE_COLUMN,
        })
    } else if (originalType === CHART && activeType === REPORT_TABLE) {
        return getWithoutId({
            ...visualization,
            type: VIS_TYPE_PIVOT_TABLE,
        })
    }

    return getWithoutId(visualization)
}
