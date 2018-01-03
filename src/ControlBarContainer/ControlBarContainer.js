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
import { orObject } from '../util';
import { fromDashboards, fromSelected, fromFilter } from '../reducers';
import {
    blue400,
    blue200,
    blue600,
    blue800,
} from '../../../d2-ui/node_modules/material-ui/styles/colors';

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
const expandedRowCount = 12;

const getInnerHeight = (isExpanded, rows) =>
    (isExpanded ? expandedRowCount : rows) * controlBarRowHeight;
const getOuterHeight = (isExpanded, rows) =>
    getInnerHeight(isExpanded, rows) + 22;

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
                {dashboards.map(dashboard => (
                    <Chip
                        key={dashboard.id}
                        label={dashboard.name}
                        avatar={dashboard.starred ? 'star' : null}
                    />
                ))}
            </div>
            <div style={styles.expandButtonWrap}>
                <div
                    onClick={onToggleExpanded}
                    style={{
                        paddingTop: 4,
                        fontSize: 11,
                        fontWeight: 500,
                        color: blue800,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                    }}
                >
                    {isExpanded ? 'Show less' : 'Show more'}
                </div>
            </div>
        </ControlBar>
    );
};

const mapStateToProps = state => {
    const { sGetSelectedEdit } = fromSelected;
    const { sGetFilterName } = fromFilter;

    const dashboards = Object.values(
        orObject(fromDashboards.sGetFromState(state))
    ).filter(d => d.name.toLowerCase().indexOf(sGetFilterName(state)) !== -1);

    return {
        dashboards: [
            ...dashboards.filter(d => d.starred),
            ...dashboards.filter(d => !d.starred),
        ],
        rows: (state.controlBar && state.controlBar.rows) || 1,
        isExpanded:
            state.controlBar.expanded &&
            state.controlBar.rows < expandedRowCount,
        editMode: sGetSelectedEdit(state),
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { dispatch } = dispatchProps;
    const { rows, isExpanded } = stateProps;

    return {
        ...stateProps,
        ...ownProps,
        onChangeHeight: stateProps.isExpanded
            ? null
            : newHeight => {
                  const newRows = Math.max(
                      1,
                      Math.floor((newHeight - 24) / controlBarRowHeight)
                  );

                  if (newRows !== rows) {
                      dispatch(tSetControlBarRows(newRows));
                  }
              },
        onToggleExpanded: () => {
            dispatch(tSetControlBarExpanded(!isExpanded));
        },
        onFilterName: name => dispatch(acSetFilterName(name)),
    };
};

export const ControlBarContainer = connect(mapStateToProps, null, mergeProps)(
    ControlBarComponent
);

export default ControlBarContainer;
