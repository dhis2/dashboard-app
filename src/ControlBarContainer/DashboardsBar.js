import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import i18n from 'dhis2-i18n';

import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
// FIXME: TO BE USED IN 2.30
//import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import arraySort from 'd2-utilizr/lib/arraySort';
import Chip from './DashboardItemChip';

import { colors } from '../colors';
import D2IconButton from '../widgets/D2IconButton';
import Filter from './Filter';
import {
    CONTROL_BAR_ROW_HEIGHT,
    CONTROL_BAR_OUTER_HEIGHT_DIFF,
    getInnerHeight,
    getOuterHeight,
} from './ControlBarContainer';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import { orObject, orArray } from '../util';
import { sGetSelectedId } from '../reducers/selected';
import { apiPostControlBarRows } from '../api/controlBar';

const dashboardBarStyles = {
    scrollWrapper: {
        padding: '10px 6px 0 6px',
    },
    expandButtonWrap: {
        textAlign: 'center',
    },
};

const EXPANDED_ROW_COUNT = 10;

const onDashboardSelectWrapper = (id, name, onClick) => () =>
    id && onClick(id, name);

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
    onEndDrag,
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
            onEndDrag={onEndDrag}
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
                                orObject(orArray(dashboards)[0]).displayName,
                                onSelectDashboard
                            )}
                        />
                    </Fragment>
                </div>
                {dashboards.map(dashboard => (
                    <Chip
                        key={dashboard.id}
                        label={dashboard.displayName}
                        starred={dashboard.starred}
                        selected={dashboard.id === selectedId}
                        onClick={onDashboardSelectWrapper(
                            dashboard.id,
                            dashboard.displayName,
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
                        color: colors.royalBlue,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        visibility: 'visible',
                    }}
                >
                    {isExpanded ? i18n.t('Show less') : i18n.t('Show more')}
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
    const { dispatch } = dispatchProps;
    const {
        fromControlBar,
        fromDashboardsFilter,
        fromEditDashboard,
    } = fromActions;

    const dashboards = Object.values(orObject(stateProps.dashboards));
    const displayDashboards = arraySort(
        dashboards.filter(d =>
            d.displayName.toLowerCase().includes(stateProps.name)
        ),
        'ASC',
        'displayName'
    );

    return {
        ...stateProps,
        ...ownProps,
        dashboards: [
            ...displayDashboards.filter(d => d.starred),
            ...displayDashboards.filter(d => !d.starred),
        ],
        onChangeHeight: (newHeight, onEndDrag) => {
            const newRows = Math.max(
                1,
                Math.floor(
                    (newHeight - CONTROL_BAR_OUTER_HEIGHT_DIFF) /
                        CONTROL_BAR_ROW_HEIGHT
                )
            );

            if (newRows !== stateProps.rows) {
                dispatch(
                    fromControlBar.acSetControlBarRows(
                        Math.min(newRows, EXPANDED_ROW_COUNT)
                    )
                );
            }
        },
        onEndDrag: () => apiPostControlBarRows(stateProps.rows),
        onNewClick: () => {
            dispatch(fromEditDashboard.acSetEditNewDashboard());
        },
        onToggleExpanded: () => {
            dispatch(
                fromControlBar.acSetControlBarExpanded(!stateProps.isExpanded)
            );
        },
        onChangeFilterName: name =>
            dispatch(fromDashboardsFilter.acSetFilterName(name)),
        onSelectDashboard: (id, name) =>
            dispatch(fromActions.tSelectDashboardById(id, name)),
    };
};

const DashboardsBarContainer = connect(mapStateToProps, null, mergeProps)(
    DashboardsBar
);

export default DashboardsBarContainer;
