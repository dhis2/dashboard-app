// Adjust the top margin of the page so it starts below the control bar
import React from 'react';
import { connect } from 'react-redux';

import { CONTROL_BAR_ROW_COUNT } from '../ControlBarContainer/ControlBarContainer';

const TOP_MARGIN = 80;

const DynamicTopMarginContainer = ({ marginTop, children }) => (
    <div className="dashboard-wrapper" style={{ marginTop }}>
        {children}
    </div>
);

const mapStateToProps = state => ({
    marginTop: state.controlBar.rows * CONTROL_BAR_ROW_COUNT + TOP_MARGIN,
});

export default connect(mapStateToProps)(DynamicTopMarginContainer);
