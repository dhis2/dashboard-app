import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import i18n from 'd2-i18n';

import { sGetById, sDashboardsIsFetching } from '../reducers/dashboards';
import { sGetSelectedId } from '../reducers/selected';
import TitleBar from '../TitleBar/TitleBar';
import ItemGrid from '../ItemGrid/ItemGrid';
import NoContentMessage from '../widgets/NoContentMessage';

export const ViewDashboardContent = ({
    selectedId,
    dashboardsIsEmpty,
    dashboardsLoaded,
}) => {
    const noContentMessage = dashboardsIsEmpty
        ? i18n.t(
              'No dashboards found. Use the + button to create a new dashboard.'
          )
        : i18n.t('Requested dashboard not found');

    const hasDashboardContent = selectedId && !dashboardsIsEmpty;

    const Content = () => {
        return hasDashboardContent ? (
            <Fragment>
                <TitleBar edit={false} />
                <ItemGrid edit={false} />
            </Fragment>
        ) : (
            <NoContentMessage text={noContentMessage} />
        );
    };

    return (
        <div className="dashboard-wrapper">
            {!dashboardsLoaded || selectedId === null ? null : <Content />}
        </div>
    );
};

const mapStateToProps = state => {
    const dashboards = sGetById(state);

    return {
        selectedId: sGetSelectedId(state),
        dashboardsIsEmpty: isEmpty(dashboards),
        dashboardsLoaded: !sDashboardsIsFetching(state),
    };
};

export default connect(mapStateToProps)(ViewDashboardContent);
