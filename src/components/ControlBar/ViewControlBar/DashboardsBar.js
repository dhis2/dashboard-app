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

import classes from './styles/DashboardsBar.module.css'

const rowClassMap = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten',
}

const rowClassKeys = Object.keys(rowClassMap)
export const MIN_ROW_COUNT = rowClassKeys[0]
export const MAX_ROW_COUNT = rowClassKeys[rowClassKeys.length - 1]

const DashboardsBar = ({
    userRows,
    updateUserRows,
    expanded,
    onExpandedChanged,
}) => {
    const [dragging, setDragging] = useState(false)
    const userRowsChanged = useRef(false)
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
                className={cx(
                    classes.container,
                    classes[rowClassMap[userRows]]
                )}
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
                    onHeightChanged={adjustRows}
                />
            </div>
            <div
                className={cx(
                    classes.topMargin,
                    classes[rowClassMap[userRows]]
                )}
            />
        </div>
    )
}

DashboardsBar.propTypes = {
    expanded: PropTypes.bool,
    updateUserRows: PropTypes.func,
    userRows: PropTypes.number,
    onExpandedChanged: PropTypes.func,
}

const mapStateToProps = state => ({
    userRows: sGetControlBarUserRows(state),
})

const mapDispatchToProps = {
    updateUserRows: acSetControlBarUserRows,
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardsBar)
