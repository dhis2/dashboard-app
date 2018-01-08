import React from 'react';
import { connect } from 'react-redux';

import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import Chip from 'd2-ui/lib/chip/Chip';

import D2IconButton from '../widgets/D2IconButton';
import Filter from './Filter';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import { orObject } from '../util';
import { blue800 } from '../../../d2-ui/node_modules/material-ui/styles/colors';

const styles = {
    scrollWrapper: {
        padding: '6px 6px 0 6px',
        overflowY: 'auto',
    },
    leftControls: {
        display: 'inline-block',
        fontSize: 16,
        float: 'left',
        height: '36px',
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
const outerHeightDiff = 22;

const getInnerHeight = (isExpanded, rows) =>
    (isExpanded ? expandedRowCount : rows) * controlBarRowHeight;

const getOuterHeight = (isExpanded, rows) =>
    getInnerHeight(isExpanded, rows) + outerHeightDiff;

const ControlBarComponent = ({
    dashboards,
    name,
    edit,
    rows,
    isExpanded,
    onChangeHeight,
    onToggleExpanded,
    onNewClick,
    onChangeName,
}) => {
    const contentWrapperStyle = Object.assign({}, styles.scrollWrapper, {
        height: getInnerHeight(isExpanded, rows),
    });

    return (
        <ControlBar
            height={getOuterHeight(isExpanded, rows)}
            onChangeHeight={onChangeHeight}
            editMode={edit}
        >
            <div style={contentWrapperStyle}>
                <div style={styles.leftControls}>
                    <D2IconButton
                        style={{ width: 36, height: 36, marginRight: 10 }}
                        onClick={onNewClick}
                    />
                    <Filter name={name} onChangeName={onChangeName} />
                </div>
                <div style={styles.rightControls}>
                    <SvgIcon icon="List" />
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
    const { fromDashboards, fromSelected, fromFilter } = fromReducers;

    return {
        dashboards: fromDashboards.sGetFromState(state),
        name: fromFilter.sGetFilterName(state),
        edit: fromSelected.sGetSelectedEdit(state),
        rows: (state.controlBar && state.controlBar.rows) || 1,
        isExpanded:
            state.controlBar.expanded &&
            state.controlBar.rows < expandedRowCount,
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { dispatch } = dispatchProps;
    const { dashboards, name, rows, isExpanded } = stateProps;
    const { fromControlBar, fromFilter, fromSelected } = fromActions;

    const filteredDashboards = Object.values(orObject(dashboards)).filter(
        d => d.name.toLowerCase().indexOf(name) !== -1
    );

    return {
        ...stateProps,
        ...ownProps,
        dashboards: [
            ...filteredDashboards.filter(d => d.starred),
            ...filteredDashboards.filter(d => !d.starred),
        ],
        onChangeHeight: isExpanded
            ? null
            : newHeight => {
                  const newRows = Math.max(
                      1,
                      Math.floor((newHeight - 24) / controlBarRowHeight)
                  );

                  if (newRows !== rows) {
                      dispatch(fromControlBar.tSetControlBarRows(newRows));
                  }
              },
        onToggleExpanded: () => {
            dispatch(fromControlBar.tSetControlBarExpanded(!isExpanded));
        },
        onNewClick: () => dispatch(fromSelected.tNewDashboard()),
        onChangeName: name => dispatch(fromFilter.acSetFilterName(name)),
    };
};

export const ControlBarContainer = connect(mapStateToProps, null, mergeProps)(
    ControlBarComponent
);

export default ControlBarContainer;
