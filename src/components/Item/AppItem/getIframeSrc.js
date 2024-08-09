import { FILTER_ORG_UNIT } from '../../../actions/itemFilters.js'
import { getPluginOverrides } from '../../../modules/localStorage.js'

export const getIframeSrc = (appDetails, item, itemFilters) => {
    switch (appDetails.appType) {
        case 'APP': {
            // check if there is an override for the plugin
            const pluginOverrides = getPluginOverrides()

            if (pluginOverrides && pluginOverrides[appDetails.key]) {
                return pluginOverrides[appDetails.key]
            }

            return appDetails.pluginLaunchUrl
        }
        default: {
            let iframeSrc = `${appDetails.launchUrl}?dashboardItemId=${item.id}`

            if (
                itemFilters[FILTER_ORG_UNIT] &&
                itemFilters[FILTER_ORG_UNIT].length
            ) {
                const ouIds = itemFilters[FILTER_ORG_UNIT].map(({ id, path }) =>
                    path ? path.split('/').slice(-1)[0] : id
                )

                iframeSrc += `&userOrgUnit=${ouIds.join(',')}`
            }

            return iframeSrc
        }
    }
}
