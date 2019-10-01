import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import ControlBar from './ControlBar';
import arraySort from 'd2-utilizr/lib/arraySort';

import Chip from './DashboardItemChip';
import AddCircleIcon from '../../icons/AddCircle';
import Filter from './Filter';
import ShowMoreButton from './ShowMoreButton';
import {
    FIRST_ROW_PADDING_HEIGHT,
    MIN_ROW_COUNT,
    getRowsHeight,
    getControlBarHeight,
    getNumRowsFromHeight,
} from './controlBarDimensions';
import { sGetControlBarUserRows } from '../../reducers/controlBar';
import { sGetAllDashboards } from '../../reducers/dashboards';
import { sGetFilterName } from '../../reducers/dashboardsFilter';
import { sGetSelectedId } from '../../reducers/selected';
import { acSetControlBarUserRows } from '../../actions/controlBar';
import { acSetFilterName } from '../../actions/dashboardsFilter';
import { orObject, orArray } from '../../modules/util';
import { apiPostControlBarRows } from '../../api/controlBar';

import classes from './styles/DashboardsBar.module.css';

export const MAX_ROW_COUNT = 10;

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

    onChangeHeight = newHeight => {
        const adjustedHeight = newHeight - 52; // don't rush the transition to a bigger row count
        const newRows = Math.max(
            MIN_ROW_COUNT,
            getNumRowsFromHeight(adjustedHeight)
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

    onSelectDashboard = () => {
        this.props.history.push(`/${this.props.dashboards[0].id}`);
    };

    render() {
        const { dashboards, name, selectedId, onChangeFilterName } = this.props;

        const rowCount = this.state.isMaxHeight
            ? MAX_ROW_COUNT
            : this.state.rows;
        const controlBarHeight = getControlBarHeight(rowCount);
        const contentWrapperStyle = {
            padding: `${FIRST_ROW_PADDING_HEIGHT}px 6px 0 6px`,
            overflowY: this.state.isMaxHeight ? 'auto' : 'hidden',
            height: getRowsHeight(rowCount) + FIRST_ROW_PADDING_HEIGHT,
        };

        return (
            <ControlBar
                height={controlBarHeight}
                onChangeHeight={this.onChangeHeight}
                onEndDrag={this.onEndDrag}
                editMode={false}
            >
                <div style={contentWrapperStyle}>
                    <div className={classes.leftControls}>
                        <Link
                            style={{
                                display: 'inline-block',
                                textDecoration: 'none',
                                marginRight: 10,
                                position: 'relative',
                                top: '2px',
                            }}
                            to={'/new'}
                        >
                            <AddCircleIcon />
                        </Link>
                        <Filter
                            name={name}
                            onChangeName={onChangeFilterName}
                            onKeypressEnter={this.onSelectDashboard}
                        />
                    </div>
                    {orArray(dashboards).map(dashboard => (
                        <Chip
                            key={dashboard.id}
                            label={dashboard.displayName}
                            starred={dashboard.starred}
                            dashboardId={dashboard.id}
                            selected={dashboard.id === selectedId}
                        />
                    ))}
                </div>
                <ShowMoreButton
                    onClick={this.onToggleMaxHeight}
                    isMaxHeight={this.state.isMaxHeight}
                    disabled={this.props.userRows === MAX_ROW_COUNT}
                />
            </ControlBar>
        );
    }
}

const mapStateToProps = state => ({
    dashboards: sGetAllDashboards(state),
    name: sGetFilterName(state),
    userRows: sGetControlBarUserRows(state),
    selectedId: sGetSelectedId(state),
});

const mapDispatchToProps = {
    onChangeHeight: acSetControlBarUserRows,
    onChangeFilterName: acSetFilterName,
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

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(DashboardsBar)
);
