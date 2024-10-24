import cx from 'classnames'
import PropTypes from 'prop-types'
import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    createRef,
} from 'react'
import { connect } from 'react-redux'
import { acSetControlBarUserRows } from '../../actions/controlBar.js'
import { apiPostControlBarRows } from '../../api/controlBar.js'
import { useWindowDimensions } from '../../components/WindowDimensionsProvider.jsx'
import { sGetControlBarUserRows } from '../../reducers/controlBar.js'
import Content from './Content.jsx'
import DragHandle from './DragHandle.jsx'
import { getRowsFromHeight } from './getRowsFromHeight.js'
import ShowMoreButton from './ShowMoreButton.jsx'
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
    const [mouseYPos, setMouseYPos] = useState(0)
    const userRowsChanged = useRef(false)
    const ref = createRef()
    const { height } = useWindowDimensions()

    const rootElement = document.documentElement

    useEffect(() => {
        if (mouseYPos === 0) {
            return
        }

        const newRows = Math.max(
            MIN_ROW_COUNT,
            getRowsFromHeight(mouseYPos - 52) // don't rush the transition to a bigger row count
        )

        if (newRows < MAX_ROW_COUNT) {
            onExpandedChanged(false)
        }

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

    const memoizedToggleExpanded = useCallback(() => {
        if (expanded) {
            memoizedCancelExpanded()
        } else {
            scrollToTop()
            onExpandedChanged(!expanded)
        }
    }, [expanded])

    const memoizedCancelExpanded = useCallback(() => {
        scrollToTop()
        onExpandedChanged(false)
    }, [])

    return (
        <div
            className={cx(
                classes.bar,
                expanded ? classes.expanded : classes.collapsed
            )}
            data-test="dashboards-bar"
        >
            <div
                className={classes.container}
                data-test="dashboardsbar-container"
            >
                <div className={classes.content} ref={ref}>
                    <Content
                        onChipClicked={memoizedCancelExpanded}
                        onSearchClicked={memoizedToggleExpanded}
                        expanded={expanded}
                    />
                </div>
                <ShowMoreButton
                    onClick={memoizedToggleExpanded}
                    dashboardBarIsExpanded={expanded}
                    disabled={!expanded && userRows === MAX_ROW_COUNT}
                />
                <DragHandle
                    setDragging={setDragging}
                    onHeightChanged={setMouseYPos}
                />
            </div>
            <div className={classes.spacer} />
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
    onExpandedChanged: Function.prototype,
}

const mapStateToProps = (state) => ({
    userRows: sGetControlBarUserRows(state),
})

const mapDispatchToProps = {
    updateUserRows: acSetControlBarUserRows,
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardsBar)
