import React, { Fragment } from 'react';
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

import './ControlBarContainer.css';

const styles = {
    scrollWrapper: {
        padding: '10px 6px 0 6px',
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

export const CONTROL_BAR_ROW_HEIGHT = 36;
const EXPANDED_ROW_COUNT = 12;
const CONTROL_BAR_OUTER_HEIGHT_DIFF = 24;

const getInnerHeight = (isExpanded, rows) =>
    (isExpanded ? EXPANDED_ROW_COUNT : rows) * CONTROL_BAR_ROW_HEIGHT;

const getOuterHeight = (isExpanded, rows) =>
    getInnerHeight(isExpanded, rows) + CONTROL_BAR_OUTER_HEIGHT_DIFF;

const onDashboardSelectWrapper = (id, onClick) => () => onClick(id);

const ControlBarComponent = ({
    dashboards,
    name,
    edit,
    rows,
    isExpanded,
    onChangeHeight,
    onToggleExpanded,
    onNewClick,
    onChangeFilterName,
    onDashboardSelect,
}) => {
    const contentWrapperStyle = Object.assign(
        {},
        styles.scrollWrapper,
        { overflowY: isExpanded ? 'auto' : 'hidden' },
        { height: getInnerHeight(isExpanded, rows) }
    );

    return (
        <ControlBar
            height={getOuterHeight(isExpanded, rows)}
            onChangeHeight={onChangeHeight}
            editMode={edit}
        >
            <div style={contentWrapperStyle}>
                <div style={styles.leftControls}>
                    {edit ? (
                        <div>Save changes</div>
                    ) : (
                        <Fragment>
                            <D2IconButton
                                style={{
                                    width: 36,
                                    height: 36,
                                    marginRight: 10,
                                }}
                                onClick={onNewClick}
                            />
                            <Filter
                                name={name}
                                onChangeName={onChangeFilterName}
                            />
                        </Fragment>
                    )}
                </div>
                <div style={styles.rightControls}>
                    {edit ? (
                        <div>Exit without saving</div>
                    ) : (
                        <div
                            style={{
                                position: 'relative',
                                top: '6px',
                                left: '-10px',
                                cursor: 'pointer',
                            }}
                            onClick={() => alert('show list view')}
                        >
                            <SvgIcon icon="List" />
                        </div>
                    )}
                </div>
                {!edit &&
                    dashboards.map(dashboard => (
                        <Chip
                            key={dashboard.id}
                            label={dashboard.name}
                            avatar={dashboard.starred ? 'star' : null}
                            onClick={onDashboardSelectWrapper(
                                dashboard.id,
                                onDashboardSelect
                            )}
                        />
                    ))}
            </div>
            <div style={styles.expandButtonWrap}>
                <div
                    onClick={onToggleExpanded}
                    style={{
                        paddingTop: isExpanded ? 0 : 4,
                        fontSize: 11,
                        fontWeight: 700,
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
            state.controlBar.rows < EXPANDED_ROW_COUNT,
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
                      Math.floor((newHeight - 24) / CONTROL_BAR_ROW_HEIGHT)
                  );

                  if (newRows !== rows) {
                      dispatch(fromControlBar.tSetControlBarRows(newRows));
                  }
              },
        onToggleExpanded: () => {
            dispatch(fromControlBar.tSetControlBarExpanded(!isExpanded));
        },
        onNewClick: () => dispatch(fromSelected.tNewDashboard()),
        onChangeFilterName: name => dispatch(fromFilter.acSetFilterName(name)),
        onDashboardSelect: id =>
            dispatch(fromSelected.tSetSelectedDashboardById(id)),
    };
};

export const ControlBarContainer = connect(mapStateToProps, null, mergeProps)(
    ControlBarComponent
);

export default ControlBarContainer;
