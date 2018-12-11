import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import i18n from 'd2-i18n';

import { fromDashboards, fromSelected } from '../../reducers';
import { acSetEditDashboard } from '../../actions/editDashboard';
import DashboardVerticalOffset from './DashboardVerticalOffset';
import DashboardContent from './DashboardContent';
import EditBar from '../ControlBarContainer/EditBar';
import NoContentMessage from '../../widgets/NoContentMessage';

const Content = ({ updateAccess }) => {
    return updateAccess ? (
        <DashboardContent editMode={true} />
    ) : (
        <NoContentMessage text={i18n.t('No access')} />
    );
};
export class EditDashboard extends Component {
    state = {
        initialized: false,
    };

    initEditDashboard = () => {
        if (this.props.dashboard) {
            this.setState({ initialized: true });
            this.props.setEditDashboard(this.props.dashboard, this.props.items);
        }
    };

    componentDidMount() {
        this.initEditDashboard();
    }

    componentDidUpdate() {
        if (!this.state.initialized) {
            this.initEditDashboard();
        }
    }

    getDashboardContent = () => {
        const contentNotReady =
            !this.props.dashboardsLoaded || this.props.id === null;

        return (
            <div className="dashboard-wrapper">
                {contentNotReady ? null : (
                    <Content updateAccess={this.props.updateAccess} />
                )}
            </div>
        );
    };

    render() {
        return (
            <Fragment>
                <EditBar />
                <DashboardVerticalOffset />
                {this.getDashboardContent()}
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    const id = fromSelected.sGetSelectedId(state);
    const dashboard = id ? fromDashboards.sGetById(state, id) : null;

    const updateAccess =
        dashboard && dashboard.access ? dashboard.access.update : false;

    return {
        dashboard,
        id,
        updateAccess,
        items: fromDashboards.sGetItems(state),
        dashboardsLoaded: !fromDashboards.sDashboardsIsFetching(state),
    };
};

export default connect(
    mapStateToProps,
    {
        setEditDashboard: acSetEditDashboard,
    }
)(EditDashboard);
