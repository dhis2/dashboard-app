import React, { Component } from 'react';
import { connect } from 'react-redux';

import { tSelectDashboard } from '../../actions/dashboards';
import { sDashboardsIsFetching } from '../../reducers/dashboards';
import { EDIT, NEW } from './dashboardModes';
import ViewDashboard from './ViewDashboard';
import EditDashboard from './EditDashboard';
import NewDashboard from './NewDashboard';

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

    render() {
        switch (this.props.mode) {
            case EDIT:
                return <EditDashboard />;
            case NEW:
                return <NewDashboard />;
            default:
                return <ViewDashboard />;
        }
    }
}

const mapStateToProps = state => {
    return { dashboardsLoaded: !sDashboardsIsFetching(state) };
};

export default connect(
    mapStateToProps,
    {
        selectDashboard: tSelectDashboard,
    }
)(Dashboard);
