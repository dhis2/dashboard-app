import React, { useState, createRef } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import cx from 'classnames'
import arraySort from 'd2-utilizr/lib/arraySort'
import PropTypes from 'prop-types'
import Chips from './Chips'
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
import { acSetControlBarUserRows } from '../../actions/controlBar'
import { apiPostControlBarRows } from '../../api/controlBar'
import { useWindowDimensions } from '../WindowDimensionsProvider'
import { isSmallScreen } from '../../modules/smallScreen'

import classes from './styles/DashboardsBar.module.css'

export const MAX_ROW_COUNT = 10
//Matches the height of .dragHandle in DashboardsBar.module.css
export const DRAG_HANDLE_HEIGHT = 7

export const getFilteredDashboards = (dashboards, filterText) => {
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

const DashboardsBar = ({
    userRows,
    updateUserRows,
    onExpandedChanged,
    history,
    dashboards,
    filterText,
}) => {
    const [expanded, setExpanded] = useState(false)
    const [dragging, setDragging] = useState(false)
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

    const onStartDrag = () => {
        setDragging(true)
        window.addEventListener('mousemove', onDrag)
        window.addEventListener('mouseup', onEndDrag)
    }

    const onDrag = event => {
        event.preventDefault()
        event.stopPropagation()

        const newHeight = event.clientY

        if (newHeight !== this.props.height && newHeight > 0) {
            requestAnimationFrame(() => {
                adjustRows(newHeight)
            })
        }
    }

    const onEndDrag = () => {
        setDragging(false)
        saveUserRows()
        window.removeEventListener('mousemove', onDrag)
        window.removeEventListener('mouseup', onEndDrag)
    }

    const onSelectDashboard = () => {
        const id = getFilteredDashboards(dashboards, filterText)[0]?.id
        if (id) {
            history.push(id)
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

    // const height = Math.max(this.props.height, 0) + DRAG_HANDLE_HEIGHT

    const rootClass = cx(
        classes.root,
        dragging && classes.dragging,
        expanded && classes.expanded
    )

    return (
        <div className={rootClass} height={getControlBarHeight(viewableRows)}>
            <div className={containerClass} ref={ref} style={rowHeightProp}>
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
                <Chips expanded={expanded} onChipClicked={cancelExpanded} />
            </div>
            <ShowMoreButton
                onClick={toggleExpanded}
                dashboardBarIsExpanded={expanded}
                disabled={!expanded && userRows === MAX_ROW_COUNT}
            />
            {!isSmallScreen(width) && (
                <div
                    className={classes.draghandle}
                    onMouseDown={onStartDrag}
                    data-testid="controlbar-drag-handle"
                />
            )}
        </div>
    )
}

DashboardsBar.propTypes = {
    dashboards: PropTypes.object,
    filterText: PropTypes.string,
    history: PropTypes.object,
    updateUserRows: PropTypes.func,
    userRows: PropTypes.number,
    onExpandedChanged: PropTypes.func,
}

const mapStateToProps = state => ({
    dashboards: sGetAllDashboards(state),
    filterText: sGetDashboardsFilter(state),
    userRows: sGetControlBarUserRows(state),
})

const mapDispatchToProps = {
    updateUserRows: acSetControlBarUserRows,
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DashboardsBar)
)
