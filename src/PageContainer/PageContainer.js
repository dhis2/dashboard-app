import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import i18n from 'd2-i18n';

import { sGetIsEditing } from '../reducers/editDashboard';
import { sGetById } from '../reducers/dashboards';
import { sGetSelectedId } from '../reducers/selected';
import TitleBar from '../TitleBar/TitleBar';
import ItemGrid from '../ItemGrid/ItemGrid';
import NoContentMessage from '../widgets/NoContentMessage';

export const PageContainer = props => {
    const noContentMessage = props.dashboardsIsEmpty
        ? i18n.t(
              'No dashboards found. Use the + button to create a new dashboard.'
          )
        : i18n.t('Requested dashboard not found');

    const hasDashboardContent =
        props.edit || (props.selectedId && !props.dashboardsIsEmpty);

    const Content = () => {
        return hasDashboardContent ? (
            <Fragment>
                <TitleBar />
                <ItemGrid />
            </Fragment>
        ) : (
            <NoContentMessage text={noContentMessage} />
        );
    };

    return (
        <div className="dashboard-wrapper">
            {!props.dashboardsLoaded || props.selectedId === null ? null : (
                <Content />
            )}
        </div>
    );
};

const mapStateToProps = state => {
    const dashboards = sGetById(state);

    return {
        edit: sGetIsEditing(state),
        selectedId: sGetSelectedId(state),
        dashboardsIsEmpty: isEmpty(dashboards),
        dashboardsLoaded: !(dashboards === null),
    };
};

export default connect(mapStateToProps)(PageContainer);
