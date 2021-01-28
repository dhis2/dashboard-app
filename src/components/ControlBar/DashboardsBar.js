import React, { useState, useEffect, createRef } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import cx from 'classnames'
import arraySort from 'd2-utilizr/lib/arraySort'
import PropTypes from 'prop-types'

import ControlBar, { DRAG_HANDLE_HEIGHT } from './ControlBar'
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
    getControlBarHeightSmallDevice,
    CONTROL_BAR,
    CONTROL_BAR_CONTAINER,
    CHIPS_CONTAINER,
} from './controlBarDimensions'
import { useWindowDimensions } from '../WindowDimensionsProvider'
import { sGetDashboardsFilter } from '../../reducers/dashboardsFilter'
import { sGetControlBarUserRows } from '../../reducers/controlBar'
import { sGetAllDashboards } from '../../reducers/dashboards'
import { sGetSelectedId } from '../../reducers/selected'
import { acSetControlBarUserRows } from '../../actions/controlBar'
import { apiPostControlBarRows } from '../../api/controlBar'

import isSmallScreen from '../../modules/isSmallScreen'

import classes from './styles/DashboardsBar.module.css'

export const MAX_ROW_COUNT = 10
export const isDashboardBarMaxHeight = rows => rows === MAX_ROW_COUNT

const DashboardsBar = ({
    userRows,
    onChangeHeight,
    history,
    dashboards,
    selectedId,
    filterText,
}) => {
    const [rows, setRows] = useState(userRows)
    const { width, height } = useWindowDimensions()
    const ref = createRef()

    useEffect(() => {
        setRows(userRows)
    }, [userRows])

    const isMaxHeight = () => isDashboardBarMaxHeight(rows)

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

    const scrollToTop = () => {
        if (isMaxHeight()) {
            ref.current.scroll(0, 0)
        }
    }

    const toggleMaxHeight = () => {
        const newRows = isMaxHeight() ? userRows : MAX_ROW_COUNT
        scrollToTop()
        setRows(newRows)
    }

    const cancelMaxHeight = () => {
        scrollToTop()
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

    const viewableRows =
        isSmallScreen(width) && !isMaxHeight() ? MIN_ROW_COUNT : rows

    const getHeight = () => {
        if (isSmallScreen(width) && isMaxHeight()) {
            return getControlBarHeightSmallDevice(CONTROL_BAR, height)
        }

        return getControlBarHeight(viewableRows)
    }

    const getContainerHeight = container => {
        if (isSmallScreen(width) && isMaxHeight()) {
            return getControlBarHeightSmallDevice(
                container ? CONTROL_BAR_CONTAINER : CHIPS_CONTAINER,
                height
            )
        }
        return getRowsHeight(viewableRows) + FIRST_ROW_PADDING_HEIGHT
    }

    const getDashboardChips = () => {
        const chips = getFilteredDashboards().map(dashboard => (
            <Chip
                key={dashboard.id}
                label={dashboard.displayName}
                starred={dashboard.starred}
                dashboardId={dashboard.id}
                selected={dashboard.id === selectedId}
                onClick={cancelMaxHeight}
            />
        ))
        if (isSmallScreen(width)) {
            const chipContainerClasses = cx(
                classes.chipContainer,
                isMaxHeight() ? classes.expanded : classes.collapsed
            )
            return (
                <div
                    className={chipContainerClasses}
                    style={{ height: getContainerHeight() }}
                >
                    {chips}
                </div>
            )
        } else {
            return chips
        }
    }

    const containerClass = cx(
        classes.container,
        isMaxHeight() ? classes.expanded : classes.collapsed
    )

    return (
        <>
            <ControlBar
                height={getHeight()}
                onChangeHeight={!isSmallScreen(width) ? adjustHeight : null}
                onEndDrag={onEndDrag}
            >
                <div
                    className={containerClass}
                    ref={ref}
                    style={{
                        height: getContainerHeight(CONTROL_BAR_CONTAINER),
                    }}
                >
                    <div className={classes.controls}>
                        <Link
                            className={classes.newLink}
                            to={'/new'}
                            data-test="link-new-dashboard"
                        >
                            <AddCircleIcon />
                        </Link>
                        <Filter
                            onKeypressEnter={onSelectDashboard}
                            onToggleMaxHeight={toggleMaxHeight}
                            isMaxHeight={isMaxHeight()}
                        />
                    </div>
                    {getDashboardChips()}
                </div>
                <ShowMoreButton
                    onClick={toggleMaxHeight}
                    isMaxHeight={isMaxHeight()}
                    disabled={userRows === MAX_ROW_COUNT}
                />
            </ControlBar>
            <div
                style={{
                    marginTop:
                        getControlBarHeight(
                            isSmallScreen(width) && !isMaxHeight()
                                ? MIN_ROW_COUNT
                                : userRows
                        ) + DRAG_HANDLE_HEIGHT,
                }}
            />
        </>
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
