import 'babel-polyfill';

import * as fromDashboards from './dashboards';
import * as fromSelected from './selected';
import * as fromFilter from './filter';
import * as fromControlBar from './controlBar';
import * as fromEditDashboard from './editDashboard';

export {
    fromDashboards,
    fromSelected,
    fromFilter,
    fromControlBar,
    fromEditDashboard,
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
