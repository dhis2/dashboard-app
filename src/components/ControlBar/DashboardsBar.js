import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import cx from 'classnames'

import arraySort from 'd2-utilizr/lib/arraySort'
import PropTypes from 'prop-types'

import ControlBar from './ControlBar'
import Chip from './DashboardItemChip'
import AddCircleIcon from '../../icons/AddCircle'
import Filter from './Filter'
import ShowMoreButton from './ShowMoreButton'
import {
    FIRST_ROW_PADDING_HEIGHT,
    MIN_ROW_COUNT,
    getRowsHeight,
    getControlBarHeight,
    getNumRowsFromHeight,
} from './controlBarDimensions'
import { sGetDashboardsFilter } from '../../reducers/dashboardsFilter'
import { sGetControlBarUserRows } from '../../reducers/controlBar'
import { sGetAllDashboards } from '../../reducers/dashboards'
import { sGetSelectedId } from '../../reducers/selected'
import { acSetControlBarUserRows } from '../../actions/controlBar'
import { apiPostControlBarRows } from '../../api/controlBar'

import classes from './styles/DashboardsBar.module.css'

export const MAX_ROW_COUNT = 10

export const DashboardsBar = ({
    userRows,
    onChangeHeight,
    history,
    dashboards,
    selectedId,
    filterText,
}) => {
    const [rows, setRows] = useState(userRows)

    useEffect(() => {
        setRows(userRows)
    }, [userRows])

    const isMaxHeight = () => rows === MAX_ROW_COUNT

    const adjustHeight = newHeight => {
        const newRows = Math.max(
            MIN_ROW_COUNT,
            getNumRowsFromHeight(newHeight - 52) // don't rush the transition to a bigger row count
        )

        if (newRows !== rows) {
            onChangeHeight(Math.min(newRows, MAX_ROW_COUNT))
        }
    }

    const onEndDrag = () => apiPostControlBarRows(rows)

    const toggleMaxHeight = () => {
        const newRows = isMaxHeight() ? userRows : MAX_ROW_COUNT
        setRows(newRows)
    }

    const cancelMaxHeight = () => {
        setRows(userRows)
    }

    const onSelectDashboard = () => {
        const id = getFilteredDashboards()[0]?.id
        if (id) {
            history.push(id)
        }
    }

    const getFilteredDashboards = () => {
        const filteredDashboards = arraySort(
            Object.values(dashboards).filter(d =>
                d.displayName.toLowerCase().includes(filterText.toLowerCase())
            ),
            'ASC',
            'displayName'
        )

        return [
            ...filteredDashboards.filter(d => d.starred),
            ...filteredDashboards.filter(d => !d.starred),
        ]
    }

    const overflowYClass = isMaxHeight()
        ? classes.overflowYAuto
        : classes.overflowYHidden

    return (
        <ControlBar
            height={getControlBarHeight(rows)}
            onChangeHeight={adjustHeight}
            onEndDrag={onEndDrag}
            editMode={false}
        >
            <div
                className={cx(classes.container, overflowYClass)}
                style={{
                    height: getRowsHeight(rows) + FIRST_ROW_PADDING_HEIGHT,
                }}
            >
                <div className={classes.leftControls}>
                    <Link
                        className={classes.newLink}
                        to={'/new'}
                        data-test="dhis2-dashboard-link-new-dashboard"
                    >
                        <AddCircleIcon />
                    </Link>
                    <Filter onKeypressEnter={onSelectDashboard} />
                </div>
                {getFilteredDashboards().map(dashboard => (
                    <Chip
                        key={dashboard.id}
                        label={dashboard.displayName}
                        starred={dashboard.starred}
                        dashboardId={dashboard.id}
                        selected={dashboard.id === selectedId}
                        onClick={cancelMaxHeight}
                    />
                ))}
            </div>
            <ShowMoreButton
                onClick={toggleMaxHeight}
                isMaxHeight={isMaxHeight()}
                disabled={userRows === MAX_ROW_COUNT}
            />
        </ControlBar>
    )
}

DashboardsBar.propTypes = {
    dashboards: PropTypes.object,
    filterText: PropTypes.string,
    history: PropTypes.object,
    selectedId: PropTypes.string,
    userRows: PropTypes.number,
    onChangeHeight: PropTypes.func,
}

const mapStateToProps = state => ({
    dashboards: sGetAllDashboards(state),
    filterText: sGetDashboardsFilter(state),
    selectedId: sGetSelectedId(state),
    userRows: sGetControlBarUserRows(state),
})

const mapDispatchToProps = {
    onChangeHeight: acSetControlBarUserRows,
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DashboardsBar)
)
