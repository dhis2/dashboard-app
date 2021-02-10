import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { useWindowDimensions } from '../WindowDimensionsProvider'
import { isSmallScreen } from '../../modules/smallScreen'
import Chip from './DashboardItemChip'
import { sGetAllDashboards } from '../../reducers/dashboards'
import { sGetDashboardsFilter } from '../../reducers/dashboardsFilter'
import { sGetSelectedId } from '../../reducers/selected'
import { getFilteredDashboards } from './DashboardsBar'

import classes from './styles/Chips.module.css'

const Chips = ({
    dashboards,
    filterText,
    selectedId,
    expanded,
    onChipClicked,
}) => {
    const { width } = useWindowDimensions()

    const chips = getFilteredDashboards(
        dashboards,
        filterText
    ).map(dashboard => (
        <Chip
            key={dashboard.id}
            label={dashboard.displayName}
            starred={dashboard.starred}
            dashboardId={dashboard.id}
            selected={dashboard.id === selectedId}
            onClick={onChipClicked}
        />
    ))

    if (isSmallScreen(width)) {
        const chipContainerClasses = cx(
            classes.container,
            expanded ? classes.expanded : classes.collapsed
        )
        return <div className={chipContainerClasses}>{chips}</div>
    } else {
        return chips
    }
}

Chips.propTypes = {
    dashboards: PropTypes.object,
    selectedId: PropTypes.string,
}

const mapStateToProps = state => ({
    dashboards: sGetAllDashboards(state),
    selectedId: sGetSelectedId(state),
    filterText: sGetDashboardsFilter(state),
})

export default connect(mapStateToProps)(Chips)
