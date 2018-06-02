import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PageContainer from '../PageContainer/PageContainer';
import PageContainerSpacer from '../PageContainer/PageContainerSpacer';
import EditDashboard from './EditDashboard';
import DashboardsBar from '../ControlBarContainer/DashboardsBar';
import { fromDashboards, fromControlBar } from '../actions';

class Dashboard extends Component {
    loadDashboard = () => {
        const id = this.props.match.params.dashboardId || null;
        this.props.selectDashboard(id);
    };

    componentDidMount() {
        this.loadDashboard();
        this.props.setControlBarRows();
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

export default connect(null, {
    selectDashboard: fromDashboards.tSelectDashboard,
    setControlBarRows: fromControlBar.tSetControlBarRows,
})(Dashboard);
