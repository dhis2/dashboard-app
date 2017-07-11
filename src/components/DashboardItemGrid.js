import React from 'react';

const divStyle = {
    margin: '20px'
};

const DashboardItemGrid = props => <div id="grid-stack" style={divStyle}>Dashboard id: {props.id || "-"}</div>;

export default DashboardItemGrid;