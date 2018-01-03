import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
import Button from 'd2-ui/lib/button/Button';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import Chip from 'd2-ui/lib/chip/Chip';

import {
    tSetControlBarExpanded,
    tSetControlBarRows,
    acSetFilterName,
} from '../actions';
import * as fromSelected from '../reducers/selected';
import * as fromFilter from '../reducers/filter';
import { orArray, orObject } from '../util';
import { fromDashboards } from '../reducers/index';

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
    onFilterName,
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
                    <input onKeyUp={e => onFilterName(e.target.value)} />
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
    const { sGetFilterName } = fromFilter;

    const dashboards = Object.values(
        orObject(fromDashboards.sGetFromState(state))
    );

    return {
        state,
        props: {
            dashboards: dashboards.filter(
                d => d.name.indexOf(sGetFilterName(state)) !== -1
            ),
            rows: (state.controlBar && state.controlBar.rows) || 1,
            isExpanded:
                state.controlBar.expanded &&
                state.controlBar.rows < expandedRowCount,
            editMode: sGetSelectedEdit(state),
        },
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const dispatch = dispatchProps.dispatch;

    return {
        ...stateProps.props,
        ...ownProps,
        onChangeHeight: stateProps.isExpanded
            ? null
            : newHeight => {
                  const newRows = Math.max(
                      1,
                      Math.floor((newHeight - 24) / controlBarRowHeight)
                  );

                  if (newRows !== stateProps.rows) {
                      dispatch(tSetControlBarRows(newRows));
                  }
              },
        onToggleExpanded: () => {
            dispatch(tSetControlBarExpanded(!stateProps.isExpanded));
        },
        onFilterName: name => dispatch(acSetFilterName(name)),
    };
};

export const ControlBarContainer = connect(mapStateToProps, null, mergeProps)(
    ControlBarComponent
);

export default ControlBarContainer;
