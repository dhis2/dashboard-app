import React from 'react';
import { connect } from 'react-redux';
import { END_FLAP_HEIGHT } from 'd2-ui/lib/controlbar/ControlBar';

import EditBar from './EditBar';
import DashboardsBar from './DashboardsBar';
import { fromEditDashboard } from '../reducers';

import './ControlBarContainer.css';

const style = {
    leftControls: {
        display: 'inline-block',
        fontSize: 16,
        float: 'left',
        height: '36px',
    },
    rightControls: {
        display: 'inline-block',
        float: 'right',
    },
};

const ControlBar = ({ edit }) => {
    return edit ? (
        <EditBar style={style} />
    ) : (
        <DashboardsBar controlsStyle={style} />
    );
};

const mapStateToProps = state => ({
    edit: fromEditDashboard.sGetIsEditing(state),
});

const ControlBarCt = connect(mapStateToProps, null)(ControlBar);

export default ControlBarCt;

export const CONTROL_BAR_ROW_HEIGHT = 36;
export const CONTROL_BAR_OUTER_HEIGHT_DIFF = 24;

export const getInnerHeight = rows => {
    return rows * CONTROL_BAR_ROW_HEIGHT;
};

export const getOuterHeight = (rows, expandable) => {
    const flapHeight = !expandable ? END_FLAP_HEIGHT : 0;

    return getInnerHeight(rows) + CONTROL_BAR_OUTER_HEIGHT_DIFF + flapHeight;
};
