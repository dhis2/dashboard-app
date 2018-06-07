import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import ViewDashboardContent from './ViewDashboardContent';
import DashboardVerticalOffset from './DashboardVerticalOffset';
import EditDashboard from './EditDashboard';
import DashboardsBar from '../ControlBarContainer/DashboardsBar';
import { fromDashboards } from '../actions';
import { sDashboardsIsFetching } from '../reducers/dashboards';

class Dashboard extends Component {
    setDashboard = () => {
        if (!this.props.isFetching) {
            const id = this.props.match.params.dashboardId || null;
            this.props.selectDashboard(id);
        }
    };

    componentDidMount() {
        this.setDashboard();
    }

    componentDidUpdate() {
        this.setDashboard();
    }

    render() {
        console.log('Dashboard render');

        return this.props.mode === 'view' ? (
            <Fragment>
                <DashboardsBar />
                <DashboardVerticalOffset />
                <ViewDashboardContent />
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
