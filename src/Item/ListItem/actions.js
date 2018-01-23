import {
    acUpdateDashboardItem,
    acRemoveDashboardItem,
} from '../../actions/editDashboard';

export const tRemoveListItemContent = (dashboardItem, content) => dispatch => {
    const listItemType = dashboardItem.type.toLowerCase();

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
