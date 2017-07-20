import React from 'react';
import { connect } from 'react-redux';

import { getDashboardsFromState } from '../../reducers/index';
import { acSetSelectedDashboard } from '../../actions/index';
import DashboardList from './DashboardList';
import DashboardBar from './DashboardBar';

let dashboardVisibilityFilter = '';

const mapStateToProps = state => ({
    dashboards: getDashboardsFromState(state),
    dashboardVisibilityFilter
});

const mapDispatchToProps = dispatch => ({
    onClick: (id) => dispatch(acSetSelectedDashboard(id)),
    onChangeFilter: (value) => {
        dashboardVisibilityFilter = value;
        console.log(dashboardVisibilityFilter);
    }
});

let DashboardSelectCt = props => (
    <div>
        <DashboardBar {...props} />
        <DashboardList {...props} />
    </div>
);

DashboardSelectCt = connect(mapStateToProps, mapDispatchToProps)(DashboardSelectCt);

export default DashboardSelectCt;