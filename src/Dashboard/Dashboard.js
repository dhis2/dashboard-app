import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import ViewDashboard from './ViewDashboard';
import EditDashboard from './EditDashboard';
import NewDashboard from './NewDashboard';
import { fromDashboards } from '../actions';
import { sDashboardsIsFetching } from '../reducers/dashboards';

class Dashboard extends Component {
    setDashboard = () => {
        if (this.props.dashboardsLoaded) {
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

    getDashboard = () => {
        switch (this.props.mode) {
            case 'edit':
                return <EditDashboard />;
            case 'new':
                return <NewDashboard />;
            default:
                return <ViewDashboard />;
        }
    };

    render() {
        return <Fragment>{this.getDashboard()}</Fragment>;
    }
}

const mapStateToProps = state => {
    return { dashboardsLoaded: !sDashboardsIsFetching(state) };
};

export default connect(mapStateToProps, {
    selectDashboard: fromDashboards.tSelectDashboard,
})(Dashboard);
