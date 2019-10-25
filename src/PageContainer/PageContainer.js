import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import i18n from '@dhis2/d2-i18n';

import { sGetIsEditing } from '../reducers/editDashboard';
import { sGetFromState } from '../reducers/dashboards';
import TitleBar from '../TitleBar/TitleBar';
import ItemGrid from '../ItemGrid/ItemGrid';
import NoContentMessage from '../widgets/NoContentMessage';

export const PageContainer = props => {
    const Content = () =>
        !props.dashboardsIsEmpty || props.edit ? (
            <Fragment>
                <TitleBar />
                <ItemGrid />
            </Fragment>
        ) : (
            <NoContentMessage
                text={i18n.t(
                    'No dashboards found. Use the + button to create a new dashboard.'
                )}
            />
        );

    return (
        <div className="dashboard-wrapper">
            {props.dashboardsIsNull ? null : <Content />}
        </div>
    );
};

const mapStateToProps = state => {
    const edit = sGetIsEditing(state);
    const dashboards = sGetFromState(state);

    return {
        edit,
        dashboardsIsEmpty: isEmpty(dashboards),
        dashboardsIsNull: dashboards === null,
    };
};

export default connect(mapStateToProps)(PageContainer);
