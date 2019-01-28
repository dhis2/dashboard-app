import React from 'react';
import { connect } from 'react-redux';

import { CONTROL_BAR_ROW_HEIGHT } from '../ControlBar/controlBarDimensions';
import { sGetControlBarUserRows } from '../../reducers/controlBar';

const DEFAULT_TOP_MARGIN = 70;

const DashboardVerticalOffset = props => (
    <div
        className="page-container-top-margin"
        style={{ marginTop: props.marginTop }}
    />
);

const mapStateToProps = state => ({
    rows: sGetControlBarUserRows(state),
});

const mergeProps = (stateProps, dispatchProps, props) => {
    return Object.assign(
        {},
        {
            marginTop:
                DEFAULT_TOP_MARGIN +
                CONTROL_BAR_ROW_HEIGHT * (props.edit ? 1 : stateProps.rows),
        }
    );
};

export default connect(
    mapStateToProps,
    null,
    mergeProps
)(DashboardVerticalOffset);
