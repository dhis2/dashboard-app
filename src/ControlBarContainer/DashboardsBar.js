import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { t } from 'i18next';

import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
// FIXME: TO BE USED IN 2.30
//import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import Chip from 'd2-ui/lib/chip/Chip';
import { blue800 } from 'material-ui/styles/colors';

import D2IconButton from '../widgets/D2IconButton';
import Filter from './Filter';
import {
    CONTROL_BAR_ROW_HEIGHT,
    getInnerHeight,
    getOuterHeight,
} from './ControlBarContainer';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import { orObject, orArray } from '../util';
import { sGetSelectedId } from '../reducers/selected';

const dashboardBarStyles = {
    scrollWrapper: {
        padding: '10px 6px 0 6px',
    },
    expandButtonWrap: {
        textAlign: 'center',
    },
};

const EXPANDED_ROW_COUNT = 10;

const onDashboardSelectWrapper = (id, onClick) => () => id && onClick(id);

// FIXME: TO BE USED IN 2.30
// const ListViewButton = () => (
//     <div style={style.rightControls}>
//         <div
//             style={{
//                 position: 'relative',
//                 top: '6px',
//                 left: '-10px',
//                 cursor: 'pointer',
//             }}
//             onClick={() => alert('show list view')}
//         >
//             <SvgIcon icon="List" />
//         </div>
//     </div>
// );

const DashboardsBar = ({
    controlsStyle,
    dashboards,
    name,
    rows,
    selectedId,
    isExpanded,
    onChangeHeight,
    onToggleExpanded,
    onNewClick,
    onChangeFilterName,
    onSelectDashboard,
}) => {
    const style = Object.assign({}, controlsStyle, dashboardBarStyles);
    const rowCount = isExpanded ? EXPANDED_ROW_COUNT : rows;
    const contentWrapperStyle = Object.assign(
        {},
        dashboardBarStyles.scrollWrapper,
        { overflowY: isExpanded ? 'auto' : 'hidden' },
        { height: getInnerHeight(rowCount) }
    );

    const controlBarHeight = getOuterHeight(rowCount, true);

    return (
        <ControlBar
            height={controlBarHeight}
            onChangeHeight={onChangeHeight}
            editMode={false}
            expandable={!isExpanded}
        >
            <div style={contentWrapperStyle}>
                <div style={style.leftControls}>
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
                            onKeypressEnter={onDashboardSelectWrapper(
                                orObject(orArray(dashboards)[0]).id,
                                onSelectDashboard
                            )}
                        />
                    </Fragment>
                </div>
                {dashboards.map(dashboard => (
                    <Chip
                        key={dashboard.id}
                        label={dashboard.name}
                        avatar={dashboard.starred ? 'star' : null}
                        color={
                            dashboard.id === selectedId ? 'primary' : undefined
                        }
                        onClick={onDashboardSelectWrapper(
                            dashboard.id,
                            onSelectDashboard
                        )}
                    />
                ))}
            </div>
            <div style={style.expandButtonWrap}>
                <div
                    onClick={onToggleExpanded}
                    style={{
                        paddingTop: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        color: blue800,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        visibility: 'visible',
                    }}
                >
                    {isExpanded ? t('Show less') : t('Show more')}
                </div>
            </div>
        </ControlBar>
    );
};

const mapStateToProps = state => {
    const { fromDashboards, fromDashboardsFilter } = fromReducers;

    return {
        dashboards: fromDashboards.sGetFromState(state),
        name: fromDashboardsFilter.sGetFilterName(state),
        rows: (state.controlBar && state.controlBar.rows) || 1,
        selectedId: sGetSelectedId(state),
        isExpanded:
            state.controlBar.expanded &&
            state.controlBar.rows < EXPANDED_ROW_COUNT,
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { dashboards, name, rows, isExpanded } = stateProps;
    const { dispatch } = dispatchProps;
    const {
        fromControlBar,
        fromDashboardsFilter,
        fromEditDashboard,
    } = fromActions;

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
        onChangeHeight: (newHeight, onEndDrag) => {
            const newRows = Math.max(
                1,
                Math.floor((newHeight - 24) / CONTROL_BAR_ROW_HEIGHT)
            );

            if (newRows !== rows) {
                dispatch(
                    fromControlBar.acSetControlBarRows(
                        Math.min(newRows, EXPANDED_ROW_COUNT)
                    )
                );
            }
        },
        onNewClick: () => {
            dispatch(fromEditDashboard.acSetEditNewDashboard());
        },
        onToggleExpanded: () => {
            dispatch(fromControlBar.acSetControlBarExpanded(!isExpanded));
        },
        onChangeFilterName: name =>
            dispatch(fromDashboardsFilter.acSetFilterName(name)),
        onSelectDashboard: id => dispatch(fromActions.tSelectDashboardById(id)),
    };
};

const DashboardsBarContainer = connect(mapStateToProps, null, mergeProps)(
    DashboardsBar
);

export default DashboardsBarContainer;
