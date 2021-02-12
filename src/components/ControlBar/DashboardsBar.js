import React, { useState, useRef, useEffect, createRef } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import cx from 'classnames'
import PropTypes from 'prop-types'
import Chips from './Chips'
import AddCircleIcon from '../../icons/AddCircle'
import Filter from './Filter'
import ShowMoreButton from './ShowMoreButton'
import DragHandle from './DragHandle'
import { getControlBarHeight, getRowsFromHeight } from './controlBarDimensions'
import { sGetDashboardsFilter } from '../../reducers/dashboardsFilter'
import { sGetControlBarUserRows } from '../../reducers/controlBar'
import { sGetAllDashboards } from '../../reducers/dashboards'
import { acSetControlBarUserRows } from '../../actions/controlBar'
import { apiPostControlBarRows } from '../../api/controlBar'
import { useWindowDimensions } from '../WindowDimensionsProvider'
import { isSmallScreen } from '../../modules/smallScreen'
import { getFilteredDashboards } from '../../modules/getFilteredDashboards'

import classes from './styles/DashboardsBar.module.css'

const MIN_ROW_COUNT = 1
const MAX_ROW_COUNT = 10

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
    const userRowsChanged = useRef(false)
    const { width } = useWindowDimensions()
    const ref = createRef()

    const adjustRows = newHeight => {
        const newRows = Math.max(
            MIN_ROW_COUNT,
            getRowsFromHeight(newHeight - 52) // don't rush the transition to a bigger row count
        )

        if (newRows !== userRows) {
            updateUserRows(Math.min(newRows, MAX_ROW_COUNT))
            userRowsChanged.current = true
        }
    }

    useEffect(() => {
        if (!dragging && userRowsChanged.current) {
            apiPostControlBarRows(userRows)
            userRowsChanged.current = false
        }
    }, [dragging, userRowsChanged.current])

    const scrollToTop = () => {
        if (expanded) {
            ref.current.scroll(0, 0)
        }
    }

    const toggleExpanded = () => {
        if (expanded) {
            cancelExpanded()
        } else {
            scrollToTop()
            setExpanded(true)
            onExpandedChanged(!expanded)
        }
    }

    const cancelExpanded = () => {
        scrollToTop()
        setExpanded(false)
        // The timeout here is to let the dashboard bar finish collapsing
        // before the dashboard is triggered to adjust position
        setTimeout(() => {
            onExpandedChanged(false)
        }, 200)
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

    const getControlBarStyle = () => {
        const isSmall = isSmallScreen(width)

        if (isSmall && expanded) {
            return {}
        }

        let viewableRows = MIN_ROW_COUNT

        if (!isSmall && expanded) {
            viewableRows = MAX_ROW_COUNT
        } else if (!isSmall && !expanded) {
            viewableRows = userRows
        }

        return {
            height: getControlBarHeight(viewableRows),
        }
    }

    return (
        <>
            <div
                className={cx(classes.root, expanded && classes.expanded)}
                style={getControlBarStyle()}
            >
                <div className={containerClass} ref={ref}>
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
                <DragHandle
                    setDragging={setDragging}
                    onHeightChanged={adjustRows}
                />
            </div>
            <div
                className={cx(classes.topMargin, expanded && classes.expanded)}
                style={{ height: getControlBarHeight(userRows) }}
            />
        </>
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
