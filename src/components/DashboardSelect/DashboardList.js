import React from 'react';
import PropTypes from 'prop-types';

import './DashboardList.css';

const DEFAULT_LOADING_MESSAGE = 'Loading dashboards ...';

const Loading = () => (
    <div style={{
        width: '100%',
        padding: '20px',
        textAlign: 'center',
        color: '#888',
        fontSize: '13px'
    }}>
        {DEFAULT_LOADING_MESSAGE}
    </div>
);

const List = ({ dashboards, onClickDashboard, dashboardsIsFetching }) => (
    <div className="DashboardList">
        <ul>
            {dashboards.map(d =>
                <li key={d.id} onClick={() => onClickDashboard(d.id)}>
                    <div className="name">{d.name}</div>
                    <div>{d.numberOfItems + ' items'}</div>
                </li>)}
        </ul>
    </div>
);

const DashboardList = props => {
    return props.dashboardsIsFetching ? (<Loading/>) : (<List {...props} />);
};

DashboardList.propTypes = {
    dashboards: PropTypes.array,
    onClickDashboard: PropTypes.func,
    dashboardsIsFetching: PropTypes.bool
};

export default DashboardList;