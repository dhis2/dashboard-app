import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    getControlBarHeight,
    MIN_ROW_COUNT,
} from '../ControlBar/controlBarDimensions';
import { sGetControlBarUserRows } from '../../reducers/controlBar';

const DashboardVerticalOffset = props => {
    const rows = props.editMode ? MIN_ROW_COUNT : props.userRows;
    const marginTop = getControlBarHeight(rows);

    return <div className="page-container-top-margin" style={{ marginTop }} />;
};

const mapStateToProps = state => ({
    userRows: sGetControlBarUserRows(state),
});

DashboardVerticalOffset.propTypes = {
    editMode: PropTypes.bool,
    userRows: PropTypes.number,
};

export default connect(mapStateToProps)(DashboardVerticalOffset);
