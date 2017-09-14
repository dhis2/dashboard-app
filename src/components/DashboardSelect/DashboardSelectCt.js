import { connect } from 'react-redux';

import * as fromReducers from '../../reducers';
import * as fromActions from '../../actions';

import DashboardSelect from './DashboardSelect';

const mapStateToProps = state => ({
    dashboards: fromReducers.sGetDashboards(state),
    isFetching: fromReducers.fromDashboardsConfig.sGetIsFetchingFromState(state),
    selectedId: fromReducers.fromDashboardsConfig.sGetSelectedIdFromState(state),
    textFilter: fromReducers.fromDashboardsConfig.sGetTextFilterFromState(state),
    showFilter: fromReducers.fromDashboardsConfig.sGetShowFilterFromState(state),
    ownerFilter: fromReducers.fromDashboardsConfig.sGetOwnerFilterFromState(state),
    sortFilterId: fromReducers.fromDashboardsConfig.sGetSortFilterId(state),
    viewFilter: fromReducers.fromDashboardsConfig.sGetViewFilterFromState(state),
});

const mapDispatchToProps = dispatch => ({
    onChangeTextFilter: value => dispatch(fromActions.acSetDashboardsConfigTextFilter(value)),
    onClickShowFilter: value => dispatch(fromActions.acSetDashboardsConfigShowFilter(value)),
    onClickOwnerFilter: value => dispatch(fromActions.acSetDashboardsConfigOwnerFilter(value)),
    onClickSortFilterKey: value => dispatch(fromActions.acSetDashboardsConfigSortFilterKey(value)),
    onClickSortFilterDirection: value => dispatch(fromActions.acSetDashboardsConfigSortFilterDirection(value)),
    onClickViewFilter: value => dispatch(fromActions.acSetDashboardsConfigViewFilter(value)),
    onClickHome: () => dispatch(fromActions.tSetPresetHome()),
    onClickManage: () => dispatch(fromActions.tSetPresetManage()),
    onClickDashboard: id => dispatch(fromActions.acSetDashboardsConfigSelectedId(id)),
});

const DashboardSelectCt = connect(mapStateToProps, mapDispatchToProps)(DashboardSelect);

export default DashboardSelectCt;
