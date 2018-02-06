import * as fromDashboards from './dashboards';
import * as fromSelected from './selected';
import * as fromFilter from './filter';
import * as fromControlBar from './controlBar';
import * as fromEditDashboard from './editDashboard';
import * as fromUser from './user';

export {
    fromDashboards,
    fromSelected,
    fromFilter,
    fromControlBar,
    fromEditDashboard,
    fromUser,
};

// depends on: fromSelected, fromFilter, fromControlBar
export const tSelectDashboardById = id => dispatch => {
    // select dashboard by id
    dispatch(fromSelected.tSetSelectedDashboardById(id));

    // reset filter
    dispatch(fromFilter.acSetFilterName());

    // collapse controlbar
    dispatch(fromControlBar.acSetControlBarExpanded(false));
};
