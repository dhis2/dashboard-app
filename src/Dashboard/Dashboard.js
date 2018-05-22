import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import PageContainer from '../PageContainer/PageContainer';
import PageContainerSpacer from '../PageContainer/PageContainerSpacer';
import EditBar from '../ControlBarContainer/EditBar';
import DashboardsBar from '../ControlBarContainer/DashboardsBar';
import { fromDashboards, fromControlBar } from '../actions';

class Dashboard extends Component {
    loadDashboard = () => {
        const { store } = this.context;

        store.dispatch(
            fromDashboards.tSetDashboards(
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
                <EditBar />
                <PageContainerSpacer />
                <PageContainer />
            </Fragment>
        );
    }
}

Dashboard.contextTypes = {
    store: PropTypes.object,
};

export default Dashboard;
