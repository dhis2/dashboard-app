import { FILTER_ORG_UNIT } from '../../../actions/itemFilters.js'
import { getPluginOverrides } from '../../../modules/localStorage.js'

export const getIframeSrc = (item, itemFilters, appDetails = {}) => {
    if (appDetails.appType === 'APP') {
        // check if there is an override for the plugin
        const pluginOverrides = getPluginOverrides()

        if (pluginOverrides?.[appDetails.key]) {
            return pluginOverrides[appDetails.key]
        }

        return appDetails.pluginLaunchUrl
    } else {
        let iframeSrc = `${appDetails.launchUrl}?dashboardItemId=${item.id}`

        if (itemFilters[FILTER_ORG_UNIT]?.length) {
            const ouIds = itemFilters[FILTER_ORG_UNIT].map(({ id, path }) =>
                path ? path.split('/').slice(-1)[0] : id
            )

            iframeSrc += `&userOrgUnit=${ouIds.join(',')}`
        }

        return iframeSrc
    }
}
