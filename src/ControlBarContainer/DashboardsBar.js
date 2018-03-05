import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import i18n from 'dhis2-i18n';

import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
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

const MIN_ROW_COUNT = 1;
const MAX_ROW_COUNT = 10;

const onDashboardSelectWrapper = (id, name, onClick) => () =>
    id && onClick(id, name);

class DashboardsBar extends Component {
    state = {
        rows: MIN_ROW_COUNT,
    };

    setInitialDashboardState = rows => {
        this.setState({ rows });
        this.setState({ isMaxHeight: rows === MAX_ROW_COUNT });
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

        const isMaxHeight = this.state.isMaxHeight;
        const style = Object.assign({}, controlsStyle, dashboardBarStyles);
        const rowCount = isMaxHeight ? MAX_ROW_COUNT : this.state.rows;
        const contentWrapperStyle = Object.assign(
            {},
            dashboardBarStyles.scrollWrapper,
            { overflowY: isMaxHeight ? 'auto' : 'hidden' },
            { height: getInnerHeight(rowCount) }
        );

        const controlBarHeight = getOuterHeight(rowCount, true);

        return (
            <ControlBar
                height={controlBarHeight}
                onChangeHeight={this.onChangeHeight}
                onEndDrag={this.onEndDrag}
                editMode={false}
                expandable={true}
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
                                    orObject(orArray(dashboards)[0])
                                        .displayName,
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
                        onClick={this.onToggleMaxHeight}
                        style={{
                            paddingTop: 3,
                            fontSize: 11,
                            fontWeight: 700,
                            color: colors.royalBlue,
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            visibility: 'visible',
                        }}
                    >
                        {isMaxHeight
                            ? i18n.t('Close')
                            : i18n.t('View all dashboards')}
                    </div>
                </div>
            </ControlBar>
        );
    }
}

const mapStateToProps = state => ({
    dashboards: fromReducers.fromDashboards.sGetFromState(state),
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
