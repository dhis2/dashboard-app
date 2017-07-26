import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as fromReducers from '../../reducers';

import { getDashboardItems } from '../../api';

import DashboardItemGrid from './DashboardItemGrid';

class DashboardItemGridCt extends Component {
    render() {
        const items = getDashboardItems(this.props.id);

        return (<DashboardItemGrid items={items} />);
    }
}

DashboardItemGridCt.contextTypes = {
    d2: PropTypes.object
};

const mapStateToProps = state => ({
    id: fromReducers.fromDashboardsConfig.sGetSelectedIdFromState(state)
});

DashboardItemGridCt = connect(mapStateToProps)(DashboardItemGridCt);

export default DashboardItemGridCt;


