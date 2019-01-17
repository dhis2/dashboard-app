import {
    acUpdateDashboardItem,
    acRemoveDashboardItem,
} from '../../../actions/editDashboard';
import { itemTypeMap } from '../../../modules/itemTypes';

export const tRemoveListItemContent = (dashboardItem, content) => dispatch => {
    const listItemType = itemTypeMap[dashboardItem.type].propName;

    const newContent = dashboardItem[listItemType].filter(
        item => item.id !== content.id
    );

    if (newContent.length) {
        dashboardItem[listItemType] = newContent;
        dispatch(acUpdateDashboardItem(dashboardItem));
    } else {
        dispatch(acRemoveDashboardItem(dashboardItem));
    }
};
