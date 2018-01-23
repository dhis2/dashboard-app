import { sGetEditDashboard } from '../reducers/editDashboard';
import { getYMax } from '../ItemGrid/gridUtil';
import {
    acAddDashboardItem,
    acUpdateDashboardItem,
} from '../actions/editDashboard';

export const tAddListItemContent = (dashboardId, type, content) => (
    dispatch,
    getState
) => {
    const state = getState();
    const listItemType = type.toLowerCase();
    const dashboardItems = sGetEditDashboard(state).dashboardItems;
    const dashboardItemIndex = dashboardItems.findIndex(
        item => item.type === type
    );
    let dashboardItem;

    // Reports/Resources/Users dashboard item type already present in dashboard
    if (dashboardItemIndex > -1) {
        dashboardItem = dashboardItems[dashboardItemIndex];
        dashboardItem[listItemType].push(content);

        dispatch(acUpdateDashboardItem(dashboardItem));
    } else {
        dashboardItem = {
            type: type,
            content: [content],
        };

        dispatch(acAddDashboardItem(dashboardItem, getYMax(dashboardItems)));
    }
};
