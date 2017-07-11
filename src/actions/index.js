import { actionTypes } from '../reducers';

console.log("actionTypes", actionTypes);

export const acSetSelectedDashboard = (id) => ({
    type: actionTypes.SET_SELECTED_DASHBOARD,
    id
});

// export const acSelectDashboardItemFilter = (filter) => ({
//     type: 'SELECT_DASHBOARD_ITEM_FILTER',
//     filter
// });

// const acRemoveDashboardItemFilter = () => ({
//     type: 'REMOVE_DASHBOARD_ITEM_FILTER'
// });

// export const acFetchDashboard = (id) => (dispatch, getState) => {
//     dispatch(acRequestDashboard(id));
//
//     return fetchDashboards(id).then(dashboard => {
//         dispatch(acReceiveDashboard(id));
//         dispatch(acSelectDashboard(dashboard));
//         dispatch(acRemoveDashboardItemFilter());
//     });
// };
