import {
    // acAddDashboardItem,
    acUpdateDashboardItem,
    tSetDashboardItems,
} from '../../../actions/editDashboard.js'
import { itemTypeMap } from '../../../modules/itemTypes.js'
import { sGetEditDashboardRoot } from '../../../reducers/editDashboard.js'

export const tAddListItemContent = (type, content) => (dispatch, getState) => {
    const state = getState()
    const listItemType = itemTypeMap[type].propName
    const dashboardItems = sGetEditDashboardRoot(state).dashboardItems
    const dashboardItemIndex = dashboardItems.findIndex(
        (item) => item.type === type
    )
    let dashboardItem

    // Reports/Resources/Users dashboard item type already present in dashboard
    if (dashboardItemIndex > -1) {
        dashboardItem = dashboardItems[dashboardItemIndex]
        dashboardItem[listItemType].push(content)

        dispatch(acUpdateDashboardItem(dashboardItem))
    } else {
        dashboardItem = {
            type: type,
            content: [content],
        }

        // dispatch(acAddDashboardItem(dashboardItem))
        dispatch(tSetDashboardItems(dashboardItem))
    }
}
