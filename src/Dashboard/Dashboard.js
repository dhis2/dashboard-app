import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PageContainer from '../PageContainer/PageContainer';
import PageContainerSpacer from '../PageContainer/PageContainerSpacer';
import EditDashboard from './EditDashboard';
import DashboardsBar from '../ControlBarContainer/DashboardsBar';
import { fromDashboards, fromControlBar } from '../actions';

class Dashboard extends Component {
    componentDidMount() {
        const id = this.props.match.params.dashboardId || null;
        this.props.loadDashboards(id);
        this.props.setControlBarRows();
    }

    componentDidUpdate() {
        const id = this.props.match.params.dashboardId || null;
        console.log('Dashboard CDU load dashboard with id', id);
        this.props.selectDashboard(id);
    }

    render() {
        console.log('Dashboard render');

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

export default connect(null, {
    selectDashboard: fromDashboards.tSelectDashboard,
    setControlBarRows: fromControlBar.tSetControlBarRows,
    loadDashboards: fromDashboards.tFetchDashboards,
})(Dashboard);
