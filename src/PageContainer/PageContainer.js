// Adjust the top margin of the page so it starts below the control bar
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import { CONTROL_BAR_ROW_HEIGHT } from '../ControlBarContainer/ControlBarContainer';
import { sGetIsEditing } from '../reducers/editDashboard';
import { sGetControlBarUserRows } from '../reducers/controlBar';
import { sGetFromState } from '../reducers/dashboards';
import TitleBar from '../TitleBar/TitleBar';
import ItemGrid from '../ItemGrid/ItemGrid';
import NoContentMessage from '../widgets/NoContentMessage';
// import

const DEFAULT_TOP_MARGIN = 80;

// const DynamicTopMarginContainer = ({ marginTop, hasDashboards }) => {
class DynamicTopMarginContainer extends Component {
    render() {
        console.log(
            'render PageContainer with dashboards',
            this.props.dashboards
        );

        const marginTop = this.props.marginTop;
        const hasDashboards =
            this.props.dashboards === null
                ? false
                : !isEmpty(this.props.dashboards);

        return (
            <div className="dashboard-wrapper" style={{ marginTop }}>
                {hasDashboards ? (
                    <Fragment>
                        <TitleBar />
                        <ItemGrid />
                    </Fragment>
                ) : (
                    <NoContentMessage text="No dashboards found" />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const edit = sGetIsEditing(state);
    const rows = sGetControlBarUserRows(state);
    const dashboards = sGetFromState(state);

    return {
        marginTop:
            DEFAULT_TOP_MARGIN + CONTROL_BAR_ROW_HEIGHT * (edit ? 1 : rows),
        dashboards,
    };
};

export default connect(mapStateToProps)(DynamicTopMarginContainer);
