import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PageContainer from '../PageContainer/PageContainer';
import PageContainerSpacer from '../PageContainer/PageContainerSpacer';
import EditDashboard from './EditDashboard';
import DashboardsBar from '../ControlBarContainer/DashboardsBar';
import { fromDashboards } from '../actions';
import { sDashboardsIsFetching } from '../reducers/dashboards';

class Dashboard extends Component {
    componentDidUpdate() {
        if (!this.props.dashboardsFetching) {
            const id = this.props.match.params.dashboardId || null;
            this.props.selectDashboard(id);
        }
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

const mapStateToProps = state => {
    return { isFetching: sDashboardsIsFetching(state) };
};

export default connect(mapStateToProps, {
    selectDashboard: fromDashboards.tSelectDashboard,
})(Dashboard);
