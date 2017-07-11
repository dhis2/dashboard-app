import React from 'react';
import PropTypes from 'prop-types';

const ulStyle = {
    textAlign: 'center'
};

const liStyle = {
    display: 'inline-block',
    margin: '10px',
    cursor: 'pointer',
    color: '#2222ff'
};

const DashboardList = ({ dashboards, onClick }) => {
    return (
        <ul style={ulStyle}>
            {dashboards.map(d => <li key={d.id} style={liStyle} onClick={() => onClick(d.id)}>{d.name}</li>)}
        </ul>
    );
};

DashboardList.propTypes = {
    dashboards: PropTypes.array,
    onClick: PropTypes.func
};

export default DashboardList;