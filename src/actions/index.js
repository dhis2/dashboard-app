import * as fromDashboards from './dashboards';
import * as fromSelected from './selected';
import * as fromDashboardsFilter from './dashboardsFilter';
import * as fromControlBar from './controlBar';
import * as fromEditDashboard from './editDashboard';
import * as fromUser from './user';
import * as fromItemFilter from './itemFilter';

export {
    fromDashboards,
    fromSelected,
    fromDashboardsFilter,
    fromControlBar,
    fromEditDashboard,
    fromUser,
    fromItemFilter,
};

// depends on: fromSelected, fromDashboardsFilter, fromControlBar
export const tSelectDashboardById = id => dispatch => {
    // select dashboard by id
    dispatch(fromSelected.tSetSelectedDashboardById(id));

    // reset filter
    dispatch(fromDashboardsFilter.acSetFilterName());

    // collapse controlbar
    dispatch(fromControlBar.acSetControlBarExpanded(false));
};
