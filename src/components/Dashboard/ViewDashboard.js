import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import TitleBar from '../TitleBar/TitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'
import FilterBar from '../FilterBar/FilterBar'
import DashboardsBar from '../ControlBar/DashboardsBar'
import DashboardVerticalOffset from './DashboardVerticalOffset'
import { sGetIsEditing } from '../../reducers/editDashboard'
import { acClearEditDashboard } from '../../actions/editDashboard'

export const ViewDashboard = ({ dashboardIsEditing, clearEditDashboard }) => {
    useEffect(() => {
        if (dashboardIsEditing) {
            clearEditDashboard()
        }
    }, [dashboardIsEditing])

    return (
        <>
            <DashboardsBar />
            <DashboardVerticalOffset />
            <div className="dashboard-wrapper">
                <TitleBar edit={false} />
                <FilterBar />
                <ItemGrid edit={false} />
            </div>
        </>
    )
}

ViewDashboard.propTypes = {
    clearEditDashboard: PropTypes.func,
    dashboardIsEditing: PropTypes.bool,
}

const mapStateToProps = state => {
    return {
        dashboardIsEditing: sGetIsEditing(state),
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
})(ViewDashboard)
