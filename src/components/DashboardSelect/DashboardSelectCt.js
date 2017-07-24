import React from 'react';
import { connect } from 'react-redux';

import { getDashboards, getDashboardFilterFromState } from '../../reducers';
import { acSetSelectedDashboard, acSetDashboardFilter } from '../../actions';
import DashboardList from './DashboardList';
import DashboardBar from './DashboardBar';

const mapStateToProps = state => ({
    dashboards: getDashboards(state),
    dashboardFilter: getDashboardFilterFromState(state)
});

const mapDispatchToProps = dispatch => ({
    onClickDashboard: (id) => dispatch(acSetSelectedDashboard(id)),
    onChangeFilter: (value) => dispatch(acSetDashboardFilter(value))
});

let DashboardSelectCt = props => (
    <div>
        <DashboardBar {...props} />
        <DashboardList {...props} />
    </div>
);

DashboardSelectCt = connect(mapStateToProps, mapDispatchToProps)(DashboardSelectCt);

export default DashboardSelectCt;