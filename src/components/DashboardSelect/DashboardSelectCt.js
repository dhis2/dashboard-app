import React from 'react';
import { connect } from 'react-redux';

import { getDashboardsFromState } from '../../reducers/index';
import { acSetSelectedDashboard } from '../../actions/index';
import DashboardList from './DashboardList';

const mapStateToProps = state => ({
    dashboards: getDashboardsFromState(state)
});

const mapDispatchToProps = dispatch => ({
    onClick: (id) => dispatch(acSetSelectedDashboard(id))
});

let DashboardSelectCt = props => (
    <div>
        <DashboardBar />
        <DashboardList {...props} />
    </div>
);

DashboardSelectCt = connect(mapStateToProps, mapDispatchToProps)(DashboardSelectCt);

export default DashboardSelectCt;