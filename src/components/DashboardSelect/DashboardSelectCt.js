import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as fromReducers from '../../reducers';
import * as fromActions from '../../actions';

import DashboardBar from './DashboardBar';
import DashboardList from './DashboardList';

const mapStateToProps = state => ({
    dashboards: fromReducers.sGetDashboards(state),
    textFilter: fromReducers.fromDashboardsConfig.sGetTextFilterFromState(state),
    viewFilter: fromReducers.fromDashboardsConfig.sGetViewFilterFromState(state),
    isFetching: fromReducers.fromDashboardsConfig.sGetIsFetchingFromState(state)
});

const mapDispatchToProps = dispatch => ({
    onClickDashboard: id => dispatch(fromActions.acSetDashboardsConfigSelectedId(id)),
    onChangeTextFilter: value => dispatch(fromActions.acSetDashboardsConfigTextFilter(value)),
    onClickViewFilter: value => dispatch(fromActions.acSetDashboardsConfigViewFilter(value))
});

let DashboardSelectCt = props => (
    <div>
        <DashboardBar {...props} />
        <DashboardList {...props} />
    </div>
);

DashboardSelectCt = connect(mapStateToProps, mapDispatchToProps)(DashboardSelectCt);

DashboardSelectCt.propTypes = {
    dashboards: PropTypes.array,
    textFilter: PropTypes.string,
    viewFilter: PropTypes.string,
    isFetching: PropTypes.bool,
    onClickDashboard: PropTypes.func,
    onChangeTextFilter: PropTypes.func,
    onClickViewFilter: PropTypes.func
};

export default DashboardSelectCt;