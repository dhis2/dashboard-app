import React from 'react';
import { connect } from 'react-redux';

import {
    HEADERBAR_HEIGHT,
    getControlBarHeight,
    MIN_ROW_COUNT,
} from '../ControlBar/controlBarDimensions';
import { sGetControlBarUserRows } from '../../reducers/controlBar';

const DashboardVerticalOffset = props => {
    const rows = props.editMode ? MIN_ROW_COUNT : props.userRows;
    const marginTop = HEADERBAR_HEIGHT + getControlBarHeight(rows, false);

    return <div className="page-container-top-margin" style={{ marginTop }} />;
};

const mapStateToProps = state => ({
    userRows: sGetControlBarUserRows(state),
});

export default connect(mapStateToProps)(DashboardVerticalOffset);
