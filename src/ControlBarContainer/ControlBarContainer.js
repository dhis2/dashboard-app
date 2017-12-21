import React from 'react';
import { connect } from 'react-redux';

import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
import Button from 'd2-ui/lib/button/Button';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import Chip from 'd2-ui/lib/chip/Chip';

import { tSetControlBarExpanded, tSetControlBarRows } from '../actions';
import * as fromSelected from '../reducers/selected';

const styles = {
    scrollWrapper: {
        padding: '6px 6px 0 6px',
        overflowY: 'auto',
    },
    leftControls: {
        display: 'inline-block',
        fontSize: 16,
        float: 'left',
    },
    rightControls: {
        display: 'inline-block',
        float: 'right',
    },
    expandButtonWrap: {
        textAlign: 'center',
    },
};

export const controlBarRowHeight = 36;
const expandedRowCount = 15;

const getInnerHeight = (isExpanded, rows) =>
    (isExpanded ? expandedRowCount : rows) * controlBarRowHeight;
const getOuterHeight = (isExpanded, rows) =>
    getInnerHeight(isExpanded, rows) + 42;

const ControlBarComponent = ({
    dashboards,
    rows,
    onChangeHeight,
    isExpanded,
    onToggleExpanded,
    editMode,
}) => {
    const contentWrapperStyle = Object.assign({}, styles.scrollWrapper, {
        height: getInnerHeight(isExpanded, rows),
    });

    return (
        <ControlBar
            height={getOuterHeight(isExpanded, rows)}
            onChangeHeight={onChangeHeight}
            editMode={editMode}
        >
            <div style={contentWrapperStyle}>
                <div style={styles.leftControls}>
                    <Button onClick={() => {}}>+</Button>
                    <span>Search box __________</span>
                </div>
                <div style={styles.rightControls}>
                    <Button onClick={() => {}}>
                        <SvgIcon icon="ViewList" />
                    </Button>
                </div>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() =>
                    dashboards.map(dashboard => (
                        <div
                            key={dashboard.id}
                            style={{
                                display: 'inline-block',
                                height: 36,
                            }}
                        >
                            <Chip
                                label={dashboard.name}
                                avatar={
                                    dashboard.name !== 'bpiwgwg' ? 'star' : ''
                                }
                                color="primary"
                            />
                        </div>
                    ))
                )}
            </div>
            <div style={styles.expandButtonWrap}>
                <Button onClick={onToggleExpanded} color="primary">
                    {isExpanded ? 'Collapse' : 'Enlarge'}
                </Button>
            </div>
        </ControlBar>
    );
};

const mapStateToProps = state => {
    const { sGetSelectedEdit } = fromSelected;

    return {
        dashboards: (state.dashboards && Object.values(state.dashboards)) || [],
        rows: (state.controlBar && state.controlBar.rows) || 1,
        isExpanded:
            state.controlBar.expanded &&
            state.controlBar.rows < expandedRowCount,
        editMode: sGetSelectedEdit(state),
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const dispatch = dispatchProps.dispatch;

    return Object.assign(
        stateProps,
        dispatchProps,
        ownProps,
        stateProps.isExpanded
            ? {}
            : {
                  onChangeHeight: newHeight => {
                      const newRows = Math.max(
                          1,
                          Math.floor((newHeight - 24) / controlBarRowHeight)
                      );

                      if (newRows !== stateProps.rows) {
                          dispatch(tSetControlBarRows(newRows));
                      }
                  },
              },
        {
            onToggleExpanded: () => {
                dispatch(tSetControlBarExpanded(!stateProps.isExpanded));
            },
        }
    );
};
export const ControlBarContainer = connect(mapStateToProps, null, mergeProps)(
    ControlBarComponent
);

export default ControlBarContainer;
