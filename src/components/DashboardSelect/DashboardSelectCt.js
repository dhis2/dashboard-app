import React from 'react';
import { connect } from 'react-redux';

import { sGetDashboards, sGetDashboardsFilterFromState, sGetDashboardsIsFetchingFromState } from '../../reducers';
import { acSetSelectedDashboard, acSetDashboardsFilter } from '../../actions';
import DashboardList from './DashboardList';
import DashboardBar from './DashboardBar';

const mapStateToProps = state => ({
    dashboards: sGetDashboards(state),
    dashboardsFilter: sGetDashboardsFilterFromState(state),
    dashboardsIsFetching: sGetDashboardsIsFetchingFromState(state)
});

const mapDispatchToProps = dispatch => ({
    onClickDashboard: (id) => dispatch(acSetSelectedDashboard(id)),
    onChangeFilter: (value) => dispatch(acSetDashboardsFilter(value))
});

let DashboardSelectCt = props => (
    <div>
        <DashboardBar {...props} />
        <DashboardList {...props} />
    </div>
);

DashboardSelectCt = connect(mapStateToProps, mapDispatchToProps)(DashboardSelectCt);

export default DashboardSelectCt;