import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import PageContainer from '../PageContainer/PageContainer';
import PageContainerSpacer from '../PageContainer/PageContainerSpacer';
import ControlBarContainer from '../ControlBarContainer/ControlBarContainer';
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
        return (
            <Fragment>
                <ControlBarContainer />
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
