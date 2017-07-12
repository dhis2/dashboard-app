import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getSelectedDashboardIdFromState } from '../reducers';

import { getDashboardItems } from '../data';

import configureGrid from '../configureGrid';

import DashboardItemGrid from '../components/DashboardItemGrid';

class DashboardItemGridCt extends Component {
    componentDidMount() {
        const { grid } = this.context;

        grid.set(configureGrid());
    }
    render(nextProps) {
        const grid = this.context.grid.get();
        const items = getDashboardItems(this.props.id);

        return (<DashboardItemGrid grid={grid} items={items} />);
    }
}

DashboardItemGridCt.contextTypes = {
    d2: PropTypes.object,
    grid: PropTypes.object
};

const mapStateToProps = state => ({
    id: getSelectedDashboardIdFromState(state)
});

DashboardItemGridCt = connect(mapStateToProps)(DashboardItemGridCt);

export default DashboardItemGridCt;


