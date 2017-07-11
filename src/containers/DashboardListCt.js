import React from 'react';
import { connect } from 'react-redux';

import { getDashboardsFromState } from '../reducers';
import { acSetSelectedDashboard } from '../actions';
import DashboardList from '../components/DashboardList';

const mapStateToProps = state => ({
    dashboards: getDashboardsFromState(state)
});

const mapDispatchToProps = dispatch => ({
    onClick: (id) => dispatch(acSetSelectedDashboard(id))
});

let DashboardListCt = props => <DashboardList {...props} />;

DashboardListCt = connect(mapStateToProps, mapDispatchToProps)(DashboardListCt);

export default DashboardListCt;