import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getSelectedDashboardIdFromState } from '../reducers';

import { getDashboardItems } from '../data';

import configureGrid from '../configureGrid';

import DashboardItemGrid from '../components/DashboardItemGrid';

const mapStateToProps = state => ({
    id: getSelectedDashboardIdFromState(state)
});

class DashboardItemGridCt extends Component {
    updateGrid(dashboardId) {
        console.log("updateGrid:", dashboardId);

        console.log("updateGrid:", getDashboardItems(dashboardId));

        console.log("updateGrid-context-grid-get", this.context.grid.get());
    }
    render() {
        return <DashboardItemGrid {...this.props}/>;
    }
    componentDidMount() {
        const { grid } = this.context;

        grid.set(configureGrid());
    }
    shouldComponentUpdate(nextProps) {
        this.updateGrid(nextProps.id);

        return false;
    }
}

DashboardItemGridCt.contextTypes = {
    d2: PropTypes.object,
    grid: PropTypes.object
};

DashboardItemGridCt = connect(mapStateToProps)(DashboardItemGridCt);

export default DashboardItemGridCt;


