import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
import arraySort from 'd2-utilizr/lib/arraySort';
import Chip from './DashboardItemChip';
import D2IconButton from '../widgets/D2IconButton';
import Filter from './Filter';
import ShowMoreButton from './ShowMoreButton';
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
import { colors } from '../colors';

export const MIN_ROW_COUNT = 1;
export const MAX_ROW_COUNT = 10;

const onDashboardSelectWrapper = (id, name, onClick) => () =>
    id && onClick(id, name);

export class DashboardsBar extends Component {
    state = {
        rows: MIN_ROW_COUNT,
    };

    setInitialDashboardState = rows => {
        this.setState({ rows, isMaxHeight: rows === MAX_ROW_COUNT });
    };

    componentDidMount() {
        this.setInitialDashboardState(this.props.userRows);
    }

    componentWillReceiveProps(nextProps) {
        this.setInitialDashboardState(nextProps.userRows);
    }

    onChangeHeight = (newHeight, onEndDrag) => {
        const newRows = Math.max(
            MIN_ROW_COUNT,
            Math.floor(
                (newHeight - CONTROL_BAR_OUTER_HEIGHT_DIFF) /
                    CONTROL_BAR_ROW_HEIGHT
            )
        );

        if (newRows !== this.state.rows) {
            const newRowCount = Math.min(newRows, MAX_ROW_COUNT);

            this.props.onChangeHeight(newRowCount);
        }
    };

    onEndDrag = () => {
        return apiPostControlBarRows(this.state.rows);
    };

    onToggleMaxHeight = () => {
        const rows =
            this.state.rows === MAX_ROW_COUNT
                ? this.props.userRows
                : MAX_ROW_COUNT;

        this.setState({ rows, isMaxHeight: !this.state.isMaxHeight });
    };

    render() {
        const {
            controlsStyle,
            dashboards,
            name,
            selectedId,
            onNewClick,
            onChangeFilterName,
            onSelectDashboard,
        } = this.props;

        const rowCount = this.state.isMaxHeight
            ? MAX_ROW_COUNT
            : this.state.rows;
        const controlBarHeight = getOuterHeight(rowCount, true);
        const contentWrapperStyle = {
            padding: '10px 6px 0 6px',
            overflowY: this.state.isMaxHeight ? 'auto' : 'hidden',
            height: getInnerHeight(rowCount),
        };

        return (
            <ControlBar
                height={controlBarHeight}
                onChangeHeight={this.onChangeHeight}
                onEndDrag={this.onEndDrag}
                editMode={false}
                expandable={true}
            >
                <div style={contentWrapperStyle}>
                    <div style={orObject(controlsStyle).leftControls}>
                        <Fragment>
                            <D2IconButton
                                style={{
                                    width: 36,
                                    height: 36,
                                    marginRight: 10,
                                }}
                                iconColor={colors.mediumGreen}
                                onClick={onNewClick}
                            />
                            <Filter
                                name={name}
                                onChangeName={onChangeFilterName}
                                onKeypressEnter={onDashboardSelectWrapper(
                                    orObject(orArray(dashboards)[0]).id,
                                    orObject(orArray(dashboards)[0])
                                        .displayName,
                                    onSelectDashboard
                                )}
                            />
                        </Fragment>
                    </div>
                    {orArray(dashboards).map(dashboard => (
                        <Chip
                            key={dashboard.id}
                            label={dashboard.displayName}
                            starred={dashboard.starred}
                            dashboardId={dashboard.id}
                            selected={dashboard.id === selectedId}
                            onClick={onDashboardSelectWrapper(
                                dashboard.id,
                                dashboard.displayName,
                                onSelectDashboard
                            )}
                        />
                    ))}
                </div>
                {this.props.userRows !== MAX_ROW_COUNT ? (
                    <ShowMoreButton
                        onClick={this.onToggleMaxHeight}
                        isMaxHeight={this.state.isMaxHeight}
                    />
                ) : null}
            </ControlBar>
        );
    }
}

const mapStateToProps = state => ({
    dashboards: fromReducers.fromDashboards.sGetById(state),
    name: fromReducers.fromDashboardsFilter.sGetFilterName(state),
    userRows: (state.controlBar && state.controlBar.userRows) || MIN_ROW_COUNT,
    selectedId: sGetSelectedId(state),
});

const mapDispatchToProps = {
    onNewClick: fromActions.fromEditDashboard.acSetEditNewDashboard,
    onChangeHeight: fromActions.fromControlBar.acSetControlBarUserRows,
    onChangeFilterName: fromActions.fromDashboardsFilter.acSetFilterName,
    onSelectDashboard: fromActions.tSelectDashboardById,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const dashboards = Object.values(orObject(stateProps.dashboards));
    const displayDashboards = arraySort(
        dashboards.filter(d =>
            d.displayName.toLowerCase().includes(stateProps.name.toLowerCase())
        ),
        'ASC',
        'displayName'
    );

    return {
        ...stateProps,
        ...ownProps,
        ...dispatchProps,
        dashboards: [
            ...displayDashboards.filter(d => d.starred),
            ...displayDashboards.filter(d => !d.starred),
        ],
    };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    DashboardsBar
);
