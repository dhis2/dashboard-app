import React, { useState, useRef, useEffect, createRef } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import PropTypes from 'prop-types'

import Content from './Content'
import ShowMoreButton from './ShowMoreButton'
import DragHandle from './DragHandle'
import { getRowsFromHeight } from './controlBarDimensions'
import { sGetControlBarUserRows } from '../../../reducers/controlBar'
import { acSetControlBarUserRows } from '../../../actions/controlBar'
import { apiPostControlBarRows } from '../../../api/controlBar'
import { useWindowDimensions } from '../../WindowDimensionsProvider'

import classes from './styles/DashboardsBar.module.css'

export const MIN_ROW_COUNT = 1
export const MAX_ROW_COUNT = 10

const DashboardsBar = ({
    userRows,
    updateUserRows,
    expanded,
    onExpandedChanged,
}) => {
    const [dragging, setDragging] = useState(false)
    const userRowsChanged = useRef(false)
    const [mouseYPos, setMouseYPos] = useState(0)
    const ref = createRef()
    const { height } = useWindowDimensions()

    const rootElement = document.documentElement

    useEffect(() => {
        const newRows = Math.max(
            MIN_ROW_COUNT,
            getRowsFromHeight(mouseYPos - 52) // don't rush the transition to a bigger row count
        )

        if (newRows !== userRows) {
            updateUserRows(Math.min(newRows, MAX_ROW_COUNT))
            userRowsChanged.current = true
        }
    }, [mouseYPos])

    useEffect(() => {
        rootElement.style.setProperty('--user-rows-count', userRows)
    }, [userRows])

    useEffect(() => {
        const vh = height * 0.01
        rootElement.style.setProperty('--vh', `${vh}px`)
    }, [height])

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
            onExpandedChanged(!expanded)
        }
    }

    const cancelExpanded = () => {
        scrollToTop()
        onExpandedChanged(false)
    }

    return (
        <div
            className={expanded ? classes.expanded : classes.collapsed}
            data-test="dashboards-bar"
        >
            <div
                className={cx(classes.container)}
                data-test="dashboardsbar-container"
            >
                <div className={classes.content} ref={ref}>
                    <Content
                        onChipClicked={cancelExpanded}
                        onSearchClicked={toggleExpanded}
                        expanded={expanded}
                    />
                </div>
                <ShowMoreButton
                    onClick={toggleExpanded}
                    dashboardBarIsExpanded={expanded}
                    disabled={!expanded && userRows === MAX_ROW_COUNT}
                />
                <DragHandle
                    setDragging={setDragging}
                    onHeightChanged={setMouseYPos}
                />
            </div>
            <div className={cx(classes.spacer)} />
        </div>
    )
}

DashboardsBar.propTypes = {
    expanded: PropTypes.bool,
    updateUserRows: PropTypes.func,
    userRows: PropTypes.number,
    onExpandedChanged: PropTypes.func,
}

DashboardsBar.defaultProps = {
    expanded: false,
    onExpandedChanged: Function.prototype,
}

const mapStateToProps = state => ({
    userRows: sGetControlBarUserRows(state),
})

const mapDispatchToProps = {
    updateUserRows: acSetControlBarUserRows,
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardsBar)
