import React from 'react';
import { connect } from 'react-redux';
import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
import Button from 'd2-ui/lib/button/Button';
import { colors } from '../colors';

import { fromSelected, fromEditDashboard } from '../actions';

import { CONTROL_BAR_ROW_HEIGHT, getOuterHeight } from './ControlBarContainer';

const styles = {
    save: {
        borderRadius: '2px',
        backgroundColor: colors.royalBlue,
        color: colors.lightGrey,
        fontWeight: '500',
        boxShadow:
            '0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.24), 0 0 8px 0 rgba(0,0,0,0.12), 0 0 8px 0 rgba(0,0,0,0.24)',
    },
    discard: {
        color: colors.royalBlue,
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '14px',
        fontWeight: 500,
        textTransform: 'uppercase',
        padding: '5px',
        height: '36px',
        cursor: 'pointer',
    },
    buttonBar: {
        height: CONTROL_BAR_ROW_HEIGHT,
        paddingTop: '14px',
        marginLeft: '15px',
        marginRight: '15px',
    },
};

const EditBar = ({ style, onSave, onDiscard }) => {
    const controlBarHeight = getOuterHeight(1, false);

    return (
        <ControlBar
            height={controlBarHeight}
            editMode={true}
            expandable={false}
        >
            <div style={styles.buttonBar}>
                <div style={style.leftControls}>
                    <Button style={styles.save} onClick={onSave}>
                        Save Changes
                    </Button>
                </div>
                <div style={style.rightControls}>
                    <button style={styles.discard} onClick={onDiscard}>
                        Exit without saving
                    </button>
                </div>
            </div>
        </ControlBar>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        onSave: () => {
            dispatch(fromEditDashboard.tSaveDashboard());
        },
        onDiscard: () => {
            dispatch(fromSelected.acSetSelectedEdit(false));
            dispatch(fromEditDashboard.acSetEditDashboard({}));
        },
    };
};

const EditBarCt = connect(null, mapDispatchToProps)(EditBar);

export default EditBarCt;
