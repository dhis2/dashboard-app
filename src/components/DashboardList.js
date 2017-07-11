import React from 'react';
import PropTypes from 'prop-types';

const DashboardList = ({ dashboards, onClick }) => {
    return <ul>{dashboards.map(d => <li onClick={onClick}>d.name</li>)}</ul>;
};

DashboardList.propTypes = {
    dashboards: PropTypes.array,
    onClick: PropTypes.func
};

export default DashboardList;