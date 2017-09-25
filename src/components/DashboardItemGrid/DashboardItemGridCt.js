import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as fromReducers from '../../reducers';

import { getDashboardItems } from '../../api';

import DashboardItemGrid from './DashboardItemGrid';

class DashboardItemGridCtCmp extends Component {
    render() {
        const { id } = this.props;
        const { d2 } = this.context;

        return (<DashboardItemGrid items={getDashboardItems(id)} d2={d2} />);
    }
}

DashboardItemGridCtCmp.propTypes = {
    id: PropTypes.string,
};

DashboardItemGridCtCmp.defaultProps = {
    id: '',
};

DashboardItemGridCtCmp.contextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = state => ({
    id: fromReducers.fromDashboardsConfig.sGetSelectedIdFromState(state),
});

const DashboardItemGridCt = connect(mapStateToProps)(DashboardItemGridCtCmp);

export default DashboardItemGridCt;

