import React from 'react';
import PropTypes from 'prop-types';

import './DashboardList.css';

const DashboardList = ({ dashboards, onClick }) => {
    return (
        <div className="DashboardList">
            <ul>
                {dashboards.map(d => <li key={d.id} onClick={() => onClick(d.id)}>{d.name}</li>)}
            </ul>
        </div>
    );
};

DashboardList.propTypes = {
    dashboards: PropTypes.array,
    onClick: PropTypes.func
};

export default DashboardList;