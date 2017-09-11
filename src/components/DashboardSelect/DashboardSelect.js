import React from 'react';

import DashboardBar from './DashboardBar';
import DashboardViewTable from './DashboardViewTable';
import DashboardViewList from './DashboardViewList';

import * as fromReducers from '../../reducers';

const styles = {
    loading: {
        width: '100%',
        padding: '20px',
        textAlign: 'center',
        color: '#888',
        fontSize: '13px'
    }
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
        return (<Loading/>);
    }

    let ViewComponent;

    switch (viewFilter) {
        case fromReducers.fromDashboardsConfig.viewFilterValues.LIST:
            ViewComponent = (<DashboardViewList {...props} />);

        case fromReducers.fromDashboardsConfig.viewFilterValues.TABLE:
            ViewComponent = (<DashboardViewTable {...props} />);

        default:
            ViewComponent = (<DashboardViewList {...props} />);
    }

    return (
        <div id="DashboardSelect">
            <DashboardBar {...props} />
            {ViewComponent}
        </div>
    );
}