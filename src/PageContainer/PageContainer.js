// Adjust the top margin of the page so it starts below the control bar
import React from 'react';
import { connect } from 'react-redux';

import { CONTROL_BAR_ROW_HEIGHT } from '../ControlBarContainer/ControlBarContainer';
import { sGetSelectedEdit } from '../reducers/selected';
import { sGetControlBarRows } from '../reducers/controlBar';

const DEFAULT_TOP_MARGIN = 80;

const DynamicTopMarginContainer = ({ marginTop, children }) => (
    <div className="dashboard-wrapper" style={{ marginTop }}>
        {children}
    </div>
);

const mapStateToProps = state => {
    const edit = sGetSelectedEdit(state);
    const rows = sGetControlBarRows(state);

    return {
        marginTop:
            DEFAULT_TOP_MARGIN + CONTROL_BAR_ROW_HEIGHT * (edit ? 1 : rows),
    };
};

export default connect(mapStateToProps)(DynamicTopMarginContainer);
