import arrayFrom from 'd2-utilizr/lib/arrayFrom'
import { convertBackendItemsToUi } from './uiBackendItemConverter'

/**
 * Returns the array of dashboards, customized for ui
 * @function
 * @param {Array} data The original dashboard list
 * @returns {Array}
 */
export const getCustomDashboards = data =>
    arrayFrom(data).map(d => ({
        id: d.id,
        name: d.name,
        displayName: d.displayName,
        description: d.description,
        displayDescription: d.displayDescription,
        starred: d.favorite,
        created: d.created?.split('T').join(' ').substr(0, 16),
        lastUpdated: d.lastUpdated?.split('T').join(' ').substr(0, 16),
        access: d.access,
        dashboardItems: convertBackendItemsToUi(d.dashboardItems),
        restrictFilters: d.restrictFilters,
        allowedFilters: d.allowedFilters ?? [],
    }))

export const getCustomDashboardsForChips = data =>
    arrayFrom(data).map(d => ({
        id: d.id,
        displayName: d.displayName,
        starred: d.favorite,
    }))
