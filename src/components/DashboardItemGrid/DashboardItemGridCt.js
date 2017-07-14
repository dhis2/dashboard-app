import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getSelectedDashboardIdFromState } from '../../reducers/index';

import { getDashboardItems } from '../../data';

import DashboardItemGrid from './DashboardItemGrid';

class DashboardItemGridCt extends Component {
    render() {
        const items = getDashboardItems(this.props.id);

        return (<DashboardItemGrid items={items} />);
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


