import { tSetSelectedDashboardById } from './selected';
import { acSetFilterName } from './dashboardsFilter';

export const tSelectDashboardById = (id, name) => dispatch => {
    // select dashboard by id
    dispatch(tSetSelectedDashboardById(id, name));

    // reset filter
    dispatch(acSetFilterName());
};
