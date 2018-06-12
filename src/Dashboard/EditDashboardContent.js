import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import i18n from 'd2-i18n';

import { sGetById, sDashboardsIsFetching } from '../reducers/dashboards';
import { sGetSelectedId } from '../reducers/selected';
import TitleBar from '../TitleBar/TitleBar';
import ItemGrid from '../ItemGrid/ItemGrid';
import NoContentMessage from '../widgets/NoContentMessage';

class EditDashboardContent extends Component {
    render() {
        const hasUpdateAccess = this.props.access
            ? this.props.access.update
            : false;

        const Content = () => {
            return hasUpdateAccess ? (
                <Fragment>
                    <TitleBar edit={true} />
                    <ItemGrid edit={true} />
                </Fragment>
            ) : (
                <NoContentMessage text={i18n.t('No access')} />
            );
        };

        return (
            <div className="dashboard-wrapper">
                {!this.props.dashboardsLoaded ||
                this.props.selectedId === null ? null : (
                    <Content />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const selectedId = sGetSelectedId(state);
    const dashboard = selectedId ? sGetById(state, selectedId) : null;

    return {
        access: selectedId && dashboard ? dashboard.access : null,
        selectedId,
        dashboardsLoaded: !sDashboardsIsFetching(state),
    };
};

export default connect(mapStateToProps)(EditDashboardContent);
