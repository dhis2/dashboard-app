import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';

import { arrayGetById } from '../util';

const styles = {
    loading: {
        width: '100%',
        padding: '20px',
        textAlign: 'center',
        color: '#888',
        fontSize: '13px',
    },
};

function Loading() {
    return (
        <div style={styles.loading}>
            {'Loading dashboards ...'}
        </div>
    );
}

// Component

export const Dashboardselect = (props) => {
    const { isFetching, viewFilter } = props;

    const { fromDashboardsConfig } = fromReducers;

    const { viewFilterData } = fromDashboardsConfig;

    if (isFetching) {
        return (<Loading />);
    }

    return arrayGetById(viewFilterData, viewFilter).getViewCmp(props);
};

Dashboardselect.propTypes = {
    isFetching: PropTypes.bool,
    viewFilter: PropTypes.string,
};

Dashboardselect.defaultProps = {
    isFetching: false,
    viewFilter: null,
};

// Container

const mapStateToProps = state => ({
    dashboards: fromReducers.sGetDashboards(state),
    isFetching: fromReducers.fromDashboardsConfig.sGetIsFetchingFromState(state),
    selectedId: fromReducers.fromDashboardsConfig.sGetSelectedIdFromState(state),
    viewFilter: fromReducers.fromDashboardsConfig.sGetViewFilterFromState(state),
});

const mapDispatchToProps = dispatch => ({
    onClickDashboard: id => dispatch(fromActions.acSetDashboardsConfigSelectedId(id)),
});

const DashboardselectCt = connect(mapStateToProps, mapDispatchToProps)(Dashboardselect);

export default DashboardselectCt;
