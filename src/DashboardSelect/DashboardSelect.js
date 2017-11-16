import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';

import DashboardSelectList from './DashboardSelectList';
import DashboardSelectTable from './DashboardSelectTable';

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
    return <div style={styles.loading}>{'Loading dashboards ...'}</div>;
}

// Component

export const DashboardSelect = props => {
    const { isFetching, viewFilterComponentIndex } = props;

    if (isFetching) {
        return <Loading />;
    }

    return [
        <DashboardSelectList {...props} />,
        <DashboardSelectTable {...props} />,
    ][viewFilterComponentIndex];
};

DashboardSelect.propTypes = {
    isFetching: PropTypes.bool,
    viewFilterComponentIndex: PropTypes.number,
};

DashboardSelect.defaultProps = {
    isFetching: false,
    viewFilterComponentIndex: 0,
};

// Container

const mapStateToProps = state => {
    const { viewFilterData } = fromReducers.fromDashboardsConfig;

    const viewFilter = fromReducers.fromDashboardsConfig.sGetViewFilterFromState(
        state
    );

    return {
        dashboards: fromReducers.sGetVisibleDashboards(state),
        isFetching: fromReducers.fromDashboardsConfig.sGetIsFetchingFromState(
            state
        ),
        viewFilterComponentIndex: viewFilterData.findIndex(
            d => d.id === viewFilter
        ),
    };
};

const mapDispatchToProps = dispatch => ({
    onClickDashboard: id => dispatch(fromActions.tSetSelectedDashboard(id)),
});

const DashboardSelectCt = connect(mapStateToProps, mapDispatchToProps)(
    DashboardSelect
);

export default DashboardSelectCt;
