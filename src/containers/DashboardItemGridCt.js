import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getSelectedDashboardIdFromState } from '../reducers';

import DashboardItemGrid from '../components/DashboardItemGrid';

const mapStateToProps = state => ({
    id: getSelectedDashboardIdFromState(state)
});

class DashboardItemGridCt extends Component {
    render() {
        return <DashboardItemGrid {...this.props}/>;
    }
    componentDidMount() {
        const { id } = this.props;
        const { store } = this.context;

        console.log("DashboardItemGrid", id, store);
    }
}

DashboardItemGridCt = connect(mapStateToProps)(DashboardItemGridCt);

DashboardItemGridCt.contextTypes = {
    store: PropTypes.object
};

export default DashboardItemGridCt;


