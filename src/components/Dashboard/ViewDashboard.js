import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import i18n from 'd2-i18n';

import {
    sGetAllDashboards,
    sDashboardsIsFetching,
} from '../../reducers/dashboards';
import { sGetSelectedId } from '../../reducers/selected';
import DashboardsBar from '../ControlBar/DashboardsBar';
import DashboardVerticalOffset from './DashboardVerticalOffset';
import DashboardContent from './DashboardContent';
import NoContentMessage from '../../widgets/NoContentMessage';

export const Content = ({ hasDashboardContent, dashboardsIsEmpty }) => {
    const msg = dashboardsIsEmpty
        ? i18n.t(
              'No dashboards found. Use the + button to create a new dashboard.'
          )
        : i18n.t('Requested dashboard not found');

    return hasDashboardContent ? (
        <DashboardContent editMode={false} />
    ) : (
        <NoContentMessage text={msg} />
    );
};

export const ViewDashboard = ({ id, dashboardsIsEmpty, dashboardsLoaded }) => {
    const hasDashboardContent = id && !dashboardsIsEmpty;
    const contentNotReady = !dashboardsLoaded || id === null;

    return (
        <Fragment>
            <DashboardsBar />
            <DashboardVerticalOffset />
            <div className="dashboard-wrapper">
                {contentNotReady ? null : (
                    <Content
                        hasDashboardContent={hasDashboardContent}
                        dashboardsIsEmpty={dashboardsIsEmpty}
                    />
                )}
            </div>
        </Fragment>
    );
};

const mapStateToProps = state => {
    const dashboards = sGetAllDashboards(state);

    return {
        id: sGetSelectedId(state),
        dashboardsIsEmpty: isEmpty(dashboards),
        dashboardsLoaded: !sDashboardsIsFetching(state),
    };
};

export default connect(mapStateToProps)(ViewDashboard);
