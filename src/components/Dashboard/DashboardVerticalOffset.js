import React from 'react';
import { connect } from 'react-redux';

import {
    getTopOffset,
    MIN_ROW_COUNT,
} from '../ControlBar/controlBarDimensions';
import { sGetControlBarUserRows } from '../../reducers/controlBar';

const DashboardVerticalOffset = props => {
    const rows = props.editMode ? MIN_ROW_COUNT : props.userRows;
    const marginTop = getTopOffset(rows);

    return <div className="page-container-top-margin" style={{ marginTop }} />;
};

const mapStateToProps = state => ({
    userRows: sGetControlBarUserRows(state),
});

export default connect(mapStateToProps)(DashboardVerticalOffset);
