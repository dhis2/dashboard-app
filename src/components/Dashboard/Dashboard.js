import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { tSelectDashboard } from '../../actions/dashboards'
import { acSetSelectedDashboardMode } from '../../actions/selected'
import { sDashboardsIsFetching } from '../../reducers/dashboards'
import {
    DASHBOARD_MODE_VIEW,
    DASHBOARD_MODE_EDIT,
    DASHBOARD_MODE_NEW,
    DASHBOARD_MODE_PRINT_LAYOUT,
} from './dashboardModes'
import ViewDashboard from './ViewDashboard'
import EditDashboard from './EditDashboard'
import NewDashboard from './NewDashboard'
import PrintDashboardLayout from './PrintDashboardLayout'

const dashboardMap = {
    [DASHBOARD_MODE_VIEW]: ViewDashboard,
    [DASHBOARD_MODE_EDIT]: EditDashboard,
    [DASHBOARD_MODE_NEW]: NewDashboard,
    [DASHBOARD_MODE_PRINT_LAYOUT]: PrintDashboardLayout,
}

const Dashboard = props => {
    useEffect(() => {
        if (props.dashboardsLoaded) {
            const id = props.match.params.dashboardId || null

            props.selectDashboard(id)
            props.setDashboardMode(props.mode)

            // scroll to the top when a dashboard is loaded
            window.scrollTo(0, 0)
        }
    })

    const ActiveDashboard = dashboardMap[props.mode]

    return <ActiveDashboard />
}

Dashboard.propTypes = {
    dashboardsLoaded: PropTypes.bool,
    match: PropTypes.object,
    mode: PropTypes.string,
    selectDashboard: PropTypes.func,
    setDashboardMode: PropTypes.func,
}

const mapStateToProps = state => {
    return { dashboardsLoaded: !sDashboardsIsFetching(state) }
}

export default connect(mapStateToProps, {
    selectDashboard: tSelectDashboard,
    setDashboardMode: acSetSelectedDashboardMode,
})(Dashboard)
