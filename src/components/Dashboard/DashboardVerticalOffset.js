import React from 'react';
import { connect } from 'react-redux';

import {
    CONTROL_BAR_ROW_HEIGHT,
    FIRST_ROW_PADDING_HEIGHT,
    CONTROL_BAR_OUTER_HEIGHT_DIFF,
    HEADER_BAR_HEIGHT,
} from '../ControlBar/controlBarDimensions';
import { sGetControlBarUserRows } from '../../reducers/controlBar';

const DEFAULT_TOP_MARGIN =
    HEADER_BAR_HEIGHT +
    FIRST_ROW_PADDING_HEIGHT +
    CONTROL_BAR_OUTER_HEIGHT_DIFF;

console.log('DEF_TOP_MAR', DEFAULT_TOP_MARGIN);

const DashboardVerticalOffset = props => {
    const marginTop =
        DEFAULT_TOP_MARGIN +
        CONTROL_BAR_ROW_HEIGHT * (props.edit ? 1 : props.rows);

    return <div className="page-container-top-margin" style={{ marginTop }} />;
};

const mapStateToProps = state => ({
    rows: sGetControlBarUserRows(state),
});

export default connect(mapStateToProps)(DashboardVerticalOffset);
