import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Link, withRouter } from 'react-router-dom'

import Chip from './DashboardItemChip'
import AddCircleIcon from '../../../icons/AddCircle'
import Filter from './Filter'

import { sGetAllDashboards } from '../../../reducers/dashboards'
import { sGetDashboardsFilter } from '../../../reducers/dashboardsFilter'
import { sGetSelectedId } from '../../../reducers/selected'
import { getFilteredDashboards } from '../../../modules/getFilteredDashboards'

import classes from './styles/Content.module.css'

const Content = ({
    dashboards,
    expanded,
    filterText,
    history,
    selectedId,
    onChipClicked,
    onSearchClicked,
}) => {
    const onSelectDashboard = () => {
        const id = getFilteredDashboards(dashboards, filterText)[0]?.id
        if (id) {
            history.push(id)
        }
    }

    const getChips = () =>
        getFilteredDashboards(dashboards, filterText).map(dashboard => (
            <Chip
                key={dashboard.id}
                label={dashboard.displayName}
                starred={dashboard.starred}
                dashboardId={dashboard.id}
                selected={dashboard.id === selectedId}
                onClick={onChipClicked}
            />
        ))

    const getControlsSmall = () => (
        <div className={classes.controlsSmall}>
            <Filter
                onKeypressEnter={onSelectDashboard}
                onSearchClicked={onSearchClicked}
                expanded={expanded}
            />
        </div>
    )

    const getControlsLarge = () => (
        <div className={classes.controlsLarge}>
            <Link
                className={classes.newLink}
                to={'/new'}
                data-test="link-new-dashboard"
            >
                <AddCircleIcon />
            </Link>
            <Filter
                onKeypressEnter={onSelectDashboard}
                onSearchClicked={onSearchClicked}
                expanded={expanded}
            />
        </div>
    )

    return (
        <div
            className={cx(
                classes.container,
                expanded ? classes.expanded : classes.collapsed
            )}
        >
            {getControlsSmall()}
            <div className={classes.chipsContainer}>
                {getControlsLarge()}
                {getChips()}
            </div>
        </div>
    )
}

Content.propTypes = {
    dashboards: PropTypes.object,
    expanded: PropTypes.bool,
    filterText: PropTypes.string,
    history: PropTypes.object,
    selectedId: PropTypes.string,
    onChipClicked: PropTypes.func,
    onSearchClicked: PropTypes.func,
}

const mapStateToProps = state => ({
    dashboards: sGetAllDashboards(state),
    selectedId: sGetSelectedId(state),
    filterText: sGetDashboardsFilter(state),
})

export default withRouter(connect(mapStateToProps)(Content))
