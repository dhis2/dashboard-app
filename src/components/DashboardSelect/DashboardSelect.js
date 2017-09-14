import React from 'react';
import PropTypes from 'prop-types';

import DashboardBar from './DashboardBar';
import Toolbar from '../../dashboardbar/Dashboardbar';

import * as fromReducers from '../../reducers';

import { arrayGetById } from '../../util';

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

export default function DashboardSelect(props) {
    const { dashboardsIsFetching, viewFilter } = props;

    if (dashboardsIsFetching) {
        return (<Loading />);
    }

    return (
        <div id="DashboardSelect">
            <DashboardBar {...props} />
            {arrayGetById(fromReducers.fromDashboardsConfig.viewFilterData, viewFilter).getViewCmp(props)}
        </div>
    );
}

DashboardSelect.propTypes = {
    dashboardsIsFetching: PropTypes.bool,
    viewFilter: PropTypes.string,
};

DashboardSelect.defaultProps = {
    dashboardsIsFetching: false,
    viewFilter: null,
};
