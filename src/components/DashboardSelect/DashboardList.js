import React from 'react';
import PropTypes from 'prop-types';

import './DashboardList.css';

const DashboardList = ({ dashboards, onClickDashboard }) => (
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

DashboardList.propTypes = {
    dashboards: PropTypes.array,
    onClickDashboard: PropTypes.func,
    dashboardFilter: PropTypes.string
};

export default DashboardList;