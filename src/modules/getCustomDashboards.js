import arrayFrom from 'd2-utilizr/lib/arrayFrom'
import { convertBackendItemsToUi } from './uiBackendItemConverter'

/**
 * Returns the array of dashboards, customized for ui
 * @function
 * @param {Array} data The original dashboard list
 * @returns {Array}
 */
export const getCustomDashboards = (data) =>
    arrayFrom(data).map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
        displayName: d.displayName,
        description: d.description,
        displayDescription: d.displayDescription,
        starred: d.starred,
        created: d.created,
        lastUpdated: d.lastUpdated,
        access: d.access,
        dashboardItems: convertBackendItemsToUi(d.dashboardItems),
        restrictFilters: d.restrictFilters,
        allowedFilters: d.allowedFilters ?? [],
        href: d.href,
        layout: d.layout,
        itemConfig: d.itemConfig,
    }))
