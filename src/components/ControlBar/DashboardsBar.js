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
import { sGetFilterName } from '../../reducers/dashboardsFilter'
import { sGetControlBarUserRows } from '../../reducers/controlBar'
import { sGetAllDashboards } from '../../reducers/dashboards'
import { sGetSelectedId } from '../../reducers/selected'
import { acSetControlBarUserRows } from '../../actions/controlBar'
import { orObject, orArray } from '../../modules/util'
import { apiPostControlBarRows } from '../../api/controlBar'

import classes from './styles/DashboardsBar.module.css'

export const MAX_ROW_COUNT = 10

export const DashboardsBar = ({
    userRows,
    onChangeHeight,
    history,
    dashboards,
    selectedId,
}) => {
    const [rows, setRows] = useState(MIN_ROW_COUNT)

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

    const onSelectDashboard = () => history.push(`/${dashboards[0].id}`)

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
                    <Link className={classes.newLink} to={'/new'}>
                        <AddCircleIcon />
                    </Link>
                    <Filter onKeypressEnter={onSelectDashboard} />
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
                onClick={toggleMaxHeight}
                isMaxHeight={isMaxHeight()}
                disabled={userRows === MAX_ROW_COUNT}
            />
        </ControlBar>
    )
}

DashboardsBar.propTypes = {
    dashboards: PropTypes.array,
    history: PropTypes.object,
    selectedId: PropTypes.string,
    userRows: PropTypes.number,
    onChangeHeight: PropTypes.func,
}

const mapStateToProps = state => ({
    dashboards: sGetAllDashboards(state),
    name: sGetFilterName(state),
    userRows: sGetControlBarUserRows(state),
    selectedId: sGetSelectedId(state),
})

const mapDispatchToProps = {
    onChangeHeight: acSetControlBarUserRows,
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const dashboards = Object.values(orObject(stateProps.dashboards))
    const displayDashboards = arraySort(
        dashboards.filter(d =>
            d.displayName.toLowerCase().includes(stateProps.name.toLowerCase())
        ),
        'ASC',
        'displayName'
    )

    return {
        ...stateProps,
        ...ownProps,
        ...dispatchProps,
        dashboards: [
            ...displayDashboards.filter(d => d.starred),
            ...displayDashboards.filter(d => !d.starred),
        ],
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(DashboardsBar)
)
