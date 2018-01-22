import React from 'react';
import ControlBar from 'd2-ui/lib/controlbar/ControlBar';

import {
    CONTROL_BAR_OUTER_HEIGHT_DIFF,
    CONTROL_BAR_ROW_HEIGHT,
} from './ControlBarContainer';

const EditBar = ({ style, onNewClick }) => {
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
                    <div>Save changes</div>
                </div>
                <div style={style.rightControls}>
                    <div>Exit without saving</div>
                </div>
            </div>
        </ControlBar>
    );
};

export default EditBar;
