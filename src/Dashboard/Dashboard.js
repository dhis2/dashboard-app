import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import PageContainer from '../PageContainer/PageContainer';
import PageContainerSpacer from '../PageContainer/PageContainerSpacer';
import EditDashboard from './EditDashboard';
import DashboardsBar from '../ControlBarContainer/DashboardsBar';
import { fromDashboards, fromControlBar } from '../actions';

class Dashboard extends Component {
    loadDashboard = () => {
        this.context.store.dispatch(
            fromDashboards.tSelectDashboard(
                this.props.match.params.dashboardId || null
            )
        );
    };

    componentDidMount() {
        this.loadDashboard();
        this.context.store.dispatch(fromControlBar.tSetControlBarRows());
    }

    componentDidUpdate() {
        this.loadDashboard();
    }

    render() {
        return this.props.mode === 'view' ? (
            <Fragment>
                <DashboardsBar />
                <PageContainerSpacer />
                <PageContainer />
            </Fragment>
        ) : (
            <Fragment>
                <EditDashboard mode={this.props.mode} />
            </Fragment>
        );
    }
}

Dashboard.contextTypes = {
    store: PropTypes.object,
};

export default Dashboard;
