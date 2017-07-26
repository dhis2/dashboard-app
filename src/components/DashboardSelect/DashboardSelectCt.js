import React from 'react';
import { connect } from 'react-redux';

import * as fromReducers from '../../reducers';
import * as fromActions from '../../actions';

import DashboardBar from './DashboardBar';
import DashboardList from './DashboardList';

const mapStateToProps = state => ({
    dashboards: fromReducers.sGetDashboards(state),
    textFilter: fromReducers.fromDashboardsConfig.sGetTextFilterFromState(state),
    isFetching: fromReducers.fromDashboardsConfig.sGetIsFetchingFromState(state)
});

const mapDispatchToProps = dispatch => ({
    onClickDashboard: id => dispatch(fromActions.acSetDashboardsConfigSelectedId(id)),
    onChangeTextFilter: value => dispatch(fromActions.acSetDashboardsConfigTextFilter(value))
});

let DashboardSelectCt = props => (
    <div>
        <DashboardBar {...props} />
        <DashboardList {...props} />
    </div>
);

DashboardSelectCt = connect(mapStateToProps, mapDispatchToProps)(DashboardSelectCt);

export default DashboardSelectCt;