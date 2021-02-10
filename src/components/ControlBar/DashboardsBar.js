import React, { useState, createRef } from 'react'
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
} from './controlBarDimensions'
import { useWindowDimensions } from '../WindowDimensionsProvider'
import { sGetDashboardsFilter } from '../../reducers/dashboardsFilter'
import { sGetControlBarUserRows } from '../../reducers/controlBar'
import { sGetAllDashboards } from '../../reducers/dashboards'
import { sGetSelectedId } from '../../reducers/selected'
import { acSetControlBarUserRows } from '../../actions/controlBar'
import { apiPostControlBarRows } from '../../api/controlBar'

import { isSmallScreen } from '../../modules/smallScreen'

import classes from './styles/DashboardsBar.module.css'

export const MAX_ROW_COUNT = 10
export const isDashboardBarMaxHeight = rows => rows === MAX_ROW_COUNT

const DashboardsBar = ({
    userRows,
    updateUserRows,
    onExpandedChanged,
    history,
    dashboards,
    selectedId,
    filterText,
}) => {
    const [expanded, setExpanded] = useState(false)
    const { width } = useWindowDimensions()
    const ref = createRef()

    const adjustRows = newHeight => {
        const newRows = Math.max(
            MIN_ROW_COUNT,
            getNumRowsFromHeight(newHeight - 52) // don't rush the transition to a bigger row count
        )

        if (newRows !== userRows) {
            updateUserRows(Math.min(newRows, MAX_ROW_COUNT))
        }
    }

    const saveUserRows = () => apiPostControlBarRows(userRows)

    const scrollToTop = () => {
        if (expanded) {
            ref.current.scroll(0, 0)
        }
    }

    const toggleExpanded = () => {
        scrollToTop()
        setExpanded(!expanded)
        onExpandedChanged(expanded)
    }

    const cancelExpanded = () => {
        scrollToTop()
        setExpanded(false)
        onExpandedChanged(expanded)
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

    const getDashboardChips = () => {
        const chips = getFilteredDashboards().map(dashboard => (
            <Chip
                key={dashboard.id}
                label={dashboard.displayName}
                starred={dashboard.starred}
                dashboardId={dashboard.id}
                selected={dashboard.id === selectedId}
                onClick={cancelExpanded}
            />
        ))
        if (isSmallScreen(width)) {
            const chipContainerClasses = cx(
                classes.chipContainer,
                expanded ? classes.expanded : classes.collapsed
            )
            return (
                <div className={chipContainerClasses} style={rowHeightProp}>
                    {chips}
                </div>
            )
        } else {
            return chips
        }
    }

    const containerClass = cx(
        classes.container,
        expanded ? classes.expanded : classes.collapsed
    )

    const viewableRows =
        isSmallScreen(width) && !expanded ? MIN_ROW_COUNT : userRows

    const rowHeightProp = {
        height: getRowsHeight(viewableRows) + FIRST_ROW_PADDING_HEIGHT,
    }

    return (
        <>
            <ControlBar
                height={getControlBarHeight(viewableRows)}
                onChangeHeight={!isSmallScreen(width) ? adjustRows : null}
                onEndDrag={saveUserRows}
                isExpanded={expanded}
            >
                <div className={classes.content}>
                    <div
                        className={containerClass}
                        ref={ref}
                        style={rowHeightProp}
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
                                onToggleExpanded={toggleExpanded}
                                dashboardBarIsExpanded={expanded}
                            />
                        </div>
                        {getDashboardChips()}
                    </div>
                    <ShowMoreButton
                        onClick={toggleExpanded}
                        dashboardBarIsExpanded={expanded}
                        disabled={!expanded && userRows === MAX_ROW_COUNT}
                    />
                </div>
            </ControlBar>
            <div
                style={{
                    marginTop:
                        getControlBarHeight(
                            isSmallScreen(width) ? MIN_ROW_COUNT : userRows
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
    updateUserRows: PropTypes.func,
    userRows: PropTypes.number,
    onExpandedChanged: PropTypes.func,
}

const mapStateToProps = state => ({
    dashboards: sGetAllDashboards(state),
    filterText: sGetDashboardsFilter(state),
    selectedId: sGetSelectedId(state),
    userRows: sGetControlBarUserRows(state),
})

const mapDispatchToProps = {
    updateUserRows: acSetControlBarUserRows,
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DashboardsBar)
)
