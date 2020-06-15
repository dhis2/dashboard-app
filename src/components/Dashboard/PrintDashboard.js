import React, { Component } from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import PropTypes from 'prop-types';

import { acSetEditDashboard } from '../../actions/editDashboard';
import { sGetSelectedId } from '../../reducers/selected';
import { acSetSelectedPrintMode } from '../../actions/selected';
import {
    sGetDashboardById,
    sGetDashboardItems,
    sDashboardsIsFetching,
} from '../../reducers/dashboards';
import DashboardContent from './DashboardContent';
import { PRINT } from './dashboardModes';
import NoContentMessage from '../../widgets/NoContentMessage';

export const Content = ({ updateAccess }) => {
    return updateAccess ? (
        <DashboardContent mode={PRINT} />
    ) : (
        <NoContentMessage text={i18n.t('No access')} />
    );
};

Content.propTypes = {
    updateAccess: PropTypes.bool,
};
export class PrintDashboard extends Component {
    state = {
        initialized: false,
    };

    initPrintDashboard = () => {
        if (this.props.dashboard) {
            this.setState({ initialized: true });
            this.props.setPrintDashboard(
                this.props.dashboard,
                this.props.items
            );
        }
        this.props.setSelectedPrintMode(true);
    };

    componentDidMount() {
        this.initPrintDashboard();
    }

    componentDidUpdate() {
        if (!this.state.initialized) {
            this.initPrintDashboard();
        }
    }

    render() {
        const contentNotReady =
            !this.props.dashboardsLoaded || this.props.id === null;

        return (
            <div className="dashboard-wrapper">
                {contentNotReady ? null : (
                    <Content updateAccess={this.props.updateAccess} />
                )}
            </div>
        );
    }
}

PrintDashboard.propTypes = {
    dashboard: PropTypes.object,
    dashboardsLoaded: PropTypes.bool,
    id: PropTypes.string,
    items: PropTypes.array,
    setPrintDashboard: PropTypes.func,
    updateAccess: PropTypes.bool,
};

const mapStateToProps = state => {
    const id = sGetSelectedId(state);
    const dashboard = id ? sGetDashboardById(state, id) : null;

    const updateAccess =
        dashboard && dashboard.access ? dashboard.access.update : false;

    return {
        dashboard,
        id,
        updateAccess,
        items: sGetDashboardItems(state),
        dashboardsLoaded: !sDashboardsIsFetching(state),
    };
};

export default connect(mapStateToProps, {
    setPrintDashboard: acSetEditDashboard,
    setSelectedPrintMode: acSetSelectedPrintMode,
})(PrintDashboard);
