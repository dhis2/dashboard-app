import { FILTER_ORG_UNIT } from '../../../actions/itemFilters.js'

export const getIframeSrc = (appDetails, item, itemFilters) => {
    let iframeSrc = `${appDetails.launchUrl}?dashboardItemId=${item.id}`

    console.log('jj itemfilters', itemFilters)

    if (itemFilters[FILTER_ORG_UNIT] && itemFilters[FILTER_ORG_UNIT].length) {
        const ouIds = itemFilters[FILTER_ORG_UNIT].map(({ id, path }) =>
            path ? path.split('/').slice(-1)[0] : id
        )

        iframeSrc += `&userOrgUnit=${ouIds.join(',')}`
    }

    return iframeSrc
}
