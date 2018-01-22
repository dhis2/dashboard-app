import React from 'react';
import { connect } from 'react-redux';
import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
import Button from 'd2-ui/lib/button/Button';

import { fromSelected, fromEditDashboard } from '../actions';

import {
    CONTROL_BAR_OUTER_HEIGHT_DIFF,
    CONTROL_BAR_ROW_HEIGHT,
} from './ControlBarContainer';

const EditBar = ({ style, onSaveChanges, onDiscardChanges }) => {
    const controlBarHeight =
        CONTROL_BAR_OUTER_HEIGHT_DIFF + CONTROL_BAR_ROW_HEIGHT;

    return (
        <ControlBar
            height={controlBarHeight}
            editMode={true}
            expandable={false}
        >
            <div style={{ height: CONTROL_BAR_ROW_HEIGHT }}>
                <div style={style.leftControls}>
                    <Button color="primary" onClick={onSaveChanges}>
                        Save Changes
                    </Button>
                </div>
                <div style={style.rightControls}>
                    <Button color="default" onClick={onDiscardChanges}>
                        Exit without saving
                    </Button>
                </div>
            </div>
        </ControlBar>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveChanges: () => {
            console.log('not implemented yet');
        },
        onDiscardChanges: () => {
            dispatch(fromSelected.acSetSelectedEdit(false));
            dispatch(fromEditDashboard.acSetEditDashboard({}));
        },
    };
};

const EditBarCt = connect(null, mapDispatchToProps)(EditBar);

export default EditBarCt;
