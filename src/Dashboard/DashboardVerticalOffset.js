import React from 'react';
import { connect } from 'react-redux';

import { CONTROL_BAR_ROW_HEIGHT } from '../ControlBarContainer/controlBarDimensions';
import { sGetIsEditing } from '../reducers/editDashboard';
import { sGetControlBarUserRows } from '../reducers/controlBar';

const DEFAULT_TOP_MARGIN = 80;

const PageContainerSpacer = props => (
    <div
        className="page-container-top-margin"
        style={{ marginTop: props.marginTop }}
    />
);

const mapStateToProps = state => {
    const edit = sGetIsEditing(state);
    const rows = sGetControlBarUserRows(state);

    return {
        marginTop:
            DEFAULT_TOP_MARGIN + CONTROL_BAR_ROW_HEIGHT * (edit ? 1 : rows),
    };
};

export default connect(mapStateToProps)(PageContainerSpacer);
